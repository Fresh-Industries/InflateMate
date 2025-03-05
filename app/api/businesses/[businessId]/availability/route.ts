import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating availability search parameters
const availabilitySearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  startTime: z.string().regex(/^\d{2}:\d{2}$/),  // HH:MM format
  endTime: z.string().regex(/^\d{2}:\d{2}$/),    // HH:MM format
  excludeBookingId: z.string().optional(),       // Optional booking ID to exclude
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    // Authenticate the user - optional for public-facing availability search
    const { userId } = await auth();
    
    const businessId  = (await params).businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse search parameters
    const url = new URL(req.url);
    const date = url.searchParams.get('date');
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');
    const excludeBookingId = url.searchParams.get('excludeBookingId') || undefined;

    if (!date || !startTime || !endTime) {
      return NextResponse.json({ 
        error: "Missing required parameters: date, startTime, endTime" 
      }, { status: 400 });
    }

    try {
      // Validate parameters
      availabilitySearchSchema.parse({ date, startTime, endTime, excludeBookingId });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Invalid parameters format", 
          details: error.errors 
        }, { status: 400 });
      }
    }

    console.log(`Checking availability for date ${date}, startTime ${startTime}, endTime ${endTime}, excluding booking ID: ${excludeBookingId || 'none'}`);
    
    // Parse the date string to create a proper UTC date
    const dateParts = date.split('-');
    if (dateParts.length !== 3) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
    const day = parseInt(dateParts[2]);
    
    // Create date objects for the start and end of the day in UTC
    // If startTime and endTime are provided, use them to create more specific time ranges
    let dayStart, dayEnd;
    
    if (startTime && startTime.match(/^\d{2}:\d{2}$/)) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      dayStart = new Date(Date.UTC(year, month, day, startHour, startMinute, 0));
    } else {
      dayStart = new Date(Date.UTC(year, month, day, 0, 0, 0));
    }
    
    if (endTime && endTime.match(/^\d{2}:\d{2}$/)) {
      const [endHour, endMinute] = endTime.split(':').map(Number);
      dayEnd = new Date(Date.UTC(year, month, day, endHour, endMinute, 59));
    } else {
      dayEnd = new Date(Date.UTC(year, month, day, 23, 59, 59));
    }
    
    console.log(`Date range for availability check: ${dayStart.toISOString()} to ${dayEnd.toISOString()}`);
    
    // Get all inventory items for this business
    const allInventory = await prisma.inventory.findMany({
      where: {
        businessId,
        status: 'AVAILABLE', // Only available inventory
      },
      include: {
        availability: {
          where: {
            // Find any blocking availability records that overlap with the requested date
            OR: [
              {
                // Availability record that blocks this date
                startTime: {
                  lt: dayEnd,
                },
                endTime: {
                  gt: dayStart,
                },
                isAvailable: false,
              },
            ],
          },
        },
      },
    });

    console.log(`Found ${allInventory.length} total inventory items`);
    
    // Find all bookings that would conflict with this date (entire day)
    // We're now checking for any booking on the same day, regardless of time
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        businessId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined, // Exclude the current booking if ID provided
        eventDate: {
          // Check if the booking is on the same day
          gte: dayStart,
          lt: dayEnd,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'], // Only consider active bookings
        },
      },
      include: {
        inventoryItems: true,
      },
    });

    console.log(`Found ${conflictingBookings.length} conflicting bookings`);

    // Extract IDs of inventory items that are already booked
    const bookedInventoryIds = new Set<string>();
    conflictingBookings.forEach(booking => {
      booking.inventoryItems.forEach(item => {
        bookedInventoryIds.add(item.inventoryId);
      });
    });

    console.log(`Booked inventory IDs: ${Array.from(bookedInventoryIds).join(', ') || 'none'}`);

    // If we're editing a booking, we need to get the bounce house ID for that booking
    let editingBounceHouseId = null;
    if (excludeBookingId) {
      const editingBooking = await prisma.booking.findUnique({
        where: { id: excludeBookingId },
        include: { inventoryItems: true },
      });
      
      if (editingBooking && editingBooking.inventoryItems.length > 0) {
        editingBounceHouseId = editingBooking.inventoryItems[0].inventoryId;
        console.log(`Editing booking with bounce house ID: ${editingBounceHouseId}`);
      }
    }

    // Filter out inventory that has blocking availability or is already booked
    const availableInventory = allInventory.filter(item => {
      // If item has blocking availabilities, it's not available
      if (item.availability.length > 0) {
        console.log(`Item ${item.id} has blocking availability`);
        return false;
      }
      
      // If item is in booked inventory, it's not available UNLESS it's the one we're editing
      if (bookedInventoryIds.has(item.id) && item.id !== editingBounceHouseId) {
        console.log(`Item ${item.id} is already booked`);
        return false;
      }
      
      // If we're editing a booking and this is the same bounce house, always include it
      if (editingBounceHouseId && item.id === editingBounceHouseId) {
        console.log(`Including item ${item.id} because it's the one being edited`);
        return true;
      }
      
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

    console.log(`Returning ${availableInventory.length} available inventory items`);
    console.log(`Available inventory IDs: ${availableInventory.map(item => item.id).join(', ') || 'none'}`);

    return NextResponse.json({ availableInventory }, { status: 200 });
  } catch (error) {
    console.error("Error searching availability:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
} 