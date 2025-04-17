import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createLocalDate, createLocalDateTime } from "@/lib/utils";

// Schema for validating availability search parameters
const availabilitySearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/),  // HH:MM
  endTime: z.string().regex(/^\d{2}:\d{2}$/),    // HH:MM
  excludeBookingId: z.string().optional(),         // for edits
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  // parse businessId
  const { businessId } = await params;
  if (!businessId) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  // parse & validate query params
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const startTime = url.searchParams.get("startTime");
  const endTime = url.searchParams.get("endTime");
  const excludeBookingId = url.searchParams.get("excludeBookingId") || undefined;

  if (!date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required parameters: date, startTime, endTime" },
      { status: 400 }
    );
  }

  try {
    availabilitySearchSchema.parse({ date, startTime, endTime, excludeBookingId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters format", details: err.errors },
        { status: 400 }
      );
    }
  }

  // build local Date objects
  const eventDay = createLocalDate(date);
  const requestedStart = createLocalDateTime(date, startTime);
  const requestedEnd = createLocalDateTime(date, endTime);

  // fetch all AVAILABLE inventory
  const allInventory = await prisma.inventory.findMany({
    where: { businessId, status: 'AVAILABLE' },
  });

  // fetch bookings that overlap the requested window
  const overlapping = await prisma.booking.findMany({
    where: {
      businessId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        { startTime: { lt: requestedEnd }, endTime: { gt: requestedStart } },
        { eventDate: eventDay },
      ],
    },
    include: { inventoryItems: true },
  });

  // collect booked inventory IDs
  const bookedIds = new Set<string>();
  overlapping.forEach(b => {
    b.inventoryItems.forEach(item => bookedIds.add(item.inventoryId));
  });

  // identify current item if editing
  let editingId: string | null = null;
  if (excludeBookingId) {
    const edit = overlapping.find(b => b.id === excludeBookingId);
    if (edit && edit.inventoryItems.length) {
      editingId = edit.inventoryItems[0].inventoryId;
    }
  }

  // filter out booked items (unless editing)
  const availableInventory = allInventory
    .filter(item => !bookedIds.has(item.id) || item.id === editingId)
    .map(item => ({
      id: item.id,
      name: item.name,
      type: item.type,
      description: item.description,
      price: item.price,
      dimensions: item.dimensions,
      capacity: item.capacity,
      ageRange: item.ageRange,
      primaryImage: item.primaryImage,
      quantity: item.quantity,
    }));

  return NextResponse.json({ availableInventory }, { status: 200 });
}
