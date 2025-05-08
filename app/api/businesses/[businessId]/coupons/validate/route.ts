import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const validateCouponSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  amountBeforeTax: z.number().min(0, "Amount must be non-negative"),
});

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const params = await props.params;
  const { businessId } = params;

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ valid: false, reason: "Invalid JSON" }, { status: 400 });
  }

  const parse = validateCouponSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ valid: false, reason: parse.error.errors[0]?.message || "Invalid input" }, { status: 400 });
  }
  const { code, amountBeforeTax } = parse.data;

  // Find coupon for this business
  const coupon = await prisma.coupon.findUnique({
    where: { code_businessId: { code, businessId } },
  });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ valid: false, reason: "Coupon not found or inactive" }, { status: 404 });
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return NextResponse.json({ valid: false, reason: "Coupon not yet active" }, { status: 400 });
  }
  if (coupon.endDate && now > coupon.endDate) {
    return NextResponse.json({ valid: false, reason: "Coupon expired" }, { status: 400 });
  }
  if (typeof coupon.maxUses === "number" && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, reason: "Coupon max uses reached" }, { status: 400 });
  }
  if (typeof coupon.minimumAmount === "number" && amountBeforeTax < coupon.minimumAmount) {
    return NextResponse.json({ valid: false, reason: `Minimum order: $${coupon.minimumAmount}` }, { status: 400 });
  }

  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = Math.round(amountBeforeTax * (coupon.discountAmount / 100) * 100) / 100;
  } else if (coupon.discountType === "FIXED") {
    discountAmount = Math.min(coupon.discountAmount, amountBeforeTax);
  }

  if (discountAmount <= 0) {
    return NextResponse.json({ valid: false, reason: "No discount for this amount" }, { status: 400 });
  }

  return NextResponse.json({ valid: true, discountAmount });
} 