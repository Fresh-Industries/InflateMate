import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  calculateStripeTax,
  convertBookingItemsToTaxLineItems,
  applyDiscountToLineItems
} from "@/lib/stripe/tax-utils";
import { DiscountType } from "@/prisma/generated/prisma";

// Define schema for the request payload
const calculateTaxSchema = z.object({
  selectedItems: z.array(z.object({
    inventoryId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })),
  customerAddress: z.object({
    line1: z.string().min(1, "Address line 1 is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Zip code is required"),
    country: z.string().optional().default('US'),
  }).nullable(), // Address can be null if not yet entered
  couponCode: z.string().optional().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = calculateTaxSchema.parse(body);

    if (!validatedData.customerAddress) {
      // If no address, return 0 tax
      const subtotalCents = validatedData.selectedItems.reduce((sum, item) => sum + Math.round(item.price * item.quantity * 100), 0);
      return NextResponse.json({
        success: true,
        subtotalCents,
        taxCents: 0,
        totalCents: subtotalCents,
        taxRate: 0,
      }, { status: 200 });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { stripeAccountId: true }
    });

    if (!business?.stripeAccountId) {
      console.warn(`[calculate-tax] Business ${businessId} does not have a Stripe account connected. Cannot calculate tax via Stripe.`);
      // Fallback to 0 tax if Stripe account not connected
      const subtotalCents = validatedData.selectedItems.reduce((sum, item) => sum + Math.round(item.price * item.quantity * 100), 0);
      return NextResponse.json({
        success: true,
        subtotalCents,
        taxCents: 0,
        totalCents: subtotalCents,
        taxRate: 0,
        error: "Stripe account not connected for tax calculation."
      }, { status: 200 });
    }

    let appliedCoupon = null;
    if (validatedData.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code_businessId: { code: validatedData.couponCode, businessId } },
      });
      const now = new Date();
      if (coupon && coupon.isActive && (!coupon.startDate || now >= coupon.startDate) &&
          (!coupon.endDate || now <= coupon.endDate) &&
          (typeof coupon.maxUses !== "number" || coupon.usedCount < coupon.maxUses)) {
        appliedCoupon = coupon;
      } else {
        console.warn(`[calculate-tax] Invalid or expired coupon code: ${validatedData.couponCode}`);
        // Do not return error, just proceed without coupon
      }
    }

    let taxLineItems = convertBookingItemsToTaxLineItems(validatedData.selectedItems);

    if (appliedCoupon) {
      taxLineItems = applyDiscountToLineItems(
        taxLineItems,
        appliedCoupon.discountAmount,
        appliedCoupon.discountType as DiscountType
      );
    }

    const stripeTaxResult = await calculateStripeTax(
      taxLineItems,
      {
        address: {
          line1: validatedData.customerAddress.line1,
          city: validatedData.customerAddress.city,
          state: validatedData.customerAddress.state,
          postal_code: validatedData.customerAddress.postalCode, // Convert camelCase to snake_case
          country: validatedData.customerAddress.country
        },
        addressSource: 'shipping'
      },
      business.stripeAccountId
    );

    return NextResponse.json({
      success: true,
      subtotalCents: stripeTaxResult.subtotalAmountCents,
      taxCents: stripeTaxResult.taxAmountCents,
      totalCents: stripeTaxResult.totalAmountCents,
      taxRate: stripeTaxResult.taxRate,
    }, { status: 200 });

  } catch (error) {
    console.error("[calculate-tax] Error calculating tax:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error during tax calculation" },
      { status: 500 }
    );
  }
}