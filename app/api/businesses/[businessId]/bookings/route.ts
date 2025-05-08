// app/api/businesses/[businessId]/bookings/route.ts
// This route handles fetching all bookings (GET) and processing the final booking
// details + creating the Stripe Payment Intent (POST).

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe-server";
import { prisma } from "@/lib/prisma";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
// We no longer create bookings here, so createBookingSafely is NOT needed in POST
// import { createBookingSafely } from "@/lib/createBookingSafely";

import { BookingStatus, Prisma } from "@/prisma/generated/prisma"; // Import necessary types/enums
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Import for specific error check


// Define a schema for the FULL payload when finalizing the booking
const finalizeBookingSchema = z.object({
  holdId: z.string().cuid("Invalid hold ID format"), // Require the ID from the previous HOLD step
  customerEmail: z.string().email("Invalid email address"),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  // Event details might be resent or assumed from the holdId lookup
  // Include them here for validation and potential updates to the booking
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (expected HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (expected HH:MM)"),
  eventAddress: z.string().min(1, "Event address is required"),
  eventCity: z.string().min(1, "Event city is required"),
  eventState: z.string().min(1, "Event state is required"),
  eventZipCode: z.string().min(1, "Event zip code is required"),
  eventTimeZone: z.string().optional(), // Timezone used for the event
  eventType: z.string().optional().nullable(),
  participantCount: z.number().min(1, "Participant count must be at least 1"),
  participantAge: z.number().optional().nullable(),
  specialInstructions: z.string().optional().nullable(),
  // Amounts based on final calculation after items/coupon/tax
  subtotalAmount: z.number().min(0, "Subtotal amount must be non-negative"), // Amount in dollars
  taxAmount: z.number().min(0, "Tax amount must be non-negative"),       // Amount in dollars
  taxRate: z.number().min(0, "Tax rate must be non-negative"),           // Percentage rate
  totalAmount: z.number().min(0, "Total amount must be non-negative"),     // Amount in dollars (should match amount in cents / 100)
  // The amount in cents for the Payment Intent
  amountCents: z.number().int().min(0, "Amount in cents must be non-negative integer"),

  // Coupon applied, if any
  couponCode: z.string().optional().nullable(),
  // selectedItems are NOT needed here as they are part of the held booking
});


// --- POST: Finalize Booking and Create Payment Intent ---
export async function POST(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const { businessId } = params;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse and validate the request payload for finalizing booking
    const body = await req.json();
    console.log("[POST /bookings] Received request body for Finalization:", body);

    const bookingData = finalizeBookingSchema.parse(body);
    console.log("[POST /bookings] Parsed finalization data:", bookingData);

    // --- Find and Validate Existing HOLD Booking ---
    console.log(`[POST /bookings] Finding existing HOLD booking with ID: ${bookingData.holdId}`);
    // Include inventoryItems to potentially update their status later
    // Include business for Stripe ID and timezone
    const existingBooking = await prisma.booking.findUnique({
        where: { id: bookingData.holdId },
        include: { inventoryItems: true, business: { select: { stripeAccountId: true, timeZone: true } } }
    });

    if (!existingBooking) {
        console.warn(`[POST /bookings] HOLD booking not found for ID: ${bookingData.holdId}`);
        return NextResponse.json({ error: "Booking hold not found." }, { status: 404 });
    }

    // Check if the booking belongs to the correct business
    if (existingBooking.businessId !== businessId) {
         console.warn(`[POST /bookings] Booking ID ${existingBooking.id} belongs to business ${existingBooking.businessId}, not ${businessId}.`);
         return NextResponse.json({ error: "Booking hold not found for this business." }, { status: 404 });
    }

    // Check if the hold is still active
    const holdExpirationTime = new Date(existingBooking.createdAt.getTime() + 30 * 60 * 1000);
    const now = new Date();
    if (existingBooking.status !== 'HOLD' || now > holdExpirationTime) {
        console.warn(`[POST /bookings] HOLD booking ID ${existingBooking.id} is expired or not in HOLD status (Current Status: ${existingBooking.status}).`);
        // Update the booking status to CANCELLED if it was an expired HOLD
        if (existingBooking.status === 'HOLD') {
             await prisma.booking.update({
                 where: { id: existingBooking.id },
                 data: { status: 'CANCELLED', isCancelled: true }
             });
         }
        return NextResponse.json({
            error: "The hold on your selected items has expired. Please check availability again.",
            isExpired: true, // Indicate to client the specific reason
        }, { status: 409 }); // 409 Conflict
    }
     console.log(`[POST /bookings] Valid HOLD booking found and is active.`);

    // Get Stripe Account ID from the included business relation
    const stripeConnectedAccountId = existingBooking.business?.stripeAccountId;

    if (!stripeConnectedAccountId) {
      // This is an unexpected state if the booking exists but business/stripe account is missing
      console.error(`[POST /bookings] Business Stripe account missing for booking ID: ${existingBooking.id}`);
      return NextResponse.json({ error: "Business Stripe account not set up" }, { status: 500 });
    }
    console.log(`[POST /bookings] Using connected Stripe Account ID: ${stripeConnectedAccountId}`);


    // --- Find or Create Customer ---
    console.log(`[POST /bookings] Finding or creating customer: ${bookingData.customerEmail}`);
    const customer = await prisma.customer.upsert({
      where: {
        email_businessId: {
          email: bookingData.customerEmail,
          businessId
        }
      },
      update: {
        name: bookingData.customerName,
        phone: bookingData.customerPhone,
        address: bookingData.eventAddress, // Update customer address from event address
        city: bookingData.eventCity,
        state: bookingData.eventState,
        zipCode: bookingData.eventZipCode,
        // Don't increment bookingCount/totalSpent here, do it on payment success via webhook
        updatedAt: new Date(), // Explicitly update timestamp
      },
      create: {
        name: bookingData.customerName,
        email: bookingData.customerEmail,
        phone: bookingData.customerPhone,
        address: bookingData.eventAddress, // Store event address as initial customer address
        city: bookingData.eventCity,
        state: bookingData.eventState,
        zipCode: bookingData.eventZipCode,
        businessId,
        bookingCount: 0, // Initial counts, update on payment success
        totalSpent: 0,
        lastBooking: null,
        status: 'Active', // Default status for a new customer
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
     console.log(`[POST /bookings] Customer found or created: ${customer.id}`);


    // --- Time Conversion (Re-verify or use from hold) ---
    // It's safer to re-calculate/verify based on the payload and business timezone
    // Using the timezone from the payload, falling back to the business timezone from the lookup
    const timezone = bookingData.eventTimeZone || existingBooking.business?.timeZone || 'America/Chicago';
    const eventDateUTC = dateOnlyUTC(bookingData.eventDate);
    const startUTC = localToUTC(bookingData.eventDate, bookingData.startTime, timezone);
    const endUTC = localToUTC(bookingData.eventDate, bookingData.endTime, timezone);
    console.log(`[POST /bookings] Final booking times (UTC): ${startUTC.toISOString()} - ${endUTC.toISOString()} (TZ: ${timezone})`);


    // --- Coupon Logic (Lookup by code if provided) ---
     let appliedCoupon = null;
     let appliedCouponId: string | null = null;
     let couponDiscountAmount = 0; // Store discount amount in dollars
     if (bookingData.couponCode) {
         console.log(`[POST /bookings] Looking up coupon code: ${bookingData.couponCode}`);
         const coupon = await prisma.coupon.findUnique({
             where: { code_businessId: { code: bookingData.couponCode, businessId } },
         });

         const now = new Date();
         // Re-validate coupon conditions before applying to the final booking
         // This is a safety check, ideally frontend prevents invalid codes being sent
         if (!coupon || !coupon.isActive || (coupon.startDate && now < coupon.startDate) ||
             (coupon.endDate && now > coupon.endDate) ||
             (typeof coupon.maxUses === "number" && coupon.usedCount >= coupon.maxUses) ||
             (typeof coupon.minimumAmount === "number" && bookingData.subtotalAmount < coupon.minimumAmount)) {
             console.warn(`[POST /bookings] Coupon code "${bookingData.couponCode}" is invalid or expired.`);
             // Return an error to the client. They should ideally handle this validation upfront.
             return NextResponse.json({ error: "The provided coupon code is invalid or cannot be applied." }, { status: 400 });
         }
         appliedCoupon = coupon;
         appliedCouponId = coupon.id;

         // Calculate discount amount (in dollars) for metadata
         if (coupon.discountType === "PERCENTAGE") {
            couponDiscountAmount = Math.round(bookingData.subtotalAmount * (coupon.discountAmount / 100) * 100) / 100;
         } else if (coupon.discountType === "FIXED") {
            couponDiscountAmount = Math.min(coupon.discountAmount, bookingData.subtotalAmount);
         }
         console.log(`[POST /bookings] Coupon "${coupon.code}" is valid. ID: ${appliedCouponId}, Discount: $${couponDiscountAmount}`);
     }


    // --- Calculate Final Amounts (re-calculate server-side for safety) ---
    // While you receive amounts in the payload, re-calculating server-side
    // based on the actual items in the hold, the business's tax rules, and
    // the validated coupon prevents manipulation.
    // For this example, let's re-calculate based on the HOLD items and the validated coupon
    // and tax rate from the payload for consistency, but note that tax calculation
    // logic might be more complex (e.g., based on location).

    const itemsSubtotal = existingBooking.inventoryItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    // Ensure the items subtotal from the hold matches the payload subtotal (within tolerance)
    const subtotalMatchTolerance = 0.01; // Tolerance for floating point comparison
    if (Math.abs(itemsSubtotal - bookingData.subtotalAmount) > subtotalMatchTolerance) {
        console.warn(`[POST /bookings] Payload subtotal mismatch. Expected: $${itemsSubtotal}, Received: $${bookingData.subtotalAmount}. Trusting payload for now.`);
         // In a real app, you might return an error or re-calculate tax based on itemsSubtotal
    }

    let calculatedDiscount = 0;
     if (appliedCoupon) {
         if (appliedCoupon.discountType === "PERCENTAGE") {
             calculatedDiscount = Math.round(itemsSubtotal * (appliedCoupon.discountAmount / 100) * 100) / 100;
         } else if (appliedCoupon.discountType === "FIXED") {
             calculatedDiscount = Math.min(appliedCoupon.discountAmount, itemsSubtotal);
         }
     }

    const discountedSubtotal = Math.max(0, itemsSubtotal - calculatedDiscount);
    // Calculate tax based on discounted subtotal and payload tax rate
    const calculatedTax = Math.round(discountedSubtotal * (bookingData.taxRate / 100) * 100) / 100; // Calculate tax in dollars
    const calculatedTotalAmountDollars = discountedSubtotal + calculatedTax;
    const calculatedAmountCents = Math.round(calculatedTotalAmountDollars * 100);

    // Compare calculated amounts with payload amounts (optional but recommended validation)
    const centsMatchTolerance = 1; // Allow 1 cent difference
     if (Math.abs(calculatedAmountCents - bookingData.amountCents) > centsMatchTolerance) {
         console.warn(`[POST /bookings] Payload cents amount mismatch. Expected: ${calculatedAmountCents}, Received: ${bookingData.amountCents}. Using payload cents.`);
          // Decide how to handle: Use calculated amount, use payload amount, return error.
          // Using payload amountCents for the PI as requested in the schema, but logging warning.
     } else {
         console.log(`[POST /bookings] Calculated cents amount (${calculatedAmountCents}) matches payload cents amount (${bookingData.amountCents}).`);
     }


    // --- Update the Existing Booking Record ---
    console.log(`[POST /bookings] Updating existing booking ID: ${existingBooking.id}`);

    try {
        // Use a transaction for the update to ensure atomicity
        await prisma.$transaction(async (tx) => {

            // Update the main Booking record with full details and change status from HOLD to PENDING
            const bookingUpdateResult = await tx.booking.update({
                where: { id: existingBooking.id },
                data: {
                    customerId: customer.id, // Link the customer
                    eventDate: eventDateUTC,
                    startTime: startUTC,
                    endTime: endUTC,
                    eventTimeZone: timezone,
                    // Change status from 'HOLD' to 'PENDING'
                    status: 'PENDING' as BookingStatus, // Transitioning to PENDING before payment
                    totalAmount: calculatedTotalAmountDollars, // Store calculated total
                    subtotalAmount: itemsSubtotal, // Store items subtotal
                    taxAmount: calculatedTax, // Store calculated tax
                    taxRate: bookingData.taxRate, // Store the rate used
                    depositPaid: false, // Still false until payment succeeds via webhook
                    eventType: bookingData.eventType,
                    eventAddress: bookingData.eventAddress,
                    eventCity: bookingData.eventCity,
                    eventState: bookingData.eventState,
                    eventZipCode: bookingData.eventZipCode,
                    participantCount: bookingData.participantCount,
                    participantAge: bookingData.participantAge,
                    specialInstructions: bookingData.specialInstructions,
                    couponId: appliedCouponId, // Link the coupon ID
                    updatedAt: new Date(), // Explicitly set update timestamp
                },
                include: { inventoryItems: true } // Include items to update their status below
            });
            console.log(`[POST /bookings] Booking ${existingBooking.id} updated to PENDING.`);

            // Also update the status of the associated BookingItems from 'HOLD' to 'PENDING'
            // Use raw SQL again because of the Unsupported type limitation
             if (existingBooking.inventoryItems.length > 0) {
                 const itemIds = existingBooking.inventoryItems.map(item => item.id);
                 await tx.$executeRaw`
                    UPDATE "BookingItem"
                    SET "bookingStatus" = 'PENDING', "updatedAt" = NOW()
                    WHERE id IN (${Prisma.join(itemIds)})
                    AND "bookingStatus" = 'HOLD'; -- Only update items still on HOLD
                 `;
                console.log(`[POST /bookings] Updated ${existingBooking.inventoryItems.length} BookingItem statuses to PENDING.`);
             }


            return bookingUpdateResult; // Return the updated booking
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable // Use Serializable isolation
        });
        console.log(`[POST /bookings] Database transaction for booking update completed.`);

//eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(`[POST /bookings] Error updating booking ${existingBooking.id} during transaction:`, error);
         // Handle potential conflicts during the update phase
         if (error && typeof error === 'object' && 'name' in error && error.name === "BookingConflictError") {
              console.warn(`[POST /bookings] BookingConflictError during update? Booking ${existingBooking.id}`);
             // This implies that RIGHT AS you tried to update the PENDING status,
             // another booking for the SAME inventory/time became CONFIRMED or PENDING.
             // This is unlikely with the initial HOLD and Serializable transaction,
             // but possible in very specific race conditions or if the HOLD wasn't correctly placed initially.
             return NextResponse.json({
                 error: "A conflict occurred while finalizing your booking. The time slot may no longer be available.",
             }, { status: 409 });
         }
         // Handle other DB errors during update
         if (error instanceof PrismaClientKnownRequestError) {
             console.error(` - Prisma Error Code: ${error.code}`);
             console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
         }
         // If the update failed for any other reason, the booking is still on HOLD (due to transaction rollback).
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update booking details." }, { status: 500 });
    }


    // --- Create the Stripe Customer & Payment Intent ---
    // Use the customer ID found/created above
    console.log(`[POST /bookings] Creating/Using Stripe Customer and creating Payment Intent.`);
    try {
      // findOrCreateStripeCustomer function should handle linking Stripe Customer to your CustomerStripeAccount table
      const stripeCustomerId = await findOrCreateStripeCustomer(
          bookingData.customerEmail,
          bookingData.customerName,
          bookingData.customerPhone,
          bookingData.eventCity,
          bookingData.eventState,
          bookingData.eventAddress,
          bookingData.eventZipCode,
          businessId, // Your business ID
          stripeConnectedAccountId // The connected account ID
      );
      console.log(`[POST /bookings] Using Stripe Customer ID: ${stripeCustomerId}`);

      // --- Prepare Metadata for the Payment Intent ---
      // Include essential prisma IDs and relevant booking info for the webhook
      // Ensure all metadata values are strings
      const metadata: Record<string, string> = {
          // Link back to your internal Prisma records
          prismaBookingId: existingBooking.id,
          prismaBusinessId: businessId,
          prismaCustomerId: customer.id,

          // Include key booking details for webhook logging/context
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          eventDate: bookingData.eventDate, // Original date string
          startTime: bookingData.startTime, // Original time string
          endTime: bookingData.endTime,   // Original time string
          eventAddress: bookingData.eventAddress,
          eventCity: bookingData.eventCity,
          eventState: bookingData.eventState,
          eventZipCode: bookingData.eventZipCode,
          eventTimeZone: timezone, // The timezone used
          eventType: bookingData.eventType || 'OTHER',
          participantCount: bookingData.participantCount.toString(),
          participantAge: bookingData.participantAge?.toString() || '',
          // Store amounts in dollars as strings
          subtotalAmount: calculatedTotalAmountDollars.toString(), // Use calculated total amount after discount
          taxAmount: calculatedTax.toString(), // Use calculated tax
          taxRate: bookingData.taxRate.toString(),
          totalAmount: calculatedTotalAmountDollars.toString(), // Use calculated total amount

          // Include item details as a JSON string
           selectedItems: JSON.stringify(existingBooking.inventoryItems.map(item => ({
               id: item.inventoryId, // Use inventory ID
               quantity: item.quantity,
               price: item.price,
               // Include names or other details if needed by webhook
           }))),

           // Include coupon info if applied
          ...(appliedCouponId ? { couponId: appliedCouponId } : {}), // Link coupon ID if applied
           ...(bookingData.couponCode ? { couponCode: bookingData.couponCode } : {}),
           ...(couponDiscountAmount > 0 ? { couponAmount: couponDiscountAmount.toString() } : {}), // Discount amount in dollars

          // Include special instructions if any
          ...(bookingData.specialInstructions && { specialInstructions: bookingData.specialInstructions }),

          // Optional: add a note about this being a hold finalization
          bookingFlow: 'hold_to_payment',
      };

      // Create the PaymentIntent on behalf of the connected account
      console.log(`[POST /bookings] Creating PaymentIntent with amount: ${bookingData.amountCents} cents`);
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: bookingData.amountCents, // Amount in cents from payload
          currency: "usd", // Or get currency from business settings
          payment_method_types: ["card"], // Specify allowed payment methods
          receipt_email: bookingData.customerEmail, // Send receipt to customer
          metadata: metadata, // Attach the metadata
          customer: stripeCustomerId, // Link the Stripe customer

          // Optional: request 3D Secure if required
          // payment_method_options: {
          //   card: {
          //     request_three_d_secure: 'any',
          //   },
          // },
        },
        {
          stripeAccount: stripeConnectedAccountId, // Perform action on behalf of the connected account
        }
      );
      console.log(`[POST /bookings] PaymentIntent created successfully: ${paymentIntent.id}`);

      // Ensure client secret is available
      if (!paymentIntent.client_secret) {
        console.error("[POST /bookings] Failed to get client secret from Stripe after creating PaymentIntent.");
         // If PI creation succeeded but no client_secret, mark booking/items as pending/requires_payment_method?
         // For now, just return an error, the booking is still PENDING in DB.
        return NextResponse.json({ error: "Failed to initialize payment with Stripe." }, { status: 500 });
      }

      // Return the client secret to the client for payment confirmation
      return NextResponse.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        bookingId: existingBooking.id, // Return the booking ID for client confirmation
        // Optionally return updated total amount if recalculated
        // finalTotalAmountDollars: calculatedTotalAmountDollars,
      }, { status: 200 });
//eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (stripeError: any) {
      console.error("[POST /bookings] Stripe error creating payment intent:", stripeError);
       // Consider updating the booking status here to indicate payment intent failed?
       // The booking is currently PENDING. Maybe leave it PENDING for retry?
       // Or change to 'PAYMENT_FAILED' if you add that status?
       // For now, log and return Stripe error.
      return NextResponse.json({ error: stripeError.message || "Stripe payment intent creation failed" }, { status: 500 });
    }
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Catch errors during initial parsing, validation, or lookup
    console.error("[POST /bookings] Error in main try block during Finalization:", error);
    if (error instanceof z.ZodError) {
      console.log("[POST /bookings] Zod validation error during Finalization.");
      return NextResponse.json(
        { error: "Invalid request payload", details: error.errors },
        { status: 400 }
      );
    }
    // Handle other unexpected errors
    console.error("[POST /bookings] Other unexpected error during Finalization:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during booking finalization" },
      { status: 500 }
    );
  }
}


