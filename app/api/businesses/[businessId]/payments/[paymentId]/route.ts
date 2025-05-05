import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

/**
 * GET a single payment by ID
 */
export async function GET(
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
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // If this is a refund, get the original payment
    let originalPayment = null;
    if (
      payment.type === "REFUND" &&
      payment.metadata &&
      typeof payment.metadata === "object" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payment.metadata as any).originalPaymentId
    ) {
      originalPayment = await prisma.payment.findUnique({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (payment.metadata as any).originalPaymentId,
        },
      });
    }

    return NextResponse.json({
      data: payment,
      originalPayment,
    });
  } catch (error) {
    console.error("Error in get payment route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
