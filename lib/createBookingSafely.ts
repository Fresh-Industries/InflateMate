// lib/createBookingSafely.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";
import crypto from 'crypto';

export async function createBookingSafely(
  bookingData: Prisma.BookingCreateInput,
  items: {
    quantity: number;
    price: number;
    startUTC: Date;
    endUTC: Date;
    status: string;
    inventoryId: string;
  }[],
  maxRetries = 3
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await prisma.$transaction(async tx => {
        // Create booking first
        const booking = await tx.booking.create({ data: bookingData });

        // Insert BookingItems using raw SQL for each item - now with period included
        for (const item of items) {
          await tx.$executeRaw`
            INSERT INTO "BookingItem" (
              id, 
              quantity, 
              price, 
              "startUTC", 
              "endUTC", 
              "bookingId", 
              "bookingStatus", 
              "inventoryId", 
              "createdAt", 
              "updatedAt",
              period
            ) VALUES (
              ${crypto.randomUUID()}, 
              ${item.quantity}, 
              ${item.price}, 
              ${item.startUTC}, 
              ${item.endUTC}, 
              ${booking.id}, 
              ${item.status}, 
              ${item.inventoryId}, 
              NOW(), 
              NOW(),
              tstzrange(${item.startUTC}, ${item.endUTC})
            )
          `;
        }

        return booking;
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Transaction error:", err);
      
      // Handle exclusion constraint violations (23P01) or serialization failures (40001)
      if (["23P01", "40001"].includes(err.code) && attempt < maxRetries - 1) {
        attempt++;
        continue;
      }
      
      // For exclusion constraint, provide a friendly error message
      if (err.code === "23P01") {
        const error = new Error("This time slot is already booked");
        error.name = "BookingConflictError";
        throw error;
      }
      
      // Other errors are bubbled up
      throw err;
    }
  }
  throw new Error("Maximum retry attempts reached");
}
