import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

/**
 * GET a single payment by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string; paymentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, paymentId } = params;
    
    const result = await withBusinessAuth(businessId, userId, async () => {
      const payment = await prisma.payment.findFirst({
        where: {
          id: paymentId,
          businessId,
        },
        include: {
          booking: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                }
              },
              inventoryItems: {
                include: {
                  inventory: true,
                }
              }
            }
          },
        },
      });
      
      if (!payment) {
        return { error: "Payment not found" };
      }
      
      // If this is a refund, get the original payment
      let originalPayment = null;
      if (payment.type === "REFUND" && payment.metadata && (payment.metadata as any).originalPaymentId) {
        originalPayment = await prisma.payment.findUnique({
          where: {
            id: (payment.metadata as any).originalPaymentId,
          },
        });
      }
      
      return {
        data: payment,
        originalPayment,
      };
    });
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in get payment route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
} 