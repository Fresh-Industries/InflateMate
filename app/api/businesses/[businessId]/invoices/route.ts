// app/api/businesses/[businessId]/invoices/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  if (!businessId) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: { businessId: businessId },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          }
        },
        booking: {
          select: {
            id: true,
            eventDate: true,
            eventTimeZone: true,
            startTime: true,
            endTime: true,
            eventAddress: true,
            eventCity: true,
            eventState: true,
            eventZipCode: true,
            participantCount: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Normalize: add amountTotal and a date-only string to avoid TZ shifts on client
    const normalized = invoices.map((inv) => ({
      ...inv,
      amountTotal: (Number(inv.amountPaid ?? 0) + Number(inv.amountRemaining ?? 0)),
      booking: {
        ...inv.booking,
        eventDateString: inv.booking?.eventDate
          ? new Date(inv.booking.eventDate).toISOString().slice(0, 10)
          : null,
      },
    }));

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "An error occurred while fetching invoices." }, { status: 500 });
  }
}

