import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InventoryStatus, InventoryType } from "../../../../../prisma/generated/prisma";
import { stripe } from "@/lib/stripe-server"; // Make sure stripe client is initialized

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
  type: z.enum(["BOUNCE_HOUSE", "WATER_SLIDE", "GAME", "OTHER"]),
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
  capacity: z.number().min(1).optional(),
  minimumSpace: z.string().optional(),
  weightLimit: z.number().min(0).optional(),
  ageRange: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await context.params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await req.json();

    // Validate based on inventory type
    let validatedData;
    const { type } = body;

    switch (type) {
      case "BOUNCE_HOUSE":
      case "WATER_SLIDE":
        validatedData = bounceHouseSchema.parse(body);
        break;
      case "GAME":
        validatedData = gameSchema.parse(body);
        break;
      case "OTHER":
        validatedData = otherSchema.parse(body);
        break;
      default:
        return NextResponse.json({ error: "Invalid inventory type" }, { status: 400 });
    }

    // Transform image data to get an array of URLs and determine the primary image.
    const imageUrls = validatedData.images.map(img => img.url);
    const primaryImageUrl =
      validatedData.images.find(img => img.isPrimary)?.url ||
      (imageUrls.length > 0 ? imageUrls[0] : undefined);

    const stripeProduct = await stripe.products.create({
      name: validatedData.name,
      description: validatedData.description || "",
      images: imageUrls,
    }, {
      stripeAccount: membership.organization?.business?.stripeAccountId || undefined,
    });

    // Create the inventory record
    const inventory = await prisma.inventory.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || "",
      
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dimensions: (validatedData as any).dimensions || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        capacity: (validatedData as any).capacity || 1,

        price: validatedData.price,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setupTime: (validatedData as any).setupTime || 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        teardownTime: (validatedData as any).teardownTime || 0,
        images: imageUrls,
        primaryImage: primaryImageUrl,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripeProduct.default_price as string,
        status: validatedData.status as InventoryStatus,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        minimumSpace: (validatedData as any).minimumSpace || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weightLimit: (validatedData as any).weightLimit || 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ageRange: (validatedData as any).ageRange || "",
        businessId: businessId,
        type: validatedData.type as InventoryType,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weatherRestrictions: (validatedData as any).weatherRestrictions || [],
        quantity: validatedData.quantity,
      },
    });

    return NextResponse.json(inventory, { status: 201 });
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
    const { businessId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
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
