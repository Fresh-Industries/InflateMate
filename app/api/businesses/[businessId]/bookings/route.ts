import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define booking schema using Zod for validation
const bookingSchema = z.object({
  eventDate: z.string(), // ISO format string
  startTime: z.string(), // ISO format string
  endTime: z.string(), 
  eventType: z.string().optional(),
  eventAddress: z.string(),
  eventCity: z.string(),
  eventState: z.string(),
  eventZipCode: z.string(),
  participantCount: z.number(),
  specialInstructions: z.string().optional(),
  bounceHouseId: z.string(),
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  totalAmount: z.number(),
  depositAmount: z.number().optional(),
  depositPaid: z.boolean().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    // Validate request body with Zod
    const validatedData = bookingSchema.parse(body);
    const { businessId } = await params;

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const result = await withBusinessAuth(businessId, user.id, async (business) => {
      // Convert eventDate, startTime, and endTime to Date objects
      const eventDate = new Date(validatedData.eventDate);
      const startTime = new Date(validatedData.startTime);
      const endTime = new Date(validatedData.endTime);

      // Ensure startTime < endTime
      if (startTime >= endTime) {
        return { error: "Start time must be before end time" };
      }

      // Check if bounce house is available
      const bounceHouse = await prisma.bounceHouse.findFirst({
        where: {
          
          businessId: business.id,
          status: "AVAILABLE",
        },
      });

      if (!bounceHouse) {
        return { error: "Bounce house is not available for booking" };
      }

      // Check for overlapping bookings
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
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

      // Create a new customer if not existing
      let customer = await prisma.customer.findFirst({
        where: { email: validatedData.customerEmail },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: validatedData.customerName,
            email: validatedData.customerEmail,
            phone: validatedData.customerPhone,
            address: validatedData.eventAddress,
            city: validatedData.eventCity,
            state: validatedData.eventState,
            zipCode: validatedData.eventZipCode,
            businessId: business.id,
          },
        });
      }

      // Create new booking
      const booking = await prisma.booking.create({
        data: {
          eventDate,
          startTime,
          endTime,
          status: "PENDING",
          totalAmount: validatedData.totalAmount,
          depositAmount: validatedData.depositAmount,
          depositPaid: validatedData.depositPaid || false,
          eventType: validatedData.eventType,
          eventAddress: validatedData.eventAddress,
          eventCity: validatedData.eventCity,
          eventState: validatedData.eventState,
          eventZipCode: validatedData.eventZipCode,
          participantCount: validatedData.participantCount,
          specialInstructions: validatedData.specialInstructions,
          businessId: business.id,
          bounceHouseId: validatedData.bounceHouseId,
          customerId: customer.id,
        },
        include: {
          bounceHouse: { select: { name: true } },
          customer: { select: { name: true, email: true, phone: true } },
        },
      });

      return { data: booking };
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("[BOOKING_ERROR]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await params;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const result = await withBusinessAuth(businessId, user.id, async (business) => {
      const bookings = await prisma.booking.findMany({
        where: {
          businessId: business.id,
          eventDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        orderBy: {
          eventDate: 'asc',
        },
        include: {
          bounceHouse: {
            select: {
              name: true,
            },
          },
        },
      });

      return bookings;
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[BOOKING_GET_ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
