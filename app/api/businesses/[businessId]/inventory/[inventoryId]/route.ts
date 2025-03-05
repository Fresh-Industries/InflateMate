import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { InventoryType } from "@prisma/client";
import { UTApi } from "uploadthing/server";

// Initialize the UploadThing API client
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
  removedImages: z.array(z.string()).optional(), // Array of image URLs to remove
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { businessId: string; inventoryId: string } }
) {
  try {
    const { businessId, inventoryId } = await Promise.resolve(params);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!businessId || !inventoryId) {
      return NextResponse.json(
        { message: "Business ID and Inventory ID are required" },
        { status: 400 }
      );
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        try {
          const body = await req.json();
          const validatedData = updateInventorySchema.parse(body);

          // Get the current inventory item to compare changes
          const currentInventory = await prisma.inventory.findUnique({
            where: { id: inventoryId },
          });

          if (!currentInventory) {
            return { error: "Inventory item not found" };
          }

          // Handle image updates if provided
          let imageUrls = currentInventory.images;
          let primaryImageUrl = currentInventory.primaryImage;

          // Handle removed images if specified
          if (validatedData.removedImages && validatedData.removedImages.length > 0) {
            // Delete images from UploadThing
            for (const imageUrl of validatedData.removedImages) {
              try {
                // Extract the file key from the URL
                const fileKey = imageUrl.split('/').pop();
                if (fileKey) {
                  // Use the UTApi directly to delete the file
                  await utapi.deleteFiles(fileKey);
                }
              } catch (error) {
                console.error(`Failed to delete image from UploadThing: ${imageUrl}`, error);
                // Continue with the update even if image deletion fails
              }
            }

            // Remove the deleted images from the imageUrls array
            imageUrls = currentInventory.images.filter(
              (url) => !validatedData.removedImages?.includes(url)
            );

            // If the primary image was deleted, update it
            if (
              primaryImageUrl &&
              validatedData.removedImages.includes(primaryImageUrl)
            ) {
              primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : undefined;
            }
          }

          // Handle new images if provided
          if (validatedData.images) {
            const newImageUrls = validatedData.images.map((img) => img.url);
            
            // Combine existing images (minus removed ones) with new images
            imageUrls = [...imageUrls, ...newImageUrls];
            
            // Update primary image if specified
            const primaryImage = validatedData.images.find((img) => img.isPrimary);
            if (primaryImage) {
              primaryImageUrl = primaryImage.url;
            } else if (!primaryImageUrl && newImageUrls.length > 0) {
              // If no primary image exists and we have new images, use the first new one
              primaryImageUrl = newImageUrls[0];
            }
          }

          // Update the inventory item
          const updatedInventory = await prisma.inventory.update({
            where: { id: inventoryId },
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
              weatherRestrictions: validatedData.weatherRestrictions,
              quantity: validatedData.quantity,
            },
          });

          return updatedInventory;
        } catch (error) {
          console.error("Error updating inventory item:", error);
          
          // Check for specific Prisma errors
          if (error.code === 'P2025') {
            return { error: "Inventory item not found or already deleted." };
          }
          
          // Handle validation errors
          if (error.name === 'ZodError') {
            return { error: "Invalid input data: " + JSON.stringify(error.errors) };
          }
          
          // Generic error
          return { error: error instanceof Error ? error.message : "Failed to update inventory item" };
        }
      }
    );

    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
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
  { params }: { params: { businessId: string; inventoryId: string } }
) {
  try {
    const { businessId, inventoryId } = await Promise.resolve(params);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!businessId || !inventoryId) {
      return NextResponse.json(
        { message: "Business ID and Inventory ID are required" },
        { status: 400 }
      );
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        try {
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
            return { error: "Inventory item not found" };
          }

          // Check if the inventory item has any upcoming bookings
          const now = new Date();
          const hasUpcomingBookings = inventoryItem.bookingItems.some(item => {
            const booking = item.booking;
            return booking && new Date(booking.startTime) > now;
          });

          if (hasUpcomingBookings) {
            return { 
              error: "Cannot delete inventory item with upcoming bookings. Please cancel or reschedule the bookings first." 
            };
          }

          // Delete images from UploadThing
          if (inventoryItem.images && inventoryItem.images.length > 0) {
            for (const imageUrl of inventoryItem.images) {
              try {
                // Extract the file key from the URL
                const fileKey = imageUrl.split('/').pop();
                if (fileKey) {
                  // Use the UTApi directly to delete the file
                  await utapi.deleteFiles(fileKey);
                }
              } catch (error) {
                console.error(`Failed to delete image from UploadThing: ${imageUrl}`, error);
                // Continue with the deletion even if image deletion fails
              }
            }
          }

          // Delete the inventory item
          const deletedInventory = await prisma.inventory.delete({
            where: { id: inventoryId },
          });

          return deletedInventory;
        } catch (error) {
          console.error("Error in inventory deletion:", error);
          
          // Check for specific Prisma errors
          if (error.code === 'P2003') {
            return { error: "This inventory item cannot be deleted because it is referenced by other records in the system." };
          }
          
          if (error.code === 'P2025') {
            return { error: "Inventory item not found or already deleted." };
          }
          
          // Generic error
          return { error: error instanceof Error ? error.message : "Failed to delete inventory item" };
        }
      }
    );

    if (result.error) {
      return NextResponse.json({ message: result.error }, { status: 403 });
    }

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
  { params }: { params: { businessId: string; inventoryId: string } }
) {
  try {
    const { businessId, inventoryId } = await Promise.resolve(params);
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async (business) => {
        try {
          const inventoryItem = await prisma.inventory.findFirst({
            where: {
              id: inventoryId,
              businessId: business.id,
            },
            include: {
              bookingItems: true
            }
          });

          if (!inventoryItem) {
            return { error: "Inventory item not found" };
          }

          return inventoryItem;
        } catch (error) {
          console.error("Error fetching inventory item:", error);
          return { error: error instanceof Error ? error.message : "Failed to fetch inventory item" };
        }
      }
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory item" },
      { status: 500 }
    );
  }
} 