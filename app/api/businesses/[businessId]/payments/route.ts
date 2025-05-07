import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";

// Schema for query parameters
const getPaymentsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
  type: z.enum(["DEPOSIT", "FULL_PAYMENT", "REFUND"]).optional(),
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
});

/**
 * GET payments for a business
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const query = getPaymentsQuerySchema.parse(Object.fromEntries(searchParams));
    const { startDate, endDate, status, type, page, limit } = query;

    // Build the where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { businessId };

    if (startDate) {
      where.createdAt = { ...(where.createdAt || {}), gte: new Date(startDate) };
    }

    if (endDate) {
      where.createdAt = { ...(where.createdAt || {}), lte: new Date(endDate) };
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    // Get total count for pagination
    const total = await prisma.payment.count({ where });

    // Get payments with pagination
    const payments = await prisma.payment.findMany({
      where,
      include: {
        booking: {
          select: {
            id: true,
            eventDate: true,
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              }
            }
          }
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      data: payments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error in get payments route:", error);
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
