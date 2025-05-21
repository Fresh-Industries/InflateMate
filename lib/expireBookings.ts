/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/expireBookings.ts
import { prisma } from "@/lib/prisma";
import { BookingStatus, InvoiceStatus, QuoteStatus, Prisma } from "@/prisma/generated/prisma";

// Placeholder for Stripe SDK - initialize it correctly in your project
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function expireOverdueBookings() {
  const now = new Date();
  let totalExpiredCount = 0;

  console.log(`[expireOverdueBookings] Starting job at ${now.toISOString()}`);

  try {
    const bookingsToExpire = await prisma.booking.findMany({
      where: {
        status: { in: [BookingStatus.HOLD, BookingStatus.PENDING] },
        expiresAt: { lte: now },
      },
      include: {
        invoice: { select: { id: true, stripeInvoiceId: true, status: true } },
        quote: { select: { id: true, stripeQuoteId: true, status: true } },
      },
    });

    if (bookingsToExpire.length === 0) {
      console.log("[expireOverdueBookings] No bookings found to expire at this time.");
      return 0;
    }

    console.log(`[expireOverdueBookings] Found ${bookingsToExpire.length} bookings to process for expiration.`);

    for (const booking of bookingsToExpire) {
      try {
        await prisma.$transaction(async (tx) => {
          console.log(`[expireOverdueBookings] Processing booking ID: ${booking.id}, current status: ${booking.status}, expiresAt: ${booking.expiresAt}`);

          if (booking.invoice && booking.invoice.stripeInvoiceId &&
              (booking.invoice.status === InvoiceStatus.OPEN || booking.invoice.status === InvoiceStatus.DRAFT)) {
            try {
              console.log(`[expireOverdueBookings] Attempting to void Stripe Invoice ID: ${booking.invoice.stripeInvoiceId} for booking ${booking.id}`);
              // await stripe.invoices.voidInvoice(booking.invoice.stripeInvoiceId); // UNCOMMENT AND USE ACTUAL STRIPE SDK
              console.log(`[expireOverdueBookings] STUB: Stripe Invoice ${booking.invoice.stripeInvoiceId} voided.`);
              await tx.invoice.update({
                where: { id: booking.invoice.id },
                data: { status: InvoiceStatus.VOID, updatedAt: new Date() },
              });
              console.log(`[expireOverdueBookings] Local Invoice ${booking.invoice.id} status updated to VOID.`);
            } catch (stripeError: any) {
              console.error(`[expireOverdueBookings] Error voiding Stripe Invoice ${booking.invoice.stripeInvoiceId} for booking ${booking.id}:`, stripeError.message);
            }
          }

          if (booking.quote && booking.quote.stripeQuoteId &&
              (booking.quote.status === QuoteStatus.OPEN || booking.quote.status === QuoteStatus.DRAFT)) {
            try {
              console.log(`[expireOverdueBookings] Attempting to cancel Stripe Quote ID: ${booking.quote.stripeQuoteId} for booking ${booking.id}`);
              // await stripe.quotes.cancel(booking.quote.stripeQuoteId); // UNCOMMENT AND USE ACTUAL STRIPE SDK
              console.log(`[expireOverdueBookings] STUB: Stripe Quote ${booking.quote.stripeQuoteId} canceled.`);
              await tx.quote.update({
                where: { id: booking.quote.id },
                data: { status: QuoteStatus.CANCELED, updatedAt: new Date() },
              });
              console.log(`[expireOverdueBookings] Local Quote ${booking.quote.id} status updated to CANCELED.`);
            } catch (stripeError: any)
            {
              console.error(`[expireOverdueBookings] Error canceling Stripe Quote ${booking.quote.stripeQuoteId} for booking ${booking.id}:`, stripeError.message);
            }
          }

          await tx.booking.update({
            where: { id: booking.id },
            data: {
              status: BookingStatus.EXPIRED,
              isCancelled: true, 
              updatedAt: new Date(),
            },
          });
          console.log(`[expireOverdueBookings] Booking ${booking.id} status updated to EXPIRED.`);

          const relevantItemStatuses = ['HOLD', 'PENDING']; 
          await tx.$executeRaw`
            UPDATE "BookingItem"
            SET "bookingStatus" = 'EXPIRED', "updatedAt" = NOW()
            WHERE "bookingId" = ${booking.id}
            AND "bookingStatus" IN (${Prisma.join(relevantItemStatuses.map(s => Prisma.sql`${s}`))}::text[]);
          `;
          console.log(`[expireOverdueBookings] BookingItems for booking ${booking.id} updated to EXPIRED status.`);

          totalExpiredCount++;
        }, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable, 
        });
      } catch (error: any) {
        console.error(`[expireOverdueBookings] Failed to process expiration for booking ID: ${booking.id}. Error: ${error.message}`, error);
      }
    }

    console.log(`[expireOverdueBookings] Job finished. Total bookings expired: ${totalExpiredCount}`);
    return totalExpiredCount;

  } catch (error: any) {
    console.error("[expireOverdueBookings] Critical error during batch fetching or overall job:", error);
    throw error; 
  }
} 