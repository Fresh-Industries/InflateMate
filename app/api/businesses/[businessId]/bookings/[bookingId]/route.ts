import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

// Schema for updating a booking
const updateBookingSchema = z.object({
  eventDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  eventType: z.string().optional(),
  eventAddress: z.string(),
  eventCity: z.string(),
  eventState: z.string(),
  eventZipCode: z.string(),
  participantCount: z.number(),
  participantAge: z.number().optional(),
  specialInstructions: z.string().optional(),
  totalAmount: z.number(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  bounceHouseId: z.string(),
});

/**
 * GET a specific booking
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string; bookingId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { businessId, bookingId } = await params;
    const result = await withBusinessAuth(businessId, userId, async () => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, businessId },
        include: {
          inventoryItems: { include: { inventory: true } },
          customer: true,
        },
      });
      if (!booking) {
        return { error: "Booking not found" };
      }
      
      // Ensure bounceHouseId is set in the response
      let responseData: any = { ...booking };
      
      // If there's an inventory item, set the bounceHouseId
      if (booking.inventoryItems && booking.inventoryItems.length > 0) {
        responseData.bounceHouseId = booking.inventoryItems[0].inventoryId;
        
        // Also set the bounceHouse object for convenience
        responseData.bounceHouse = {
          id: booking.inventoryItems[0].inventoryId,
          name: booking.inventoryItems[0].inventory.name
        };
      }
      
      console.log("Returning booking with bounceHouseId:", responseData.bounceHouseId);
      return { data: responseData };
    });
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH (update) an existing booking
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const businessId = (await params).businessId;
    const bookingId = (await params).bookingId;
    
    const body = await req.json();
    console.log("Update booking request body:", body);
    
    // Extract customer data from the nested customer object if it exists
    const processedBody = { ...body };
    
    if (body.customer && !body.customerName) {
      processedBody.customerName = body.customer.name;
      processedBody.customerEmail = body.customer.email;
      processedBody.customerPhone = body.customer.phone;
      console.log("Extracted customer data from nested customer object");
    }
    
    try {
      const validatedData = updateBookingSchema.parse(processedBody);
      
      const result = await withBusinessAuth(businessId, userId, async () => {
        // Get the existing booking first
        const existingBooking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { inventoryItems: true }
        });
        
        if (!existingBooking) {
          return { error: "Booking not found" };
        }
        
        // Create a date that preserves the user's selected date regardless of time zone
        // We use YYYY-MM-DD format and set the time to noon to avoid any date shifting
        const dateParts = validatedData.eventDate.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
        const day = parseInt(dateParts[2]);
        
        // Create a date at noon UTC on the selected day to avoid time zone issues
        const eventDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
        
        console.log(`Original date string: ${validatedData.eventDate}`);
        console.log(`Parsed event date: ${eventDate.toISOString()}`);
        
        // Format times properly - handle both HH:MM format and full ISO strings
        let startTime, endTime;
        
        if (validatedData.startTime.includes('T')) {
          startTime = new Date(validatedData.startTime);
        } else {
          // Handle HH:MM format - use the same date as eventDate for consistency
          const [hours, minutes] = validatedData.startTime.split(':').map(Number);
          startTime = new Date(Date.UTC(year, month, day, hours, minutes));
          console.log(`Parsed start time: ${startTime.toISOString()}`);
        }
        
        if (validatedData.endTime.includes('T')) {
          endTime = new Date(validatedData.endTime);
        } else {
          // Handle HH:MM format - use the same date as eventDate for consistency
          const [hours, minutes] = validatedData.endTime.split(':').map(Number);
          endTime = new Date(Date.UTC(year, month, day, hours, minutes));
          console.log(`Parsed end time: ${endTime.toISOString()}`);
        }
        
        if (startTime >= endTime) {
          return { error: "Start time must be before end time" };
        }
        
        console.log(`Checking conflicts for booking ${bookingId} on date ${eventDate.toISOString().split('T')[0]}`);
        
        // Check for overlapping bookings (exclude current booking) using BookingItem
        const conflictingItem = await prisma.bookingItem.findFirst({
          where: {
            inventoryId: validatedData.bounceHouseId,
            booking: {
              id: { not: bookingId }, // Exclude the current booking
              eventDate,
              status: { notIn: ["CANCELLED"] },
            },
          },
          include: {
            booking: true,
          }
        });
        
        if (conflictingItem) {
          console.log("Found conflicting booking:", conflictingItem);
          return { error: "Selected date is already booked for this bounce house" };
        }
        
        // Update the booking record and nested customer info
        const updatedBooking = await prisma.booking.update({
          where: { id: bookingId, businessId },
          data: {
            eventDate,
            startTime,
            endTime,
            eventType: validatedData.eventType,
            eventAddress: validatedData.eventAddress,
            eventCity: validatedData.eventCity,
            eventState: validatedData.eventState,
            eventZipCode: validatedData.eventZipCode,
            participantCount: validatedData.participantCount,
            participantAge: validatedData.participantAge,
            specialInstructions: validatedData.specialInstructions,
            totalAmount: validatedData.totalAmount,
            // Update associated customer data
            customer: {
              update: {
                name: validatedData.customerName,
                email: validatedData.customerEmail,
                phone: validatedData.customerPhone,
              },
            },
            // Update inventory items if bounceHouseId has changed
            inventoryItems: existingBooking.inventoryItems[0]?.inventoryId !== validatedData.bounceHouseId
              ? {
                  deleteMany: {},
                  create: {
                    inventoryId: validatedData.bounceHouseId,
                    price: validatedData.totalAmount,
                  }
                }
              : undefined,
          },
          include: {
            inventoryItems: { include: { inventory: true } },
            customer: true,
          },
        });
        
        return { data: updatedBooking };
      });
      
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
      console.error("Error in PATCH booking route:", error);
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input", details: error.errors },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Internal Server Error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in PATCH booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE a specific booking
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = await params;
    const result = await withBusinessAuth(businessId, userId, async () => {
      const booking = await prisma.booking.delete({
        where: { id: bookingId, businessId },
      });
      return { data: booking };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}