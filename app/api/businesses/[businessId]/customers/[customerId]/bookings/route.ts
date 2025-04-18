import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ businessId: string; customerId: string }> }
) {
  const params = await props.params;
  try {
    const { businessId, customerId } = params;

    const bookings = await prisma.booking.findMany({
      where: {
        businessId,
        customerId,
      },
      select: {
        id: true,
        eventDate: true,
        startTime: true,
        endTime: true,
        status: true,
        totalAmount: true,
        eventType: true,
        eventAddress: true,
        eventCity: true,
        eventState: true,
        eventZipCode: true,
        inventoryItems: {
          include: {
            inventory: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        eventDate: "desc",
      },
    });

    // Transform the response to match our expected format
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      eventDate: booking.eventDate.toISOString().split('T')[0],
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      totalAmount: booking.totalAmount,
      eventType: booking.eventType || '',
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      bounceHouse: booking.inventoryItems[0]?.inventory || { id: '', name: 'Unknown Item' },
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer bookings" },
      { status: 500 }
    );
  }
} 