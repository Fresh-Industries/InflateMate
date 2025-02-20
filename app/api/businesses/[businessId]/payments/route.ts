// app/api/businesses/[businessId]/payment/intent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe-server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";
import { z } from "zod";

// Define Zod schema for input validation
const paymentSchema = z.object({
  amount: z.number().positive("Amount must be a positive number"),
  customerEmail: z.string().email("Invalid email"),
  bookingId: z.string().optional(),
  metadata: z.object({}).optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = params;
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const result = await withBusinessAuth(businessId, user.id, async (business) => {
      const { amount, customerEmail, bookingId, metadata } = validatedData;

      let paymentIntentMetadata = metadata || {};

      // If bookingId is provided, fetch booking details
      if (bookingId) {
        const booking = await prisma.booking.findFirst({
          where: { id: bookingId, businessId: business.id },
          include: { customer: true, bounceHouse: true },
        });

        if (!booking) {
          return { error: "Booking not found" };
        }

        paymentIntentMetadata = {
          bookingId: booking.id,
          bounceHouseId: booking.bounceHouseId,
          eventDate: booking.eventDate.toISOString(),
          businessId: business.id,
          customerName: booking.customer.name,
          customerEmail: booking.customer.email,
          customerPhone: booking.customer.phone,
        };
      }

      // Create Stripe Payment Intent
      const paymentIntent = await createPaymentIntent({
        amount,
        customerEmail,
        metadata: paymentIntentMetadata,
        payment_method_types: ["card"],
      });

      if (!paymentIntent || !paymentIntent.client_secret) {
        throw new Error("Failed to create payment intent");
      }

      // Save payment record in database
      const payment = await prisma.payment.create({
        data: {
          amount,
          status: "PENDING",
          type: bookingId ? "BALANCE" : "FULL_PAYMENT",
          stripePaymentId: paymentIntent.id,
          stripeClientSecret: paymentIntent.client_secret,
          businessId: business.id,
          bookingId: bookingId || undefined,
          customerEmail,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        paymentId: payment.id,
      };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
