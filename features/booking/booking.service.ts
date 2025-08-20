import "server-only";

import { prisma } from "@/lib/prisma";
import { BookingStatus, Prisma } from "@/prisma/generated/prisma";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import { createHoldSchema } from "@/features/booking/booking.schema";
import { createBookingSafely } from "@/lib/createBookingSafely";
import { bookingListInclude, bookingForDateSelect } from "./booking.select";

type CreateHoldInput = unknown;

export async function createHold(
  businessId: string,
  raw: CreateHoldInput
) {
  const holdData = createHoldSchema.parse(raw);

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      timeZone: true,
      minNoticeHours: true,
      maxNoticeHours: true,
      minBookingAmount: true,
      bufferBeforeHours: true,
      bufferAfterHours: true,
    },
  });

  if (!business) {
    throw Object.assign(new Error("Business not found"), { status: 404 });
  }

  // Time conversion
  const timezone = holdData.eventTimeZone || business.timeZone;
  const eventDateUTC = dateOnlyUTC(holdData.eventDate);
  const startUTC = localToUTC(holdData.eventDate, holdData.startTime, timezone);
  const endUTC = localToUTC(holdData.eventDate, holdData.endTime, timezone);

  // Validation: notice window
  const nowUTC = new Date();
  const noticeDiffMs = startUTC.getTime() - nowUTC.getTime();
  const minNoticeMs = business.minNoticeHours * 60 * 60 * 1000;
  const maxNoticeMs = business.maxNoticeHours * 60 * 60 * 1000;
  if (noticeDiffMs < minNoticeMs) {
    throw Object.assign(
      new Error(`Bookings must be made at least ${business.minNoticeHours} hours ahead.`),
      { status: 400 }
    );
  }
  if (noticeDiffMs > maxNoticeMs) {
    throw Object.assign(
      new Error(
        `Bookings cannot be made more than ${business.maxNoticeHours / 24} days ahead.`
      ),
      { status: 400 }
    );
  }

  // Validation: minimum booking amount
  const requestedSubtotal = holdData.selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  if (requestedSubtotal < business.minBookingAmount) {
    throw Object.assign(
      new Error(
        `Minimum booking total $${business.minBookingAmount.toFixed(
          2
        )} required. Your total: $${requestedSubtotal.toFixed(2)}.`
      ),
      { status: 400 }
    );
  }

  // Conflict check with buffers
  const bufferBeforeMs = business.bufferBeforeHours * 60 * 60 * 1000;
  const bufferAfterMs = business.bufferAfterHours * 60 * 60 * 1000;
  const desiredStartWithBuffer = new Date(startUTC.getTime() - bufferBeforeMs);
  const desiredEndWithBuffer = new Date(endUTC.getTime() + bufferAfterMs);

  const requestedInventoryIds = holdData.selectedItems.map((item) => item.id);
  const inventoryConflicts = await prisma.bookingItem.findFirst({
    where: {
      inventoryId: { in: requestedInventoryIds },
      booking: {
        businessId,
        status: { in: ["HOLD", "PENDING", "CONFIRMED"] },
      },
      startUTC: { lte: desiredEndWithBuffer },
      endUTC: { gte: desiredStartWithBuffer },
    },
    include: {
      inventory: { select: { name: true } },
      booking: { select: { id: true, eventDate: true } },
    },
  });

  if (inventoryConflicts) {
    const message = `Item "${inventoryConflicts.inventory.name}" is already booked for this time slot (including buffer time).`;
    const err = new Error(message);
    // Mark as conflict for route mapping
    throw Object.assign(err, { status: 409, code: "CONFLICT" });
  }

  // Prepare booking creation payloads
  const bookingCreationData: Omit<
    Prisma.BookingCreateInput,
    "inventoryItems"
  > = {
    eventDate: eventDateUTC,
    startTime: startUTC,
    endTime: endUTC,
    eventTimeZone: timezone,
    status: "HOLD" as BookingStatus,
    totalAmount: 0,
    subtotalAmount: 0,
    taxAmount: 0,
    taxRate: 0,
    depositPaid: false,
    eventType: holdData.eventType || "OTHER",
    eventAddress: holdData.eventAddress || "",
    eventCity: holdData.eventCity || "",
    eventState: holdData.eventState || "",
    eventZipCode: holdData.eventZipCode || "",
    participantCount: holdData.participantCount,
    participantAge: holdData.participantAge,
    specialInstructions: holdData.specialInstructions,
    business: { connect: { id: businessId } },
    coupon: undefined,
  };

  const itemCreationData = holdData.selectedItems.map((item) => ({
    quantity: item.quantity,
    price: item.price || 0,
    startUTC: startUTC,
    endUTC: endUTC,
    status: "HOLD",
    inventoryId: item.id,
  }));

  // Create booking and items
  try {
    const booking = await createBookingSafely(bookingCreationData, itemCreationData);
    if (!booking) {
      throw Object.assign(new Error("Failed to create booking record for hold"), {
        status: 500,
      });
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    return {
      success: true,
      holdId: booking.id,
      expiresAt: expiresAt.toISOString(),
    };
  } catch (error) {
    // Forward conflict errors from createBookingSafely
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as { name?: string }).name === "BookingConflictError"
    ) {
      throw Object.assign(
        new Error(
          "The selected item(s) are no longer available for the chosen time slot. Please check availability again."
        ),
        { status: 409, code: "CONFLICT" }
      );
    }
    throw error;
  }
}



export async function listBookings(businessId: string) {
  if (!businessId) {
    throw Object.assign(new Error("Business ID is required"), { status: 400 });
  }

  const bookings = await prisma.booking.findMany({
    where: { businessId },
    include: bookingListInclude,
    orderBy: { eventDate: "asc" },
  });

  // mirror previous response shape: add hasSignedWaiver flag
  return bookings.map((booking) => ({
    ...booking,
    hasSignedWaiver: booking.waivers.some((w) => w.status === "SIGNED"),
    bounceHouse: undefined,
    bounceHouseId: undefined,
  }));
}

export async function listBookingsForDate(businessId: string, dateParam: string | null) {
  if (!dateParam) {
    throw Object.assign(new Error("Date parameter is required"), { status: 400 });
  }
  if (!businessId) {
    throw Object.assign(new Error("Business ID is required"), { status: 400 });
  }

  const targetDate = new Date(dateParam);
  if (isNaN(targetDate.getTime())) {
    throw Object.assign(new Error("Invalid date parameter"), { status: 400 });
  }

  // Optional: could format for logging: format(targetDate, "yyyy-MM-dd");

  const bookings = await prisma.booking.findMany({
    where: {
      businessId,
      eventDate: targetDate,
      status: { in: ["CONFIRMED", "PENDING", "HOLD"] },
    },
    select: bookingForDateSelect,
    orderBy: { startTime: "asc" },
  });

  return bookings.map((booking) => ({
    id: booking.id,
    startTime: booking.startTime.toISOString(),
    endTime: booking.endTime.toISOString(),
    status: booking.status,
  }));
}
