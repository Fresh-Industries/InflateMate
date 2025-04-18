import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await params;
    const { searchParams } = new URL(req.url);
    
    const query = getPaymentsQuerySchema.parse(Object.fromEntries(searchParams));
    const { startDate, endDate, status, type, page, limit } = query;
    
    const result = await withBusinessAuth(businessId, userId, async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = { businessId };
      
      // Apply filters
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
      
      return {
        data: payments,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        }
      };
    });
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
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