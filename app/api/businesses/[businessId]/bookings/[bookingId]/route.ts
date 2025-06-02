/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { updateBookingSafely, UpdateBookingDataInput, BookingConflictError } from '@/lib/updateBookingSafely';
import { z } from 'zod'; // Import Zod for schema validation

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
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
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

    // Transform the data to match BookingFullDetails format
    const bookingFullDetails = {
      booking: {
        id: booking.id,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalAmount: booking.totalAmount,
        eventType: booking.eventType,
        eventAddress: booking.eventAddress,
        eventCity: booking.eventCity,
        eventState: booking.eventState,
        eventZipCode: booking.eventZipCode,
        eventTimeZone: booking.eventTimeZone || "America/Chicago",
        participantCount: booking.participantCount,
        participantAge: booking.participantAge,
        specialInstructions: booking.specialInstructions,
        expiresAt: booking.expiresAt,
      },
      customer: booking.customer ? {
        id: booking.customer.id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
      } : null,
      bookingItems: booking.inventoryItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        startUTC: item.startUTC,
        endUTC: item.endUTC,
        inventory: {
          id: item.inventory.id,
          name: item.inventory.name,
          description: item.inventory.description,
          primaryImage: item.inventory.primaryImage,
        }
      }))
    };

    return NextResponse.json(bookingFullDetails);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Define a schema for the booking update request body
