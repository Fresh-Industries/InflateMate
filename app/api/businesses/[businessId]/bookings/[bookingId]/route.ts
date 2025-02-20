import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Booking Update Schema
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
});

/**
 * GET a specific booking
 */
export async function GET(
  request: NextRequest,
  context: { params: { businessId: string; bookingId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = context.params;

    const result = await withBusinessAuth(businessId, user.id, async () => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId, businessId },
        include: {
          customer: true,
          bounceHouse: true,
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
 * PATCH (Update) an existing booking
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { businessId: string; bookingId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = context.params;
    const body = await request.json();

    console.log("API Route Hit - PATCH Booking");
    console.log("Business ID:", businessId);
    console.log("Booking ID:", bookingId);
    console.log("Update Data:", body);

    // Validate request body using Zod
    const validatedData = updateBookingSchema.parse(body);

    const result = await withBusinessAuth(businessId, user.id, async () => {
      // Convert date fields
      const eventDate = new Date(validatedData.eventDate);
      const startTime = new Date(validatedData.startTime);
      const endTime = new Date(validatedData.endTime);

      if (startTime >= endTime) {
        return { error: "Start time must be before end time" };
      }

      // Check for overlapping bookings (excluding current booking)
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: bookingId }, // Exclude the current booking
          bounceHouseId: validatedData.bounceHouseId,
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
      });

      if (conflictingBooking) {
        return { error: "Selected time slot is already booked" };
      }

      // Update the booking
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
          customer: {
            update: {
              name: validatedData.customerName,
              email: validatedData.customerEmail,
              phone: validatedData.customerPhone,
            },
          },
        },
        include: {
          customer: true,
          bounceHouse: true,
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
