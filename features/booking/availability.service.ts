import "server-only";

import { prisma } from "@/lib/prisma";
import { localToUTC } from "@/lib/utils";
import { Prisma } from "@/prisma/generated/prisma";
import { availabilitySearchSchema } from "@/features/booking/booking.schema";

type SearchParams = {
  date: string;
  startTime: string;
  endTime: string;
  tz?: string;
  excludeBookingId?: string;
};

export async function searchAvailability(
  businessId: string,
  params: unknown
) {
  const parsed = availabilitySearchSchema.parse(params) as SearchParams;
  const { date, startTime, endTime, tz, excludeBookingId } = parsed;

  const businessData = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      timeZone: true,
      minNoticeHours: true,
      maxNoticeHours: true,
      bufferBeforeHours: true,
      bufferAfterHours: true,
    },
  });

  if (!businessData) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }

  const finalTz = tz ?? businessData.timeZone;

  const requestedStartUTC = localToUTC(date, startTime, finalTz);
  const requestedEndUTC = localToUTC(date, endTime, finalTz);
  const now = new Date();

  if (isNaN(requestedStartUTC.getTime()) || isNaN(requestedEndUTC.getTime())) {
    throw Object.assign(
      new Error("Invalid date processing for UTC conversion"),
      { status: 500 }
    );
  }
  if (requestedStartUTC >= requestedEndUTC) {
    throw Object.assign(new Error("End time must be after start time"), {
      status: 400,
    });
  }

  // Validate notice window requirements
  const noticeDiffMs = requestedStartUTC.getTime() - now.getTime();
  const minNoticeMs = businessData.minNoticeHours * 60 * 60 * 1000;
  const maxNoticeMs = businessData.maxNoticeHours * 60 * 60 * 1000;

  if (noticeDiffMs < minNoticeMs) {
    throw Object.assign(
      new Error(
        `You must book at least ${businessData.minNoticeHours} hours in advance.`
      ),
      { status: 400 }
    );
  }
  if (noticeDiffMs > maxNoticeMs) {
    const maxDays = Math.floor(businessData.maxNoticeHours / 24);
    throw Object.assign(
      new Error(`You can't book more than ${maxDays} days out.`),
      { status: 400 }
    );
  }

  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  const allInventory = await prisma.inventory.findMany({
    where: { businessId, status: "AVAILABLE" },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      price: true,
      dimensions: true,
      capacity: true,
      ageRange: true,
      primaryImage: true,
      quantity: true,
      stripeProductId: true,
      version: true,
    },
  });

  if (allInventory.length === 0) {
    return { availableInventory: [] as typeof allInventory };
  }

  const allInventoryIds = allInventory.map((item) => item.id);
  if (allInventoryIds.length === 0) {
    return { availableInventory: [] as typeof allInventory };
  }

  // Compute the buffer (in milliseconds)
  const bufferBeforeMs = businessData.bufferBeforeHours * 60 * 60 * 1000;
  const bufferAfterMs = businessData.bufferAfterHours * 60 * 60 * 1000;

  // Expand the requested window by the buffer on the outside edges
  const effectiveSearchStart = new Date(requestedStartUTC.getTime() - bufferBeforeMs);
  const effectiveSearchEnd = new Date(requestedEndUTC.getTime() + bufferAfterMs);

  const bookingWhere: Prisma.BookingWhereInput = {
    businessId: businessId,
    OR: [
      { status: "CONFIRMED" },
      {
        status: "HOLD",
        createdAt: { gt: thirtyMinutesAgo },
      },
    ],
  };

  if (excludeBookingId) {
    bookingWhere.id = { not: excludeBookingId };
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
    select: {
      inventoryId: true,
      quantity: true,
    },
  });

  // Aggregate booked quantities by inventoryId
  const bookedQuantitiesMap = new Map<string, number>();
  bookedItems.forEach((item) => {
    const currentBooked = bookedQuantitiesMap.get(item.inventoryId) || 0;
    bookedQuantitiesMap.set(item.inventoryId, currentBooked + item.quantity);
  });

  const availableInventory = (allInventory
    .map((item) => {
      const booked = bookedQuantitiesMap.get(item.id) || 0;
      const remaining = item.quantity - booked;
      if (remaining > 0) {
        return { ...item, quantity: remaining };
      }
      return null;
    })
    .filter((item) => item !== null)) as typeof allInventory;

  return { availableInventory };
}


