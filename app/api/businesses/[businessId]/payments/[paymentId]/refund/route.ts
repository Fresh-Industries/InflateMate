import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { businessId, paymentId } = params;
    const body = await req.json();
    const { fullRefund, amount, reason } = refundPaymentSchema.parse(body);
    
    const result = await withBusinessAuth(businessId, userId, async () => {
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
        return { error: "Payment not found or not eligible for refund" };
      }
      
      if (!paymentToRefund.stripePaymentId) {
        return { error: "No Stripe payment ID found for this payment" };
      }
      
      // Calculate refund amount
      const refundAmount = fullRefund 
        ? Number(paymentToRefund.amount) 
        : (amount || 0);
        
      if (!fullRefund && !amount) {
        return { error: "Refund amount must be provided for partial refunds" };
      }
      
      if (refundAmount <= 0 || refundAmount > Number(paymentToRefund.amount)) {
        return { error: "Invalid refund amount" };
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
          return { error: "Business Stripe account not found" };
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
          originalPaymentAmount: originalAmount, // Record original amount before modification
          refundedAmount: refundAmount, // Record the amount actually refunded
        };
        
        // Update the original payment record
        const updatedPayment = await prisma.payment.update({
          where: { id: paymentToRefund.id },
          data: {
            status: newStatus,
            amount: newAmount, // Update amount based on refund type
            metadata: newMetadata, // Store detailed refund info in metadata
            updatedAt: new Date(),
            // Keep original type and stripePaymentId (for the original charge)
            // type: paymentToRefund.type, 
            // stripePaymentId: paymentToRefund.stripePaymentId, 
          },
        });
        
        return { 
          data: updatedPayment, // Return the updated original payment
          refundAmount, // Keep this for clarity in the API response
          isFullRefund, // Keep this for clarity
          stripeRefundId: refundResult.id // Keep this for clarity
        };
        
      } catch (stripeError) {
        console.error("Stripe refund error:", stripeError);
        return { 
          error: "Failed to process refund", 
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error" 
        };
      }
    });
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result, { status: 200 });
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