import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, amount, businessId } = await req.json();

    if (!code || !amount || !businessId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        businessId,
        isActive: true,
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
        OR: [
          { maxUses: null },
          { usedCount: { lt: { maxUses: true } } },
        ],
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid or expired coupon" },
        { status: 400 }
      );
    }

    if (coupon.minimumAmount && amount < coupon.minimumAmount) {
      return NextResponse.json(
        { error: `Minimum order amount is $${coupon.minimumAmount}` },
        { status: 400 }
      );
    }

    let discountedAmount = amount;
    if (coupon.discountType === "PERCENTAGE") {
      discountedAmount = amount * (1 - coupon.discountAmount / 100);
    } else {
      discountedAmount = amount - coupon.discountAmount;
    }

    // Ensure the discounted amount is not negative
    discountedAmount = Math.max(0, discountedAmount);

    return NextResponse.json({
      discountedAmount,
      discount: amount - discountedAmount,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
      },
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
} 