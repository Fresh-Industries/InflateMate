import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateBounceHouseSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  dimensions: z.string().optional(),
  capacity: z.number().min(1).optional(),
  price: z.number().min(0).optional(),
  setupTime: z.number().min(0).optional(),
  teardownTime: z.number().min(0).optional(),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean()
  })).optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]).optional(),
  features: z.array(z.string()).optional(),
  minimumSpace: z.string().optional(),
  weightLimit: z.number().min(0).optional(),
  ageRange: z.string().optional(),
  weatherRestrictions: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ businessId: string; bounceHouseId: string }> }
) {
  try {
    const params = await context.params;
    const { businessId, bounceHouseId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const body = await req.json();
        const validatedData = updateBounceHouseSchema.parse(body);

        // Transform image data if provided
        let imageUrls;
        let primaryImageUrl;
        if (validatedData.images) {
          imageUrls = validatedData.images.map(img => img.url);
          primaryImageUrl = validatedData.images.find(img => img.isPrimary)?.url || imageUrls[0];
        }

        // Update the bounce house
        const bounceHouse = await prisma.bounceHouse.update({
          where: {
            id: bounceHouseId,
            businessId: business.id,
          },
          data: {
            ...validatedData,
            ...(imageUrls && { images: imageUrls }),
            ...(primaryImageUrl && { primaryImage: primaryImageUrl }),
            ...(validatedData.features && {
              features: {
                deleteMany: {},
                create: validatedData.features.map(feature => ({
                  name: feature
                }))
              }
            }),
          },
          include: {
            features: true
          }
        });

        return bounceHouse;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating bounce house:", error);
    return NextResponse.json(
      { error: "Failed to update bounce house" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ businessId: string; bounceHouseId: string }> }
) {
  try {
    const params = await context.params;
    const { businessId, bounceHouseId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        // Delete the bounce house
        await prisma.bounceHouse.delete({
          where: {
            id: bounceHouseId,
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
    console.error("Error deleting bounce house:", error);
    return NextResponse.json(
      { error: "Failed to delete bounce house" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ businessId: string; bounceHouseId: string }> }
) {
  try {
    const params = await context.params;
    const { businessId, bounceHouseId } = params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const bounceHouse = await prisma.bounceHouse.findFirst({
          where: {
            id: bounceHouseId,
            businessId: business.id,
          },
          include: {
            features: true
          }
        });

        if (!bounceHouse) {
          throw new Error("Bounce house not found");
        }

        return bounceHouse;
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching bounce house:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounce house" },
      { status: 500 }
    );
  }
} 