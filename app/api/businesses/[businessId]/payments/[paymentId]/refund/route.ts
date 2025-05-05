import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { stripe } from "@/lib/stripe-server";

// Schema for refund request
const refundPaymentSchema = z.object({
  fullRefund: z.boolean().default(true),
  amount: z.number().optional(),
  reason: z.string().optional(),
});

/**
 * POST to refund a payment
 */
export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; paymentId: string }> }
) {
  const params = await props.params;
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, paymentId } = params;

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { fullRefund, amount, reason } = refundPaymentSchema.parse(body);

    // Get the payment information
    const paymentToRefund = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        businessId,
        status: "COMPLETED",
        type: { in: ["DEPOSIT", "FULL_PAYMENT"] }
      },
      include: {
        booking: true,
      },
    });

    if (!paymentToRefund) {
      return NextResponse.json({ error: "Payment not found or not eligible for refund" }, { status: 404 });
    }

    if (!paymentToRefund.stripePaymentId) {
      return NextResponse.json({ error: "No Stripe payment ID found for this payment" }, { status: 400 });
    }

    // Calculate refund amount
    const refundAmount = fullRefund
      ? Number(paymentToRefund.amount)
      : (amount || 0);

    if (!fullRefund && !amount) {
      return NextResponse.json({ error: "Refund amount must be provided for partial refunds" }, { status: 400 });
    }

    if (refundAmount <= 0 || refundAmount > Number(paymentToRefund.amount)) {
      return NextResponse.json({ error: "Invalid refund amount" }, { status: 400 });
    }

    // Process the refund through Stripe
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
      const refundResult = await stripe.refunds.create({
        payment_intent: paymentToRefund.stripePaymentId,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: 'requested_by_customer',
      }, {
        stripeAccount: business.stripeAccountId,
      });

      // Determine the updates for the original payment record
      const originalAmount = Number(paymentToRefund.amount);
      const isFullRefund = refundAmount === originalAmount;

      // Use "REFUNDED" for full refunds, keep "COMPLETED" for partial, as payment was still captured.
      const newStatus = isFullRefund ? "REFUNDED" : paymentToRefund.status;
      // Ensure the new amount reflects the remaining value or negative full refund
      const newAmount = isFullRefund ? -originalAmount : originalAmount - refundAmount;

      // Metadata update: preserve existing metadata and add refund info
      const existingMetadata = paymentToRefund.metadata && typeof paymentToRefund.metadata === 'object'
        ? paymentToRefund.metadata
        : {};
      const newMetadata = {
        ...existingMetadata,
        stripeRefundId: refundResult.id,
        refundReason: reason || "Manual refund",
        isFullRefund: isFullRefund,
        originalPaymentAmount: originalAmount,
        refundedAmount: refundAmount,
      };

      // Update the original payment record
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentToRefund.id },
        data: {
          status: newStatus,
          amount: newAmount,
          metadata: newMetadata,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        data: updatedPayment,
        refundAmount,
        isFullRefund,
        stripeRefundId: refundResult.id
      }, { status: 200 });

    } catch (stripeError) {
      console.error("Stripe refund error:", stripeError);
      return NextResponse.json({
        error: "Failed to process refund",
        details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in refund payment route:", error);
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
