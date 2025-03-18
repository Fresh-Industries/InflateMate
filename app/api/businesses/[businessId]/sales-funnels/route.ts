import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
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
    console.log("businessId", businessId);
    const user = await getCurrentUser();
    console.log("user", user);
    
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
        const salesFunnels = await prisma.salesFunnel.findMany({
          where: {
            businessId: business.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return salesFunnels;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
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
        const validatedData = salesFunnelSchema.parse(body);

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

        const salesFunnel = await prisma.salesFunnel.create({
          data: {
            ...validatedData,
            businessId: business.id,
          },
        });

        return salesFunnel;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data, { status: 201 });
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