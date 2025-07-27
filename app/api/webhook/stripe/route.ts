import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { Stripe } from "stripe";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import { sendSignatureEmail } from "@/lib/sendEmail";
import { sendToDocuSeal } from "@/lib/docuseal.server";
import { syncStripeDataToDB } from "@/lib/stripe-sync";
import { BookingStatus, InvoiceStatus } from "@/prisma/generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createBookingSafely } from "@/lib/createBookingSafely";
import { bookingConfirmationEmailHtml, BookingWithDetails } from "@/lib/EmailTemplates";
import { SiteConfig } from "@/lib/business/domain-utils";

interface Booking {
    id: string;
    eventDate: string; // Ensure this is string
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge?: number;
  }


export async function POST(req: NextRequest) {
  const sig = (await headers()).get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  console.log("[WEBHOOK] Received Stripe webhook, verifying signature...");

  let event: Stripe.Event;
  try {
    if (!sig) {
      console.error("[WEBHOOK] No Stripe signature found in request");
      return NextResponse.json({ error: "No Stripe signature" }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error("[WEBHOOK] STRIPE_WEBHOOK_SECRET environment variable is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const requestBody = await req.text();
    event = stripe.webhooks.constructEvent(requestBody, sig, webhookSecret);
    console.log(`[WEBHOOK] Webhook verified: ${event.type} - Event ID: ${event.id}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[WEBHOOK] Signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Process the event
  try {
    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[WEBHOOK] Processing payment_intent.succeeded: ${paymentIntent.id}`);
        try {
          await handlePaymentIntentSucceeded(paymentIntent);
          console.log(`[WEBHOOK] Successfully processed payment_intent.succeeded: ${paymentIntent.id}`);
        } catch (error) {
          console.error(`[WEBHOOK] Error in handlePaymentIntentSucceeded: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[WEBHOOK] Processing payment_intent.payment_failed: ${paymentIntent.id}`);
        try {
          await handlePaymentIntentFailed(paymentIntent);
        } catch (error) {
          console.error(`[WEBHOOK] Error processing payment_intent.payment_failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'charge.succeeded':
      case 'charge.updated':
        console.log(`[WEBHOOK] Received ${event.type} event - no action needed`);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
      case 'customer.subscription.trial_will_end':
      case 'customer.subscription.pending_update_applied':
      case 'customer.subscription.pending_update_expired':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscription(subscription);
        break;

      // --- ADDED: Invoice Event Handlers ---
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[WEBHOOK] Processing invoice.payment_succeeded: ${invoice.id}`);
        try {
          await handleInvoicePaymentSucceeded(invoice);
        } catch (error) {
          console.error(`[WEBHOOK] Error in handleInvoicePaymentSucceeded: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Log finalization error if available, otherwise log generic message
        const failureReason = invoice.last_finalization_error?.message ?? 'Unknown (check related PaymentIntent/Charge)';
        console.log(`[WEBHOOK] Processing invoice.payment_failed: ${invoice.id}, Reason: ${failureReason}`);
        try {
          await handleInvoicePaymentFailed(invoice);
        } catch (error) {
          console.error(`[WEBHOOK HANDLER_ERROR handleInvoicePaymentFailed] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }

      case 'invoice.voided': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[WEBHOOK] Processing invoice.voided: ${invoice.id}`);
        try {
          await handleInvoiceVoided(invoice);
        } catch (error) {
          console.error(`[WEBHOOK HANDLER_ERROR handleInvoiceVoided] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }

      case 'invoice.deleted': { // Note: Not all invoices can be deleted
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[WEBHOOK] Processing invoice.deleted: ${invoice.id}`);
        try {
          await handleInvoiceDeleted(invoice);
        } catch (error) {
          console.error(`[WEBHOOK HANDLER_ERROR handleInvoiceDeleted] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }
      // --- END: Added Invoice Event Handlers ---


    case 'quote.accepted': {
        const quote = event.data.object as Stripe.Quote;
        console.log(`[WEBHOOK] Processing quote.accepted: ${quote.id}`);
        await handleQuoteAccepted(quote); // Implement this handler
        // If Stripe is configured to auto-invoice on acceptance, the invoice.paid/invoice.payment_succeeded
        // webhooks will follow and trigger booking confirmation via handleInvoicePaymentSucceeded.
        break;
    }

    case 'quote.canceled': {
        const quote = event.data.object as Stripe.Quote;
        console.log(`[WEBHOOK] Processing quote.canceled: ${quote.id}`);
        await handleQuoteCanceled(quote); // Implement this handler
        break;
    }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event to Stripe
    console.log(`[WEBHOOK] Finished processing event ${event.id} (${event.type}). Sending 200 OK to Stripe.`);
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    // --- THIS CATCH BLOCK IS NOW FOR UNEXPECTED ERRORS *OUTSIDE* HANDLERS ---
    const eventId = (event as Stripe.Event | undefined)?.id ?? 'unknown';
    const eventType = (event as Stripe.Event | undefined)?.type ?? 'unknown';
    console.error(`[WEBHOOK] Critical error during webhook processing (event ${eventId}, type ${eventType}):`, error);
    // Log specific message if it's an Error instance
    if (error instanceof Error) {
        console.error(` - Error Message: ${error.message}`);
    }
    // Even in critical failure, tell Stripe we received it to avoid retries for potentially unrecoverable errors.
    return NextResponse.json({ error: "Critical error processing webhook internally." }, { status: 200 }); 
  }
}

async function handleSubscription(subscription: Stripe.Subscription) {
  console.log(`[WEBHOOK] Subscription event: ${subscription.id}`);

  try {
    const organizationId = subscription.metadata?.organizationId;
    if (!organizationId) {
      console.warn(`[WEBHOOK] Subscription ${subscription.id} missing organizationId metadata`);
      return;
    }

    console.log(`[WEBHOOK] Syncing subscription data to DB for org: ${organizationId}`);
    await syncStripeDataToDB(organizationId, subscription.customer as string);
  } catch (error) {
    console.error(`[WEBHOOK] Error handling subscription ${subscription.id}:`, error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`[WEBHOOK] PaymentIntent succeeded: ${paymentIntent.id}`);
  
  if (!paymentIntent) {
    console.error("[WEBHOOK] PaymentIntent object is null or undefined");
    return;
  }

  const metadata = paymentIntent.metadata;
  console.log("[WEBHOOK] PaymentIntent metadata:", JSON.stringify(metadata, null, 2));

  if (!metadata || !metadata.prismaBookingId) {
    console.log("[WEBHOOK] No booking metadata found in payment intent");
    return;
  }

  console.log(`[WEBHOOK] Processing booking confirmation for booking ID: ${metadata.prismaBookingId}`);

  try {
    const email = paymentIntent.receipt_email || '';
    const businessId = metadata.prismaBusinessId || '';
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    console.log("[WEBHOOK] Creating/updating customer with:", { email, businessId });

    // Replace upsert with findFirst + create/update approach
    let customer;
    try {
      // First check if customer exists
      const existingCustomer = await prisma.customer.findFirst({
        where: {
          email: email,
          businessId: businessId,
        },
      });

      if (existingCustomer) {
        // Update existing customer
        customer = await prisma.customer.update({
          where: { id: existingCustomer.id },
          data: {
            lastBooking: new Date(),
            bookingCount: { increment: 1 },
            totalSpent: { increment: paymentIntent.amount / 100 },
            address: metadata.eventAddress || '',
            city: metadata.eventCity || '',
            state: metadata.eventState || '',
            zipCode: metadata.eventZipCode || '',
            status: 'Active',
          },
        });
        console.log("[WEBHOOK] Customer updated successfully:", customer.id);
      } else {
        // Create new customer
        customer = await prisma.customer.create({
          data: {
            name: metadata.customerName || 'Customer',
            email,
            phone: metadata.customerPhone || '',
            businessId,
            address: metadata.eventAddress || '',
            city: metadata.eventCity || '',
            state: metadata.eventState || '',
            zipCode: metadata.eventZipCode || '',
            status: 'Active',
            lastBooking: new Date(),
            bookingCount: 1,
            totalSpent: paymentIntent.amount / 100,
          },
        });
        console.log("[WEBHOOK] Customer created successfully:", customer.id);
      }
    } catch (customerError) {
      console.error("[WEBHOOK] Error creating/updating customer:", 
        customerError instanceof Error ? customerError.message : 'Unknown error');
      throw customerError;
    }

    // Add try-catch block for booking creation
    let booking;
    try {
      // Log the raw date and time values from metadata
      console.log("[WEBHOOK] Raw date/time values from metadata:", {
        eventDate: metadata.eventDate,
        startTime: metadata.startTime,
        endTime: metadata.endTime,
        eventTimeZone: metadata.eventTimeZone, // Log the incoming timezone
      });
      
      // Determine the timezone to use
      // Use metadata timezone, fallback to business timezone, or default if business is null
      const tz = metadata.eventTimeZone ?? business?.timeZone ?? 'America/Chicago'; 
      console.log(`[WEBHOOK] Using timezone: ${tz}`);

      // Use new utility functions for date/time conversion
      const eventDate = dateOnlyUTC(metadata.eventDate);
      const startUTC  = localToUTC(metadata.eventDate, metadata.startTime, tz);
      const endUTC    = localToUTC(metadata.eventDate, metadata.endTime,   tz);
      
      // Log the converted UTC times
      console.log("[WEBHOOK] Converted UTC times:", {
        eventDate: eventDate.toISOString(),
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      });

      const subtotalAmount = parseFloat(metadata.subtotalAmount || '0') || 0;
      const taxAmount = parseFloat(metadata.taxAmount || '0') || 0;
      const taxRate = parseFloat(metadata.taxRate || '10') || 10;

      // Parse the selectedItems from JSON string
      let inventoryItems = [];
      try {
        if (metadata.selectedItems) {
          const selectedItems = JSON.parse(metadata.selectedItems);
          console.log("[WEBHOOK] Parsed selectedItems:", selectedItems);
          
          // Map the selected items to the format expected by createBookingSafely
          inventoryItems = selectedItems.map((item: { id: string; quantity?: number; price?: number }) => ({
            inventoryId: item.id,
            quantity: item.quantity || 1,
            price: item.price || 0,
            status: 'CONFIRMED',
            startUTC: startUTC,
            endUTC: endUTC,
          }));
        } else {
          // Fallback to legacy bounceHouseId for backwards compatibility
          inventoryItems = [{
            inventoryId: metadata.bounceHouseId,
            quantity: 1,
            price: subtotalAmount,
            status: 'CONFIRMED',
            startUTC: startUTC,
            endUTC: endUTC,
          }];
        }
      } catch (parseError) {
        console.error("[WEBHOOK] Error parsing selectedItems:", parseError);
        // Fallback to legacy method if parsing fails
        inventoryItems = [{
          inventoryId: metadata.bounceHouseId,
          quantity: 1,
          price: subtotalAmount,
          status: 'CONFIRMED',
          startUTC: startUTC,
          endUTC: endUTC,
        }];
      }

      // Check if booking exists
      console.log(`[WEBHOOK] Looking for existing booking: ${metadata.prismaBookingId}`);
      const existingBooking = await prisma.booking.findUnique({
        where: { id: metadata.prismaBookingId },
      });

      if (existingBooking) {
        console.log(`[WEBHOOK] Found existing booking with status: ${existingBooking.status}`);
        
        // Only update status and depositPaid
        booking = await prisma.booking.update({
          where: { id: metadata.prismaBookingId },
          data: {
            status: 'CONFIRMED',
            depositPaid: true,
            expiresAt: null, // Clear expiresAt for confirmed bookings
          },
        });
        console.log(`[WEBHOOK] Booking updated successfully: ${booking.id} - Status changed from ${existingBooking.status} to CONFIRMED`);
        
        // Send real-time update via Supabase for PENDING->CONFIRMED transition
        console.log(`[WEBHOOK] Attempting Supabase real-time update for booking: ${metadata.prismaBookingId}`);
        if (supabaseAdmin) {
          try {
            const supabaseResult = await supabaseAdmin
            .from('Booking')
            .update({
              status: 'CONFIRMED',
              depositPaid: true,
              expiresAt: null,
              updatedAt: new Date().toISOString(),
            })
            .eq('id', metadata.prismaBookingId);
            
            if (supabaseResult.error) {
              console.error("[WEBHOOK] Supabase real-time update failed:", supabaseResult.error);
            } else {
              console.log(`[WEBHOOK] Booking PENDING->CONFIRMED: real-time update sent via Supabase for booking: ${metadata.prismaBookingId}`);
            }
          } catch (supabaseError) {
            console.error("[WEBHOOK] Error sending Supabase real-time update:", supabaseError);
          }
        } else {
          console.warn("[WEBHOOK] supabaseAdmin is not available for real-time updates");
        }
        
        // Set all BookingItems to CONFIRMED
        await prisma.$executeRaw`UPDATE "BookingItem" SET "bookingStatus" = 'CONFIRMED', "updatedAt" = NOW() WHERE "bookingId" = ${booking.id}`;
        console.log("[WEBHOOK] All BookingItems set to CONFIRMED for booking:", booking.id);
      } else {
        console.log("[WEBHOOK] No existing booking found, creating new booking");
        // Remove inventoryItems from bookingData
        const bookingData = {
          id: metadata.prismaBookingId || '',
          eventDate: eventDate,
          startTime: startUTC,
          endTime: endUTC,
          eventTimeZone: tz,
          status: 'CONFIRMED' as const,
          totalAmount: paymentIntent.amount / 100,
          subtotalAmount: subtotalAmount,
          taxAmount: taxAmount,
          taxRate: taxRate,
          depositPaid: true,
          eventType: metadata.eventType || 'OTHER',
          eventAddress: metadata.eventAddress || '',
          eventCity: metadata.eventCity || '',
          eventState: metadata.eventState || '',
          eventZipCode: metadata.eventZipCode || '',
          participantCount: parseInt(metadata.participantCount) || 1,
          participantAge: metadata.participantAge ? parseInt(metadata.participantAge) : null,
          specialInstructions: metadata.specialInstructions || '',
          businessId: metadata.prismaBusinessId,
          customerId: customer.id,
          business: { connect: { id: metadata.prismaBusinessId } },
          customer: { connect: { id: customer.id } },
        };
        booking = await createBookingSafely(bookingData, inventoryItems);
        console.log("Booking created successfully via createBookingSafely:", booking.id);
        // Set all BookingItems to CONFIRMED
        await prisma.$executeRaw`UPDATE "BookingItem" SET "bookingStatus" = 'CONFIRMED', "updatedAt" = NOW() WHERE "bookingId" = ${booking.id}`;
        console.log("All BookingItems set to CONFIRMED for booking:", booking.id);
      }
    } catch (bookingError) {
      console.error("Error creating/updating booking:", bookingError);
      throw bookingError;
    }

    // Add try-catch block for payment creation
    try {
      const paymentData = {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'COMPLETED' as const,
        type: 'FULL_PAYMENT' as const,
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret || '',
        paidAt: new Date(),
        bookingId: booking.id,
        businessId: metadata.prismaBusinessId,
        metadata: metadata as Record<string, string | number | null>,
      };

      await prisma.payment.create({ data: paymentData });
      console.log("Payment record created successfully");
    } catch (paymentError) {
      console.error("Error creating payment record:", paymentError);
      throw paymentError;
    }
    
    // Call the reusable confirmation handler AFTER all DB updates for this PI are done
    if (booking?.id) { // Ensure booking object and id exist
        console.log(`[handlePaymentIntentSucceeded] Calling handleBookingConfirmation for Booking ID: ${booking.id}`);
        await handleBookingConfirmation(booking.id);
    } else {
        console.error("[handlePaymentIntentSucceeded] Booking ID is missing after upsert. Cannot trigger confirmation steps.");
    }

    console.log(`[handlePaymentIntentSucceeded] Booking ${booking?.id} confirmed successfully via Payment Intent`);

    const invoiceMeta = paymentIntent.metadata ?? null;
    if (invoiceMeta && invoiceMeta.couponCode && metadata.prismaBusinessId) {
      await prisma.$transaction(async (tx) => {
        await tx.coupon.update({
          where: { code_businessId: { code: invoiceMeta.couponCode, businessId: metadata.prismaBusinessId } },
          data: { usedCount: { increment: 1 } },
        });
      });
    }

  } catch (error) {
    // --- MODIFIED CATCH BLOCK --- 
    console.error(`[HANDLER_ERROR handlePaymentIntentSucceeded] Error processing PI ${paymentIntent.id}:`, error);
    // Log specific error details if possible
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(` - Prisma Error Code: ${error.code}`);
        console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    } else if (error instanceof Error) { // Handle generic Errors
        console.error(` - Error Message: ${error.message}`);
    }
    // Do NOT re-throw the error here. Log it and let the webhook return 200 OK.
    // --- END MODIFIED CATCH BLOCK --- 
  }
}


async function handleQuoteAccepted(stripeQuote: Stripe.Quote) {
  console.log(`[HANDLER] Processing Quote Accepted: ${stripeQuote.id}`);
  const stripeQuoteId = stripeQuote.id;
  const bookingId = stripeQuote.metadata?.prismaBookingId as string | undefined;

  if (!bookingId) {
    console.warn(`[HANDLER] Quote ${stripeQuoteId} accepted without prismaBookingId metadata. Cannot link to internal booking.`);
    return;
  }

  console.log(`[HANDLER] Booking ID: ${bookingId}`);

  try {
    // Find the internal quote record
    const internalQuote = await prisma.quote.findFirst({
      where: { 
        OR: [
          { bookingId: bookingId },
          { stripeQuoteId: stripeQuoteId }
        ]
      },
      include: { booking: true, customer: true }
    });

    if (!internalQuote) {
      console.warn(`[HANDLER] Accepted: Quote record for booking ${bookingId} (Stripe ID ${stripeQuoteId}) not found in DB.`);
      return;
    }

    if (internalQuote.status === 'ACCEPTED') {
      console.warn(`[HANDLER] Accepted: Quote ${internalQuote.id} (Stripe ${stripeQuoteId}) is already ACCEPTED. Skipping update.`);
      return;
    }

    // Create invoice record and update quote status in a transaction
    await prisma.$transaction(async (tx) => {
      // Update quote status
      await tx.quote.update({
        where: { id: internalQuote.id },
        data: {
          status: 'ACCEPTED',
          updatedAt: new Date(),
        },
      });

      // Create invoice record
      await tx.invoice.create({
        data: {
          status: 'OPEN',
          amountDue: internalQuote.amountTotal,
          amountPaid: 0,
          amountRemaining: internalQuote.amountTotal,
          currency: internalQuote.currency,
          stripeInvoiceId: stripeQuote.invoice?.toString(), // Stripe creates this automatically
          businessId: internalQuote.businessId,
          customerId: internalQuote.customerId,
          bookingId: internalQuote.bookingId,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour hold
          metadata: {
            prismaBookingId: bookingId,
            prismaBusinessId: internalQuote.businessId,
            prismaCustomerId: internalQuote.customerId,
            prismaQuoteId: internalQuote.id,
          },
        },
      });

      // Create payment record with PENDING status
      await tx.payment.create({
        data: {
          amount: internalQuote.amountTotal,
          type: 'FULL_PAYMENT',
          status: 'PENDING',
          currency: internalQuote.currency,
          bookingId: internalQuote.bookingId,
          businessId: internalQuote.businessId,
          metadata: {
            prismaQuoteId: internalQuote.id,
            stripeQuoteId: stripeQuoteId,
          },
        },
      });

      // Update booking status to PENDING
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'PENDING' as BookingStatus,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set 24-hour expiration for PENDING
          updatedAt: new Date(),
        },
      });
    });
    
    // Send real-time update via Supabase
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('Booking')
        .update({
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq('id', bookingId);
      console.log("Quote accepted: Booking real-time update sent via Supabase");
    }

    console.log(`[HANDLER] Quote ${internalQuote.id} accepted and invoice record created.`);

  } catch (error) {
    console.error(`[HANDLER_ERROR handleQuoteAccepted] Error processing Quote ${stripeQuoteId}:`, error);
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(` - Prisma Error Code: ${error.code}`);
      console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    }
  }
}

async function handleQuoteCanceled(stripeQuote: Stripe.Quote) {
  console.log(`[HANDLER] Processing Quote Canceled: ${stripeQuote.id}`);
  const stripeQuoteId = stripeQuote.id;
  const bookingId = stripeQuote.metadata?.prismaBookingId as string | undefined;

   if (!bookingId) {
       console.warn(`[HANDLER] Quote ${stripeQuoteId} canceled without prismaBookingId metadata. Cannot link to internal booking.`);
       return; // Cannot link
  }

  try {
       // Find the internal quote record
      const internalQuote = await prisma.quote.findUnique({
          where: { bookingId: bookingId },
          include: { booking: true }
      });

      if (!internalQuote) {
           console.warn(`[HANDLER] Canceled: Quote record for booking ${bookingId} (Stripe ID ${stripeQuoteId}) not found in DB.`);
           return; // Nothing to update
      }

       if (internalQuote.status === 'CANCELED') {
           console.warn(`[HANDLER] Canceled: Quote ${internalQuote.id} (Stripe ${stripeQuoteId}) is already CANCELED. Skipping update.`);
           return; // Avoid reprocessing
       }


      console.log(`[HANDLER] Canceled: Updating internal Quote record ${internalQuote.id} and Booking ${bookingId}`);

       await prisma.$transaction(async (tx) => {
           // Update the internal Quote status to CANCELED
           await tx.quote.update({
               where: { id: internalQuote.id },
               data: {
                   status: 'CANCELED', // Map Stripe 'canceled' to your CANCELED enum
                   updatedAt: new Date(),
               },
           });
           console.log(` - Internal Quote record ${internalQuote.id} updated to CANCELED.`);

           // Update the linked Booking status to CANCELLED
           if (internalQuote.booking) {
                await tx.booking.update({
                    where: { id: internalQuote.bookingId },
                     // Ensure you have a 'CANCELLED' status in your BookingStatus enum
                    data: { 
                      status: 'CANCELLED' as BookingStatus,
                      expiresAt: null, // Clear expiresAt for cancelled bookings
                    },
                });
               console.log(` - Booking ${internalQuote.bookingId} status updated to CANCELLED.`);
           } else {
               console.warn(` - Canceled: Booking ${internalQuote.bookingId} linked to Quote ${internalQuote.id} not found.`);
           }
       });
       console.log(`[HANDLER] Canceled: Transaction committed for Quote ${internalQuote.id}`);

      // TODO: Optionally send notification to customer/admin

  } catch (error) {
      console.error(`[HANDLER_ERROR handleQuoteCanceled] Error processing Quote ${stripeQuoteId}:`, error);
       if (error instanceof PrismaClientKnownRequestError) {
          console.error(` - Prisma Error Code: ${error.code}`);
          console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
      } else if (error instanceof Error) {
           console.error(` - Error Message: ${error.message}`);
      }
       // Do NOT re-throw
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent failed: ${paymentIntent.id}`);

  const metadata = paymentIntent.metadata;
  if (!metadata || !metadata.prismaBookingId) {
    return;
  }

  try {
    // Update booking status if it exists
    await prisma.booking.updateMany({
      where: { id: metadata.prismaBookingId },
      data: { 
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set 24-hour expiration for PENDING
      },
    });

    // Record the failed payment
    await prisma.payment.create({
      data: {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'FAILED',
        type: 'FULL_PAYMENT',
        stripePaymentId: paymentIntent.id,
        stripeClientSecret: paymentIntent.client_secret || '',
        bookingId: metadata.prismaBookingId,
        businessId: metadata.prismaBusinessId,
        metadata: metadata as Record<string, string | number | null>,
      },
    });
  } catch (error) {
    console.error('Error processing payment failure:', error);
    throw error;
  }
}

// --- IMPLEMENTED: Centralized Booking Confirmation Logic ---
async function handleBookingConfirmation(bookingId: string) {
  console.log(`[CONFIRMATION] Starting post-confirmation steps for Booking ID: ${bookingId}`);

  try {
    // 1. Fetch the confirmed booking with related data
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        business: true,
        inventoryItems: {
          include: {
            inventory: true,
          },
        },
      },
    });

    // 2. Validate fetched data
    if (!booking) {
      console.warn(`[CONFIRMATION] Booking ${bookingId} not found.`);
      return;
    }
    // IMPORTANT: Check status *before* proceeding
    if (booking.status !== 'CONFIRMED') {
      console.warn(`[CONFIRMATION] Booking ${bookingId} is not in CONFIRMED state (Status: ${booking.status}). Skipping confirmation steps.`);
      return;
    }
    if (!booking.customer) {
      console.error(`[CONFIRMATION] Customer data missing for Booking ${bookingId}. Cannot send waiver.`);
      return;
    }
    if (!booking.business) {
      console.error(`[CONFIRMATION] Business data missing for Booking ${bookingId}. Cannot send waiver.`);
      return;
    }

    const { customer, business } = booking;
    const templateVersion = 'v1'; // Define or retrieve template version

    console.log(`[CONFIRMATION] Starting Waiver/Email process for Booking ${bookingId}`);

    // 3. Construct the booking object for DocuSeal
    //    Ensure eventDate format matches what sendToDocuSeal expects (string YYYY-MM-DD)
    const formattedEventDate = booking.eventDate.toISOString().split('T')[0]; 
    const docuSealBooking: Booking = {
      id: booking.id,
      eventDate: formattedEventDate, // Use formatted string date
      eventAddress: booking.eventAddress || '',
      eventCity: booking.eventCity || '',
      eventState: booking.eventState || '',
      eventZipCode: booking.eventZipCode || '',
      participantCount: booking.participantCount || 1,
      participantAge: booking.participantAge ?? undefined,
    };

    // 4. Send to DocuSeal
    console.log(`[CONFIRMATION] Calling sendToDocuSeal for booking ${bookingId}...`);
    const { url, documentId } = await sendToDocuSeal(
      business,
      customer,
      docuSealBooking,
      templateVersion
    );
    console.log(`[CONFIRMATION] DocuSeal URL received: ${url}`);
    console.log(`[CONFIRMATION] DocuSeal Document ID received: ${documentId}`);

    // 5. Create/Update Waiver Record using upsert
    console.log(`[CONFIRMATION] Upserting Waiver record for booking ${bookingId}...`);
    await prisma.waiver.upsert({
      where: {
        // Use the Prisma generated composite key identifier
        customerId_businessId_bookingId: {
          customerId: customer.id,
          businessId: business.id,
          bookingId: booking.id
        }
      },
      update: { // If waiver already existed (e.g., webhook retry), update relevant fields
        documentUrl: url,
        docuSealDocumentId: documentId,
        status: 'PENDING', // Reset status to pending if re-sending
        templateVersion: templateVersion, // Update template version if needed
        updatedAt: new Date(), // Explicitly set update time
      },
      create: { // Fields for creating a new waiver
        businessId: business.id,
        customerId: customer.id,
        bookingId: booking.id,
        status: 'PENDING',
        templateVersion: templateVersion,
        documentUrl: url,
        docuSealDocumentId: documentId,
      },
    });
    console.log(`[CONFIRMATION] Waiver record created/updated for Booking ${bookingId}.`);

    // 6. Send Waiver Email
    console.log(`[CONFIRMATION] Sending waiver email to ${customer.email} for booking ${bookingId}...`);
    
    // Ensure we have all required data for the email template
    if (booking.customer && booking.business) {
      // Transform the booking data to match BookingWithDetails interface
      const bookingWithDetails = {
        ...booking,
        customer: booking.customer,
        business: {
          ...booking.business,
          siteConfig: booking.business.siteConfig as unknown as SiteConfig | null,
        },
        eventTimeZone: booking.eventTimeZone || 'America/Chicago', // Provide fallback
        inventoryItems: booking.inventoryItems,
      } as unknown as BookingWithDetails;
      
      console.log(`[CONFIRMATION] Generating email HTML for booking ${bookingId}...`);
      const emailHtml = bookingConfirmationEmailHtml(bookingWithDetails, url);
      console.log(`[CONFIRMATION] Email HTML generated successfully. Length: ${emailHtml.length} characters`);
      
      console.log(`[CONFIRMATION] Sending email to ${customer.email}...`);
      const emailResult = await sendSignatureEmail({
        from: `${business.name} <waivers@mail.inflatemate.co>`, 
        to: customer.email,
        subject: `Action Required: Sign Your Waiver for Booking with ${business.name}`, // More specific subject
        html: emailHtml,
      });
      console.log(`[CONFIRMATION] Email send result:`, emailResult);
      console.log(`[CONFIRMATION] Waiver email sent successfully to ${customer.email} for Booking ${bookingId}.`);
    } else {
      console.error(`[CONFIRMATION] Missing customer or business data for booking ${bookingId}. Cannot send email.`);
    }

    console.log(`[CONFIRMATION] Post-confirmation steps completed for Booking ID: ${bookingId}`);

  } catch (error) {
    console.error(`[CONFIRMATION] Error during post-confirmation steps for Booking ID ${bookingId}:`, error);
    // Log the error but don't re-throw, to prevent webhook retries for confirmation step failures
  }
}

// --- ADDED: Placeholder Invoice Handler Functions ---
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`[HANDLER] Processing Invoice Payment Succeeded: ${invoice.id}`);

  const stripeInvoiceId = invoice.id;
  const prismaBookingId = invoice.metadata?.prismaBookingId;
  const prismaCustomerId = invoice.metadata?.prismaCustomerId;

  console.log(` - Stripe Invoice ID: ${stripeInvoiceId}`);
  console.log(` - Metadata Booking ID: ${prismaBookingId}`);
  console.log(` - Metadata Customer ID: ${prismaCustomerId}`);

  if (!stripeInvoiceId) {
    console.warn(`[HANDLER] Received invoice.payment_succeeded event without an Invoice ID.`);
    return; // Cannot process without ID
  }

  try {
    // Find the internal invoice record using the Stripe ID
    const internalInvoice = await prisma.invoice.findUnique({
      where: {
        stripeInvoiceId: stripeInvoiceId,
      },
      include: {
        booking: true, // Include related booking
        customer: true, // Include related customer
      },
    });

    if (!internalInvoice) {
      console.warn(`[HANDLER] Invoice with Stripe ID ${stripeInvoiceId} not found in database. Possibly already processed or from a different source.`);
      return;
    }

    if (internalInvoice.status === 'PAID') {
      console.warn(`[HANDLER] Invoice ${internalInvoice.id} (Stripe: ${stripeInvoiceId}) is already marked as PAID. Skipping update.`);
      return;
    }

    if (!internalInvoice.booking) {
        console.error(`[HANDLER] Invoice ${internalInvoice.id} is missing the related booking record.`);
        return; // Cannot update booking if it doesn't exist
    }

     if (!internalInvoice.customer) {
        console.error(`[HANDLER] Invoice ${internalInvoice.id} is missing the related customer record.`);
        // Decide if this is critical. We can still update Invoice/Booking.
        // For now, log and continue, but don't update customer.
    }

    console.log(`[HANDLER] Found internal invoice ${internalInvoice.id} for Stripe ID ${stripeInvoiceId}. Status: ${internalInvoice.status}. Updating...`);

    const bookingIdToConfirm = internalInvoice.booking.id;
    const customerIdToUpdate = internalInvoice.customer?.id;
    const amountPaid = invoice.amount_paid / 100;

    // Perform updates within a transaction
    await prisma.$transaction(async (tx) => {
      console.log(`[HANDLER] Starting transaction for invoice ${internalInvoice.id}`);
      
      // Update Invoice
      await tx.invoice.update({
        where: { id: internalInvoice.id },
        data: {
          status: 'PAID',
          amountPaid: amountPaid,
          amountRemaining: invoice.amount_remaining / 100,
          paidAt: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
        },
      });
      console.log(` - Invoice ${internalInvoice.id} status updated to PAID.`);

      // Update Payment status to COMPLETED
      await tx.payment.updateMany({
        where: { 
          bookingId: internalInvoice.bookingId,
          status: 'PENDING'
        },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });
      console.log(` - Payment status updated to COMPLETED for booking ${internalInvoice.bookingId}`);

      // Update Booking
      await tx.booking.update({
        where: { id: internalInvoice.bookingId },
        data: {
          status: 'CONFIRMED',
          expiresAt: null, // Clear expiresAt for confirmed bookings
        },
      });
      console.log(` - Booking ${internalInvoice.bookingId} status updated to CONFIRMED/COMPLETED.`);

      // Update Customer (if found)
      if (customerIdToUpdate) {
            await tx.customer.update({
              where: { id: customerIdToUpdate },
              data: {
                bookingCount: { increment: 1 }, // Consider if this should only increment on first payment? Depends on logic.
                totalSpent: { increment: amountPaid },
                lastBooking: new Date(), // Update last booking date
              },
            });
            console.log(` - Customer ${customerIdToUpdate} stats updated.`);
        } else {
             console.warn(` - Customer update skipped for invoice ${internalInvoice.id} as customer link was missing.`);
        }

    });
    console.log(`[HANDLER] Transaction committed for invoice ${internalInvoice.id}.`);

    // Send real-time update via Supabase
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('Booking')
        .update({
          status: 'CONFIRMED',
          expiresAt: null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', bookingIdToConfirm);
      console.log("Invoice payment succeeded: Booking real-time update sent via Supabase");
    }

    // Call the confirmation handler
    console.log(`[HANDLER] Calling handleBookingConfirmation for Booking ID: ${bookingIdToConfirm}`);
    await handleBookingConfirmation(bookingIdToConfirm);

    const invoiceMeta = invoice.metadata ?? null;
    if (invoiceMeta && invoiceMeta.couponCode && internalInvoice.booking?.businessId) {
      await prisma.$transaction(async (tx) => {
        await tx.coupon.update({
          where: { code_businessId: { code: invoiceMeta.couponCode, businessId: internalInvoice.booking.businessId } },
          data: { usedCount: { increment: 1 } },
        });
      });
    }

  } catch (error) {
    // --- MODIFIED CATCH BLOCK --- 
    console.error(`[HANDLER_ERROR handleInvoicePaymentSucceeded] Error processing Invoice ${invoice.id}:`, error);
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(` - Prisma Error Code: ${error.code}`);
        console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    } else if (error instanceof Error) { // Handle generic Errors
        console.error(` - Error Message: ${error.message}`);
    }
    // Do NOT re-throw
    // --- END MODIFIED CATCH BLOCK --- 
  }
}



async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const stripeInvoiceId = invoice.id;
  console.log(`[HANDLER] Processing Invoice Payment Failed: ${stripeInvoiceId}`);

  try {
    const internalInvoice = await prisma.invoice.findUnique({
      where: { stripeInvoiceId: stripeInvoiceId },
      include: { booking: true }, // Include booking to update its status
    });

    if (!internalInvoice) {
      console.warn(`[HANDLER] Failed Payment: Invoice with Stripe ID ${stripeInvoiceId} not found.`);
      return;
    }

    // Avoid processing if already handled or in a final state
    if (['PAID', 'VOID', 'DELETED', 'FAILED'].includes(internalInvoice.status)) {
      console.warn(`[HANDLER] Failed Payment: Invoice ${internalInvoice.id} already in status ${internalInvoice.status}. Skipping.`);
      return;
    }

    console.log(`[HANDLER] Failed Payment: Updating Invoice ${internalInvoice.id} and Booking ${internalInvoice.bookingId}`);

    await prisma.$transaction(async (tx) => {
      // Update Invoice status
      await tx.invoice.update({
        where: { id: internalInvoice.id },
        data: { status: 'FAILED' as InvoiceStatus },
      });

      // Update Booking status
      if (internalInvoice.booking) {
        await tx.booking.update({
          where: { id: internalInvoice.bookingId },
          data: { 
            status: 'PENDING',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set 24-hour expiration for PENDING
          },
        });
      } else {
         console.warn(`[HANDLER] Failed Payment: Booking ${internalInvoice.bookingId} linked to Invoice ${internalInvoice.id} not found.`);
      }
    });
    console.log(`[HANDLER] Failed Payment: Updated records for Invoice ${internalInvoice.id}`);
    // TODO: Optionally send notification to admin/business owner

  } catch (error) {
    // --- MODIFIED CATCH BLOCK --- 
    console.error(`[HANDLER_ERROR handleInvoicePaymentFailed] Error processing Invoice ${invoice.id}:`, error);
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(` - Prisma Error Code: ${error.code}`);
        console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    } else if (error instanceof Error) { // Handle generic Errors
        console.error(` - Error Message: ${error.message}`);
    }
    // Do NOT re-throw
    // --- END MODIFIED CATCH BLOCK --- 
  }
}

async function handleInvoiceVoided(invoice: Stripe.Invoice) {
  const stripeInvoiceId = invoice.id;
  console.log(`[HANDLER] Processing Invoice Voided: ${stripeInvoiceId}`);

  try {
    const internalInvoice = await prisma.invoice.findUnique({
      where: { stripeInvoiceId: stripeInvoiceId },
      include: { booking: true },
    });

    if (!internalInvoice) {
      console.warn(`[HANDLER] Voided: Invoice with Stripe ID ${stripeInvoiceId} not found.`);
      return;
    }

     if (['VOID', 'DELETED'].includes(internalInvoice.status)) {
      console.warn(`[HANDLER] Voided: Invoice ${internalInvoice.id} already in status ${internalInvoice.status}. Skipping.`);
      return;
    }

    console.log(`[HANDLER] Voided: Updating Invoice ${internalInvoice.id} and Booking ${internalInvoice.bookingId}`);

    await prisma.$transaction(async (tx) => {
      await tx.invoice.update({
        where: { id: internalInvoice.id },
        data: {
          status: 'VOID',
          voidedAt: new Date(),
        },
      });

      // Update payment status to EXPIRED
      await tx.payment.updateMany({
        where: { 
          bookingId: internalInvoice.bookingId,
          status: 'PENDING'
        },
        data: {
          status: 'EXPIRED',
        },
      });

      if (internalInvoice.booking) {
        await tx.booking.update({
          where: { id: internalInvoice.bookingId },
          data: { 
            status: 'EXPIRED',
            expiresAt: null, // Clear expiresAt for expired bookings
          },
        });
      } else {
         console.warn(`[HANDLER] Voided: Booking ${internalInvoice.bookingId} linked to Invoice ${internalInvoice.id} not found.`);
      }
    });
     console.log(`[HANDLER] Voided: Updated records for Invoice ${internalInvoice.id}`);
     // TODO: Optionally notify customer/admin

  } catch (error) {
    // --- MODIFIED CATCH BLOCK --- 
    console.error(`[HANDLER_ERROR handleInvoiceVoided] Error processing Invoice ${invoice.id}:`, error);
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(` - Prisma Error Code: ${error.code}`);
        console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    } else if (error instanceof Error) { // Handle generic Errors
        console.error(` - Error Message: ${error.message}`);
    }
    // Do NOT re-throw
    // --- END MODIFIED CATCH BLOCK --- 
  }
}

async function handleInvoiceDeleted(invoice: Stripe.Invoice) {
  const stripeInvoiceId = invoice.id;
  console.log(`[HANDLER] Processing Invoice Deleted: ${stripeInvoiceId}`);
  // Note: Deleting invoices in Stripe is often restricted after finalization.
  // This handler might be less common.

  try {
    const internalInvoice = await prisma.invoice.findUnique({
      where: { stripeInvoiceId: stripeInvoiceId },
       include: { booking: true },
    });

    if (!internalInvoice) {
      console.warn(`[HANDLER] Deleted: Invoice with Stripe ID ${stripeInvoiceId} not found.`);
      return;
    }
    
     if (internalInvoice.status === 'DELETED' as InvoiceStatus) {
      console.warn(`[HANDLER] Deleted: Invoice ${internalInvoice.id} already marked as DELETED. Skipping.`);
      return;
    }

    console.log(`[HANDLER] Deleted: Marking Invoice ${internalInvoice.id} as DELETED and cancelling Booking ${internalInvoice.bookingId}`);

    await prisma.$transaction(async (tx) => {
      // Option 1: Mark as deleted (safer)
      await tx.invoice.update({
        where: { id: internalInvoice.id },
        data: { status: 'DELETED' as InvoiceStatus }, // Assumes DELETED enum value exists
      });
      // Option 2: Actually delete (more complex if relations block)
      // await tx.invoice.delete({ where: { id: internalInvoice.id } });

      if (internalInvoice.booking) {
        await tx.booking.update({
          where: { id: internalInvoice.bookingId },
          data: { 
            status: 'CANCELLED',
            expiresAt: null, // Clear expiresAt for cancelled bookings
          },
        });
      } else {
         console.warn(`[HANDLER] Deleted: Booking ${internalInvoice.bookingId} linked to Invoice ${internalInvoice.id} not found.`);
      }
    });
     console.log(`[HANDLER] Deleted: Updated records for Invoice ${internalInvoice.id}`);

  } catch (error) {
    // --- MODIFIED CATCH BLOCK --- 
    console.error(`[HANDLER_ERROR handleInvoiceDeleted] Error processing Invoice ${invoice.id}:`, error);
    if (error instanceof PrismaClientKnownRequestError) {
        console.error(` - Prisma Error Code: ${error.code}`);
        console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
    } else if (error instanceof Error) { // Handle generic Errors
        console.error(` - Error Message: ${error.message}`);
    }
    // Do NOT re-throw
    // --- END MODIFIED CATCH BLOCK --- 
  }
}
