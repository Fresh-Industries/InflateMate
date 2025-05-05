import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { stripe } from "@/lib/stripe-server";

// Schema for cancellation request
const cancelBookingSchema = z.object({
  fullRefund: z.boolean().default(false),
  reason: z.string().optional(),
});

export async function POST(
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
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "You don't have access to this business" }, { status: 403 });
    }

    const body = await req.json();
    const { fullRefund, reason } = cancelBookingSchema.parse(body);

    // Get the booking with payment information
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        payments: true,
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 });
    }

    // Check if the booking is within 24 hours
    const now = new Date();
    const eventDate = new Date(booking.eventDate);
    const isWithin24Hours = (eventDate.getTime() - now.getTime()) < (24 * 60 * 60 * 1000);

    // Find the payment to refund
    const paymentToRefund = booking.payments.find(p =>
      (p.status === "COMPLETED" && p.type === "FULL_PAYMENT") ||
      (p.status === "COMPLETED" && p.type === "DEPOSIT")
    );

    if (!paymentToRefund || !paymentToRefund.stripePaymentId) {
      // No payment to refund, just mark as cancelled
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED",
        },
      });
      return NextResponse.json({ data: updatedBooking, refundAmount: 0 }, { status: 200 });
    }

    // Calculate refund amount
    let refundAmount = Number(paymentToRefund.amount);
    let refundPercentage = 100;

    // Apply cancellation fee if within 24 hours and not a full refund override
    if (isWithin24Hours && !fullRefund) {
      refundPercentage = 90; // 90% refund (10% cancellation fee)
      refundAmount = refundAmount * 0.9;
    }

    // Process the refund through Stripe
    let refundResult;
    try {
      // Get the business's Stripe account ID
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: { stripeAccountId: true },
      });

      if (!business?.stripeAccountId) {
        return NextResponse.json({ error: "Business Stripe account not found" }, { status: 400 });
      }

      // Create the refund in Stripe
      refundResult = await stripe.refunds.create({
        payment_intent: paymentToRefund.stripePaymentId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: 'requested_by_customer',
      }, {
        stripeAccount: business.stripeAccountId,
      });

      // Determine the updates for the original payment record
      const originalAmount = Number(paymentToRefund.amount);
      const isFullRefund = refundAmount === originalAmount;
      const newStatus = isFullRefund ? "REFUNDED" : paymentToRefund.status;
      const newAmount = isFullRefund ? -originalAmount : originalAmount - refundAmount;

      const existingMetadata = paymentToRefund.metadata && typeof paymentToRefund.metadata === 'object'
        ? paymentToRefund.metadata
        : {};
      const refundMetadata = {
        ...existingMetadata,
        stripeRefundId: refundResult.id,
        refundReason: reason || "Customer cancellation",
        isFullRefund: isFullRefund,
        requestedFullRefundOverride: fullRefund,
        originalPaymentAmount: originalAmount,
        refundedAmount: refundAmount,
        refundPercentage: refundPercentage,
        isWithin24Hours: isWithin24Hours,
      };

      await prisma.payment.update({
        where: { id: paymentToRefund.id },
        data: {
          status: newStatus,
          amount: newAmount,
          metadata: refundMetadata,
          updatedAt: new Date(),
        },
      });

    } catch (stripeError) {
      console.error("Stripe refund error:", stripeError);
      return NextResponse.json({
        error: "Failed to process refund",
        details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error"
      }, { status: 400 });
    }

    // Delete associated booking items
    await prisma.bookingItem.deleteMany({
      where: { bookingId: bookingId },
    });

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
      include: {
        payments: true,
        customer: true,
      },
    });

    return NextResponse.json({
      data: updatedBooking,
      refundAmount,
      refundPercentage,
      isWithin24Hours,
      stripeRefundId: refundResult?.id
    }, { status: 200 });

  } catch (error) {
    console.error("Error in cancel booking route:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
