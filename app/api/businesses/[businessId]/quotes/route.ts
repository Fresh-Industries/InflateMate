import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is initialized here
import { stripe } from "@/lib/stripe-server"; // Make sure stripe client is initialized
import { z } from "zod";
import Stripe from "stripe";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils";
import { QuoteStatus, BookingStatus } from "@/prisma/generated/prisma";
import { UTApi } from 'uploadthing/server'
import { FileEsque } from '@/lib/utils'

const utapi = new UTApi()
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
            quote: true
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
        if (existingBooking.quote && existingBooking.quote.stripeQuoteId) {
          const activeQuoteStatuses: QuoteStatus[] = [QuoteStatus.OPEN, QuoteStatus.DRAFT];
          if (activeQuoteStatuses.includes(existingBooking.quote.status)) {
            console.log(`Canceling existing Stripe Quote ${existingBooking.quote.stripeQuoteId} for booking ${bookingId}`);
            try {
              await stripe.quotes.cancel(existingBooking.quote.stripeQuoteId, {}, 
                { stripeAccount: stripeConnectedAccountId });
              console.log(`Existing Stripe Quote ${existingBooking.quote.stripeQuoteId} canceled.`);
            } catch (err) {
              console.error(`Error canceling Stripe Quote ${existingBooking.quote.stripeQuoteId}:`, err);
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

      // 4. Prepare line items - use items from existing booking if available
      let lineItems;
      if (existingBooking && existingBooking.inventoryItems.length > 0) {
        // Use inventory items from the existing booking
        lineItems = existingBooking.inventoryItems.map(item => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(item.price * 100), // Amount in cents
            product: item.inventory.stripeProductId,
          },
        }));
        console.log(`Using ${lineItems.length} items from existing booking for quote.`);
      } else {
        // Use items from the request
        lineItems = selectedItems.map(item => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(item.price * 100),
            product: item.stripeProductId,
          },
        }));
      }

      // 5. Create Stripe Quote (Draft)
      const targetBookingId = bookingId || holdId;
      console.log(`Creating Stripe quote draft for booking ID: ${targetBookingId}`);
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
          prismaQuoteId: targetBookingId || null, // Add this to help with tracking
        },
        description: `Quote for event on ${eventDate}`,
      }, { stripeAccount: stripeConnectedAccountId });
      console.log(`Created Stripe quote draft: ${stripeQuoteDraft.id}`);


      // 6. Send the Quote using the correct method
      console.log(`Sending Stripe quote: ${stripeQuoteDraft.id}`);
      // Cast the result to Stripe.Quote to resolve type issues with hosted_quote_url, pdf_url, currency
      const sentQuote = await stripe.quotes.finalizeQuote(stripeQuoteDraft.id, {
        // No parameters needed for the send action itself, options are for the request
      }, { stripeAccount: stripeConnectedAccountId }) as Stripe.Quote; // Cast to Stripe.Quote


      console.log(`Stripe quote sent: ${sentQuote.id}, Status: ${sentQuote.status}`);

      // Now compare against the actual Stripe status value (lowercase 'sent')
      // --- FIX IS HERE: Split the condition ---
      if (!sentQuote || !sentQuote.id) {
        console.error("Stripe Quote sending failed or returned null/missing ID:", sentQuote);
        throw new Error("Failed to confirm Stripe quote sending."); // More accurate error message
      }
      // Now check the status separately
      // Use lowercase 'sent' as per Stripe API documentation
      if (sentQuote.status as string !== 'open') {
        console.error(`Stripe Quote sending returned unexpected status: ${sentQuote.status}`, sentQuote);
        throw new Error(`Failed to confirm Stripe quote sending with expected status 'sent'. Actual status: ${sentQuote.status}`); // More informative error
      }
      // --- END FIX ---

      // Prepare dates
      const startDateTime = new Date(`${eventDate}T${startTime}`);
      const endDateTime = new Date(`${eventDate}T${endTime}`);

      // --- Start: Handle PDF Stream from Stripe ---
      const pdfStream = await stripe.quotes.pdf(sentQuote.id, { stripeAccount: stripeConnectedAccountId }); // Added stripeAccount here for consistency

      const chunks: Uint8Array[] = [];
      let ufsUrl: string | undefined;

      // Create a promise to handle the stream processing
      await new Promise<void>((resolve, reject) => {
        pdfStream.on('data', (chunk) => {
          chunks.push(chunk);
        });
        pdfStream.on('error', (err) => {
          console.error("Error reading PDF stream from Stripe:", err);
          reject(new Error("Failed to read PDF stream from Stripe."));
        });
        pdfStream.on('end', async () => {
          try {
            const pdfBuffer = Buffer.concat(chunks);
            const arrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength);

            const fileName = `Quote-${customer.name}-${targetBookingId}.pdf`;
            console.log(`Uploading PDF to UploadThing: ${fileName}`);
            const upRes = await utapi.uploadFiles(new FileEsque([arrayBuffer], fileName, { type: 'application/pdf' }));

            if (upRes.error) {
              console.error("UploadThing API Error:", upRes.error);
              throw new Error(`UploadThing upload failed: ${upRes.error.message}`);
            }
            if (!upRes.data || !upRes.data.url) { // Assuming 'url' is the correct field from UploadThing response
              console.error("UploadThing response missing URL:", upRes.data);
              throw new Error('UploadThing failed to return a URL.');
            }
            ufsUrl = upRes.data.url; // Store the URL
            console.log(`PDF uploaded successfully to UploadThing: ${ufsUrl}`);
            resolve();
          } catch (uploadError) {
            console.error("Error during PDF upload or processing:", uploadError);
            reject(uploadError);
          }
        });
      });

      if (!ufsUrl) {
        // This case should ideally be caught by the promise rejection, but as a safeguard:
        console.error("UploadThing URL was not set after stream processing.");
        throw new Error('UploadThing URL was not obtained.');
      }
      // --- End: Handle PDF Stream from Stripe ---


      // 7. Update existing Booking and Create Quote in DB Transaction
      console.log(`Starting database transaction for updating Booking ${targetBookingId} and creating Quote...`);
      const [updatedBooking, createdQuote] = await prisma.$transaction(async (tx) => {
        let booking;
        
        if (existingBooking) {
          // Update the existing booking (from bookingId flow)
          booking = await tx.booking.update({
            where: { id: existingBooking.id },
            data: {
              eventDate: new Date(eventDate),
              startTime: startDateTime,
              endTime: endDateTime,
              eventTimeZone: eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
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
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours for quote
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
              eventDate: new Date(eventDate),
              startTime: startDateTime,
              endTime: endDateTime,
              eventTimeZone: eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
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
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours for quote
            }
          });
          console.log(` - Booking updated from HOLD to PENDING: ${booking.id}`);
        } else {
          // This case shouldn't occur due to schema validation
          throw new Error("Neither bookingId nor holdId was provided");
        }

        // Check for and handle existing quote if exists
        let createdQuote;
        if (booking.id && existingBooking?.quote) {
          // Update the existing quote instead of creating a new one
          createdQuote = await tx.quote.update({
            where: { id: existingBooking.quote.id },
            data: {
              stripeQuoteId: sentQuote.id,
              status: QuoteStatus.DRAFT,
              amountTotal: totalAmount,
              amountSubtotal: subtotalAmount,
              amountTax: taxAmount,
              currency: sentQuote.currency!.toUpperCase(),
              hostedQuoteUrl: sentQuote.invoice?.toString(),
              pdfUrl: ufsUrl,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
              metadata: {
                prismaBookingId: booking.id,
                prismaBusinessId: businessId,
                prismaCustomerId: customer.id,
              },
              businessId: businessId,
              customerId: customer.id,
              bookingId: booking.id,
            }
          });
          console.log(` - Existing quote ${existingBooking.quote.id} updated with new data.`);
        } else {
          // Create a new Quote record if none exists
          createdQuote = await tx.quote.create({
            data: {
              stripeQuoteId: sentQuote.id,
              status: QuoteStatus.DRAFT,
              amountTotal: totalAmount,
              amountSubtotal: subtotalAmount,
              amountTax: taxAmount,
              currency: sentQuote.currency!.toUpperCase(),
              hostedQuoteUrl: sentQuote.invoice?.toString(),
              pdfUrl: ufsUrl,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
              metadata: {
                prismaBookingId: booking.id,
                prismaBusinessId: businessId,
                prismaCustomerId: customer.id,
              },
              businessId: businessId,
              customerId: customer.id,
              bookingId: booking.id,
            }
          });
          console.log(` - Quote created: ${createdQuote.id}, Stripe ID: ${createdQuote.stripeQuoteId}`);
        }

        return [booking, createdQuote];
      });
      console.log("Database transaction completed.");

      // --- End: Database and Stripe Operations ---

      return NextResponse.json(
        {
          message: "Quote sent successfully via Stripe",
          bookingId: updatedBooking.id, // Return the booking ID
          quoteId: createdQuote.id,
          stripeQuoteId: createdQuote.stripeQuoteId,
          hostedQuoteUrl: createdQuote.hostedQuoteUrl,
          pdfUrl: createdQuote.pdfUrl, // Also return the new PDF URL
        },
        { status: 200 } // 200 OK
      );

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
        // Handle unique constraint violation if trying to create a quote for a booking_id that already has one
        if (error.code === 'P2002' && Array.isArray(error.meta?.target) && error.meta.target.includes('bookingId')) {
          const targetId = bookingId || holdId;
          return NextResponse.json({ error: `A quote already exists for this booking ID (${targetId}).`, field: 'bookingId' }, { status: 409 }); // Conflict
        }
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
    });

    return NextResponse.json(quotes, { status: 200 });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json({ error: "An error occurred while fetching quotes." }, { status: 500 });
  }
}
