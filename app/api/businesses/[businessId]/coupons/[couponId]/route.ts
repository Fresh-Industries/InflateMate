import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCouponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters").optional(),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountAmount: z.number().positive("Amount must be positive").optional(),
  maxUses: z.number().int().positive("Max uses must be a positive integer").optional().nullable(),
  isActive: z.boolean().optional(),
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
  if (data.discountType === "PERCENTAGE" && data.discountAmount) {
    return data.discountAmount <= 100;
  }
  return true;
}, {
  message: "Percentage discount cannot exceed 100%",
  path: ["discountAmount"],
});

// GET /api/businesses/[businessId]/coupons/[couponId]
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; couponId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, couponId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: {
        id: couponId,
        businessId: businessId,
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PATCH /api/businesses/[businessId]/coupons/[couponId]
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; couponId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, couponId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateCouponSchema.parse(body);

    // Check if the coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        id: couponId,
        businessId: businessId,
      },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // If code is being updated, check if it already exists
    if (validatedData.code && validatedData.code !== existingCoupon.code) {
      const codeExists = await prisma.coupon.findUnique({
        where: {
          code_businessId: {
            code: validatedData.code,
            businessId: businessId,
          },
        },
      });

      if (codeExists) {
        return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
      }
    }

    const coupon = await prisma.coupon.update({
      where: {
        id: couponId,
        businessId: businessId,
      },
      data: validatedData,
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error("Error updating coupon:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE /api/businesses/[businessId]/coupons/[couponId]
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; couponId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, couponId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if the coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        id: couponId,
        businessId: businessId,
      },
    });

    if (!existingCoupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    // Delete the coupon
    await prisma.coupon.delete({
      where: {
        id: couponId,
        businessId: businessId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}