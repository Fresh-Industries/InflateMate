import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { Prisma } from "@/prisma/generated/prisma";
import { createId } from '@paralleldrive/cuid2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = await params;

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        inventoryItems: { include: { inventory: true } },
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseData: any = { ...booking };
    if (booking.inventoryItems && booking.inventoryItems.length > 0) {
      responseData.bounceHouseId = booking.inventoryItems[0].inventoryId;
      responseData.bounceHouse = {
        id: booking.inventoryItems[0].inventoryId,
        name: booking.inventoryItems[0].inventory.name
      };
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  // Declare bookingId outside the try block to ensure scope in catch
  let bookingId: string | undefined;

  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paramsResult = await params;
    bookingId = paramsResult.bookingId; // Assign to the outer variable
    const businessId = paramsResult.businessId;
    const body = await req.json();

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Fetch the booking and check status BEFORE transaction
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, businessId },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    // We still need to check status inside the transaction potentially,
    // but this initial check gives a quick response for obvious cases.
    // If status is 'HOLD' or 'PENDING', we proceed to the transaction.
     if (!["PENDING", "HOLD"].includes(booking.status)) {
      return NextResponse.json({ error: "Booking can only be edited if status is PENDING or HOLD" }, { status: 400 });
    }


    // --- Perform updates within a transaction ---
    try {
      const transactionResult = await prisma.$transaction(async (tx) => {
        // Re-fetch inside transaction to ensure we have the latest state
        const latestBooking = await tx.booking.findUnique({
             where: { id: bookingId!, businessId }, // Use non-null assertion as it's checked above
             select: { status: true } // Only need status for the check
        });

         if (!latestBooking) {
            // Should not happen if initial check passed, but good defensive coding
             throw new Error("Booking not found during transaction."); // Will be caught below
         }

        // Re-check status inside the transaction for atomicity
        if (!["PENDING", "HOLD"].includes(latestBooking.status)) {
           // This will abort the transaction
             throw new Error("Booking status changed: can no longer be edited.");
        }


        // Only allow updating safe fields on the main booking record
        const allowedFields = [
          "eventDate", "startTime", "endTime", "eventType", "eventAddress",
          "eventCity", "eventState", "eventZipCode", "participantCount",
          "participantAge", "specialInstructions", "status" // Allow status change
        ];
        const updateData: Record<string, unknown> = {};
        for (const key of allowedFields) {
          // Check if the field is present in the body AND is one of the allowed fields
          if (body[key] !== undefined && allowedFields.includes(key)) {
              updateData[key] = body[key];
          }
        }

        // Update booking if needed
        if (Object.keys(updateData).length > 0) {
          await tx.booking.update({
            where: { id: bookingId!, businessId }, // Use non-null assertion
            data: {
                ...updateData,
                updatedAt: new Date(), // Ensure updated timestamp is set
             },
          });
           console.log("Booking record updated within transaction:", updateData);
        } else {
             console.log("No top-level booking fields to update.");
        }

        // --- BookingItem edits ---
        // Remove BookingItems (soft delete by setting status to CANCELLED)
        if (Array.isArray(body.removeBookingItemIds) && body.removeBookingItemIds.length > 0) {
          // Ensure item IDs belong to this booking before updating
          await tx.$executeRaw`
            UPDATE "BookingItem"
            SET "bookingStatus" = 'CANCELLED', "updatedAt" = NOW()
            WHERE "id" = ANY(${body.removeBookingItemIds}::text[])
            AND "bookingId" = ${bookingId}
            AND "bookingStatus" <> 'CANCELLED' -- Only cancel if not already cancelled
          `;
          console.log("BookingItems cancelled within transaction:", body.removeBookingItemIds);
        } else {
            console.log("No BookingItems to remove.");
        }

        // Add new BookingItems
        if (Array.isArray(body.addBookingItems) && body.addBookingItems.length > 0) {
          for (const item of body.addBookingItems) {
            // Required: inventoryId, quantity, price, startUTC, endUTC, status
            // Validate necessary fields are present for each item
            if (!item.inventoryId || item.quantity === undefined || item.price === undefined || !item.startUTC || !item.endUTC) {
                 console.warn("Skipping addition of BookingItem due to missing required fields:", item);
                 continue; // Skip this item but continue with others
            }

            // Convert startUTC and endUTC to Date objects if they are strings (assuming ISO 8601)
            const startUTC = typeof item.startUTC === 'string' ? new Date(item.startUTC) : item.startUTC;
            const endUTC = typeof item.endUTC === 'string' ? new Date(item.endUTC) : item.endUTC;

            if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
                 console.warn("Skipping addition of BookingItem due to invalid date format:", item);
                 continue;
            }


            // Use gen_random_uuid() directly in SQL or createId() beforehand
            // Using createId() for consistency with createBookingSafely
            const bookingItemId = createId();

            // INSERT using raw SQL (required for 'period' column)
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
                "period" -- Calculate and provide the value
              ) VALUES (
                ${bookingItemId}::text,
                ${item.quantity}::integer,
                ${item.price}::double precision,
                ${bookingId}::text,
                ${item.status || 'PENDING'}::text,
                ${item.inventoryId}::text,
                ${startUTC}::timestamptz,
                ${endUTC}::timestamptz,
                NOW(),
                NOW(),
                 tstzrange( -- Calculate and provide the value
                  ${startUTC}::timestamptz,
                  ${endUTC}::timestamptz,
                  '[]'
                )
              )
            `;

             console.log("BookingItem added within transaction:", item);
          }
        } else {
            console.log("No BookingItems to add.");
        }

        // Update existing BookingItems
        if (Array.isArray(body.updateBookingItems) && body.updateBookingItems.length > 0) {
          for (const item of body.updateBookingItems) {
             // Ensure item ID is provided and is a string
            if (!item.id || typeof item.id !== 'string') {
                 console.warn("Skipping update of BookingItem due to missing or invalid ID:", item);
                 continue; // Skip this item
            }

             // Only allow updating specific fields: quantity, price, time, status
            const fields: string[] = [];
            const params: (string | number | Date)[] = [];
            let paramIndex = 1; // Start index for parameters in SQL

            if (item.quantity !== undefined) {
                 fields.push(`quantity = $${paramIndex++}`);
                 params.push(item.quantity);
            }
            if (item.price !== undefined) {
                 fields.push(`price = $${paramIndex++}`);
                 params.push(item.price);
            }
            // Handle time update separately as it affects the 'period' column
            if (item.startUTC && item.endUTC) {
                 const startUTC = typeof item.startUTC === 'string' ? new Date(item.startUTC) : item.startUTC;
                 const endUTC = typeof item.endUTC === 'string' ? new Date(item.endUTC) : item.endUTC;

                 if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
                     console.warn("Skipping time update for BookingItem due to invalid date format:", item);
                 } else {
                    fields.push(`"startUTC" = $${paramIndex++}`);
                    params.push(startUTC);
                    fields.push(`"endUTC" = $${paramIndex++}`);
                    params.push(endUTC);
                     // Recalculate period using the new times
                    fields.push(`period = tstzrange($${paramIndex - 2}::timestamptz, $${paramIndex - 1}::timestamptz, '[]')`);
                 }
            } else if (item.startUTC !== undefined || item.endUTC !== undefined) {
                 // Log warning if only one time is provided
                 console.warn("Cannot update only one time field (startUTC or endUTC). Both must be provided.", item);
            }

            if (item.status !== undefined) {
                 fields.push(`"bookingStatus" = $${paramIndex++}`);
                 params.push(item.status);
            }

            if (fields.length > 0) {
              // Add updated timestamp to the set clause
               fields.push(`"updatedAt" = NOW()`);
               const finalSetClause = fields.join(', ');

               // Add item.id and bookingId to parameters for the WHERE clause
               params.push(item.id); // $paramIndex
               params.push(bookingId || ''); // $paramIndex + 1

              // Use a parameterized query for safety and correct type handling
              await tx.$executeRawUnsafe(
                `UPDATE "BookingItem" SET ${finalSetClause} WHERE id = $${paramIndex} AND "bookingId" = $${paramIndex + 1}`,
                 ...params
              );
              console.log("BookingItem updated within transaction:", item);
            } else {
                 console.log(`No allowed fields to update for BookingItem ID: ${item.id}`);
            }
          }
        } else {
             console.log("No BookingItems to update.");
        }

        // Return the updated booking with necessary relations for the response
        const updatedBooking = await tx.booking.findFirst({
            where: { id: bookingId!, businessId }, // Use non-null assertion
            include: {
                inventoryItems: { include: { inventory: true } },
                customer: true,
            },
        });

         if (!updatedBooking) {
             // Should not happen
             throw new Error("Failed to retrieve updated booking.");
         }

        return updatedBooking;

      }, {
         // Use Serializable isolation level to help prevent race conditions
         isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });


        // Transform the result for the response, similar to the GET endpoint
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData: any = { ...transactionResult };
        // Remove old bounceHouse fields if they exist
        delete responseData.bounceHouse;
        delete responseData.bounceHouseId;

        // If you still need a single bounceHouse field for backward compatibility,
        // you might derive it from the first inventoryItem if necessary.
        // For now, I'll rely on inventoryItems array being the source of truth.
        // If you need the old format, let me know.

        return NextResponse.json(responseData);


    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (transactionError: any) {
        console.error(`[PATCH /bookings/${bookingId}] Transaction error caught:`, transactionError); // Debug log

        // Handle specific Prisma errors
        if (transactionError instanceof PrismaClientKnownRequestError) {
             console.error(` - Prisma Error Code: ${transactionError.code}`);
             console.error(` - Prisma Meta: ${JSON.stringify(transactionError.meta)}`);

             // Handle exclusion constraint violation (e.g., time overlap)
             if (transactionError.code === '23P01') {
                 console.warn("[PATCH /bookings] Booking conflict detected during update.");
                 return NextResponse.json({
                     error: "A conflict occurred while updating the booking. The time slot may no longer be available.",
                 }, { status: 409 }); // 409 Conflict
             }
              // Handle serialization error (transient, but we are not retrying PATCH automatically here)
              if (transactionError.code === '40001') {
                  console.warn("[PATCH /bookings] Serialization error (40001) during update.");
                   return NextResponse.json({
                     error: "The booking could not be updated due to a transient database conflict. Please try again.",
                 }, { status: 500 }); // Or 409 if you prefer
              }

             // Re-throw other known Prisma errors
             throw transactionError; // Caught by the outer catch
        }
         // Re-throw any custom errors thrown inside the transaction (like the status check error)
         if (transactionError.message === "Booking status changed: can no longer be edited.") {
              return NextResponse.json({ error: transactionError.message }, { status: 400 });
         }


         // Re-throw any other errors from the transaction
         throw transactionError; // Caught by the outer catch
    }


//eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Catch errors from initial checks or errors re-thrown from the transaction block
    console.error(`[PATCH /bookings/${bookingId}] Error in main try block:`, error); // Debug log
     // Handle errors re-thrown from the transaction or initial checks
     if (error instanceof PrismaClientKnownRequestError) {
         // This should ideally be caught and handled within the transaction block,
         // but as a fallback, you might handle specific codes here too.
         console.error(` - Uncaught Prisma Error Code: ${error.code}`);
         console.error(` - Uncaught Prisma Meta: ${JSON.stringify(error.meta)}`);
     }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
