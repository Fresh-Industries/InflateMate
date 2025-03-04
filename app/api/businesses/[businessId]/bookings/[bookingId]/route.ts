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
      return { data: booking };
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
    
    const { businessId, bookingId } = await params;
    const body = await req.json();
    const validatedData = updateBookingSchema.parse(body);
    
    const result = await withBusinessAuth(businessId, userId, async () => {
      const eventDate = new Date(validatedData.eventDate);
      const startTime = new Date(validatedData.startTime);
      const endTime = new Date(validatedData.endTime);
      
      if (startTime >= endTime) {
        return { error: "Start time must be before end time" };
      }
      
      // Check for overlapping bookings (exclude current booking) using BookingItem
      const conflictingItem = await prisma.bookingItem.findFirst({
        where: {
          inventoryId: validatedData.bounceHouseId,
          booking: {
            id: { not: bookingId },
            eventDate,
            OR: [
              {
                AND: [
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } },
                ],
              },
            ],
            status: { notIn: ["CANCELLED"] },
          },
        },
      });
      if (conflictingItem) {
        return { error: "Selected time slot is already booked" };
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
          // (Optionally, update inventoryItems if needed)
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