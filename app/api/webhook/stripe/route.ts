import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Stripe } from "stripe";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";
import { sendSignatureEmail } from "@/lib/sendEmail";
import { sendToDocuSeal } from "@/lib/docuseal.server";
import { syncStripeDataToDB } from "@/lib/stripe-sync";
import { InvoiceStatus } from "@/prisma/generated/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

  console.log("Received Stripe webhook, verifying signature...");

  let event: Stripe.Event;
  try {
    if (!sig) {
      console.error("No Stripe signature found in request");
      return NextResponse.json({ error: "No Stripe signature" }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET environment variable is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const requestBody = await req.text();
    event = stripe.webhooks.constructEvent(requestBody, sig, webhookSecret);
    console.log(`Webhook verified: ${event.type}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  // Process the event
  try {
    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Processing payment_intent.succeeded: ${paymentIntent.id}`);
        try {
          await handlePaymentIntentSucceeded(paymentIntent);
        } catch (error) {
          console.error(`[Webhook POST] Error in handlePaymentIntentSucceeded: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Processing payment_intent.payment_failed: ${paymentIntent.id}`);
        try {
          await handlePaymentIntentFailed(paymentIntent);
        } catch (error) {
          console.error(`Error processing payment_intent.payment_failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'charge.succeeded':
      case 'charge.updated':
        console.log(`Received ${event.type} event - no action needed`);
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
        console.log(`Processing invoice.payment_succeeded: ${invoice.id}`);
        try {
          await handleInvoicePaymentSucceeded(invoice);
        } catch (error) {
          console.error(`[Webhook POST] Error in handleInvoicePaymentSucceeded: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        break;
      }

      case 'invoice.paid': { // Often overlaps with payment_succeeded
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Processing invoice.paid: ${invoice.id}`);
        await handleInvoicePaid(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Log finalization error if available, otherwise log generic message
        const failureReason = invoice.last_finalization_error?.message ?? 'Unknown (check related PaymentIntent/Charge)';
        console.log(`Processing invoice.payment_failed: ${invoice.id}, Reason: ${failureReason}`);
        try {
          await handleInvoicePaymentFailed(invoice);
        } catch (error) {
          console.error(`[HANDLER_ERROR handleInvoicePaymentFailed] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }

      case 'invoice.voided': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Processing invoice.voided: ${invoice.id}`);
        try {
          await handleInvoiceVoided(invoice);
        } catch (error) {
          console.error(`[HANDLER_ERROR handleInvoiceVoided] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }

      case 'invoice.deleted': { // Note: Not all invoices can be deleted
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`Processing invoice.deleted: ${invoice.id}`);
        try {
          await handleInvoiceDeleted(invoice);
        } catch (error) {
          console.error(`[HANDLER_ERROR handleInvoiceDeleted] Error processing Invoice ${invoice.id}:`, error);
          if (error instanceof PrismaClientKnownRequestError) {
              console.error(` - Prisma Error Code: ${error.code}`);
              console.error(` - Prisma Meta: ${JSON.stringify(error.meta)}`);
          }
        }
        break;
      }
      // --- END: Added Invoice Event Handlers ---

      default:
        console.log(`[Webhook POST] Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event to Stripe
    console.log(`[Webhook POST] Finished processing event ${event.id} (${event.type}). Sending 200 OK to Stripe.`);
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });

  } catch (error) {
    // --- THIS CATCH BLOCK IS NOW FOR UNEXPECTED ERRORS *OUTSIDE* HANDLERS ---
    const eventId = (event as Stripe.Event | undefined)?.id ?? 'unknown';
    const eventType = (event as Stripe.Event | undefined)?.type ?? 'unknown';
    console.error(`[Webhook POST] Critical error during webhook processing (event ${eventId}, type ${eventType}):`, error);
    // Log specific message if it's an Error instance
    if (error instanceof Error) {
        console.error(` - Error Message: ${error.message}`);
    }
    // Even in critical failure, tell Stripe we received it to avoid retries for potentially unrecoverable errors.
    return NextResponse.json({ error: "Critical error processing webhook internally." }, { status: 200 }); 
  }
}

async function handleSubscription(subscription: Stripe.Subscription) {
  console.log(`Subscription: ${subscription.id}`);

  const customerId = subscription.customer as string;
  await syncStripeDataToDB(customerId);
}
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
  
  if (!paymentIntent) {
    console.error("PaymentIntent object is null or undefined");
    return;
  }

  const metadata = paymentIntent.metadata;
  console.log("PaymentIntent object:", JSON.stringify(paymentIntent, null, 2));
  console.log("Metadata:", metadata);

  if (!metadata || !metadata.bounceHouseId) {
    console.log("No booking metadata found in payment intent");
    return;
  }

  try {
    const email = paymentIntent.receipt_email || '';
    const businessId = metadata.businessId || '';
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    console.log("Creating/updating customer with:", { email, businessId });

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
        console.log("Customer updated successfully:", customer.id);
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
        console.log("Customer created successfully:", customer.id);
      }
    } catch (customerError) {
      console.error("Error creating/updating customer:", 
        customerError instanceof Error ? customerError.message : 'Unknown error');
      throw customerError;
    }

    // Add try-catch block for booking creation
    let booking;
    try {
      // Log the raw date and time values from metadata
      console.log("Raw date/time values from metadata:", {
        eventDate: metadata.eventDate,
        startTime: metadata.startTime,
        endTime: metadata.endTime,
        eventTimeZone: metadata.eventTimeZone, // Log the incoming timezone
      });
      
      // Determine the timezone to use
      // Use metadata timezone, fallback to business timezone, or default if business is null
      const tz = metadata.eventTimeZone ?? business?.timeZone ?? 'America/Chicago'; 
      console.log(`Using timezone: ${tz}`);

      // Use new utility functions for date/time conversion
      const eventDate = dateOnlyUTC(metadata.eventDate);
      const startUTC  = localToUTC(metadata.eventDate, metadata.startTime, tz);
      const endUTC    = localToUTC(metadata.eventDate, metadata.endTime,   tz);
      
      // Log the converted UTC times
      console.log("Converted UTC times:", {
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
          console.log("Parsed selectedItems:", selectedItems);
          
          // Map the selected items to the format expected by Prisma
          inventoryItems = selectedItems.map((item: { id: string; quantity?: number; price?: number }) => ({
            inventoryId: item.id,
            quantity: item.quantity || 1,
            price: item.price || 0,
          }));
        } else {
          // Fallback to legacy bounceHouseId for backwards compatibility
          inventoryItems = [{
            inventoryId: metadata.bounceHouseId,
            quantity: 1,
            price: subtotalAmount,
          }];
        }
      } catch (parseError) {
        console.error("Error parsing selectedItems:", parseError);
        // Fallback to legacy method if parsing fails
        inventoryItems = [{
          inventoryId: metadata.bounceHouseId,
          quantity: 1,
          price: subtotalAmount,
        }];
      }

      const bookingData = {
        id: metadata.bookingId || '',
        eventDate: eventDate, // Use the date-only UTC Date object
        startTime: startUTC,  // Use the converted UTC start time
        endTime: endUTC,    // Use the converted UTC end time
        eventTimeZone: tz,    // Persist the timezone used
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
        businessId: metadata.businessId,
        customerId: customer.id,
        inventoryItems: {
          create: inventoryItems,
        },
      };

      booking = await prisma.booking.upsert({
        where: { id: bookingData.id },
        update: {
          status: 'CONFIRMED',
          depositPaid: true,
        },
        create: bookingData,
        include: {
          inventoryItems: true,
        },
      });
      console.log("Booking created/updated successfully:", booking.id);
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
        businessId: metadata.businessId,
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

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`PaymentIntent failed: ${paymentIntent.id}`);

  const metadata = paymentIntent.metadata;
  if (!metadata || !metadata.bookingId) {
    return;
  }

  try {
    // Update booking status if it exists
    await prisma.booking.updateMany({
      where: { id: metadata.bookingId },
      data: { status: 'PENDING' },
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
        bookingId: metadata.bookingId,
        businessId: metadata.businessId,
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
      eventAddress: booking.eventAddress,
      eventCity: booking.eventCity,
      eventState: booking.eventState,
      eventZipCode: booking.eventZipCode,
      participantCount: booking.participantCount,
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
    const emailHtml = `
      <p>Hello ${customer.name},</p>
      <p>Your booking with ${business.name} is confirmed!</p>
      <p>Please review and sign your rental waiver by clicking the link below:</p>
      <p><a href="${url}">Sign Your Waiver</a></p>
      <p>Thank you,</p>
      <p>The ${business.name} Team</p>
    `; // Improved email content
    await sendSignatureEmail({
      from: `${business.name} <onboarding@resend.dev>`, // Use dynamic business name
      to: customer.email,
      subject: `Action Required: Sign Your Waiver for Booking with ${business.name}`, // More specific subject
      html: emailHtml,
    });
    console.log(`[CONFIRMATION] Waiver email sent successfully to ${customer.email} for Booking ${bookingId}.`);

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

      // Update Booking
      await tx.booking.update({
        where: { id: internalInvoice.bookingId },
        data: {
          status: 'CONFIRMED',
          depositPaid: true, // Assuming invoice payment confirms everything
          isCompleted: true, // Mark as completed upon final payment
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

    // Call the confirmation handler
    console.log(`[HANDLER] Calling handleBookingConfirmation for Booking ID: ${bookingIdToConfirm}`);
    await handleBookingConfirmation(bookingIdToConfirm);

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

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`[HANDLER] Invoice Paid event received: ${invoice.id}. Delegating to handleInvoicePaymentSucceeded.`);
  // For this application's logic, the actions taken when an invoice is fully paid 
  // are covered by handleInvoicePaymentSucceeded. We call it to ensure 
  // idempotency and consistent state updates, even if both events fire.
  await handleInvoicePaymentSucceeded(invoice);
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
        data: { status: 'FAILED' as InvoiceStatus }, // Assumes FAILED enum value exists
      });

      // Update Booking status (e.g., back to PENDING or a specific FAILED status)
      if (internalInvoice.booking) {
        await tx.booking.update({
          where: { id: internalInvoice.bookingId },
          // Decide appropriate booking status: PENDING allows retry/manual intervention
          data: { status: 'PENDING' }, 
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
          voidedAt: new Date(), // Record void time
        },
      });

      if (internalInvoice.booking) {
        await tx.booking.update({
          where: { id: internalInvoice.bookingId },
          data: { status: 'CANCELLED' }, // Voiding cancels the booking
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
          data: { status: 'CANCELLED' }, // Deleting usually implies cancellation
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