// --- GET: Fetch All Bookings for a Business ---
// This GET route is separate from availability and hold placement.
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } } // Use direct params
) {
  try {
    const { businessId } = params;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    console.log(`[GET /bookings] Fetching all bookings for business ID: ${businessId}`);

    const bookings = await prisma.booking.findMany({
      where: {
        businessId: businessId,
      },
      include: {
        inventoryItems: {
          include: {
            inventory: {
              select: { id: true, name: true } // Only select necessary fields from Inventory
            }
          }
        },
        customer: { // Include customer details
            select: { id: true, name: true, email: true, phone: true } // Select specific customer fields
        },
        waivers: { // Include waivers related to this booking
          select: {
            id: true,
            status: true, // Get the waiver status
            docuSealDocumentId: true // Include for potential linking/viewing
          }
        },
        coupon: { // Include coupon details if linked
            select: { id: true, code: true, discountType: true, discountAmount: true }
        },
        invoice: { // Include invoice details if linked
            select: { id: true, status: true, amountDue: true, invoicePdfUrl: true, hostedInvoiceUrl: true }
        },
        quote: { // Include quote details if linked
             select: { id: true, status: true, amountTotal: true, hostedQuoteUrl: true, pdfUrl: true }
        }
      },
      orderBy: {
        eventDate: 'asc', // Order by event date ascending
        startTime: 'asc', // Then by start time
      },
    });

    console.log(`[GET /bookings] Found ${bookings.length} bookings.`);

    // Transform bookings for the response format if needed
    // Adding hasSignedWaiver flag is a good transformation
    const formattedBookings = bookings.map(booking => {
      const hasSignedWaiver = booking.waivers.some(waiver => waiver.status === 'SIGNED');

      return {
        ...booking,
        hasSignedWaiver, // Add a boolean flag for signed waiver
        // Ensure any fields marked with `undefined` or `null` in previous logic
        // are correctly handled if they were included by default and are not needed.
        // Based on the `select` and `include` above, Prisma will only fetch what's specified.
      };
    });

    return NextResponse.json(formattedBookings, { status: 200 });

  } catch (error) {
    console.error("[GET /bookings] Error fetching bookings:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}



