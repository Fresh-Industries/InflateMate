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
  // Customer information fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  // Amount fields for validation
  subtotalAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  // Intent field for handling quote/payment preparation
  intent?: "prepare_for_quote" | "prepare_for_payment" | "prepare_for_payment_difference" | "update_customer_info_only";
  // Coupon code
  couponCode?: string;
  // customerId?: string; // If customer can be changed
  // couponId?: string; // If coupon can be changed
  items: UpdateBookingItemInput[];
}

export async function updateBookingSafely(
  bookingId: string,
  businessId: string,
  updateData: UpdateBookingDataInput,
  maxRetries = 3
): Promise<any> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      console.log(`[updateBookingSafely] Attempt ${attempt + 1}/${maxRetries} for booking ID: ${bookingId}`);
      
      const updatedBooking = await prisma.$transaction(async (tx) => {
        console.log("[updateBookingSafely] Starting transaction...");
        // Fetch the booking with a lock for update
        const booking = await tx.booking.findFirst({
          where: { id: bookingId, businessId },
          include: { inventoryItems: true, customer: true },
        });

        if (!booking) {
          throw new Error(`Booking with ID ${bookingId} not found`);
        }

        // Check if booking can be edited
        if (booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "EXPIRED") {
          throw new Error(`Booking with status ${booking.status} cannot be edited`);
        }
        
        // Handle CONFIRMED bookings differently
        if (booking.status === "CONFIRMED") {
          // For confirmed bookings without item updates, the API route will handle directly
          // This is just a safety check in case this function is called with a confirmed booking
          // but without items data
          if (!updateData.items || updateData.items.length === 0) {
            console.log(`[updateBookingSafely] CONFIRMED booking ${bookingId} received without items - only customer info will be updated`);
            
            // The API route should handle this case directly
            throw new Error("Use the direct API route for updating CONFIRMED bookings without item changes");
          }
          
          console.log(`[updateBookingSafely] CONFIRMED booking ${bookingId} includes item updates - proceeding with caution`);
          // For confirmed bookings with item updates, continue with normal flow
          // In a future version, we'll implement special logic to handle item additions to confirmed bookings
        }

        // 2. Verify the booking is in an editable state
        const editableStates: BookingStatus[] = [
          BookingStatus.HOLD,
          BookingStatus.PENDING,
        ];

        if (!editableStates.includes(booking.status)) {
          console.warn(`[updateBookingSafely] Booking ${bookingId} is in status ${booking.status}, which is not editable.`);
          throw new Error(`Booking is in status '${booking.status}' and cannot be edited.`);
        }

        // 3. Void/Cancel Stripe Entities if they exist
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

        // 5. Availability Check - Enhanced to be more rigorous
        console.log(`[updateBookingSafely] Starting availability check for ${updateData.items.length} items for booking ID: ${bookingId}`);
        for (const item of updateData.items) {
          const startUTC = typeof item.startUTC === 'string' ? new Date(item.startUTC) : item.startUTC;
          const endUTC = typeof item.endUTC === 'string' ? new Date(item.endUTC) : item.endUTC;
          
          // Check if inventory exists and is active
          const inventory = await tx.inventory.findUnique({
            where: { id: item.inventoryId },
            select: { id: true, quantity: true, status: true }
          });
          
          if (!inventory || inventory.status === "MAINTENANCE" || inventory.status === "RETIRED") {
            console.error(`[updateBookingSafely] Item ${item.inventoryId} not found or inactive.`);
            throw new BookingConflictError(`Item with ID ${item.inventoryId} is no longer available.`);
          }
          
          // Count how many of this item are already booked in the same timeframe
          // Exclude the current booking from the count
          const bookedCount = await tx.bookingItem.aggregate({
            _sum: { quantity: true },
            where: {
              inventoryId: item.inventoryId,
              bookingId: { not: booking.id },
              startUTC: { lte: endUTC },
              endUTC: { gte: startUTC },
              // Use an appropriate field instead of 'bookingStatus' if it's named differently
              // or query through the booking relation
              booking: {
                status: {
                  in: ['CONFIRMED', 'HOLD', 'PENDING'] // Only count relevant statuses
                }
              }
            }
          });
          
          const availableQuantity = inventory.quantity - (bookedCount._sum?.quantity || 0);
          
          if (availableQuantity < item.quantity) {
            console.error(`[updateBookingSafely] Insufficient inventory for item ${item.inventoryId}: requested ${item.quantity}, available ${availableQuantity}`);
            throw new BookingConflictError(`Item is no longer available for the selected time/quantity. Available: ${availableQuantity}, Requested: ${item.quantity}`);
          }
        }
        console.log(`[updateBookingSafely] Availability check passed for all items for booking ID: ${bookingId}`);

        // 6. Create New BookingItems
        console.log(`[updateBookingSafely] Creating ${updateData.items.length} new booking items for booking ID: ${bookingId}`);
        // Determine the status for new booking items based on the intent/current booking status
        let newItemStatus: string = booking.status;
        
        // Update item status based on intent if provided
        if (updateData.intent) {
          if (booking.status === "HOLD" && 
              (updateData.intent === "prepare_for_quote" || updateData.intent === "prepare_for_payment")) {
            newItemStatus = "PENDING";
          }
        }
        
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
              "updatedAt",
              "period"
            ) VALUES (
              ${bookingItemId}::text,
              ${item.quantity}::integer,
              ${item.price}::double precision,
              ${booking.id}::text,
              ${newItemStatus}::text,
              ${item.inventoryId}::text,
              ${startUTC}::timestamptz,
              ${endUTC}::timestamptz,
              NOW(),
              NOW(),
              tstzrange(${startUTC}::timestamptz, ${endUTC}::timestamptz, '[]')
            )
          `;
          console.log(`[updateBookingSafely] BookingItem ${bookingItemId} inserted for inventory ${item.inventoryId} (Booking ID: ${bookingId}).`);
        }

        // 7. Prepare Booking Update Payload & Update Booking
        console.log(`[updateBookingSafely] Preparing update payload for booking ID: ${bookingId}`);

        // Calculate amounts based on provided items
        const newSubtotalAmount = updateData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Apply coupon discount if applicable
        let couponDiscount = 0;
        let couponId = booking.couponId; // Keep existing coupon by default
        
        // If a new coupon code is provided, look it up and apply
        if (updateData.couponCode) {
          // Use a separate variable name to avoid variable declaration issues
          let foundCoupon = await tx.coupon.findFirst({
            where: { 
              code: updateData.couponCode,
              businessId: businessId,
              isActive: true,
              startDate: { lte: new Date() },
              endDate: { gte: new Date() },
              // Check maxUses safely without referencing 'coupon'
              maxUses: null, // First check for null (unlimited uses)
              // Add a separate OR condition for numeric maxUses with proper filter
            }
          });
          
          // Get max uses separately to avoid the self-reference issue
          if (foundCoupon && foundCoupon.maxUses !== null) {
            const isUnderMaxUses = foundCoupon.usedCount < foundCoupon.maxUses;
            if (!isUnderMaxUses) {
              // Coupon is at max uses, don't apply it
              console.log(`[updateBookingSafely] Coupon ${updateData.couponCode} reached max uses`);
              couponId = null;
              // Skip to next section without applying coupon
              foundCoupon = null; // Set to null to prevent using it below
            }
          }
          
          if (foundCoupon) {
            couponId = foundCoupon.id;
            
            // Calculate discount amount
            if (foundCoupon.discountType === "PERCENTAGE") {
              couponDiscount = newSubtotalAmount * (foundCoupon.discountAmount / 100);
            } else if (foundCoupon.discountType === "FIXED") {
              couponDiscount = Math.min(foundCoupon.discountAmount, newSubtotalAmount);
            }
          } else if (updateData.couponCode) {
            // If code was provided but not found/valid, don't apply any coupon
            couponId = null;
          }
        }
        
        // Calculate tax if tax amount provided or calculate based on subtotal
        const newTaxAmount = updateData.taxAmount || 0;
        
        // Calculate total
        const newTotalAmount = newSubtotalAmount - couponDiscount + newTaxAmount;

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
          specialInstructions,
          customerName,
          customerEmail,
          customerPhone,
          intent
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
        
        // Determine the new booking status and expiration time based on intent and current status
        let newStatus = booking.status;
        let newExpiresAt = booking.expiresAt;
        
        // Status and Expiry Management based on intent
        if (intent) {
          if (booking.status === "HOLD" && 
              (intent === "prepare_for_quote" || intent === "prepare_for_payment")) {
            // Update status from HOLD to PENDING for both quote and payment intents
            newStatus = "PENDING";
            
            if (intent === "prepare_for_quote") {
              // Set 24-hour expiry for quotes
              newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            } else if (intent === "prepare_for_payment") {
              // Set 15-minute expiry for payment
              newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
            }
          } else if (booking.status === "PENDING") {
            // For PENDING bookings, refresh the expiry time based on intent
            if (intent === "prepare_for_quote") {
              newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours for quote
            } else if (intent === "prepare_for_payment") {
              newExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes for payment
            }
          }
        } else if (booking.status === "PENDING") {
          // For draft saves on PENDING bookings, refresh the general 24h expiry
          newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        
        // Handle customer updates
        let customerUpdateData = {};
        if (customerName || customerEmail || customerPhone) {
          // Check if we have a customer to update
          if (booking.customerId) {
            // Update existing customer
            await tx.customer.update({
              where: { id: booking.customerId },
              data: {
                ...(customerName && { name: customerName }),
                ...(customerEmail && { email: customerEmail }),
                ...(customerPhone && { phone: customerPhone }),
              }
            });
          } else if (customerEmail) {
            // Find or create a customer if we have at least an email
            const existingCustomer = await tx.customer.findFirst({
              where: {
                email: customerEmail,
                businessId: businessId
              }
            });
            
            if (existingCustomer) {
              // Update and connect existing customer
              await tx.customer.update({
                where: { id: existingCustomer.id },
                data: {
                  ...(customerName && { name: customerName }),
                  ...(customerPhone && { phone: customerPhone }),
                }
              });
              
              customerUpdateData = {
                customer: { connect: { id: existingCustomer.id } }
              };
            } else {
              // Create new customer
              const newCustomer = await tx.customer.create({
                data: {
                  name: customerName || "",
                  email: customerEmail,
                  phone: customerPhone || "",
                  businessId: businessId
                }
              });
              
              customerUpdateData = {
                customer: { connect: { id: newCustomer.id } }
              };
            }
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
          subtotalAmount: newSubtotalAmount,
          taxAmount: newTaxAmount,
          totalAmount: newTotalAmount,
          status: newStatus,
          expiresAt: newExpiresAt,
          updatedAt: new Date(),
          // Update coupon if provided
          ...(couponId !== undefined && { 
            coupon: couponId ? { connect: { id: couponId } } : { disconnect: true } 
          }),
          // Include customer updates
          ...customerUpdateData,
          // Disconnect relations by using the relation field name with { disconnect: true }
          // Only disconnect if not reconnecting
          ...(booking.invoice && !intent && { invoice: { disconnect: true } }),
          ...(booking.quote && !intent && { quote: { disconnect: true } }),
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
          include: {
            customer: true,
            coupon: true,
            inventoryItems: {
              include: {
                inventory: true
              }
            }
          }
        });

        console.log(`[updateBookingSafely] Booking ${updatedBooking.id} successfully updated to status ${updatedBooking.status}.`);
        return updatedBooking;

      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        timeout: 10000, // default
      });

      return updatedBooking as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(`[updateBookingSafely] Error during attempt ${attempt} for booking ${bookingId}:`, err);

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2034' || err.code === '40001' || err.code === '23P01') { 
          if (attempt < maxRetries - 1) {
            attempt++;
            console.warn(`[updateBookingSafely] Retrying transaction for booking ${bookingId}, attempt ${attempt} due to error code ${err.code}.`);
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
      throw new Error(`Failed to update booking ${bookingId} after ${attempt} attempts: ${err.message}`);
    }
  }
  // This part should ideally not be reached if retries are handled correctly,
  // but as a fallback:
  throw new Error(`Booking update for ${bookingId} failed definitively after ${maxRetries} retries.`);
} 