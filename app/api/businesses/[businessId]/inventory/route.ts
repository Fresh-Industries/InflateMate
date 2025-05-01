// /api/businesses/[businessId]/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InventoryStatus, InventoryType } from "../../../../../prisma/generated/prisma";

// Base schema with common fields for all inventory types
const baseInventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be 0 or greater"),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]),
  images: z.array(z.object({
    url: z.string(),
    isPrimary: z.boolean()
  })),
  quantity: z.number().int().min(0).default(1),
  type: z.enum(["BOUNCE_HOUSE", "INFLATABLE", "GAME", "OTHER"]),
});

// Type-specific schemas
const bounceHouseSchema = baseInventorySchema.extend({
  dimensions: z.string().min(1, "Dimensions are required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  setupTime: z.number().min(0),
  teardownTime: z.number().min(0),
  minimumSpace: z.string().min(1, "Minimum space is required"),
  weightLimit: z.number().min(0),
  ageRange: z.string().min(1, "Age range is required"),
  weatherRestrictions: z.array(z.string()).optional(),
});

const gameSchema = baseInventorySchema.extend({
  dimensions: z.string().min(1, "Dimensions are required").optional(),
  ageRange: z.string().min(1, "Age range is required"),
  setupTime: z.number().min(0).optional(),
  teardownTime: z.number().min(0).optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
});

const otherSchema = baseInventorySchema.extend({
  dimensions: z.string().optional(),
  setupTime: z.number().min(0).optional(),
  teardownTime: z.number().min(0).optional(),
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
      
      // Validate based on inventory type
      let validatedData;
      const { type } = body;
      
      switch (type) {
        case "BOUNCE_HOUSE":
        case "INFLATABLE":
          validatedData = bounceHouseSchema.parse(body);
          break;
        case "GAME":
          validatedData = gameSchema.parse(body);
          break;
        case "OTHER":
          validatedData = otherSchema.parse(body);
          break;
        default:
          throw new Error("Invalid inventory type");
      }

      // Transform image data to get an array of URLs and determine the primary image.
      const imageUrls = validatedData.images.map(img => img.url);
      const primaryImageUrl =
        validatedData.images.find(img => img.isPrimary)?.url ||
        (imageUrls.length > 0 ? imageUrls[0] : undefined);

      // Create the inventory record
      const inventory = await prisma.inventory.create({
        data: {
          name: validatedData.name,
          description: validatedData.description || "",
          dimensions: validatedData.dimensions as string || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          capacity: (validatedData as any).capacity || 1,
          price: validatedData.price,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setupTime: (validatedData as any).setupTime || 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          teardownTime: (validatedData as any).teardownTime || 0,
          images: imageUrls,
          primaryImage: primaryImageUrl,
          status: validatedData.status as InventoryStatus,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          minimumSpace: (validatedData as any).minimumSpace || "",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          weightLimit: (validatedData as any).weightLimit || 0,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ageRange: (validatedData as any).ageRange || "",
          businessId: business.id,
          type: validatedData.type as InventoryType,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          weatherRestrictions: (validatedData as any).weatherRestrictions || [],
          quantity: validatedData.quantity,
        },
      });

      return inventory;
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

    console.error("Inventory creation error:", error);
    return NextResponse.json(
      { error: "Failed to create inventory item" },
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

    // Get query parameters for filtering
    const url = new URL(req.url);
    const typeFilter = url.searchParams.get('type') as InventoryType | null;
    const statusFilter = url.searchParams.get('status') as InventoryStatus | null;

    // Build the where clause based on filters
    const whereClause: {
      businessId: string;
      type?: InventoryType;
      status?: InventoryStatus;
    } = { businessId };
    
    if (typeFilter) {
      whereClause.type = typeFilter;
    }
    
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const inventoryItems = await prisma.inventory.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            bookingItems: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Transform the data to include the booking count
    const transformedItems = inventoryItems.map(item => {
      const { _count, ...rest } = item;
      return {
        ...rest,
        bookingCount: _count.bookingItems
      };
    });

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error("[INVENTORY_GET]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