const UpdateBookingSchema = z.object({
  // Customer information
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  
  // Special instructions
  specialInstructions: z.string().nullable().optional(),
  
  // Event location fields
  eventAddress: z.string().optional(),
  eventCity: z.string().optional(),
  eventState: z.string().optional(),
  eventZipCode: z.string().optional(),
  
  // Participant fields
  participantCount: z.number().int().min(1).optional(),
  participantAge: z.number().int().positive().nullable().optional(),
  
  // Original date/time fields - typically shouldn't change in edit flow but kept for validation
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  eventTimeZone: z.string().optional(),
  
  // Inventory items - make optional to allow confirmed booking updates without items
  items: z.array(
    z.object({
      inventoryId: z.string(),
      quantity: z.number().int().min(1),
      price: z.number().min(0),
      // These will be converted to Date objects in updateBookingSafely
      startUTC: z.date().or(z.string()),
      endUTC: z.date().or(z.string()),
      status: z.string().optional(),
    })
  ).optional(),
  
  // Amounts for validation
  subtotalAmount: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
  totalAmount: z.number().min(0).optional(),
  
  // Coupon
  couponCode: z.string().optional().nullable(),
  
  // Intent for prepare_for_quote or prepare_for_payment
  intent: z.enum([
    "prepare_for_quote", 
    "prepare_for_payment", 
    "prepare_for_payment_difference",
    "update_customer_info_only"
  ]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: User details missing." }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Forbidden: Access denied to this business." }, { status: 403 });
    }

    // Parse and validate the request body
    let body: UpdateBookingDataInput;
    try {
      const rawBody = await request.json();
      console.log('[API PATCH Booking] Request body:', JSON.stringify(rawBody));
      
      // Validate the request body with Zod schema
      const validatedData = UpdateBookingSchema.parse(rawBody);
      body = validatedData as UpdateBookingDataInput;
      
      // Log if we're processing an intent
      if (body.intent) {
        console.log(`[API PATCH Booking] Processing with intent: ${body.intent}`);
      }
    } catch (error) {
      console.error('[API PATCH Booking] Error parsing request body:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Invalid request body format.", 
          details: error.errors 
        }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    console.log(`[API PATCH Booking] User ${user.id} attempting to update booking ${bookingId} for business ${businessId}`);
    
    // Check if this is a CONFIRMED booking
    const booking = await prisma.booking.findUnique({ 
      where: { id: bookingId },
      select: { status: true }
    });

    // Special handling for CONFIRMED bookings without items array (just updating customer info)
    if (booking?.status === "CONFIRMED" && (!body.items || body.intent === "update_customer_info_only")) {
      console.log(`[API PATCH Booking] Processing simple update for CONFIRMED booking without modifying items`);
      
      // Directly update the booking without affecting booking items
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          eventAddress: body.eventAddress,
          eventCity: body.eventCity,
          eventState: body.eventState,
          eventZipCode: body.eventZipCode,
          participantCount: body.participantCount,
          participantAge: body.participantAge,
          specialInstructions: body.specialInstructions,
          eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
          startTime: body.startTime && body.eventDate 
            ? new Date(`${body.eventDate}T${body.startTime}:00.000Z`) 
            : undefined,
          endTime: body.endTime && body.eventDate 
            ? new Date(`${body.eventDate}T${body.endTime}:00.000Z`) 
            : undefined,
          eventTimeZone: body.eventTimeZone,
          updatedAt: new Date(),
          // If we have customer info, also update the customer
          ...(body.customerName && body.customerEmail && body.customerPhone ? {
            customer: {
              update: {
                name: body.customerName,
                email: body.customerEmail,
                phone: body.customerPhone,
                updatedAt: new Date(),
              }
            }
          } : {})
        },
        include: {
          customer: true,
          inventoryItems: {
            include: { inventory: true }
          }
        }
      });
      
      console.log(`[API PATCH Booking] Successfully updated CONFIRMED booking ${bookingId} (simple update)`);
      return NextResponse.json(updatedBooking, { status: 200 });
    }
    
    // Special handling for CONFIRMED bookings with prepare_for_payment_difference intent
    if (booking?.status === "CONFIRMED" && body.intent === "prepare_for_payment_difference" && body.items) {
      console.log(`[API PATCH Booking] Processing payment for additional items for CONFIRMED booking`);
      
      try {
        // First, update the booking with the new items using updateBookingSafely
        const updatedBookingWithItems = await updateBookingSafely(bookingId, businessId, body);
        
        // Now we need to create a payment intent for the difference amount
        // Get the business for Stripe account info
        const business = await prisma.business.findUnique({
          where: { id: businessId },
          select: { stripeAccountId: true }
        });

        if (!business?.stripeAccountId) {
          return NextResponse.json({ 
            error: "Business Stripe account not configured",
            code: "STRIPE_ACCOUNT_MISSING"
          }, { status: 400 });
        }

        // Calculate the difference amount (added items + tax)
        const differenceAmount = (body.subtotalAmount || 0) + (body.taxAmount || 0);
        const differenceAmountCents = Math.round(differenceAmount * 100);

        if (differenceAmountCents <= 0) {
          return NextResponse.json({ 
            error: "No additional payment required",
            code: "NO_PAYMENT_NEEDED"
          }, { status: 400 });
        }

        // Get or create customer for Stripe
        const customer = await prisma.customer.findFirst({
          where: { 
            email: body.customerEmail || "",
            businessId: businessId 
          }
        });

        if (!customer) {
          return NextResponse.json({ 
            error: "Customer not found",
            code: "CUSTOMER_NOT_FOUND"
          }, { status: 400 });
        }

        // Find or create Stripe customer
        const { findOrCreateStripeCustomer } = await import("@/lib/stripe/customer-utils");
        const stripeCustomerId = await findOrCreateStripeCustomer(
          customer.email,
          customer.name,
          customer.phone || "",
          body.eventCity || "",
          body.eventState || "",
          body.eventAddress || "",
          body.eventZipCode || "",
          businessId,
          business.stripeAccountId
        );

        // Create payment intent for the difference
        const { stripe } = await import("@/lib/stripe-server");
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: differenceAmountCents,
          currency: "usd",
          customer: stripeCustomerId,
          receipt_email: customer.email,
          metadata: {
            prismaBookingId: bookingId,
            prismaBusinessId: businessId,
            prismaCustomerId: customer.id,
            paymentType: "booking_addition",
            addedItemsAmount: (body.subtotalAmount || 0).toString(),
            taxAmount: (body.taxAmount || 0).toString(),
            totalDifferenceAmount: differenceAmount.toString(),
            customerName: customer.name,
            customerEmail: customer.email,
          }
        }, {
          stripeAccount: business.stripeAccountId
        });

        if (!paymentIntent.client_secret) {
          return NextResponse.json({ 
            error: "Failed to create payment intent",
            code: "PAYMENT_INTENT_FAILED"
          }, { status: 500 });
        }

        console.log(`[API PATCH Booking] Created payment intent for difference: $${differenceAmount}`);
        
        // Return the updated booking with client secret
        return NextResponse.json({
          ...updatedBookingWithItems,
          clientSecret: paymentIntent.client_secret,
          differenceAmount: differenceAmount,
          paymentIntentId: paymentIntent.id
        }, { status: 200 });
        
      } catch (error) {
        console.error("[API PATCH Booking] Error processing payment difference:", error);
        return NextResponse.json({ 
          error: error instanceof Error ? error.message : "Failed to process payment for additional items",
          code: "PAYMENT_DIFFERENCE_ERROR"
        }, { status: 400 });
      }
    }
    
    // For non-confirmed bookings or confirmed bookings with items array, use the regular update process
    const updatedBooking = await updateBookingSafely(bookingId, businessId, body);

    console.log(`[API PATCH Booking] Successfully updated booking ${updatedBooking.id} to status ${updatedBooking.status}`);
    
    // Return the fully updated booking
    return NextResponse.json(updatedBooking, { status: 200 });

  } catch (error: any) {
    try {
      const { bookingId } = await params;
      console.error(`[API PATCH Booking] Error updating booking ${bookingId}:`, error);
    } catch {
      console.error(`[API PATCH Booking] Error updating booking:`, error);
    }

    // Handle specific error types
    if (error instanceof BookingConflictError) {
      return NextResponse.json({ 
        error: error.message || "Booking conflict detected - Items may no longer be available.", 
        code: "CONFLICT"
      }, { status: 409 });
    }
    
    if (error.message.includes("cannot be edited")) {
      return NextResponse.json({ 
        error: error.message, 
        code: "CANNOT_EDIT"
      }, { status: 400 });
    }
    
    if (error.message.includes("not found")) {
      return NextResponse.json({ 
        error: error.message, 
        code: "NOT_FOUND"
      }, { status: 404 });
    }

    return NextResponse.json({ 
      error: "Internal Server Error.", 
      message: error.message || "An unexpected error occurred." 
    }, { status: 500 });
  }
}

