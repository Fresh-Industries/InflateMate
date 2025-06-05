import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format, startOfDay, endOfDay } from "date-fns";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse the date and get the full day range
    const targetDate = new Date(date);
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    console.log(`[Bookings for Date] Fetching bookings for ${businessId} on ${format(targetDate, 'yyyy-MM-dd')}`);

    // Find all bookings for this business on the specified date
    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
        eventDate: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ['CONFIRMED', 'PENDING', 'HOLD']
        }
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    console.log(`[Bookings for Date] Found ${bookings.length} bookings for ${format(targetDate, 'yyyy-MM-dd')}`);

    // Transform to return ISO strings
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
    }));

    return NextResponse.json(formattedBookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings for date:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 