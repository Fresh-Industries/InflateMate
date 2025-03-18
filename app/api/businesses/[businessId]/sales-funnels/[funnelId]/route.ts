import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
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
        const salesFunnel = await prisma.salesFunnel.findUnique({
          where: {
            id: funnelId,
            businessId: business.id,
          },
        });

        if (!salesFunnel) {
          throw new Error("Sales funnel not found");
        }

        return salesFunnel;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching sales funnel:", error);
    
    if (error instanceof Error && error.message === "Sales funnel not found") {
      return NextResponse.json(
        { error: "Sales funnel not found" },
        { status: 404 }
      );
    }
    
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
        const validatedData = updateSalesFunnelSchema.parse(body);

        // If a couponId is provided, verify it exists and belongs to this business
        if (validatedData.couponId) {
          const coupon = await prisma.coupon.findUnique({
            where: {
              id: validatedData.couponId,
              businessId: business.id,
            },
          });

          if (!coupon) {
            throw new Error("Coupon not found");
          }
        }

        const salesFunnel = await prisma.salesFunnel.update({
          where: {
            id: funnelId,
            businessId: business.id,
          },
          data: validatedData,
        });

        return salesFunnel;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating sales funnel:", error);
    
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
        // Check if the sales funnel exists
        const salesFunnel = await prisma.salesFunnel.findUnique({
          where: {
            id: funnelId,
            businessId: business.id,
          },
        });

        if (!salesFunnel) {
          throw new Error("Sales funnel not found");
        }

        // Delete the sales funnel
        await prisma.salesFunnel.delete({
          where: {
            id: funnelId,
            businessId: business.id,
          },
        });

        return { success: true };
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error deleting sales funnel:", error);
    
    if (error instanceof Error && error.message === "Sales funnel not found") {
      return NextResponse.json(
        { error: "Sales funnel not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete sales funnel" },
      { status: 500 }
    );
  }
} 