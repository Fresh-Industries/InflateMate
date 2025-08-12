// app/api/businesses/[businessId]/quotes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is initialized here
import { stripe } from "@/lib/stripe-server"; // Make sure stripe client is initialized
import { z } from "zod";
import Stripe from "stripe";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
import { QuoteStatus, BookingStatus } from "@/prisma/generated/prisma";
import { uploadStreamToUploadThing } from '@/lib/uploadthing-server'
import { sendSignatureEmail } from "@/lib/sendEmail";
import { dateOnlyUTC, localToUTC } from '@/lib/utils';

// Define a schema for validation for the Quote request body
const quoteSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(1, "Customer phone is required"),
  selectedItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    stripeProductId: z.string(),
    stripePriceId: z.string().optional(),
  })).min(1, "At least one item must be selected"),
  totalAmount: z.number().positive("Total amount must be positive"),
  subtotalAmount: z.number().nonnegative(),
  taxAmount: z.number().nonnegative(),
  taxRate: z.number().nonnegative(),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  eventType: z.string().optional(),
  eventAddress: z.string().min(1, "Event address is required"),
  eventCity: z.string().min(1, "Event city is required"),
  eventState: z.string().min(1, "Event state is required"),
  eventZipCode: z.string().min(1, "Event zip code is required"),
  participantCount: z.number().min(1),
  participantAge: z.string().optional(),
  specialInstructions: z.string().optional(),
  holdId: z.string().optional(),
  bookingId: z.string().optional(),
  eventTimeZone: z.string().optional(),
}).refine(data => data.holdId || data.bookingId, {
  message: "Either holdId or bookingId must be provided",
  path: ["holdId", "bookingId"],
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  if (!businessId) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Validate request body
    const validation = quoteSchema.safeParse(body);
    if (!validation.success) {
      console.error("Quote Validation Error:", validation.error.errors);
      return NextResponse.json({ error: "Invalid input data", details: validation.error.errors }, { status: 400 });
    }

    const {
      customerName,
      customerEmail,
      customerPhone,
      selectedItems,
      totalAmount,
      subtotalAmount,
      taxAmount,
      taxRate,
      eventDate,
      startTime,
      endTime,
      eventType,
      eventAddress,
      eventCity,
      eventState,
      eventZipCode,
      participantCount,
      participantAge,
      specialInstructions,
      holdId,
      bookingId,
      eventTimeZone
    } = validation.data;

    // --- Start: Database and Stripe Operations ---
    try {
      // 1. Find the business and ensure Stripe is connected
      const business = await prisma.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        console.warn(`Business not found for ID: ${businessId}`);
        return NextResponse.json({ error: "Business not found" }, { status: 404 });
      }
      if (!business.stripeAccountId) {
        console.warn(`Stripe not connected for business ID: ${businessId}`);
        return NextResponse.json({ error: "Stripe is not connected for this business." }, { status: 400 });
      }
      const stripeConnectedAccountId = business.stripeAccountId;

      // Check for existing booking if bookingId is provided
      let existingBooking = null;
      if (bookingId) {
        existingBooking = await prisma.booking.findUnique({
          where: { 
            id: bookingId,
            businessId: businessId, // Ensure it belongs to this business
          },
          include: { 
            inventoryItems: {
              include: {
                inventory: true // Include inventory details for Stripe product IDs
              }
            },
            customer: true,
            currentQuote: true // Use the new currentQuote relation
          }
        });

        if (!existingBooking) {
          console.warn(`Booking not found for ID: ${bookingId}`);
          return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Verify booking is in an appropriate status for quoting
        if (existingBooking.status !== BookingStatus.PENDING && existingBooking.status !== BookingStatus.HOLD) {
          console.warn(`Booking ${bookingId} has status ${existingBooking.status}, which is not appropriate for quoting.`);
          return NextResponse.json({ 
            error: `Booking is in status '${existingBooking.status}' and cannot be quoted.` 
          }, { status: 400 });
        }

        // Cancel existing Stripe quote if needed
        if (existingBooking.currentQuote && existingBooking.currentQuote.stripeQuoteId) {
          const activeQuoteStatuses: QuoteStatus[] = [QuoteStatus.OPEN, QuoteStatus.DRAFT];
          if (activeQuoteStatuses.includes(existingBooking.currentQuote.status)) {
            console.log(`Canceling existing Stripe Quote ${existingBooking.currentQuote.stripeQuoteId} for booking ${bookingId}`);
            try {
              await stripe.quotes.cancel(existingBooking.currentQuote.stripeQuoteId, {}, 
                { stripeAccount: stripeConnectedAccountId });
              console.log(`Existing Stripe Quote ${existingBooking.currentQuote.stripeQuoteId} canceled.`);
            } catch (err) {
              console.error(`Error canceling Stripe Quote ${existingBooking.currentQuote.stripeQuoteId}:`, err);
              // Continue anyway, as we'll create a new quote
            }
          }
        }
      }

      // 2. Find or create the Prisma customer - use existing customer from booking if available
      let customer;
      if (existingBooking && existingBooking.customer) {
        // Use customer from existing booking, but update details
        customer = await prisma.customer.update({
          where: { id: existingBooking.customer.id },
          data: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: eventAddress,
            city: eventCity,
            state: eventState,
            zipCode: eventZipCode,
          }
        });
        console.log(`Using existing customer from booking: ${customer.id} (${customer.email})`);
      } else {
        // Find or create customer as in original flow
        customer = await prisma.customer.findUnique({
          where: {
            email_businessId: {
              email: customerEmail,
              businessId: businessId,
            },
          },
        });

        if (!customer) {
          console.log(`Creating new customer: ${customerEmail} for business: ${businessId}`);
          customer = await prisma.customer.create({
            data: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone,
              address: eventAddress, // Use event address for initial customer address
              city: eventCity,
              state: eventState,
              zipCode: eventZipCode,
              businessId: businessId,
            },
          });
        } else {
          // Optional: Update customer details like name/phone/address if they might change
          console.log(`Customer ${customerEmail} found. Updating details if necessary.`);
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: {
              name: customerName,
              phone: customerPhone,
              // Decide if you want to update address here or only on booking completion
              address: eventAddress,
              city: eventCity,
              state: eventState,
              zipCode: eventZipCode,
            },
          });
        }
      }

      // 3. Get or Create Stripe Customer ID using the helper function
      // This ensures the customer exists on the connected Stripe account
      const stripeCustomerId = await findOrCreateStripeCustomer(
        customerEmail,
        customerName,
        customerPhone, // Pass phone to helper
        eventCity,
        eventState,
        eventAddress,
        eventZipCode,
        businessId,
        stripeConnectedAccountId
      );
      console.log(`Using Stripe Customer ID from helper: ${stripeCustomerId} for Quote`);

      if (!stripeCustomerId) {
        throw new Error("Missing Stripe Customer ID after calling helper for quote");
      }

      // 4a. Ensure Stripe customer is up to date with destination address for tax
      await stripe.customers.update(
        stripeCustomerId,
        {
          email: customerEmail,
          address: {
            line1: eventAddress,
            city: eventCity,
            state: eventState,
            postal_code: eventZipCode,
            country: 'US',
          },
        },
        { stripeAccount: stripeConnectedAccountId }
      );

      // 4b. Prepare line items - use items from existing booking if available
      let lineItems;
      if (existingBooking && existingBooking.inventoryItems.length > 0) {
        // Prefer price reference when available for automatic tax
        lineItems = existingBooking.inventoryItems.map(item => {
          const priceId = item.inventory.stripePriceId;
          if (priceId) {
            return {
              quantity: item.quantity,
              price: priceId,
            };
          }
          return {
            quantity: item.quantity,
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(item.price * 100),
              product: item.inventory.stripeProductId,
              // Required when automatic_tax is enabled
              tax_behavior: 'exclusive',
            },
          };
        });
        console.log(`Using ${lineItems.length} items from existing booking for quote.`);
      } else {
        // Use items from the request; prefer price id when provided
        lineItems = selectedItems.map(item => ({
          quantity: item.quantity,
          ...(item.stripePriceId
            ? { price: item.stripePriceId }
            : { price_data: { currency: 'usd', unit_amount: Math.round(item.price * 100), product: item.stripeProductId, tax_behavior: 'exclusive' } }),
        }));
      }

      // 5. Create Stripe Quote (Draft) with idempotency
      const targetBookingId = bookingId || holdId;
      const version = 1; // Start at version 1
      const idempotencyKey = `quote:${businessId}:${targetBookingId}:${version}`;
      
      console.log(`Creating Stripe quote draft for booking ID: ${targetBookingId} with idempotency key: ${idempotencyKey}`);
      
      const stripeQuoteDraft = await stripe.quotes.create({
        customer: stripeCustomerId,
        line_items: lineItems as unknown as Stripe.QuoteCreateParams.LineItem[],
        application_fee_amount: 0,
        collection_method: 'send_invoice',
        invoice_settings: {
          days_until_due: 1,
        },
        expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
        metadata: {
          prismaBookingId: targetBookingId || null,
          prismaBusinessId: businessId,
          prismaCustomerId: customer.id,
        },
        description: `Quote for event on ${eventDate}`,
        // Enable automatic tax for quotes (flows through to the generated invoice)
        automatic_tax: { enabled: true },
        // Provide default invoice shipping address used for tax destination
        default_tax_rates: undefined,
        on_behalf_of: undefined,
      }, { 
        stripeAccount: stripeConnectedAccountId,
        idempotencyKey: idempotencyKey
      });
      console.log(`Created Stripe quote draft: ${stripeQuoteDraft.id}`);

      // 6. Finalize the Quote and expect status === 'open'
      console.log(`Finalizing Stripe quote: ${stripeQuoteDraft.id}`);
      const finalized = await stripe.quotes.finalizeQuote(
        stripeQuoteDraft.id,
        {},
        { 
          stripeAccount: stripeConnectedAccountId, 
          idempotencyKey: `${idempotencyKey}:finalize`
        }
      );
      
      console.log(`Stripe quote finalized: ${finalized.id}, Status: ${finalized.status}`);

      // Validate the finalized quote status
      if (!finalized || !finalized.id) {
        console.error("Stripe Quote finalization failed or returned null/missing ID:", finalized);
        throw new Error("Failed to finalize Stripe quote");
      }
      
      if (finalized.status !== 'open') {
        console.error(`Stripe Quote finalization returned unexpected status: ${finalized.status}`, finalized);
        throw new Error(`Expected 'open' status, got ${finalized.status}`);
      }

      // 7. Download PDF and upload to UploadThing
      console.log(`Downloading PDF for quote: ${finalized.id}`);
      const pdfStream = await stripe.quotes.pdf(finalized.id, { stripeAccount: stripeConnectedAccountId });
      const pdfUrl = await uploadStreamToUploadThing(pdfStream, `Quote-${customer.name}-${targetBookingId}.pdf`);

      // 8. Prepare dates for booking update with timezone awareness
      const tz = eventTimeZone || business.timeZone || 'America/Chicago';
      const startDateTime = localToUTC(eventDate, startTime, tz);
      const endDateTime = localToUTC(eventDate, endTime, tz);

      // Pull Stripe-calculated amounts (in cents)
      const amountSubtotalCents = finalized.amount_subtotal ?? 0;
      const amountTotalCents = finalized.amount_total ?? 0;
      const amountTaxCents = finalized.total_details?.amount_tax ?? Math.max(0, amountTotalCents - amountSubtotalCents);

      // 9. Update existing Booking and Create Quote in DB Transaction
      console.log(`Starting database transaction for updating Booking ${targetBookingId} and creating Quote...`);
      const [updatedBooking, createdQuote] = await prisma.$transaction(async (tx) => {
        let booking;
        
        if (existingBooking) {
          // Update the existing booking (from bookingId flow)
          booking = await tx.booking.update({
            where: { id: existingBooking.id },
            data: {
              eventDate: dateOnlyUTC(eventDate),
              startTime: startDateTime,
              endTime: endDateTime,
              eventTimeZone: tz,
              status: "PENDING" as BookingStatus,
              totalAmount: totalAmount,
              subtotalAmount: subtotalAmount,
              taxAmount: taxAmount,
              taxRate: taxRate,
              eventType: eventType,
              eventAddress: eventAddress,
              eventCity: eventCity,
              eventState: eventState,
              eventZipCode: eventZipCode,
              participantCount: participantCount,
              participantAge: participantAge ? parseInt(participantAge, 10) : null,
              specialInstructions: specialInstructions,
              customer: { connect: { id: customer.id } },
              expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours for quote
            }
          });
          console.log(` - Existing booking updated to PENDING: ${booking.id}`);
        } else if (holdId) {
          // Find and update the hold booking
          const holdBooking = await tx.booking.findUnique({
            where: { id: holdId },
            include: { inventoryItems: true }
          });

          if (!holdBooking) {
            throw new Error("Hold booking not found");
          }

          // Update the booking with new information
          booking = await tx.booking.update({
            where: { id: holdId },
            data: {
              eventDate: dateOnlyUTC(eventDate),
              startTime: startDateTime,
              endTime: endDateTime,
              eventTimeZone: tz,
              status: "PENDING" as BookingStatus,
              totalAmount: totalAmount,
              subtotalAmount: subtotalAmount,
              taxAmount: taxAmount,
              taxRate: taxRate,
              eventType: eventType,
              eventAddress: eventAddress,
              eventCity: eventCity,
              eventState: eventState,
              eventZipCode: eventZipCode,
              participantCount: participantCount,
              participantAge: participantAge ? parseInt(participantAge, 10) : null,
              specialInstructions: specialInstructions,
              customer: { connect: { id: customer.id } },
              expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours for quote
            }
          });
          console.log(` - Booking updated from HOLD to PENDING: ${booking.id}`);
        } else {
          // This case shouldn't occur due to schema validation
          throw new Error("Neither bookingId nor holdId was provided");
        }

        // Mark previous OPEN quotes as EXPIRED for this booking
        console.log(`Expiring previous OPEN quotes for booking: ${booking.id}`);
        const expiredQuotes = await tx.quote.updateMany({
          where: { bookingId: booking.id, status: 'OPEN' },
          data: { status: 'EXPIRED' },
        });
        console.log(` - Expired ${expiredQuotes.count} previous OPEN quotes`);

        // Create Quote with proper status and URLs (no appQuoteUrl)
        const createdQuote = await tx.quote.create({
          data: {
            stripeQuoteId: finalized.id,
            status: QuoteStatus.OPEN, // Store as OPEN status
            amountTotal: amountTotalCents / 100,
            amountSubtotal: amountSubtotalCents / 100,
            amountTax: amountTaxCents / 100,
            currency: (finalized.currency ?? 'usd').toUpperCase(),
            appQuoteUrl: null, // No app URL needed
            stripeHostedUrl: null, // Not using Stripe's hosted view
            pdfUrl: pdfUrl,
            expiresAt: new Date(finalized.expires_at! * 1000), // Use Stripe's expiration
            version: version,
            businessId: businessId,
            customerId: customer.id,
            bookingId: booking.id,
            metadata: {
              prismaBookingId: booking.id,
              prismaBusinessId: businessId,
              prismaCustomerId: customer.id,
            },
          }
        });
        console.log(` - Quote created: ${createdQuote.id}, Stripe ID: ${createdQuote.stripeQuoteId}`);

        // Update booking with current quote reference
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            currentQuoteId: createdQuote.id,
          }
        });

        return [booking, createdQuote];
      });
      console.log("Database transaction completed.");

      // 10. Update Stripe quote metadata with Prisma IDs
      console.log(`Updating Stripe quote metadata with Prisma IDs: ${finalized.id}`);
      await stripe.quotes.update(finalized.id, {
        metadata: {
          prismaBusinessId: businessId,
          prismaBookingId: updatedBooking.id,
          prismaCustomerId: customer.id,
          prismaQuoteId: createdQuote.id
        }
      }, { stripeAccount: stripeConnectedAccountId });

      // 11. Send quote email with PDF link via Resend
      console.log(`Sending quote email to ${customerEmail}`);
      await sendSignatureEmail({
        from: `${business.name} <quotes@mail.inflatemate.co>`,
        to: customerEmail,
        subject: `Your Quote from ${business.name}`,
        html: `
          <p>Hi ${customerName},</p>
          <p>Here's your quote for ${eventDate}.</p>
          <p><strong>Total:</strong> $${totalAmount.toFixed(2)} (Subtotal $${subtotalAmount.toFixed(2)} + Tax $${taxAmount.toFixed(2)})</p>
          <p>This quote expires on ${new Date(finalized.expires_at! * 1000).toLocaleString()}.</p>
          <p><a href="${pdfUrl}">Download the quote PDF</a></p>
          <p>When you're ready, we'll email your invoice to pay.</p>
        `,
      });
      console.log(`Quote email sent successfully to ${customerEmail}`);

      // --- End: Database and Stripe Operations ---

      return NextResponse.json({
        message: "Quote created",
        bookingId: updatedBooking.id,
        quoteId: createdQuote.id,
        stripeQuoteId: createdQuote.stripeQuoteId,
        pdfUrl: createdQuote.pdfUrl
      }, { status: 200 });

    } catch (error) {
      // Enhanced Error Handling (similar to Invoice API)
      console.error("[QUOTE_CREATION_ERROR]", error); // Log the raw error

      if (error instanceof z.ZodError) {
        console.error("Validation Error Details:", error.errors);
        return NextResponse.json({ error: "Invalid input data provided.", details: error.flatten().fieldErrors }, { status: 400 });
      }
      if (error instanceof Stripe.errors.StripeError) {
        console.error("Stripe API Error:", { code: error.code, message: error.message, type: error.type });
        let userMessage = "An error occurred while creating the quote with our payment provider.";
        if (error.code === 'account_invalid') {
          userMessage = "Stripe account configuration error. Please contact support.";
        } else if (error.code === 'parameter_invalid') {
          userMessage = `Invalid data sent to payment provider: ${error.param}.`;
        }
        return NextResponse.json({ error: userMessage, stripeErrorCode: error.code }, { status: 500 });
      }
      if (error instanceof PrismaClientKnownRequestError) {
        console.error("Prisma Database Error:", { code: error.code, meta: error.meta });
        return NextResponse.json({ error: "A database error occurred.", code: error.code }, { status: 500 });
      }
      if (error instanceof Error) {
        console.error("Generic Error:", error.message);
        return NextResponse.json({ error: error.message || "An unexpected internal server error occurred." }, { status: 500 });
      }

      console.error("Unknown Error Type:", error);
      return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing quote request:", error);
    // Fallback for errors happening *before* the main try block's inner try
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  if (!businessId) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  try {
    const quotes = await prisma.quote.findMany({
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
            specialInstructions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Normalize: date-only string to avoid TZ shifts on client
    const normalized = quotes.map((q) => ({
      ...q,
      booking: {
        ...q.booking,
        eventDateString: q.booking?.eventDate
          ? new Date(q.booking.eventDate).toISOString().slice(0, 10)
          : null,
      },
    }));

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "An error occurred while fetching quotes." }, { status: 500 });
  }
}
