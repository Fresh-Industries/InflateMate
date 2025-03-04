// /api/businesses/[businessId]/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bounceHouseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  dimensions: z.string().min(1, "Dimensions are required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price must be 0 or greater"),
  setupTime: z.number().min(0),
  teardownTime: z.number().min(0),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean()
  })),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
  minimumSpace: z.string().min(1, "Minimum space is required"),
  weightLimit: z.number().min(0),
  ageRange: z.string().min(1, "Age range is required"),
  weatherRestrictions: z.array(z.string()).optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await context.params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const result = await withBusinessAuth(businessId, user.id, async (business) => {
      const body = await req.json();
      const validatedData = bounceHouseSchema.parse(body);

      // Transform image data to get an array of URLs and determine the primary image.
      const imageUrls = validatedData.images.map(img => img.url);
      const primaryImageUrl =
        validatedData.images.find(img => img.isPrimary)?.url ||
        imageUrls[0];

      // Supply an empty array if weatherRestrictions is not provided.
      const weatherRestrictions = validatedData.weatherRestrictions || [];

      // Create the inventory (bounce house) record.
      const bounceHouse = await prisma.inventory.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          dimensions: validatedData.dimensions,
          capacity: validatedData.capacity,
          price: validatedData.price,
          setupTime: validatedData.setupTime,
          teardownTime: validatedData.teardownTime,
          images: imageUrls,
          primaryImage: primaryImageUrl,
          status: validatedData.status,
          minimumSpace: validatedData.minimumSpace,
          weightLimit: validatedData.weightLimit,
          ageRange: validatedData.ageRange,
          businessId: business.id,
          type: "BOUNCE_HOUSE",
          weatherRestrictions: weatherRestrictions,
        },
      });

      return bounceHouse;
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Bounce house creation error:", error);
    return NextResponse.json(
      { error: "Failed to create bounce house" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const businessId  = (await params).businessId;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!businessId) {
      return NextResponse.json(
        { message: "Business ID is required" },
        { status: 400 }
      );
    }

    // Ensure the user has access to this business.
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: user.id },
    });

    if (!business) {
      return NextResponse.json(
        { message: "Business not found" },
        { status: 404 }
      );
    }

    const bounceHouses = await prisma.inventory.findMany({
      where: { businessId: businessId },
    });

    return NextResponse.json(bounceHouses);
  } catch (error) {
    console.error("[BOUNCE_HOUSES_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
