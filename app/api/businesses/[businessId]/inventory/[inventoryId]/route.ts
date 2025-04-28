import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
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
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
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
      async () => {
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

          // Initialize variables for final image state
          let finalImageUrls: string[] = currentInventory.images;
          let finalPrimaryImageUrl: string | null = currentInventory.primaryImage;

          // 1. Handle removed images (delete from storage)
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
            // Note: We don't modify finalImageUrls based on removedImages here.
            // The final list comes solely from validatedData.images.
          }

          // 2. Determine the final image state from the request payload
          if (validatedData.images) {
            // Use the provided images array as the definitive list
            finalImageUrls = validatedData.images.map((img) => img.url);

            // Find the primary image specified in the payload
            const primaryImage = validatedData.images.find((img) => img.isPrimary);
            if (primaryImage) {
              finalPrimaryImageUrl = primaryImage.url;
            } else if (finalImageUrls.length > 0) {
              // If no primary is explicitly set, default to the first image in the final list
              finalPrimaryImageUrl = finalImageUrls[0];
            } else {
              // If the final list is empty, there's no primary image
              finalPrimaryImageUrl = null;
            }
          } else {
            // If no 'images' array is provided in the PATCH, keep the existing ones
            // (minus any potentially removed ones if only `removedImages` was sent,
            // although the current frontend always sends `images`).
            // To be safe, let's filter based on removedImages if images array is missing.
            if (validatedData.removedImages && validatedData.removedImages.length > 0) {
                 finalImageUrls = currentInventory.images.filter(
                    (url) => !validatedData.removedImages?.includes(url)
                 );
                 if (finalPrimaryImageUrl && validatedData.removedImages.includes(finalPrimaryImageUrl)) {
                    finalPrimaryImageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : null;
                 }
            }
            // If neither images nor removedImages is provided, finalImageUrls and finalPrimaryImageUrl
            // remain as they were fetched from currentInventory.
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

          return updatedInventory;
        } catch (error) {
          console.error("Error updating inventory item:", error);
          
          // Check for specific Prisma errors
          if (error instanceof Error && error.message.includes('P2025')) {
            return { error: "Inventory item not found or already deleted." };
          }
          
          // Handle validation errors
          if (error instanceof ZodError) {
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
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
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
      async () => {
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
          if (error instanceof Error && error.message.includes('P2003')) {
            return { error: "This inventory item cannot be deleted because it is referenced by other records in the system." };
          }
          
          if (error instanceof Error && error.message.includes('P2025')) {
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
  props: { params: Promise<{ businessId: string; inventoryId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, inventoryId } = await Promise.resolve(params);
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await withBusinessAuth(
      businessId,
      user.id,
      async () => {
        try {
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