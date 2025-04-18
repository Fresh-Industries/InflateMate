import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountAmount: z.number().positive("Amount must be positive"),
  maxUses: z.number().int().positive("Max uses must be a positive integer").optional().nullable(),
  isActive: z.boolean().default(true),
  minimumAmount: z.number().nonnegative("Minimum amount must be non-negative").optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
}).refine(data => {
  // If both dates are provided, ensure endDate is after startDate
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
}).refine(data => {
  // For percentage discounts, ensure the amount is between 1 and 100
  if (data.discountType === "PERCENTAGE") {
    return data.discountAmount <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountAmount"],
});

// GET /api/businesses/[businessId]/coupons
export async function GET(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  try {
    const { businessId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const coupons = await prisma.coupon.findMany({
          where: {
            businessId: business.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return coupons;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST /api/businesses/[businessId]/coupons
export async function POST(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
  try {
    const { businessId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const validatedData = couponSchema.parse(body);

        // Check if coupon code already exists for this business
        const existingCoupon = await prisma.coupon.findUnique({
          where: {
            code_businessId: {
              code: validatedData.code,
              businessId: business.id,
            },
          },
        });

        if (existingCoupon) {
          throw new Error("Coupon code already exists");
        }

        const coupon = await prisma.coupon.create({
          data: {
            ...validatedData,
            businessId: business.id,
            usedCount: 0,
          },
        });

        return coupon;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === "Coupon code already exists") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
} 