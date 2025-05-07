import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSalesFunnelSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  popupTitle: z.string().min(2, "Popup title is required").optional(),
  popupText: z.string().min(2, "Popup text is required").optional(),
  popupImage: z.string().optional().nullable(),
  formTitle: z.string().min(2, "Form title is required").optional(),
  thankYouMessage: z.string().min(2, "Thank you message is required").optional(),
  couponId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// GET /api/businesses/[businessId]/sales-funnels/[funnelId]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; funnelId: string }> }
) {
  try {
    const { businessId, funnelId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const salesFunnel = await prisma.salesFunnel.findUnique({
      where: {
        id: funnelId,
        businessId: businessId,
      },
    });

    if (!salesFunnel) {
      return NextResponse.json({ error: "Sales funnel not found" }, { status: 404 });
    }

    return NextResponse.json(salesFunnel);
  } catch (error) {
    console.error("Error fetching sales funnel:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales funnel" },
      { status: 500 }
    );
  }
}

// PATCH /api/businesses/[businessId]/sales-funnels/[funnelId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; funnelId: string }> }
) {
  try {
    const { businessId, funnelId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateSalesFunnelSchema.parse(body);

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

    const salesFunnel = await prisma.salesFunnel.update({
      where: {
        id: funnelId,
        businessId: businessId,
      },
      data: validatedData,
    });

    return NextResponse.json(salesFunnel);
  } catch (error) {
    console.error("Error updating sales funnel:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update sales funnel" },
      { status: 500 }
    );
  }
}

// DELETE /api/businesses/[businessId]/sales-funnels/[funnelId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; funnelId: string }> }
) {
  try {
    const { businessId, funnelId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if the sales funnel exists
    const salesFunnel = await prisma.salesFunnel.findUnique({
      where: {
        id: funnelId,
        businessId: businessId,
      },
    });

    if (!salesFunnel) {
      return NextResponse.json({ error: "Sales funnel not found" }, { status: 404 });
    }

    // Delete the sales funnel
    await prisma.salesFunnel.delete({
      where: {
        id: funnelId,
        businessId: businessId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sales funnel:", error);
    return NextResponse.json(
      { error: "Failed to delete sales funnel" },
      { status: 500 }
    );
  }
}
