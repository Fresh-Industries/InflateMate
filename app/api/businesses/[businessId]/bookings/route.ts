// /api/businesses/[businessId]/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe-server";
import { prisma } from "@/lib/prisma";

// Define a schema for the expected payload
const paymentIntentSchema = z.object({
  amount: z.number(), // amount in cents
  customerEmail: z.string().email(),
  metadata: z.record(z.any()), // booking details stored as metadata
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
    console.log("Received payment intent request body:", body);
    const { amount, customerEmail, metadata } = paymentIntentSchema.parse(body);
    console.log("Validated payment intent data:", { amount, customerEmail });

    // Fetch the business to ensure it exists and has a Stripe account
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || !business.stripeAccountId) {
      return NextResponse.json({ error: "Business not found or Stripe account not set up" }, { status: 404 });
    }

    console.log("Creating PaymentIntent for connected account:", business.stripeAccountId);

    try {
      // Ensure all metadata values are strings
      const sanitizedMetadata: Record<string, string> = {};
      Object.entries(metadata).forEach(([key, value]) => {
        sanitizedMetadata[key] = typeof value === 'string' ? value : JSON.stringify(value);
      });
      
      // Create a PaymentIntent on behalf of the connected account
      const paymentIntent = await stripe.paymentIntents.create(
        {
          amount,
          currency: "usd",
          payment_method_types: ["card"],
          receipt_email: customerEmail,
          metadata: sanitizedMetadata,
        },
        {
          stripeAccount: business.stripeAccountId,
        }
      );

      if (!paymentIntent.client_secret) {
        return NextResponse.json({ error: "Failed to get client secret from Stripe" }, { status: 500 });
      }

      return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
    } catch (stripeError) {
      console.error("Stripe error creating payment intent:", stripeError);
      return NextResponse.json({ error: stripeError instanceof Error ? stripeError.message : "Stripe payment intent creation failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating PaymentIntent:", error);
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