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
  { params }: { params: { businessId: string; paymentId: string } }
) {
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
      let refundAmount = fullRefund 
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
        
        // Create a refund record in the database
        const refundPayment = await prisma.payment.create({
          data: {
            amount: -refundAmount, // Negative amount for refund
            currency: paymentToRefund.currency || "USD",
            status: "COMPLETED",
            type: "REFUND",
            stripePaymentId: refundResult.id,
            refundAmount: refundAmount,
            refundReason: reason || "Manual refund",
            bookingId: paymentToRefund.bookingId,
            businessId: paymentToRefund.businessId,
            metadata: {
              originalPaymentId: paymentToRefund.id,
              isFullRefund: fullRefund,
            },
            paidAt: new Date(),
          },
        });
        
        // Update the original payment status
        await prisma.payment.update({
          where: { id: paymentToRefund.id },
          data: {
            status: "REFUNDED",
            refundAmount: refundAmount,
            refundReason: reason || "Manual refund",
          },
        });
        
        return { 
          data: refundPayment,
          refundAmount,
          isFullRefund: fullRefund,
          stripeRefundId: refundResult?.id
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