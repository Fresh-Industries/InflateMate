import "server-only";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
import {
  calculateStripeTax,
  convertBookingItemsToTaxLineItems,
  applyDiscountToLineItems,
} from "@/lib/stripe/tax-utils";
import { finalizeBookingSchema, calculateTaxSchema } from "@/features/booking/booking.schema";
import { BookingStatus, Prisma, DiscountType } from "@/prisma/generated/prisma";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import Stripe from "stripe";
import { sendSignatureEmail } from "@/lib/sendEmail";

type FinalizeInput = unknown;

export async function finalizeBookingAndCreatePI(
  businessId: string,
  raw: FinalizeInput
) {
  const bookingData = finalizeBookingSchema.parse(raw);

  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingData.holdId },
    include: {
      inventoryItems: true,
      business: { select: { stripeAccountId: true, timeZone: true } },
    },
  });

  if (!existingBooking) {
    throw Object.assign(new Error("Booking not found."), { status: 404 });
  }
  if (existingBooking.businessId !== businessId) {
    throw Object.assign(new Error("Booking not found for this business."), {
      status: 404,
    });
  }

  const validStatuses = ["HOLD", "PENDING"] as const;
  if (!validStatuses.includes(existingBooking.status as (typeof validStatuses)[number])) {
    throw Object.assign(
      new Error(
        `Booking cannot be processed for payment because it has status '${existingBooking.status}'.`
      ),
      { status: 409 }
    );
  }

  // expiration
  const now = new Date();
  let isExpired = false;
  if (existingBooking.expiresAt) {
    isExpired = now > new Date(existingBooking.expiresAt);
  } else {
    isExpired = true;
  }
  if (isExpired) {
    await prisma.booking.update({
      where: { id: existingBooking.id },
      data: { status: "EXPIRED", isCancelled: true, updatedAt: new Date() },
    });
    const err = new Error("The booking has expired. Please create a new booking.") as Error & {
      status?: number;
      isExpired?: boolean;
    };
    err.status = 409;
    err.isExpired = true;
    throw err;
  }

  const stripeConnectedAccountId = existingBooking.business?.stripeAccountId;
  if (!stripeConnectedAccountId) {
    throw Object.assign(new Error("Business Stripe account not set up"), {
      status: 500,
    });
  }

  // Upsert customer in DB
  const customer = await prisma.customer.upsert({
    where: {
      email_businessId: {
        email: bookingData.customerEmail,
        businessId,
      },
    },
    update: {
      name: bookingData.customerName,
      phone: bookingData.customerPhone,
      address: bookingData.eventAddress,
      city: bookingData.eventCity,
      state: bookingData.eventState,
      zipCode: bookingData.eventZipCode,
      updatedAt: new Date(),
    },
    create: {
      name: bookingData.customerName,
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone,
      address: bookingData.eventAddress,
      city: bookingData.eventCity,
      state: bookingData.eventState,
      zipCode: bookingData.eventZipCode,
      businessId,
      bookingCount: 0,
      totalSpent: 0,
      lastBooking: null,
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Time conversion using payload timezone or business timezone
  const timezone = bookingData.eventTimeZone || existingBooking.business?.timeZone || "America/Chicago";
  const eventDateUTC = dateOnlyUTC(bookingData.eventDate);
  const startUTC = localToUTC(bookingData.eventDate, bookingData.startTime, timezone);
  const endUTC = localToUTC(bookingData.eventDate, bookingData.endTime, timezone);

  // Coupon lookup (if provided)
  let appliedCoupon: { discountAmount: number; discountType: DiscountType; stripeCouponId?: string | null; id: string; code?: string } | null = null;
  let appliedCouponId: string | null = null;
  if (bookingData.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code_businessId: { code: bookingData.couponCode, businessId } },
    });
    const now2 = new Date();
    const invalid =
      !coupon ||
      !coupon.isActive ||
      (coupon.startDate && now2 < coupon.startDate) ||
      (coupon.endDate && now2 > coupon.endDate) ||
      (typeof coupon.maxUses === "number" && coupon.usedCount >= coupon.maxUses);
    if (invalid) {
      throw Object.assign(new Error("The provided coupon code is invalid or cannot be applied."), {
        status: 400,
      });
    }
    if (!coupon.stripeCouponId) {
      throw Object.assign(new Error("Coupon is not properly configured for Stripe."), {
        status: 400,
      });
    }
    appliedCoupon = coupon;
    appliedCouponId = coupon.id;
  }

  // Items subtotal (from existing booking)
  // const itemsSubtotal = existingBooking.inventoryItems.reduce(
  //   (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
  //   0
  // );

  // Convert to tax line items
  let taxLineItems = convertBookingItemsToTaxLineItems(
    existingBooking.inventoryItems.map((item) => ({
      inventoryId: item.inventoryId,
      quantity: item.quantity || 1,
      price: item.price || 0,
    }))
  );

  // Apply coupon to tax line items
  if (appliedCoupon) {
    taxLineItems = applyDiscountToLineItems(
      taxLineItems,
      appliedCoupon.discountAmount,
      appliedCoupon.discountType
    );
  }

  // Stripe Tax calculation with fallback
  let stripeTaxResult:
    | {
        calculation: Stripe.Tax.Calculation | null;
        taxAmountCents: number;
        totalAmountCents: number;
        subtotalAmountCents: number;
        taxRate: number;
      }
    | undefined;
  // keep interface similar to original code but not used downstream

  try {
    stripeTaxResult = await calculateStripeTax(
      taxLineItems,
      {
        address: {
          line1: bookingData.eventAddress,
          city: bookingData.eventCity,
          state: bookingData.eventState,
          postal_code: bookingData.eventZipCode,
          country: "US",
        },
        addressSource: "shipping",
      },
      stripeConnectedAccountId
    );
  } catch {
    const fallbackSubtotal = taxLineItems.reduce((sum, item) => sum + item.amount, 0) / 100;
    const fallbackTaxAmount = Math.round(fallbackSubtotal * (bookingData.taxRate / 100) * 100) / 100;
    const fallbackTotal = fallbackSubtotal + fallbackTaxAmount;
    stripeTaxResult = {
      calculation: null,
      taxAmountCents: Math.round(fallbackTaxAmount * 100),
      totalAmountCents: Math.round(fallbackTotal * 100),
      subtotalAmountCents: Math.round(fallbackSubtotal * 100),
      taxRate: bookingData.taxRate,
    };
  }

  if (!stripeTaxResult) {
    throw Object.assign(new Error("Failed to calculate tax"), { status: 500 });
  }

  const calculatedTotalAmountDollars = stripeTaxResult.totalAmountCents / 100;
  const calculatedTax = stripeTaxResult.taxAmountCents / 100;
  const discountedSubtotal = stripeTaxResult.subtotalAmountCents / 100;
  const calculatedAmountCents = stripeTaxResult.totalAmountCents;

  // Update booking to PENDING (if needed) and write computed totals
  try {
    await prisma.$transaction(
      async (tx) => {
        const statusUpdate =
          existingBooking.status === "HOLD" ? { status: "PENDING" as BookingStatus } : {};
        const bookingUpdateResult = await tx.booking.update({
          where: { id: existingBooking.id },
          data: {
            customerId: customer.id,
            eventDate: eventDateUTC,
            startTime: startUTC,
            endTime: endUTC,
            eventTimeZone: timezone,
            ...statusUpdate,
            totalAmount: calculatedTotalAmountDollars,
            subtotalAmount: discountedSubtotal,
            taxAmount: calculatedTax,
            taxRate: stripeTaxResult.taxRate,
            depositPaid: false,
            eventType: bookingData.eventType,
            eventAddress: bookingData.eventAddress,
            eventCity: bookingData.eventCity,
            eventState: bookingData.eventState,
            eventZipCode: bookingData.eventZipCode,
            participantCount: bookingData.participantCount,
            participantAge: bookingData.participantAge,
            specialInstructions: bookingData.specialInstructions,
            couponId: appliedCouponId,
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
          },
          include: { inventoryItems: true },
        });

        if (existingBooking.status === "HOLD" && existingBooking.inventoryItems.length > 0) {
          const itemIds = existingBooking.inventoryItems.map((item) => String(item.id));
          await tx.$executeRawUnsafe(
            `
              UPDATE "BookingItem"
              SET "bookingStatus" = 'PENDING', "updatedAt" = NOW()
              WHERE id = ANY($1::text[])
              AND "bookingStatus" = 'HOLD'
            `,
            itemIds
          );
        }

        return bookingUpdateResult;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    // Forward as 500; route will map
    throw Object.assign(new Error((error as Error).message || "Failed to update booking details."), {
      status: 500,
    });
  }

  // Create or use Stripe Customer in connected account
  const stripeCustomerId = await findOrCreateStripeCustomer(
    bookingData.customerEmail,
    bookingData.customerName,
    bookingData.customerPhone,
    bookingData.eventCity,
    bookingData.eventState,
    bookingData.eventAddress,
    bookingData.eventZipCode,
    businessId,
    stripeConnectedAccountId
  );

  const metadata: Record<string, string> = {
    prismaBookingId: existingBooking.id,
    prismaBusinessId: businessId,
    prismaCustomerId: customer.id,
    customerName: bookingData.customerName,
    customerEmail: bookingData.customerEmail,
    customerPhone: bookingData.customerPhone,
    eventDate: bookingData.eventDate,
    startTime: bookingData.startTime,
    endTime: bookingData.endTime,
    eventAddress: bookingData.eventAddress,
    eventCity: bookingData.eventCity,
    eventState: bookingData.eventState,
    eventZipCode: bookingData.eventZipCode,
    eventTimeZone: timezone,
    eventType: bookingData.eventType || "OTHER",
    participantCount: bookingData.participantCount.toString(),
    participantAge: bookingData.participantAge?.toString() || "",
    subtotalAmount: discountedSubtotal.toString(),
    taxAmount: calculatedTax.toString(),
    taxRate: stripeTaxResult.taxRate.toString(),
    totalAmount: calculatedTotalAmountDollars.toString(),
    selectedItems: JSON.stringify(
      existingBooking.inventoryItems.map((item) => ({
        id: item.inventoryId,
        quantity: item.quantity,
        price: item.price,
      }))
    ),
    ...(appliedCouponId ? { couponId: appliedCouponId } : {}),
    ...(bookingData.couponCode ? { couponCode: bookingData.couponCode } : {}),
    ...(appliedCoupon?.stripeCouponId ? { stripeCouponId: appliedCoupon.stripeCouponId } : {}),
    ...(bookingData.specialInstructions
      ? { specialInstructions: bookingData.specialInstructions }
      : {}),
    bookingFlow: existingBooking.status === "HOLD" ? "hold_to_payment" : "pending_to_payment",
  };

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: calculatedAmountCents,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        ...metadata,
        ...(stripeTaxResult.calculation?.id
          ? { stripeTaxCalculationId: stripeTaxResult.calculation.id, taxCalculationMethod: "stripe_tax_api" }
          : { taxCalculationMethod: "fallback_manual" }),
      },
      customer: stripeCustomerId,
    },
    { stripeAccount: stripeConnectedAccountId }
  );

  if (!paymentIntent.client_secret) {
    throw Object.assign(new Error("Failed to initialize payment with Stripe."), { status: 500 });
  }

  return {
    success: true,
    clientSecret: paymentIntent.client_secret,
    bookingId: existingBooking.id,
  };
}



