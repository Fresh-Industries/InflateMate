import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe-server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";

interface RouteParams {
  params: Promise<{ businessId: string }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await the params to get businessId
    const { businessId } = await params;

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const body = await request.json();
        const { amount, customerEmail, bookingId, metadata } = body;

        // Validate amount is a valid positive number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          throw new Error("Amount must be a valid positive number");
        }

        if (!customerEmail) {
          throw new Error("Missing required customerEmail field");
        }

        // Then, branch based on whether bookingId is provided
        if (bookingId) {
          // Existing flow: get booking details and create payment record
          // Get the booking details
          const booking = await prisma.booking.findFirst({
            where: {
              id: bookingId,
              businessId: business.id,
            },
            include: {
              customer: true,
              bounceHouse: true,
            },
          });

          if (!booking) {
            throw new Error("Booking not found");
          }

          // Create payment intent with booking metadata
          const paymentIntent = await createPaymentIntent({
            amount: parsedAmount,
            customerEmail,
            metadata: {
              bookingId: booking.id,
              bounceHouseId: booking.bounceHouseId,
              eventDate: booking.eventDate.toISOString(),
              businessId: business.id,
              customerName: booking.customer.name,
              customerEmail: booking.customer.email,
              customerPhone: booking.customer.phone,
            },
            payment_method_types: ['card'],
          });

          if (!paymentIntent || !paymentIntent.client_secret) {
            throw new Error("Failed to create payment intent");
          }

          // Create payment record
          await prisma.payment.create({
            data: {
              amount: parsedAmount,
              status: "PENDING",
              type: "BOOKING",
              stripePaymentId: paymentIntent.id,
              stripeClientSecret: paymentIntent.client_secret,
              businessId: business.id,
              bookingId: booking.id,
              customerEmail: customerEmail,
            },
          });

          return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
          };
        } else {
          // New flow: bookingId is not provided but metadata is provided
          const paymentIntent = await createPaymentIntent({
            amount: parsedAmount,
            customerEmail,
            metadata,
            payment_method_types: ['card'],
          });

          if (!paymentIntent || !paymentIntent.client_secret) {
            throw new Error("Failed to create payment intent");
          }

          // Note: In the new flow, we do not create a payment record since the booking does not exist yet.

          return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
          };
        }
      }
    );

    // If withBusinessAuth returned null, return an error object
    if (!result) {
      return NextResponse.json({ error: "Business not found or unauthorized" }, { status: 403 });
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
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