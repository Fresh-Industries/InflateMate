import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const updateInventorySchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  dimensions: z.string().min(1, "Dimensions are required").optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  price: z.number().min(0, "Price must be 0 or greater").optional(),
  setupTime: z.number().min(0).optional(),
  teardownTime: z.number().min(0).optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        isPrimary: z.boolean(),
      })
    )
    .optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "RETIRED"]).optional(),
  minimumSpace: z.string().min(1, "Minimum space is required").optional(),
  weightLimit: z.number().min(0).optional(),
  ageRange: z.string().min(1, "Age range is required").optional(),
  weatherRestrictions: z.array(z.string()).optional(),
  quantity: z.number().int().min(0).optional(),
  removedImages: z.array(z.string()).optional(),
});

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, inventoryId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateInventorySchema.parse(body);

    // Get the current inventory item to compare changes
    const currentInventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!currentInventory) {
      return NextResponse.json({ message: "Inventory item not found" }, { status: 404 });
    }

    // Initialize variables for final image state
    let finalImageUrls: string[] = currentInventory.images;
    let finalPrimaryImageUrl: string | null = currentInventory.primaryImage;

    // 1. Handle removed images (delete from storage)
    if (validatedData.removedImages && validatedData.removedImages.length > 0) {
      for (const imageUrl of validatedData.removedImages) {
        try {
          const fileKey = imageUrl.split('/').pop();
          if (fileKey) {
            await utapi.deleteFiles(fileKey);
          }
        } catch (error) {
          console.error(`Failed to delete image from UploadThing: ${imageUrl}`, error);
        }
      }
    }

    // 2. Determine the final image state from the request payload
    if (validatedData.images) {
      finalImageUrls = validatedData.images.map((img) => img.url);
      const primaryImage = validatedData.images.find((img) => img.isPrimary);
      if (primaryImage) {
        finalPrimaryImageUrl = primaryImage.url;
      } else if (finalImageUrls.length > 0) {
        finalPrimaryImageUrl = finalImageUrls[0];
      } else {
        finalPrimaryImageUrl = null;
      }
    } else if (validatedData.removedImages && validatedData.removedImages.length > 0) {
      finalImageUrls = currentInventory.images.filter(
        (url) => !validatedData.removedImages?.includes(url)
      );
      if (finalPrimaryImageUrl && validatedData.removedImages.includes(finalPrimaryImageUrl)) {
        finalPrimaryImageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : null;
      }
    }

    // Update the inventory item in the database
    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        name: validatedData.name ?? currentInventory.name,
        description: validatedData.description ?? currentInventory.description,
        dimensions: validatedData.dimensions ?? currentInventory.dimensions,
        capacity: validatedData.capacity ?? currentInventory.capacity,
        price: validatedData.price ?? currentInventory.price,
        setupTime: validatedData.setupTime ?? currentInventory.setupTime,
        teardownTime: validatedData.teardownTime ?? currentInventory.teardownTime,
        status: validatedData.status ?? currentInventory.status,
        minimumSpace: validatedData.minimumSpace ?? currentInventory.minimumSpace,
        weightLimit: validatedData.weightLimit ?? currentInventory.weightLimit,
        ageRange: validatedData.ageRange ?? currentInventory.ageRange,
        weatherRestrictions: validatedData.weatherRestrictions ?? currentInventory.weatherRestrictions,
        quantity: validatedData.quantity ?? currentInventory.quantity,
        images: finalImageUrls,
        primaryImage: finalPrimaryImageUrl,
      },
    });

    return NextResponse.json(updatedInventory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[INVENTORY_UPDATE]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, inventoryId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Get the inventory item to delete its images
    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: {
        bookingItems: {
          include: {
            booking: true
          }
        }
      }
    });

    if (!inventoryItem) {
      return NextResponse.json({ message: "Inventory item not found" }, { status: 404 });
    }

    // Check if the inventory item has any upcoming bookings
    const now = new Date();
    const hasUpcomingBookings = inventoryItem.bookingItems.some(item => {
      const booking = item.booking;
      return booking && new Date(booking.startTime) > now;
    });

    if (hasUpcomingBookings) {
      return NextResponse.json({
        message: "Cannot delete inventory item with upcoming bookings. Please cancel or reschedule the bookings first."
      }, { status: 400 });
    }

    // Delete images from UploadThing
    if (inventoryItem.images && inventoryItem.images.length > 0) {
      for (const imageUrl of inventoryItem.images) {
        try {
          const fileKey = imageUrl.split('/').pop();
          if (fileKey) {
            await utapi.deleteFiles(fileKey);
          }
        } catch (error) {
          console.error(`Failed to delete image from UploadThing: ${imageUrl}`, error);
        }
      }
    }

    // Delete the inventory item
    await prisma.inventory.delete({
      where: { id: inventoryId },
    });

    return NextResponse.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("[INVENTORY_DELETE]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, inventoryId } = params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        id: inventoryId,
        businessId: businessId,
      },
      include: {
        bookingItems: true
      }
    });

    if (!inventoryItem) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    }

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory item" },
      { status: 500 }
    );
  }
}
