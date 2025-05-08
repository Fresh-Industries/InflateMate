// /api/businesses/[businessId]/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe-server";
import { prisma } from "@/lib/prisma";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
import { createBookingSafely } from "@/lib/createBookingSafely";
import { BookingStatus } from "@/prisma/generated/prisma";

// Define a schema for the expected payload
const bookingSchema = z.object({
  amount: z.number(), // amount in cents
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerPhone: z.string(),
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  eventAddress: z.string(),
  eventCity: z.string(),
  eventState: z.string(),
  eventZipCode: z.string(),
  eventTimeZone: z.string().optional(),
  eventType: z.string().optional(),
  participantCount: z.number(),
  participantAge: z.number().optional(),
  subtotalAmount: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  specialInstructions: z.string().optional(),
  selectedItems: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
    price: z.number(),
    startUTC: z.string(),
    endUTC: z.string(),
    status: z.string()
  })),
  couponCode: z.string().optional(),
  couponAmount: z.number().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse and validate the request payload
    const body = await req.json();
    console.log("Received booking request body:", body);
    const bookingData = bookingSchema.parse(body);
    
    // Fetch the business to ensure it exists and has a Stripe account
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || !business.stripeAccountId) {
      return NextResponse.json({ error: "Business not found or Stripe account not set up" }, { status: 404 });
    }
    const stripeConnectedAccountId = business.stripeAccountId;

    // Try to create the booking using the safe transaction approach
    try {
      // First find or create the customer
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
          address: bookingData.eventAddress,
          city: bookingData.eventCity,
          state: bookingData.eventState,
          zipCode: bookingData.eventZipCode,
        },
        create: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          phone: bookingData.customerPhone,
          address: bookingData.eventAddress,
          city: bookingData.eventCity,
          state: bookingData.eventState,
          zipCode: bookingData.eventZipCode,
          businessId,
        }
      });

      // Get the date parts
      const eventDate = new Date(bookingData.eventDate);
      const timezone = bookingData.eventTimeZone || business.timeZone;
      
      // Parse start and end times
      const [startHour, startMinute] = bookingData.startTime.split(':').map(Number);
      const [endHour, endMinute] = bookingData.endTime.split(':').map(Number);
      
      // Create start and end DateTime objects
      const startTime = new Date(eventDate);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(eventDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      // Coupon logic
      let couponDiscount = 0;
      let couponCode: string | undefined = undefined;
      if (bookingData.couponCode) {
        // Look up coupon for this business
        const coupon = await prisma.coupon.findUnique({
          where: { code_businessId: { code: bookingData.couponCode, businessId } },
        });
        const now = new Date();
        if (!coupon || !coupon.isActive) {
          return NextResponse.json({ error: "Coupon not found or inactive" }, { status: 400 });
        }
        if (coupon.startDate && now < coupon.startDate) {
          return NextResponse.json({ error: "Coupon not yet active" }, { status: 400 });
        }
        if (coupon.endDate && now > coupon.endDate) {
          return NextResponse.json({ error: "Coupon expired" }, { status: 400 });
        }
        if (typeof coupon.maxUses === "number" && coupon.usedCount >= coupon.maxUses) {
          return NextResponse.json({ error: "Coupon max uses reached" }, { status: 400 });
        }
        if (typeof coupon.minimumAmount === "number" && bookingData.subtotalAmount < coupon.minimumAmount) {
          return NextResponse.json({ error: `Minimum order: $${coupon.minimumAmount}` }, { status: 400 });
        }
        // Compute discount
        if (coupon.discountType === "PERCENTAGE") {
          couponDiscount = Math.round(bookingData.subtotalAmount * (coupon.discountAmount / 100) * 100) / 100;
        } else if (coupon.discountType === "FIXED") {
          couponDiscount = Math.min(coupon.discountAmount, bookingData.subtotalAmount);
        }
        if (couponDiscount <= 0) {
          return NextResponse.json({ error: "No discount for this amount" }, { status: 400 });
        }
        couponCode = coupon.code;
      }
      // Adjust amount (in cents)
      let finalAmount = bookingData.amount;
      if (couponDiscount > 0) {
        // Only apply to subtotal, not tax
        const discountedSubtotal = Math.max(0, bookingData.subtotalAmount - couponDiscount);
        const newTotal = discountedSubtotal + bookingData.taxAmount;
        finalAmount = Math.round(newTotal * 100); // cents
      }

      // Create booking with BookingItems in a transaction that respects exclusion constraints
      const booking = await createBookingSafely({
        eventDate,
        startTime,
        endTime,
        eventTimeZone: timezone,
        status: "HOLD" as BookingStatus,
        totalAmount: finalAmount / 100, // Convert cents to dollars
        subtotalAmount: bookingData.subtotalAmount,
        taxAmount: bookingData.taxAmount,
        taxRate: bookingData.taxRate,
        depositPaid: false,
        eventType: bookingData.eventType || "OTHER",
        eventAddress: bookingData.eventAddress,
        eventCity: bookingData.eventCity,
        eventState: bookingData.eventState,
        eventZipCode: bookingData.eventZipCode,
        participantCount: bookingData.participantCount,
        participantAge: bookingData.participantAge,
        specialInstructions: bookingData.specialInstructions,
        business: {
          connect: { id: businessId }
        },
        customer: {
          connect: { id: customer.id }
        },
        inventoryItems: bookingData.selectedItems.map(item => ({
          quantity: item.quantity,
          price: item.price,
          startUTC: startTime,
          endUTC: endTime,
          status: "HOLD",
          inventory: { connect: { id: item.id } }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        })) as any,
      });

      // Ensure booking was created successfully
      if (!booking) {
        return NextResponse.json({ error: "Failed to create booking record" }, { status: 500 });
      }

      // Now create the Stripe customer and payment intent
      const stripeCustomerId = await findOrCreateStripeCustomer(
        bookingData.customerEmail,
        bookingData.customerName,
        bookingData.customerPhone,
        bookingData.eventCity,
        bookingData.eventState,
        bookingData.eventAddress,
        bookingData.eventZipCode,
        businessId,
        stripeConnectedAccountId
      );
      
      // Prepare metadata for the payment intent
      const metadata = {
        bookingId: booking.id,
        businessId,
        customerId: customer.id,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        eventDate: bookingData.eventDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        eventAddress: bookingData.eventAddress,
        eventCity: bookingData.eventCity,
        eventState: bookingData.eventState,
        eventZipCode: bookingData.eventZipCode,
        eventTimeZone: timezone,
        eventType: bookingData.eventType || "OTHER",
        participantCount: bookingData.participantCount.toString(),
        participantAge: bookingData.participantAge?.toString() || "",
        subtotalAmount: bookingData.subtotalAmount.toString(),
        taxAmount: bookingData.taxAmount.toString(),
        taxRate: bookingData.taxRate.toString(),
        totalAmount: ((finalAmount / 100).toString()),
        specialInstructions: bookingData.specialInstructions || "",
        selectedItems: JSON.stringify(bookingData.selectedItems),
        ...(couponCode ? { couponCode } : {}),
        ...(couponDiscount > 0 ? { couponAmount: couponDiscount.toString() } : {}),
      };
      
      // Create a PaymentIntent on behalf of the connected account
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount: finalAmount,
          currency: "usd",
          payment_method_types: ["card"],
          receipt_email: bookingData.customerEmail,
          metadata,
          customer: stripeCustomerId,
        },
        {
          stripeAccount: stripeConnectedAccountId,
        }
      );

      if (!paymentIntent.client_secret) {
        // If we couldn't get a client secret, mark the booking as cancelled
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: "CANCELLED" }
        });
        return NextResponse.json({ error: "Failed to get client secret from Stripe" }, { status: 500 });
      }

      return NextResponse.json({ 
        bookingId: booking.id,
        clientSecret: paymentIntent.client_secret 
      }, { status: 200 });
    } catch (error) {
      console.error("Error creating booking or payment intent:", error);
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : "Failed to create booking" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in POST /api/businesses/[businessId]/bookings:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        businessId: businessId,
      },
      include: {
        inventoryItems: {
          include: {
            inventory: {
              select: { id: true, name: true } // Only select necessary fields
            }
          }
        },
        customer: true, // Keep customer details
        waivers: { // Include waivers related to this booking
          select: {
            id: true,
            status: true, // Get the waiver status
            docuSealDocumentId: true // Include for potential linking/viewing
          }
        }
      },
      orderBy: {
        eventDate: 'asc',
      },
    });
    
    // Transform bookings to include simplified bounceHouse and waiver status
    const formattedBookings = bookings.map(booking => {
      // Use inventoryItems directly instead of creating a separate bounceHouse field
      const hasSignedWaiver = booking.waivers.some(waiver => waiver.status === 'SIGNED');
      
      return {
        ...booking,
        hasSignedWaiver, // Add a boolean flag for signed waiver
        // Remove the old bounceHouse and bounceHouseId fields
        bounceHouse: undefined,
        bounceHouseId: undefined,
      };
    });

    return NextResponse.json(formattedBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}