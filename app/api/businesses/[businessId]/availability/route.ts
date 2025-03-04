import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating availability search parameters
const availabilitySearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  startTime: z.string().regex(/^\d{2}:\d{2}$/),  // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/),    // HH:MM format
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    // Authenticate the user - optional for public-facing availability search
    const { userId } = auth();
    
    const businessId  = (await params).businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse search parameters
    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ 
        error: "Missing required parameters: date, startTime, endTime" 
      }, { status: 400 });
    }

    try {
      // Validate parameters
      availabilitySearchSchema.parse({ date, startTime, endTime });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Invalid parameters format", 
          details: error.errors 
        }, { status: 400 });
      }
    }

    // Create Date objects for search
    const searchDate = date;
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Get all inventory items for this business
    const allInventory = await prisma.inventory.findMany({
      where: {
        businessId,
        status: 'AVAILABLE', // Only available inventory
      },
      include: {
        availability: {
          where: {
            // Find any blocking availability records that overlap with the requested time
            OR: [
              {
                // Starts during the requested time
                startTime: {
                  lt: endDateTime,
                },
                endTime: {
                  gt: startDateTime,
                },
                isAvailable: false,
              },
            ],
          },
        },
      },
    });

    // Find all bookings that would conflict with this time slot
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        businessId,
        eventDate: {
          equals: new Date(searchDate),
        },
        OR: [
          {
            // Booking starts during our timeframe
            startTime: {
              lt: endDateTime,
            },
            endTime: {
              gt: startDateTime,
            },
          },
        ],
        status: {
          in: ['PENDING', 'CONFIRMED'], // Only consider active bookings
        },
      },
      include: {
        inventoryItems: true,
      },
    });

    // Extract IDs of inventory items that are already booked
    const bookedInventoryIds = new Set<string>();
    conflictingBookings.forEach(booking => {
      booking.inventoryItems.forEach(item => {
        bookedInventoryIds.add(item.inventoryId);
      });
    });

    // Filter out inventory that has blocking availability or is already booked
    const availableInventory = allInventory.filter(item => {
      // If item has blocking availabilities, it's not available
      if (item.availability.length > 0) return false;
      
      // If item is in booked inventory, it's not available
      if (bookedInventoryIds.has(item.id)) return false;
      
      return true;
    }).map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      price: item.price,
      dimensions: item.dimensions,
      capacity: item.capacity,
      ageRange: item.ageRange,
      primaryImage: item.primaryImage,
    }));

    return NextResponse.json({ availableInventory }, { status: 200 });
  } catch (error) {
    console.error("Error searching availability:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 