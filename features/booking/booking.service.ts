import "server-only";

import { prisma } from "@/lib/prisma";
import { BookingStatus, Prisma } from "@/prisma/generated/prisma";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import { createHoldSchema, cancelBookingSchema } from "@/features/booking/booking.schema";
import { createBookingSafely } from "@/lib/createBookingSafely";
import { updateBookingSafely, type UpdateBookingDataInput } from "@/lib/updateBookingSafely";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
import { bookingListInclude, bookingForDateSelect, publicBookingInclude, bookingEditInclude } from "./booking.select";
import { stripe } from "@/lib/stripe-server";
import { supabaseAdmin } from "@/lib/supabaseClient";

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

export async function cancelBooking(
  businessId: string,
  bookingId: string,
  raw: unknown
) {
  const { fullRefund, reason } = cancelBookingSchema.parse(raw);

  // Get the booking with payment information
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId },
    include: {
      payments: true,
      customer: true,
    },
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }

  if (booking.status === "CANCELLED") {
    throw Object.assign(new Error("Booking is already cancelled"), { status: 400 });
  }

  // Check if the booking is within 24 hours
  const now = new Date();
  const eventDate = new Date(booking.eventDate);
  const isWithin24Hours = eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000;

  // Find the payment to refund
  const paymentToRefund = booking.payments.find(
    (p) =>
      (p.status === "COMPLETED" && p.type === "FULL_PAYMENT") ||
      (p.status === "COMPLETED" && p.type === "DEPOSIT")
  );

  // No payment to refund, just mark as cancelled
  if (!paymentToRefund || !paymentToRefund.stripePaymentId) {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED",
      },
    });

    if (supabaseAdmin) {
      await supabaseAdmin
        .from("Booking")
        .update({
          status: "CANCELLED",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", bookingId);
    }

    return { data: updatedBooking, refundAmount: 0, refundPercentage: 0, isWithin24Hours };
  }

  // Calculate refund amount
  let refundAmount = Number(paymentToRefund.amount);
  let refundPercentage = 100;

  if (isWithin24Hours && !fullRefund) {
    refundPercentage = 90; // 90% refund (10% cancellation fee)
    refundAmount = refundAmount * 0.9;
  }

  // Process refund via Stripe
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { stripeAccountId: true },
  });
  if (!business?.stripeAccountId) {
    throw Object.assign(new Error("Business Stripe account not found"), { status: 400 });
  }

  const refundResult = await stripe.refunds.create(
    {
      payment_intent: paymentToRefund.stripePaymentId,
      amount: Math.round(refundAmount * 100),
      reason: "requested_by_customer",
      metadata: {
        prismaBookingId: bookingId,
        refundReason: reason || "Customer cancellation",
      },
    },
    { stripeAccount: business.stripeAccountId }
  );

  // Update original payment record
  const originalAmount = Number(paymentToRefund.amount);
  const isFullRefund = refundAmount === originalAmount;
  const newStatus = isFullRefund ? "REFUNDED" : paymentToRefund.status;
  const newAmount = isFullRefund ? -originalAmount : originalAmount - refundAmount;

  const existingMetadata =
    paymentToRefund.metadata && typeof paymentToRefund.metadata === "object"
      ? paymentToRefund.metadata
      : {};
  const refundMetadata = {
    ...existingMetadata,
    stripeRefundId: refundResult.id,
    refundReason: reason || "Customer cancellation",
    isFullRefund: isFullRefund,
    requestedFullRefundOverride: fullRefund,
    originalPaymentAmount: originalAmount,
    refundedAmount: refundAmount,
    refundPercentage: refundPercentage,
    isWithin24Hours: isWithin24Hours,
  };

  await prisma.payment.update({
    where: { id: paymentToRefund.id },
    data: {
      status: newStatus,
      amount: newAmount,
      metadata: refundMetadata,
      updatedAt: new Date(),
    },
  });

  // Delete associated booking items
  await prisma.bookingItem.deleteMany({ where: { bookingId } });

  // Update booking status
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: { payments: true, customer: true },
  });

  if (supabaseAdmin) {
    await supabaseAdmin
      .from("Booking")
      .update({ status: "CANCELLED", updatedAt: new Date().toISOString() })
      .eq("id", bookingId);
  }

  return {
    data: updatedBooking,
    refundAmount,
    refundPercentage,
    isWithin24Hours,
    stripeRefundId: refundResult?.id,
  };
}

