// lib/createBookingSafely.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";
import { createId } from '@paralleldrive/cuid2'; // Correct import for createId
// Note: crypto is not needed if you use createId() for CUIDs
// import crypto from 'crypto';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Define a custom error for clarity, consistent with your route handlers
export class BookingConflictError extends Error {
  constructor(message = "Booking conflict detected: Item already booked.") {
    super(message);
    this.name = "BookingConflictError";
  }
}

export async function createBookingSafely(
  // Ensure bookingData is typed correctly. If it includes relations like 'customer'
  // or 'inventoryItems' that are handled elsewhere in the transaction or not here,
  // you might need a more specific Input type (e.g., Omit some fields).
  // Based on how you used it in /holds route, Prisma.BookingCreateInput seems appropriate
  // if you're passing the connect/create structure for business, etc.
  bookingData: Prisma.BookingCreateInput,
  items: {
    quantity: number;
    price: number;
    startUTC: Date; // Ensure these are UTC Date objects
    endUTC: Date;   // Ensure these are UTC Date objects
    status: string; // Should be 'HOLD' initially
    inventoryId: string; // This is a CUID from your schema
  }[],
  maxRetries = 3
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      console.log(`[createBookingSafely] Attempt ${attempt + 1}/${maxRetries}`);
      const transactionResult = await prisma.$transaction(async tx => {
        console.log("[createBookingSafely] Starting transaction...");

        // Create booking first
        // Ensure bookingData contains the necessary connections/data for creation
        const booking = await tx.booking.create({ data: bookingData });
        console.log(`[createBookingSafely] Booking created with ID: ${booking.id}`);


        // Insert BookingItems using raw SQL for each item (required for Unsupported type with generated column)
        // Make sure to NOT include the 'period' column in the INSERT list or VALUES.
        // PostgreSQL generates it automatically from startUTC/endUTC.
        for (const item of items) {
          const bookingItemId = createId(); // Generate CUID for BookingItem ID
          console.log(`[createBookingSafely] Inserting BookingItem ${bookingItemId} for inventory ${item.inventoryId}...`);

          await tx.$executeRaw`
            INSERT INTO "BookingItem" (
              id,
              quantity,
              price,
              "bookingId",
              "bookingStatus",
              "inventoryId",
              "startUTC", -- Provide start and end times
              "endUTC",   -- Provide start and end times
              "createdAt",
              "updatedAt",
              "period" -- Now a standard column, include it
            ) VALUES (
              ${bookingItemId}::text,
              ${item.quantity},
              ${item.price},
              ${booking.id}::text,
              ${item.status}::text,
              ${item.inventoryId}::text,
              ${item.startUTC}::timestamptz,
              ${item.endUTC}::timestamptz,
              NOW(),
              NOW(),
              tstzrange( -- Calculate and provide the value
                ${item.startUTC}::timestamptz,
                ${item.endUTC}::timestamptz,
                '[]'
              )
            )
          `;
           console.log(`[createBookingSafely] BookingItem ${bookingItemId} inserted.`);
        }

        console.log("[createBookingSafely] Transaction completed.");
        return booking; // Return the created booking object

      }, {
        // Recommended isolation level for preventing race conditions on availability checks
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });

      // If transaction succeeds, return its result and break the retry loop
      return transactionResult;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("[createBookingSafely] Transaction error caught:", err);

      // Check if it's a Prisma error
      if (err instanceof PrismaClientKnownRequestError) {
          console.error(`[createBookingSafely] Prisma Error Code: ${err.code}`);
          console.error(`[createBookingSafely] Prisma Meta: ${JSON.stringify(err.meta)}`);

          // Handle specific errors:
          // 23P01: Exclusion constraint violation (overlap)
          // 40001: Serialization error (retryable transient issue in Serializable isolation)
          // 428BP: Generated column can't be inserted into (means you included 'period' in INSERT list/values)
          if (err.code === '428BP') {
               console.error("[createBookingSafely] FATAL: Attempted to insert into a GENERATED ALWAYS column ('period'). Check raw SQL.");
               // This is a code error, retrying won't help. Throw immediately.
               throw new Error("Database schema error: Attempted to write to a generated column."); // Or throw err directly
          }

          if (["23P01", "40001"].includes(err.code)) {
              // These are potential conflicts or transient issues that *might* be resolved by retrying.
              // 23P01 could happen if another transaction committed an overlapping booking right before yours.
              // 40001 is a standard Serializable isolation conflict.
              if (attempt < maxRetries - 1) {
                 attempt++;
                 console.warn(`[createBookingSafely] Retrying transaction attempt ${attempt + 1} for error code ${err.code}...`);
                 // Adding a small delay can sometimes help with retries
                 await new Promise(resolve => setTimeout(resolve, 50 * attempt)); // Simple exponential backoff
                 continue; // Go to the next loop iteration (retry)
              } else {
                  // Max retries reached for a retryable error
                  console.error(`[createBookingSafely] Max retries reached for error code ${err.code}.`);
              }
          }

          // If the error is 23P01 (Exclusion violation) and we didn't continue for retry (i.e. retries exhausted or not a retryable condition for this attempt type)
          // OR if max retries were reached for a retryable error, we throw a friendly conflict error.
           if (err.code === "23P01" || (["23P01", "40001"].includes(err.code) && attempt === maxRetries -1)) {
              console.warn("[createBookingSafely] Booking conflict detected after retries.");
              // Throw the custom conflict error that the route handler expects
              throw new BookingConflictError();
           }


          // Re-throw any other known Prisma errors that weren't handled above
          throw err;

      } else {
           // Handle non-Prisma errors (e.g., network issues, syntax errors if not caught as 428BP, etc.)
           console.error("[createBookingSafely] Non-Prisma error:", err);
           // Re-throw other errors
           throw err;
      }
    }
  }
  // If the loop finishes without returning, it means max retries were reached
   console.error("[createBookingSafely] Transaction failed after maximum retry attempts.");
   throw new Error(`Booking attempt failed after ${maxRetries} retries due to a potential conflict or transient error.`);
}
