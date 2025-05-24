import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const salesFunnelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  popupTitle: z.string().min(2, "Popup title is required"),
  popupText: z.string().min(2, "Popup text is required"),
  popupImage: z.string().optional(),
  formTitle: z.string().min(2, "Form title is required"),
  thankYouMessage: z.string().min(2, "Thank you message is required"),
  couponId: z.string().optional(),
  isActive: z.boolean().default(true),
});

// GET /api/businesses/[businessId]/sales-funnels
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const salesFunnels = await prisma.salesFunnel.findMany({
      where: {
        businessId: businessId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(salesFunnels);
  } catch (error) {
    console.error("Error fetching sales funnels:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales funnels" },
      { status: 500 }
    );
  }
}

// POST /api/businesses/[businessId]/sales-funnels
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId = (await params).businessId;
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
    const validatedData = salesFunnelSchema.parse(body);

    // If a couponId is provided, verify it exists and belongs to this business
    if (validatedData.couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: {
          id: validatedData.couponId,
          businessId: businessId,
        },
      });

      if (!coupon) {
        return NextResponse.json({ error: "Coupon not found" }, { status: 400 });
      }
    }

    const salesFunnel = await prisma.salesFunnel.create({
      data: {
        ...validatedData,
        businessId: businessId,
      },
    });

    return NextResponse.json(salesFunnel, { status: 201 });
  } catch (error) {
    console.error("Error creating sales funnel:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Coupon not found") {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create sales funnel" },
      { status: 500 }
    );
  }
}
