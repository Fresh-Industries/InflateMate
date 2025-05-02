import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { localToUTC } from "@/lib/utils";
// Import necessary Prisma types from the generated client location
import { BookingItem, Prisma } from "@/prisma/generated/prisma"; 

// Schema for validating availability search parameters
const availabilitySearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/),  // HH:MM
  endTime: z.string().regex(/^\d{2}:\d{2}$/),    // HH:MM
  tz: z.string().optional(), // Add timezone (IANA format)
  excludeBookingId: z.string().optional(),         // for edits
});

// Define the expected type for the result with included relations
type BookingWithItems = Prisma.BookingGetPayload<{
  include: { inventoryItems: true }
}>

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
  const queryTz = url.searchParams.get("tz") || undefined; // Timezone from query
  const excludeBookingId = url.searchParams.get("excludeBookingId") || undefined;

  if (!date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required parameters: date, startTime, endTime" },
      { status: 400 }
    );
  }

  try {
    availabilitySearchSchema.parse({ date, startTime, endTime, tz: queryTz, excludeBookingId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid parameters format", details: err.errors },
        { status: 400 }
      );
    }
  }

  // Fetch business to get default timezone
  const business = await prisma.business.findUnique({ 
    where: { id: businessId },
    select: { timeZone: true } 
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Determine the final timezone to use
  const finalTz = queryTz ?? business.timeZone; 
  console.log(`Availability check using timezone: ${finalTz}`);

  // Convert request times to UTC using the final timezone
  const requestedStartUTC = localToUTC(date, startTime, finalTz);
  const requestedEndUTC = localToUTC(date, endTime, finalTz);
  const now = new Date(); // Get current time for expiry check

  // fetch all AVAILABLE inventory for the business
  const allInventory = await prisma.inventory.findMany({
    where: { businessId, status: 'AVAILABLE' },
  });

  // fetch bookings that conflict with the request
  const conflictingBookings: BookingWithItems[] = await prisma.booking.findMany({
    where: {
      businessId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      OR: [
        // Condition 1: Confirmed booking overlaps time
        {
          status: 'CONFIRMED',
          startTime: { lt: requestedEndUTC },
          endTime: { gt: requestedStartUTC },
        },
        // Condition 2: Pending booking with an active, unexpired invoice hold
        {
          status: 'PENDING',
          invoice: {
            status: 'OPEN',
            expiresAt: { gt: now } 
          }
        }
      ]
    },
    include: {
      inventoryItems: true,
    },
  });

  // collect unavailable inventory IDs
  const unavailableIds = new Set<string>();
  conflictingBookings.forEach(b => {
    b.inventoryItems.forEach((item: BookingItem) => { 
        unavailableIds.add(item.inventoryId);
    });
  });

  // filter out unavailable items
  const availableInventory = allInventory
    .filter(item => !unavailableIds.has(item.id))
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
