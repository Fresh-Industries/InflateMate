import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { add, isWithinInterval, parseISO } from "date-fns";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ businessId: string }> }
) {
  try {
    const params = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing date or time parameters" },
        { status: 400 }
      );
    }

    // Parse ISO strings to Date objects
    const startDate = parseISO(startTime);
    const endDate = parseISO(endTime);
    
    // Add 24 hours buffer for cleaning and maintenance
    const bufferStart = add(startDate, { hours: -24 });
    const bufferEnd = add(endDate, { hours: 24 });

    // Get all bounce houses for the business
    const bounceHouses = await prisma.bounceHouse.findMany({
      where: {
        businessId: params.businessId,
        status: 'AVAILABLE',
      },
      cacheStrategy: { ttl: 120 }, // Cache for 2 minutes
    });

    // Get all bookings for the specified date (including buffer)
    const bookings = await prisma.booking.findMany({
      where: {
        bounceHouse: {
          businessId: params.businessId,
        },
        startTime: {
          gte: bufferStart,
          lte: bufferEnd,
        },
        status: {
          notIn: ['CANCELLED'],
        },
      },
      select: {
        bounceHouseId: true,
        startTime: true,
        endTime: true,
      },
    });

    // Filter out unavailable bounce houses
    const availableBounceHouses = bounceHouses.filter((bounceHouse) => {
      const conflictingBooking = bookings.find((booking) => {
        if (booking.bounceHouseId !== bounceHouse.id) return false;

        // Check if the requested time slot overlaps with any existing booking
        return isWithinInterval(startDate, {
          start: add(booking.startTime, { hours: -24 }),
          end: add(booking.endTime, { hours: 24 }),
        }) || isWithinInterval(endDate, {
          start: add(booking.startTime, { hours: -24 }),
          end: add(booking.endTime, { hours: 24 }),
        });
      });

      return !conflictingBooking;
    });

    return NextResponse.json(availableBounceHouses);
  } catch (error) {
    console.error("Error checking bounce house availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
} 