export async function calculateTaxQuote(
  businessId: string,
  raw: unknown
) {
  if (!businessId) {
    throw Object.assign(new Error("Business ID is required"), { status: 400 });
  }

  const validatedData = calculateTaxSchema.parse(raw);

  // If no address, return 0 tax with computed subtotal
  if (!validatedData.customerAddress) {
    const subtotalCents = validatedData.selectedItems.reduce(
      (sum, item) => sum + Math.round(item.price * item.quantity * 100),
      0
    );
    return {
      success: true,
      subtotalCents,
      taxCents: 0,
      totalCents: subtotalCents,
      taxRate: 0,
    };
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { stripeAccountId: true },
  });

  if (!business?.stripeAccountId) {
    const subtotalCents = validatedData.selectedItems.reduce(
      (sum, item) => sum + Math.round(item.price * item.quantity * 100),
      0
    );
    return {
      success: true,
      subtotalCents,
      taxCents: 0,
      totalCents: subtotalCents,
      taxRate: 0,
      error: "Stripe account not connected for tax calculation.",
    };
  }

  let appliedCoupon: { discountAmount: number; discountType: DiscountType } | null = null;
  if (validatedData.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code_businessId: { code: validatedData.couponCode, businessId } },
    });
    const now = new Date();
    if (
      coupon &&
      coupon.isActive &&
      (!coupon.startDate || now >= coupon.startDate) &&
      (!coupon.endDate || now <= coupon.endDate) &&
      (typeof coupon.maxUses !== "number" || coupon.usedCount < coupon.maxUses)
    ) {
      appliedCoupon = coupon;
    }
  }

  let taxLineItems = convertBookingItemsToTaxLineItems(validatedData.selectedItems);
  if (appliedCoupon) {
    taxLineItems = applyDiscountToLineItems(
      taxLineItems,
      appliedCoupon.discountAmount,
      appliedCoupon.discountType as DiscountType
    );
  }

  const stripeTaxResult = await calculateStripeTax(
    taxLineItems,
    {
      address: {
        line1: validatedData.customerAddress.line1,
        city: validatedData.customerAddress.city,
        state: validatedData.customerAddress.state,
        postal_code: validatedData.customerAddress.postalCode,
        country: validatedData.customerAddress.country,
      },
      addressSource: "shipping",
    },
    business.stripeAccountId
  );

  return {
    success: true,
    subtotalCents: stripeTaxResult.subtotalAmountCents,
    taxCents: stripeTaxResult.taxAmountCents,
    totalCents: stripeTaxResult.totalAmountCents,
    taxRate: stripeTaxResult.taxRate,
  };
}

