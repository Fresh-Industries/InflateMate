import { prisma } from "@/lib/prisma";
import { Prisma, BookingStatus, InvoiceStatus, QuoteStatus } from "@/prisma/generated/prisma"; // Assuming BookingStatus is part of generated prisma client
import { createId } from '@paralleldrive/cuid2';
import { localToUTC } from "@/lib/utils"; // Import your utility function
// Assuming BookingConflictError will be created or is in a shared error file.
// For now, we can define a simple version or import if it exists.
// If createBookingSafely.ts exports it, the path might be './createBookingSafely'
// For now, let's define a placeholder if not readily available.
export class BookingConflictError extends Error {
  constructor(message = "Booking conflict detected.") {
    super(message);
    this.name = "BookingConflictError";
  }
}

// Define input types
export interface UpdateBookingItemInput {
  inventoryId: string;
  quantity: number;
  price: number; // Or calculate based on inventoryId
  startUTC: Date;
  endUTC: Date;
  status: string; // Should likely default to 'HOLD' or a similar initial status
}

export interface UpdateBookingDataInput {
  eventDate?: string; // Or Date
  startTime?: string; // Or Date
  endTime?: string; // Or Date
  eventType?: string;
  eventAddress?: string;
  eventCity?: string;
  eventState?: string;
  eventZipCode?: string;
  eventTimeZone?: string;
  participantAge?: number;
  participantCount?: number;
  specialInstructions?: string;
  // customerId?: string; // If customer can be changed
  // couponId?: string; // If coupon can be changed
  items: UpdateBookingItemInput[];
}

