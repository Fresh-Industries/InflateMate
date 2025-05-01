import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { businessId, bookingId } = await params;
    const body = await req.json();
    const { fullRefund, reason } = cancelBookingSchema.parse(body);
    
    const result = await withBusinessAuth(businessId, userId, async () => {
      // Get the booking with payment information
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, businessId },
        include: {
          payments: true,
          customer: true,
        },
      });
      
      if (!booking) {
        return { error: "Booking not found" };
      }
      
      if (booking.status === "CANCELLED") {
        return { error: "Booking is already cancelled" };
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
        return { data: updatedBooking, refundAmount: 0 };
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
        // Note: refundAmount might be less than original due to cancellation policy
        const isFullRefund = refundAmount === originalAmount;
        
        // Use "REFUNDED" for full refunds, keep original status (e.g., "COMPLETED") for partial
        const newStatus = isFullRefund ? "REFUNDED" : paymentToRefund.status;
        // Ensure the new amount reflects the remaining value or negative full refund
        const newAmount = isFullRefund ? -originalAmount : originalAmount - refundAmount;
        
        // Metadata update: preserve existing metadata and add refund info
        const existingMetadata = paymentToRefund.metadata && typeof paymentToRefund.metadata === 'object' 
                               ? paymentToRefund.metadata 
                               : {};
        const refundMetadata = {
          ...existingMetadata,
          stripeRefundId: refundResult.id,
          refundReason: reason || "Customer cancellation",
          isFullRefund: isFullRefund, // Whether the *actual* refunded amount equalled original
          requestedFullRefundOverride: fullRefund, // Whether user explicitly requested full refund
          originalPaymentAmount: originalAmount,
          refundedAmount: refundAmount,
          refundPercentage: refundPercentage,
          isWithin24Hours: isWithin24Hours,
        };
        
        // Update the original payment record instead of creating a new one
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
        return { 
          error: "Failed to process refund", 
          details: stripeError instanceof Error ? stripeError.message : "Unknown Stripe error" 
        };
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
      
      return { 
        data: updatedBooking, 
        refundAmount, 
        refundPercentage,
        isWithin24Hours,
        stripeRefundId: refundResult?.id
      };
    });
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result, { status: 200 });
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