// Delete Booking only if pending or hold if no payment has been made then it can be safely deleted 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get the booking with all related records
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        payments: true,
        waivers: true,
        invoice: true,
        quote: true,
        inventoryItems: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow deletion of PENDING or HOLD bookings
    if (booking.status !== "PENDING" && booking.status !== "HOLD") {
      return NextResponse.json(
        { error: "Only PENDING or HOLD bookings can be deleted" },
        { status: 400 }
      );
    }

    // Check if there are any completed payments
    const hasCompletedPayments = booking.payments.some(
      (payment) => payment.status === "COMPLETED"
    );
    if (hasCompletedPayments) {
      return NextResponse.json(
        { error: "Cannot delete booking with completed payments" },
        { status: 400 }
      );
    }

    // Delete the booking and all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      if (booking.invoice) {
        await tx.invoice.delete({
          where: { id: booking.invoice.id },
        });
      }

      if (booking.quote) {
        await tx.quote.delete({
          where: { id: booking.quote.id },
        });
      }

      // Delete payments
      await tx.payment.deleteMany({
        where: { bookingId },
      });

      // Delete waivers
      await tx.waiver.deleteMany({
        where: { bookingId },
      });

      // Delete booking items
      await tx.bookingItem.deleteMany({
        where: { bookingId },
      });

      // Finally delete the booking
      await tx.booking.delete({
        where: { id: bookingId },
      });
    });

    return NextResponse.json(
      { message: "Booking and related records deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}