export async function updateBookingSafely(
  bookingId: string,
  businessId: string,
  updateData: UpdateBookingDataInput,
  maxRetries = 3
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      console.log(`[updateBookingSafely] Attempt ${attempt + 1}/${maxRetries} for booking ID: ${bookingId}`);
      const updatedBooking = await prisma.$transaction(async (tx) => {
        console.log("[updateBookingSafely] Starting transaction...");

        const booking = await tx.booking.findUnique({
          where: { id: bookingId, businessId: businessId }, // Ensure booking belongs to the business
          include: {
            inventoryItems: true,
            invoice: {
              select: {
                id: true,
                stripeInvoiceId: true,
                status: true,
              }
            },
            quote: {
              select: {
                id: true,
                stripeQuoteId: true,
                status: true,
              }
            },
            // Include customer if customer details can be updated or are needed for validation
            // customer: true,
          },
        });

        if (!booking) {
          console.error(`[updateBookingSafely] Booking with ID ${bookingId} not found or does not belong to business ${businessId}.`);
          throw new Error(`Booking with ID ${bookingId} not found.`);
        }

        console.log(`[updateBookingSafely] Fetched booking ${bookingId} with status: ${booking.status}`);

        const editableStates: BookingStatus[] = [
          BookingStatus.HOLD,
          BookingStatus.PENDING,
        ];

        if (!editableStates.includes(booking.status)) {
          console.warn(`[updateBookingSafely] Booking ${bookingId} is in status ${booking.status}, which is not editable.`);
          throw new Error(`Booking is in status '${booking.status}' and cannot be edited.`);
        }

        // 3. Void/Cancel Stripe Entities
        if (booking.invoice && booking.invoice.stripeInvoiceId) {
          // Define active statuses for an invoice that can be voided
          const activeInvoiceStatuses: InvoiceStatus[] = [InvoiceStatus.OPEN, InvoiceStatus.DRAFT]; 
          if (activeInvoiceStatuses.includes(booking.invoice.status)) {
            console.log(`[updateBookingSafely] Existing Stripe Invoice ${booking.invoice.stripeInvoiceId} for booking ${bookingId} needs to be voided.`);
            // TODO: Implement actual Stripe API call
            // await stripe.invoices.voidInvoice(booking.invoice.stripeInvoiceId);
            console.log(`[updateBookingSafely] Placeholder for Stripe API: Voiding invoice ${booking.invoice.stripeInvoiceId}`);
            await tx.invoice.update({
              where: { id: booking.invoice.id },
              data: { status: InvoiceStatus.VOID, updatedAt: new Date() }, // Or your equivalent VOID status
            });
            console.log(`[updateBookingSafely] Local invoice ${booking.invoice.id} status updated to VOID.`);
          }
        }

        if (booking.quote && booking.quote.stripeQuoteId) {
          // Define active statuses for a quote that can be canceled
          const activeQuoteStatuses: QuoteStatus[] = [QuoteStatus.OPEN, QuoteStatus.DRAFT];
          if (activeQuoteStatuses.includes(booking.quote.status)) {
            console.log(`[updateBookingSafely] Existing Stripe Quote ${booking.quote.stripeQuoteId} for booking ${bookingId} needs to be canceled.`);
            // TODO: Implement actual Stripe API call
            // await stripe.quotes.cancel(booking.quote.stripeQuoteId);
            console.log(`[updateBookingSafely] Placeholder for Stripe API: Canceling quote ${booking.quote.stripeQuoteId}`);
            await tx.quote.update({
              where: { id: booking.quote.id },
              data: { status: QuoteStatus.CANCELED, updatedAt: new Date() }, // Or your equivalent CANCELED status
            });
            console.log(`[updateBookingSafely] Local quote ${booking.quote.id} status updated to CANCELED.`);
          }
        }

        // 4. Delete Old BookingItems
        console.log(`[updateBookingSafely] Deleting old booking items for booking ID: ${bookingId}`);
        await tx.bookingItem.deleteMany({
          where: { bookingId: booking.id },
        });
        console.log(`[updateBookingSafely] Old booking items deleted for booking ID: ${bookingId}`);

        // 5. Availability Check
        console.log(`[updateBookingSafely] Starting availability check for ${updateData.items.length} items for booking ID: ${bookingId}`);
        for (const item of updateData.items) {
          // TODO: Implement rigorous availability check for item.inventoryId, item.quantity between item.startUTC and item.endUTC.
          // This check needs to consider other CONFIRMED, HOLD, and PENDING bookings.
          // It should query the Inventory model for its total quantity and then check BookingItems.
          // For now, we assume items are available. Replace with actual logic.
          const isAvailable = true; // Placeholder for actual availability check
          if (!isAvailable) {
            // Ideally, include item name if readily available or fetch it for a better error message.
            console.error(`[updateBookingSafely] Item ${item.inventoryId} is not available for the requested quantity/period.`);
            throw new BookingConflictError(`Item with ID ${item.inventoryId} is no longer available for the selected time/quantity.`);
          }
        }
        console.log(`[updateBookingSafely] Availability check passed for all items for booking ID: ${bookingId}`);

        // 6. Create New BookingItems
        console.log(`[updateBookingSafely] Creating ${updateData.items.length} new booking items for booking ID: ${bookingId}`);
        for (const item of updateData.items) {
          const bookingItemId = createId();
          console.log(`[updateBookingSafely] Inserting BookingItem ${bookingItemId} for inventory ${item.inventoryId} (Booking ID: ${bookingId})`);
          
          const startUTC = typeof item.startUTC === 'string' ? new Date(item.startUTC) : item.startUTC;
          const endUTC = typeof item.endUTC === 'string' ? new Date(item.endUTC) : item.endUTC;

          await tx.$executeRaw`
            INSERT INTO "BookingItem" (
              id,
              quantity,
              price,
              "bookingId",
              "bookingStatus",
              "inventoryId",
              "startUTC",
              "endUTC",
              "createdAt",
              "updatedAt"
              -- "period" column is generated by the database if schema is set up correctly
            ) VALUES (
              ${bookingItemId}::text,
              ${item.quantity}::integer,
              ${item.price}::double precision,
              ${booking.id}::text, -- Use booking.id from the fetched booking context
              ${item.status}::text, -- This status comes from UpdateBookingItemInput
              ${item.inventoryId}::text,
              ${startUTC}::timestamptz,
              ${endUTC}::timestamptz,
              NOW(),
              NOW()
            )
          `;
          console.log(`[updateBookingSafely] BookingItem ${bookingItemId} inserted for inventory ${item.inventoryId} (Booking ID: ${bookingId}).`);
        }

        // 7. Prepare Booking Update Payload & Update Booking
        console.log(`[updateBookingSafely] Preparing update payload for booking ID: ${bookingId}`);

        const subtotalAmount = updateData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Assuming totalAmount is subtotal for now. Add tax logic if applicable.
        const totalAmount = subtotalAmount; 

        // Fields that can be directly updated from updateData
        const { 
          eventDate: rawEventDateString,
          startTime: rawTimeString,
          endTime: rawEndTimeString,
          eventType,
          eventAddress,
          eventCity,
          eventState,
          eventZipCode,
          participantAge,
          participantCount,
          specialInstructions
        } = updateData;

        // Use a default timezone if not provided, though it should ideally come with updateData
        const tz = updateData.eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";

        let finalEventDate: Date | undefined = undefined;
        let finalStartTime: Date | undefined = undefined;
        let finalEndTime: Date | undefined = undefined;

        if (rawEventDateString) {
          // Assuming eventDate from input is already a YYYY-MM-DD string suitable for date-only part of localToUTC
          finalEventDate = new Date(rawEventDateString + "T00:00:00"); // For eventDate field which is Date only

          if (rawTimeString) {
            finalStartTime = localToUTC(rawEventDateString, rawTimeString, tz);
          }
          if (rawEndTimeString) {
            finalEndTime = localToUTC(rawEventDateString, rawEndTimeString, tz);
          }
        }
        
        const bookingUpdatePayload: Prisma.BookingUpdateInput = {
          ...(finalEventDate && { eventDate: finalEventDate }),
          ...(finalStartTime && { startTime: finalStartTime }),
          ...(finalEndTime && { endTime: finalEndTime }),
          eventType,
          eventAddress,
          eventCity,
          eventState,
          eventZipCode,
          participantAge,
          participantCount,
          specialInstructions,
          subtotalAmount,
          totalAmount,
          status: BookingStatus.HOLD,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30-minute hold
          updatedAt: new Date(),
          // Disconnect relations by using the relation field name with { disconnect: true }
          // Check if the relation object itself exists before attempting to disconnect
          ...(booking.invoice && { invoice: { disconnect: true } }),
          ...(booking.quote && { quote: { disconnect: true } }),
          // Example for coupon, if it's also a relation you want to clear
          // ...(booking.coupon && { coupon: { disconnect: true } }), 
        };
        
        // Remove undefined direct fields from payload to avoid Prisma errors if not all fields are provided
        // Relational disconnects are fine as is.
        Object.keys(bookingUpdatePayload).forEach(key => {
            const K = key as keyof typeof bookingUpdatePayload;
            // Check if the property is not an object (to avoid deleting disconnects) and is undefined
            if (typeof bookingUpdatePayload[K] !== 'object' && bookingUpdatePayload[K] === undefined) {
                delete bookingUpdatePayload[K];
            }
        });

        const updatedBooking = await tx.booking.update({
          where: { id: booking.id }, // Use booking.id from the fetched booking context
          data: bookingUpdatePayload,
        });

        console.log(`[updateBookingSafely] Booking ${updatedBooking.id} successfully updated to status ${updatedBooking.status}.`);
        return updatedBooking;

      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000, // default
        timeout: 10000, // default
      });

      return updatedBooking; // This will eventually return the result of the transaction

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(`[updateBookingSafely] Error during attempt ${attempt + 1} for booking ${bookingId}:`, err);

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2034' || err.code === '40001' || err.code === '23P01') { 
          if (attempt < maxRetries - 1) {
            attempt++;
            console.warn(`[updateBookingSafely] Retrying transaction for booking ${bookingId}, attempt ${attempt + 1} due to error code ${err.code}.`);
            await new Promise(resolve => setTimeout(resolve, 100 * attempt));
            continue;
          } else {
            console.error(`[updateBookingSafely] Max retries reached for booking ${bookingId} with error code ${err.code}.`);
            if (err.code === '23P01') {
              throw new BookingConflictError(`Failed to update booking ${bookingId} due to a database conflict (e.g., overlapping items) after ${maxRetries} retries.`);
            }
            throw new BookingConflictError(`Failed to update booking ${bookingId} due to persistent conflict after ${maxRetries} retries.`);
          }
        }
      } 
      // Removed the specific check for "updateBookingSafely function is not fully implemented yet."

      if (err.message.includes("cannot be edited") || err.message.includes("not found") || err instanceof BookingConflictError) {
        throw err; // Rethrow known business logic errors or our custom conflict error
      }
      throw new Error(`Failed to update booking ${bookingId} after ${attempt + 1} attempts: ${err.message}`);
    }
  }
  // This part should ideally not be reached if retries are handled correctly,
  // but as a fallback:
  throw new Error(`Booking update for ${bookingId} failed definitively after ${maxRetries} retries.`);
} 