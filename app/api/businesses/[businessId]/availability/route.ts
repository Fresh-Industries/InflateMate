// app/api/businesses/[businessId]/availability/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { localToUTC } from "@/lib/utils";
import { Prisma } from "@/prisma/generated/prisma";

const availabilitySearchSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (expected HH:MM)"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (expected HH:MM)"),
  tz: z.string().optional(),
  excludeBookingId: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await params;

  if (!businessId) {
    console.error("[Availability API RAW] Business ID is missing from params.");
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }
  console.log(`[Availability API RAW] Received request for businessId: ${businessId}`);

  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const startTime = url.searchParams.get("startTime");
  const endTime = url.searchParams.get("endTime");
  const queryTz = url.searchParams.get("tz") || undefined;
  const excludeBookingIdParam = url.searchParams.get("excludeBookingId") || undefined;

  console.log("[Availability API RAW] Query Params:", { date, startTime, endTime, queryTz, excludeBookingIdParam });


  if (!date || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Missing required parameters: date, startTime, endTime" },
      { status: 400 }
    );
  }

  try {
    availabilitySearchSchema.parse({ date, startTime, endTime, tz: queryTz, excludeBookingId: excludeBookingIdParam });
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error("[Availability API RAW] Zod validation error:", err.errors);
      return NextResponse.json(
        { error: "Invalid parameters format", details: err.errors },
        { status: 400 }
      );
    }
    console.error("[Availability API RAW] Error during Zod parsing:", err);
     return NextResponse.json(
       { error: "Failed to process request parameters (Zod)" },
       { status: 500 }
     );
  }

  try {
    const businessData = await prisma.business.findUnique({
      where: { id: businessId },
      select: { 
        timeZone: true,
        minNoticeHours: true,
        maxNoticeHours: true,
        bufferBeforeHours: true,
        bufferAfterHours: true
      }
    });

    if (!businessData) {
      console.warn(`[Availability API RAW] Business not found: ${businessId}`);
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const finalTz = queryTz ?? businessData.timeZone;
    console.log(`[Availability API RAW] Availability check using timezone: ${finalTz}`);

    const requestedStartUTC = localToUTC(date, startTime, finalTz);
    const requestedEndUTC = localToUTC(date, endTime, finalTz);
    const now = new Date();

    if (isNaN(requestedStartUTC.getTime()) || isNaN(requestedEndUTC.getTime())) {
        console.error("[Availability API RAW] Invalid Date object from localToUTC conversion.");
        return NextResponse.json({ error: "Internal server error: Invalid date processing for UTC conversion" }, { status: 500 });
    }
     if (requestedStartUTC >= requestedEndUTC) {
         console.warn(`[Availability API RAW] Invalid time range: Start=${requestedStartUTC.toISOString()}, End=${requestedEndUTC.toISOString()}`);
          return NextResponse.json(
            { error: "End time must be after start time" },
            { status: 400 }
          );
     }

    // Validate notice window requirements
    const noticeDiffMs = requestedStartUTC.getTime() - now.getTime();
    const minNoticeMs = businessData.minNoticeHours * 60 * 60 * 1000;
    const maxNoticeMs = businessData.maxNoticeHours * 60 * 60 * 1000;

    if (noticeDiffMs < minNoticeMs) {
      return NextResponse.json(
        { error: `You must book at least ${businessData.minNoticeHours} hours in advance.` },
        { status: 400 }
      );
    }
    if (noticeDiffMs > maxNoticeMs) {
      const maxDays = Math.floor(businessData.maxNoticeHours / 24);
      return NextResponse.json(
        { error: `You can't book more than ${maxDays} days out.` },
        { status: 400 }
      );
    }

    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const allInventory = await prisma.inventory.findMany({
      where: { businessId, status: 'AVAILABLE' },
      select: {
          id: true, name: true, type: true, description: true, price: true,
          dimensions: true, capacity: true, ageRange: true, primaryImage: true,
          quantity: true, stripeProductId: true, version: true,
      }
    });

    if (allInventory.length === 0) {
         console.log(`[Availability API RAW] No AVAILABLE inventory found for business: ${businessId}`);
         return NextResponse.json({ availableInventory: [] }, { status: 200 });
    }

    const allInventoryIds = allInventory.map(item => item.id);
    if (allInventoryIds.length === 0) {
        return NextResponse.json({ availableInventory: [] }, { status: 200 });
    }

    console.log("[Availability API Prisma] Fetching booked items...");

    // Compute the buffer (in milliseconds)
    const bufferBeforeMs = businessData.bufferBeforeHours * 60 * 60 * 1000;
    const bufferAfterMs = businessData.bufferAfterHours * 60 * 60 * 1000;

    // Expand the requested window by the buffer on the outside edges
    const effectiveSearchStart = new Date(requestedStartUTC.getTime() - bufferBeforeMs);
    const effectiveSearchEnd = new Date(requestedEndUTC.getTime() + bufferAfterMs);

    console.log(`[Availability API] Buffer settings: ${businessData.bufferBeforeHours}h before, ${businessData.bufferAfterHours}h after`);
    console.log(`[Availability API] Effective search window: ${effectiveSearchStart.toISOString()} to ${effectiveSearchEnd.toISOString()}`);

    const bookingWhere: Prisma.BookingWhereInput = {
      businessId: businessId,
      OR: [
        { status: 'CONFIRMED' },
        { // HOLD status valid for 30 minutes
          status: 'HOLD',
          createdAt: { gt: thirtyMinutesAgo },
        },
      ],
    };

    if (excludeBookingIdParam) {
      bookingWhere.id = { not: excludeBookingIdParam };
    }

    const bookedItems = await prisma.bookingItem.findMany({
      where: {
        inventoryId: {
          in: allInventoryIds,
        },
        // Filter for overlapping periods using expanded search window to account for buffers
        startUTC: { lte: effectiveSearchEnd },
        endUTC: { gte: effectiveSearchStart },
        booking: bookingWhere,
      },
      select: { // Select only necessary fields
        inventoryId: true,
        quantity: true,
        // Include booking status if needed for post-processing, though handled in where now
        // booking: { select: { status: true } }, 
      },
    });

    console.log(`[Availability API Prisma] Found ${bookedItems.length} booked items matching criteria.`);

    // Aggregate booked quantities by inventoryId
    const bookedQuantitiesMap = new Map<string, number>();

    // Define a type for the items returned by the findMany query
    type BookedItemSelect = { inventoryId: string; quantity: number; };

    bookedItems.forEach((item: BookedItemSelect) => {
        const currentBooked = bookedQuantitiesMap.get(item.inventoryId) || 0;
        bookedQuantitiesMap.set(item.inventoryId, currentBooked + item.quantity);
    });

    const availableInventory: typeof allInventory = allInventory
      .map(item => {
        const booked = bookedQuantitiesMap.get(item.id) || 0;
        const remaining = item.quantity - booked;
        if (remaining > 0) {
          return { ...item, quantity: remaining }; // Return item with *actual available quantity*
        }
        return null;
      })
      .filter(item => item !== null);

    console.log(`[Availability API RAW] Final available items count: ${availableInventory.length}`);
    return NextResponse.json({ availableInventory }, { status: 200 });

  } catch (error) {
    console.error("[Availability API RAW] Unexpected error in GET handler:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
         console.error("[Availability API RAW] Prisma Error details:", {
             code: error.code,
             meta: error.meta,
             message: error.message,
         });
     } else if (error instanceof Error) {
        console.error("[Availability API RAW] Generic error details:", error.message, error.stack);
     } else {
        console.error("[Availability API RAW] Unknown error object:", error);
     }
    return NextResponse.json(
      { error: "Failed to search availability", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
