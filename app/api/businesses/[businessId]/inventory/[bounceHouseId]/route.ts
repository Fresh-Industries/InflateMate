import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
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
  images: z.array(
    z.object({
      url: z.string(),
      isPrimary: z.boolean(),
    })
  ).optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]).optional(),
  minimumSpace: z.string().optional(),
  weightLimit: z.number().min(0).optional(),
  ageRange: z.string().optional(),
  weatherRestrictions: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bounceHouseId: string }> }
) {
  try {
    const { businessId, bounceHouseId } = await params;
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
        let imageUrls: string[] | undefined;
        let primaryImageUrl: string | undefined;
        if (validatedData.images) {
          imageUrls = validatedData.images.map((img) => img.url);
          primaryImageUrl =
            validatedData.images.find((img) => img.isPrimary)?.url ||
            imageUrls[0];
        }
        
        // Destructure to remove the original images field
        const { images, ...restData } = validatedData;

        // Update the bounce house with transformed image data
        const bounceHouse = await prisma.inventory.update({
          where: {
            id: bounceHouseId,
            businessId: business.id,
          },
          data: {
            ...restData,
            ...(imageUrls && { images: imageUrls }),
            ...(primaryImageUrl && { primaryImage: primaryImageUrl }),
          },
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
  { params }: { params: Promise<{ businessId: string, bounceHouseId: string }>  }
) {
  try {
    const { businessId, bounceHouseId } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        console.log(businessId, bounceHouseId);
        await prisma.inventory.delete({
          where: {
            id: bounceHouseId,
            businessId: businessId,
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
  { params }: { params: Promise<{ businessId: string; bounceHouseId: string }> }
) {
  try {
    const { businessId, bounceHouseId } = await params;
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        const bounceHouse = await prisma.inventory.findFirst({
          where: {
            id: bounceHouseId,
            businessId: business.id,
          },
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
