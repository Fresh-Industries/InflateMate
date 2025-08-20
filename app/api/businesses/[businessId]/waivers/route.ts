// app/api/businesses/[businessId]/waivers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  const waivers = await prisma.waiver.findMany({
    where: { businessId },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      booking: {
        select: {
          eventDate: true,
          startTime: true,
          endTime: true,
          eventTimeZone: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  const normalized = waivers.map(w => ({
    ...w,
    booking: {
      ...w.booking,
      eventDateString: w.booking?.eventDate
        ? new Date(w.booking.eventDate).toISOString().slice(0, 10)
        : null,
    }
  }))

  return NextResponse.json(normalized);
}