export async function completeBooking(
  businessId: string,
  bookingId: string,
) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      businessId: businessId,
    },
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "COMPLETED",
      isCompleted: true,
    },
  });

  if (supabaseAdmin) {
    await supabaseAdmin
      .from('Booking')
      .update({
        status: 'COMPLETED',
        isCompleted: true,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', bookingId);
  }

  return updatedBooking;
}

export async function getPublicBookingDetails(
  businessId: string,
  bookingId: string,
) {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      businessId,
      OR: [
        { status: "COMPLETED" },
        { status: "CONFIRMED" },
        { status: "PENDING" },
      ],
    },
    include: publicBookingInclude,
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }

  return {
    id: booking.id,
    status: booking.status,
    eventDate: booking.eventDate,
    eventTimeZone: booking.eventTimeZone,
    startTime: booking.startTime,
    endTime: booking.endTime,
    eventAddress: booking.eventAddress,
    eventCity: booking.eventCity,
    eventState: booking.eventState,
    eventZipCode: booking.eventZipCode,
    totalAmount: booking.totalAmount,
    subtotalAmount: booking.subtotalAmount,
    taxAmount: booking.taxAmount,
    specialInstructions: booking.specialInstructions,
    customer: booking.customer
      ? {
          name: booking.customer.name,
          email: booking.customer.email,
        }
      : null,
    items: booking.inventoryItems.map((item) => ({
      id: item.id,
      name: item.inventory.name,
      description: item.inventory.description,
      image: item.inventory.primaryImage,
      quantity: item.quantity,
      price: item.price,
    })),
    business: booking.business
      ? {
          name: booking.business.name,
          email: booking.business.email,
          phone: booking.business.phone,
          address: booking.business.address,
          city: booking.business.city,
          state: booking.business.state,
          zipCode: booking.business.zipCode,
        }
      : null,
    hasSignedWaiver: booking.waivers?.some((w) => w.status === "SIGNED") ?? false,
  };
}

export async function getBookingForEdit(
  businessId: string,
  bookingId: string,
) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId },
    include: bookingEditInclude,
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }

  const hasSignedWaiver = booking.waivers.some((w) => w.status === "SIGNED");
  return {
    booking: {
      id: booking.id,
      eventDate: booking.eventDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      totalAmount: booking.totalAmount,
      subtotalAmount: booking.subtotalAmount,
      taxAmount: booking.taxAmount,
      taxRate: booking.taxRate,
      depositAmount: booking.depositAmount,
      depositPaid: booking.depositPaid,
      eventType: booking.eventType,
      participantCount: booking.participantCount,
      participantAge: booking.participantAge,
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      eventTimeZone: booking.eventTimeZone || "America/Chicago",
      specialInstructions: booking.specialInstructions,
      expiresAt: booking.expiresAt,
      isCompleted: booking.status === "COMPLETED",
    },
    customer: booking.customer
      ? {
          id: booking.customer.id,
          name: booking.customer.name,
          email: booking.customer.email,
          phone: booking.customer.phone,
        }
      : null,
    bookingItems: booking.inventoryItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      startUTC: item.startUTC || booking.startTime,
      endUTC: item.endUTC || booking.endTime,
      inventoryId: item.inventoryId,
      bookingId: item.bookingId,
      inventory: {
        id: item.inventory.id,
        name: item.inventory.name,
        description: item.inventory.description,
        primaryImage: item.inventory.primaryImage,
      },
    })),
    waivers: booking.waivers,
    hasSignedWaiver,
    inventoryItems: booking.inventoryItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      inventoryId: item.inventoryId,
      bookingId: item.bookingId,
    })),
  };
}