export async function sendInvoiceForBooking(
  businessId: string,
  bookingId: string
) {
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business?.stripeAccountId) {
    throw Object.assign(new Error("Stripe not connected"), { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      currentQuote: true,
      inventoryItems: { include: { inventory: true } },
      coupon: true,
    },
  });
  if (!booking || !booking.customer) {
    throw Object.assign(new Error("Booking/customer not found"), { status: 404 });
  }

  const items = booking.inventoryItems.map((it) => ({
    description: it.inventory.name,
    unitAmount: it.price || 0,
    qty: it.quantity || 1,
    stripeProductId: it.inventory.stripeProductId || null,
    stripePriceId: (it.inventory as unknown as { stripePriceId?: string | null }).stripePriceId || null,
  }));

  let appliedCoupon: { code?: string | null; stripeCouponId?: string | null } | null = null;
  if (booking.coupon) {
    appliedCoupon = booking.coupon;
  }

  const customerStripe = await prisma.customerStripeAccount.findFirst({
    where: { customerId: booking.customer.id, businessId },
  });
  if (!customerStripe?.stripeCustomerId) {
    throw Object.assign(new Error("Stripe customer missing"), { status: 400 });
  }

  const stripeAccount = business.stripeAccountId;

  await stripe.customers.update(
    customerStripe.stripeCustomerId,
    {
      email: booking.customer.email || undefined,
      address: {
        line1: booking.eventAddress || undefined,
        city: booking.eventCity || undefined,
        state: booking.eventState || undefined,
        postal_code: booking.eventZipCode || undefined,
        country: "US",
      },
    },
    { stripeAccount }
  );

  const invoiceParams: Stripe.InvoiceCreateParams = {
    customer: customerStripe.stripeCustomerId,
    collection_method: "send_invoice",
    days_until_due: 3,
    automatic_tax: { enabled: true },
    metadata: {
      prismaBusinessId: businessId,
      prismaBookingId: bookingId,
      prismaCustomerId: booking.customer.id,
      prismaSource: "dashboard_send_invoice",
      couponCode: appliedCoupon?.code || "",
      stripeCouponId: appliedCoupon?.stripeCouponId || "",
    },
  };

  if (appliedCoupon?.stripeCouponId) {
    invoiceParams.discounts = [
      {
        coupon: appliedCoupon.stripeCouponId,
      },
    ];
  }

  const inv = await stripe.invoices.create(invoiceParams, { stripeAccount });

  for (const it of items) {
    const unitAmount = it.unitAmount || 0;
    const quantity = it.qty || 1;
    if (quantity <= 0 || unitAmount <= 0) {
      continue;
    }

    if (it.stripeProductId) {
      await stripe.invoiceItems.create(
        {
          customer: customerStripe.stripeCustomerId,
          invoice: inv.id,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(unitAmount * 100),
            product: it.stripeProductId,
            tax_behavior: "exclusive",
          },
          quantity,
          description: it.description,
        },
        { stripeAccount }
      );
    } else if (it.stripePriceId) {
      const priceObj = await stripe.prices.retrieve(it.stripePriceId, { stripeAccount });
      const productId = (priceObj.product as unknown as string) || undefined;
      if (productId) {
        await stripe.invoiceItems.create(
          {
            customer: customerStripe.stripeCustomerId,
            invoice: inv.id,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(unitAmount * 100),
              product: productId,
              tax_behavior: "exclusive",
            },
            quantity,
            description: it.description,
          },
          { stripeAccount }
        );
      } else {
        await stripe.invoiceItems.create(
          {
            customer: customerStripe.stripeCustomerId,
            invoice: inv.id,
            currency: "usd",
            amount: Math.round(unitAmount * quantity * 100),
            description: it.description,
          },
          { stripeAccount }
        );
      }
    } else {
      await stripe.invoiceItems.create(
        {
          customer: customerStripe.stripeCustomerId,
          invoice: inv.id,
          currency: "usd",
          amount: Math.round(unitAmount * quantity * 100),
          description: it.description,
        },
        { stripeAccount }
      );
    }
  }

  const finalized = await stripe.invoices.finalizeInvoice(inv.id!, { auto_advance: true }, { stripeAccount });
  await stripe.invoices.sendInvoice(finalized.id!, {}, { stripeAccount });

  const refreshed = await stripe.invoices.retrieve(finalized.id!, { stripeAccount });

  if (!(refreshed.status_transitions as { sent_at?: number })?.sent_at) {
    const to = booking.customer.email;
    const hosted = refreshed.hosted_invoice_url;
    if (to && hosted) {
      await sendSignatureEmail({
        from: `${business.name} <invoices@mail.inflatemate.co>`,
        to,
        subject: `Your invoice from ${business.name}`,
        html: `
            <p>Hi ${booking.customer.name || ''},</p>
            <p>Your invoice is ready. Please pay here:</p>
            ${appliedCoupon && refreshed.total_discount_amounts && refreshed.total_discount_amounts.length > 0 ? 
              `<p><strong>Discount Applied:</strong> ${appliedCoupon.code} (-$${(refreshed.total_discount_amounts[0].amount / 100).toFixed(2)})</p>` : ''}
            <p><a href="${hosted}">View & Pay Invoice</a></p>
            <p>Due: ${refreshed.due_date ? new Date(refreshed.due_date * 1000).toLocaleString() : '—'}</p>
          `,
      });
    }
  }

  const invoiceRow = await prisma.invoice.upsert({
    where: { stripeInvoiceId: finalized.id },
    update: {
      status: "OPEN",
      amountDue: (finalized.amount_due ?? 0) / 100,
      amountRemaining: (finalized.amount_remaining ?? 0) / 100,
      amountPaid: (finalized.amount_paid ?? 0) / 100,
      currency: (finalized.currency ?? "usd").toUpperCase(),
      hostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
      invoicePdfUrl: finalized.invoice_pdf ?? null,
      dueAt: finalized.due_date ? new Date(finalized.due_date * 1000) : null,
      metadata: finalized.metadata as Record<string, string>,
    },
    create: {
      stripeInvoiceId: finalized.id,
      status: "OPEN",
      amountDue: (finalized.amount_due ?? 0) / 100,
      amountRemaining: (finalized.amount_remaining ?? 0) / 100,
      amountPaid: (finalized.amount_paid ?? 0) / 100,
      currency: (finalized.currency ?? "usd").toUpperCase(),
      hostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
      invoicePdfUrl: finalized.invoice_pdf ?? null,
      dueAt: finalized.due_date ? new Date(finalized.due_date * 1000) : null,
      businessId,
      customerId: booking.customer.id,
      bookingId: booking.id,
      metadata: finalized.metadata as Record<string, string>,
    },
  });

  if (booking.currentQuote?.id) {
    try {
      await prisma.quote.update({
        where: { id: booking.currentQuote.id },
        data: { status: "ACCEPTED" },
      });
    } catch {
      // non-fatal
    }
  }

  return {
    message: "Invoice created and sent",
    stripeInvoiceId: invoiceRow.stripeInvoiceId,
    hostedInvoiceUrl: invoiceRow.hostedInvoiceUrl,
    dueAt: invoiceRow.dueAt,
  };
}
