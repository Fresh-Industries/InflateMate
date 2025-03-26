import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import { z } from "zod";
import Stripe from "stripe";
import { Twilio } from "twilio";

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessAddress: z.string().min(5, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().length(2, "Please use 2-letter state code"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  businessPhone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
});

export async function POST(req: NextRequest) {
  try {
    // Retrieve the current user from the session
    const twilio = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const { userId } = await auth();
    console.log(userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    console.log(user);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    if (!user.email) {
      return NextResponse.json({ message: "User email is required" }, { status: 400 });
    }

    // Create a Stripe Connect account with pre-filled business data
    const account = await stripe.accounts.create({
      type: 'custom',
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: validatedData.businessName,
        support_phone: validatedData.businessPhone,
        support_address: {
          line1: validatedData.businessAddress,
          city: validatedData.businessCity,
          state: validatedData.businessState,
          postal_code: validatedData.businessZip,
          country: "US",
        },
        // Use a default description since they don't have a website yet
        product_description: "Managed via Bounce House App",
      },
    });
    
    // Create the business record in your database
    const business = await prisma.business.create({
      data: {
        name: validatedData.businessName,
        address: validatedData.businessAddress,
        city: validatedData.businessCity,
        state: validatedData.businessState,
        zipCode: validatedData.businessZip,
        phone: validatedData.businessPhone.replace(/\D/g, ""),
        email: user.email,
        userId: user.id,
        stripeAccountId: account.id,
        // Default settings
        minAdvanceBooking: 24,
        maxAdvanceBooking: 90,
        minimumPurchase: 100,
      },
    });

    // Create sub account for business
    const twilioSubAccount = await twilio.api.v2010.accounts.create({
      friendlyName: business.name,
    });

    // Update the business record with the Twilio sub account SID
    await prisma.business.update({
      where: { id: business.id },
      data: { twilioSubAccountSid: twilioSubAccount.sid },
    });



    // Update the user's onboarded status 
    await prisma.user.update({
      where: { id: user.id },
      data: { onboarded: true },
    });

    return NextResponse.json({
      business,
      stripeAccountId: account.id,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    if (
      typeof error === 'object' && 
      error !== null && 
      'type' in error && 
      error.type === 'StripeInvalidRequestError'
    ) {
      const stripeError = error as Stripe.errors.StripeError;
      console.error("[STRIPE_ERROR]", {
        message: stripeError.message,
        code: stripeError.code,
        type: stripeError.type,
        requestId: stripeError.requestId,
      });
      
      return NextResponse.json(
        { 
          message: "Failed to set up payment processing. Please try again or contact support.",
          details: stripeError.message,
        },
        { status: 400 }
      );
    }

    console.error("[BUSINESS_CREATE_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