export async function updateBooking(
  businessId: string,
  bookingId: string,
  body: UpdateBookingDataInput
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });

  // Simple update path for confirmed bookings without items or info-only intent
  if (booking?.status === "CONFIRMED" && (!body.items || body.intent === "update_customer_info_only")) {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        eventAddress: body.eventAddress,
        eventCity: body.eventCity,
        eventState: body.eventState,
        eventZipCode: body.eventZipCode,
        participantCount: body.participantCount,
        participantAge: body.participantAge,
        specialInstructions: body.specialInstructions,
        eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
        startTime:
          body.startTime && body.eventDate ? new Date(`${body.eventDate}T${body.startTime}:00.000Z`) : undefined,
        endTime:
          body.endTime && body.eventDate ? new Date(`${body.eventDate}T${body.endTime}:00.000Z`) : undefined,
        eventTimeZone: body.eventTimeZone,
        updatedAt: new Date(),
        ...(body.customerName && body.customerEmail && body.customerPhone
          ? {
              customer: {
                update: {
                  name: body.customerName,
                  email: body.customerEmail,
                  phone: body.customerPhone,
                  updatedAt: new Date(),
                },
              },
            }
          : {}),
      },
      include: { customer: true, inventoryItems: { include: { inventory: true } } },
    });

    if (supabaseAdmin) {
      await supabaseAdmin
        .from("Booking")
        .update({ updatedAt: new Date().toISOString() })
        .eq("id", bookingId);
    }

    return updatedBooking;
  }

  // Prepare additional payment for confirmed booking when items are added
  if (booking?.status === "CONFIRMED" && body.intent === "prepare_for_payment_difference" && body.items) {
    const updatedBookingWithItems = await updateBookingSafely(bookingId, businessId, body);

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { stripeAccountId: true },
    });
    if (!business?.stripeAccountId) {
      throw Object.assign(new Error("Business Stripe account not configured"), {
        status: 400,
        code: "STRIPE_ACCOUNT_MISSING",
      });
    }

    const differenceAmount = (body.subtotalAmount || 0) + (body.taxAmount || 0);
    const differenceAmountCents = Math.round(differenceAmount * 100);
    if (differenceAmountCents <= 0) {
      throw Object.assign(new Error("No additional payment required"), {
        status: 400,
        code: "NO_PAYMENT_NEEDED",
      });
    }

    const customer = await prisma.customer.findFirst({
      where: { email: body.customerEmail || "", businessId },
    });
    if (!customer) {
      throw Object.assign(new Error("Customer not found"), { status: 400, code: "CUSTOMER_NOT_FOUND" });
    }

    const stripeCustomerId = await findOrCreateStripeCustomer(
      customer.email,
      customer.name,
      customer.phone || "",
      body.eventCity || "",
      body.eventState || "",
      body.eventAddress || "",
      body.eventZipCode || "",
      businessId,
      business.stripeAccountId
    );

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: differenceAmountCents,
        currency: "usd",
        customer: stripeCustomerId,
        receipt_email: customer.email,
        metadata: {
          prismaBookingId: bookingId,
          prismaBusinessId: businessId,
          prismaCustomerId: customer.id,
          paymentType: "booking_addition",
          addedItemsAmount: (body.subtotalAmount || 0).toString(),
          taxAmount: (body.taxAmount || 0).toString(),
          totalDifferenceAmount: differenceAmount.toString(),
          customerName: customer.name,
          customerEmail: customer.email,
        },
      },
      { stripeAccount: business.stripeAccountId }
    );

    if (!paymentIntent.client_secret) {
      throw Object.assign(new Error("Failed to create payment intent"), { status: 500, code: "PAYMENT_INTENT_FAILED" });
    }

    return {
      ...updatedBookingWithItems,
      clientSecret: paymentIntent.client_secret,
      differenceAmount,
      paymentIntentId: paymentIntent.id,
    };
  }

  // Default: use safe updater
  const updatedBooking = await updateBookingSafely(bookingId, businessId, body);
  if (supabaseAdmin) {
    await supabaseAdmin
      .from("Booking")
      .update({ status: updatedBooking.status, updatedAt: new Date().toISOString() })
      .eq("id", updatedBooking.id);
  }
  return updatedBooking;
}

export async function deleteBookingSafely(
  businessId: string,
  bookingId: string
) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId },
    include: { payments: true, waivers: true, invoices: true, quotes: true, inventoryItems: true },
  });

  if (!booking) {
    throw Object.assign(new Error("Booking not found"), { status: 404 });
  }
  if (booking.status !== "PENDING" && booking.status !== "HOLD") {
    throw Object.assign(new Error("Only PENDING or HOLD bookings can be deleted"), { status: 400 });
  }
  const hasCompletedPayments = booking.payments?.some((p) => p.status === "COMPLETED") || false;
  if (hasCompletedPayments) {
    throw Object.assign(new Error("Cannot delete booking with completed payments"), { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    if (booking.invoices && booking.invoices.length > 0) {
      await tx.invoice.deleteMany({ where: { bookingId } });
    }
    if (booking.quotes && booking.quotes.length > 0) {
      await tx.quote.deleteMany({ where: { bookingId } });
    }
    await tx.payment.deleteMany({ where: { bookingId } });
    await tx.waiver.deleteMany({ where: { bookingId } });
    await tx.bookingItem.deleteMany({ where: { bookingId } });
    await tx.booking.delete({ where: { id: bookingId } });
  });

  return { message: "Booking and related records deleted successfully" };
}
