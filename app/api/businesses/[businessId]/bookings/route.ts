// /api/businesses/[businessId]/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withBusinessAuth, getCurrentUser } from "@/lib/auth/clerk-utils";
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
    // Authenticate the user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("userId", user?.id);
    const businessId  = (await params).businessId;
    console.log("businessId", businessId);
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }
    
    // Parse and validate the request payload
    const body = await req.json();
    console.log("Received payment intent request body:", body);
    const { amount, customerEmail, metadata } = paymentIntentSchema.parse(body);
    console.log("Validated payment intent data:", { amount, customerEmail });

    // Use your withBusinessAuth helper to verify that the user is allowed for this business
    const result = await withBusinessAuth(businessId, user.id, async (business) => {
      console.log("Business data in withBusinessAuth:", {
        id: business.id,
        hasStripeAccount: !!business.stripeAccountId,
        stripeAccountId: business.stripeAccountId
      });
      
      if (!business.stripeAccountId) {
        console.error("No stripeAccountId found for business:", businessId);
        return { error: "Connected Stripe account is not set up for this business" };
      }
      
      console.log("Creating PaymentIntent for connected account:", business.stripeAccountId);
      
      try {
        // Add some debugging for the metadata
        console.log("Creating PaymentIntent with metadata:", metadata);
        console.log("Metadata keys:", Object.keys(metadata));
        console.log("Critical metadata fields:", {
          bounceHouseId: metadata.bounceHouseId,
          businessId: metadata.businessId,
          customerEmail: customerEmail
        });

        // Create a PaymentIntent on behalf of the connected account.
        // You have two options:
        // - Direct Charges: PaymentIntent is created on the connected account (using stripeAccount)
        // - Destination Charges: PaymentIntent is created on your platform, then funds transferred.
        // In this example we use direct charges.
        const paymentIntent = await stripe.paymentIntents.create(
          {
            amount,
            currency: "usd",
            payment_method_types: ["card"],
            receipt_email: customerEmail,
            metadata, // Store booking details here so you can later create the booking record (or update it) after payment succeeds.
          },
          {
            stripeAccount: business.stripeAccountId,
          }
        );

        console.log("PaymentIntent created successfully:", {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret ? "exists" : "missing",
          clientSecretLength: paymentIntent.client_secret ? paymentIntent.client_secret.length : 0
        });

        // After creating the PaymentIntent, verify the metadata was set correctly
        console.log("PaymentIntent created with ID:", paymentIntent.id);
        console.log("Metadata successfully set:", !!paymentIntent.metadata);
        console.log("Metadata keys in created PaymentIntent:", Object.keys(paymentIntent.metadata));
        if (!paymentIntent.metadata || Object.keys(paymentIntent.metadata).length === 0) {
          console.error("WARNING: No metadata was set on the PaymentIntent. Webhook processing will fail!");
        }

        if (!paymentIntent.client_secret) {
          console.error("No client_secret returned from Stripe");
          return { error: "Failed to get client secret from Stripe" };
        }

        return { data: { clientSecret: paymentIntent.client_secret } };
      } catch (stripeError) {
        console.error("Stripe error creating payment intent:", stripeError);
        return { error: stripeError instanceof Error ? stripeError.message : "Stripe payment intent creation failed" };
      }
    });

    console.log("Result from withBusinessAuth:", {
      hasError: !!result.error,
      hasData: !!result.data,
      dataKeys: result.data ? Object.keys(result.data) : [],
      error: result.error || "none"
    });

    if (result.error) {
      console.error("Error creating payment intent:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    console.log("Returning successful response with client secret");
    
    // Verify that result.data exists and has clientSecret before returning
    if (result.data && 'clientSecret' in result.data) {
      const clientSecret = result.data.clientSecret as string;
      console.log("Client secret found with length:", clientSecret.length);
      
      // Return in a format the frontend expects
      return NextResponse.json({ 
        clientSecret,
        data: { clientSecret } 
      }, { status: 200 });
    } else {
      console.error("Missing client secret in result data:", result);
      return NextResponse.json({ error: "Missing client secret in result" }, { status: 500 });
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
    const  businessId  = (await params).businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        businessId: businessId,
      },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
