import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Stripe } from "stripe";
import { createLocalDate, createLocalDateTime } from "@/lib/utils";
import { sendSignatureEmail } from "@/lib/sendEmail";
import { generateWaiverPDF } from "@/lib/generateWaiver";
import { sendToOpenSign } from "@/lib/openSign";


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

  try {
    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Processing payment_intent.succeeded: ${paymentIntent.id}`);
        try {
          await handlePaymentIntentSucceeded(paymentIntent);
        } catch (error) {
          console.error(`Error processing payment_intent.succeeded: ${error instanceof Error ? error.message : 'Unknown error'}`);
          // Log and continue without throwing
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

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error(`Error processing webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return NextResponse.json({ error: "Error processing webhook" }, { status: 500 });
  }
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
        endTime: metadata.endTime
      });
      
      // New – now treating these as local time values
      const startDateTime = createLocalDateTime(metadata.eventDate, metadata.startTime);
      const endDateTime = createLocalDateTime(metadata.eventDate, metadata.endTime);
      const eventDate = createLocalDate(metadata.eventDate);
      
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
        eventDate: eventDate,
        startTime: startDateTime,
        endTime: endDateTime,
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
    
   // Prepare data for PDF generation
   const pdfData = {
     customer: {
       id: customer.id,
       name: customer.name,
       email: customer.email,
       phone: customer.phone,
     },
     booking: {
       id: booking.id,
       eventDate: metadata.eventDate, 
       eventAddress: metadata.eventAddress,
       eventCity: metadata.eventCity,
       eventState: metadata.eventState,
       eventZipCode: metadata.eventZipCode,
       participantCount: parseInt(metadata.participantCount) || 1,
       participantAge: metadata.participantAge ? parseInt(metadata.participantAge) : undefined,
     },
     business: {
       id: business?.id || '' ,
       name: business?.name || '',
       logo: business?.logo || null,
       phone: business?.phone || null,
       email: business?.email || null,
     },
     templateVersion: 'v1',
   };

   // Log the data being passed to generateWaiverPDF
   console.log("Data for PDF generation:", JSON.stringify(pdfData, null, 2));

   // Generate the waiver PDF
   const pdfBuffer = await generateWaiverPDF(pdfData);
    // Send the PDF to OpenSign to get a signing URL
    const {url, documentId} = await sendToOpenSign(pdfBuffer, customer.email, business?.name || '', customer.name || '');
    console.log("OpenSign URL:", url);
    console.log("OpenSign Document ID:", documentId);

    // Create a new waiver record in the database
    await prisma.waiver.create({
      data: {
        businessId: metadata.businessId,
        customerId: customer.id,
        bookingId: booking.id,
        status: 'PENDING',
        templateVersion: 'v1',
        documentUrl: url, 
        openSignDocumentId: documentId
      },
    });
    console.log("Waiver record created.");

    // Send the waiver email via Resend
    const emailHtml = `
      <p>Hello ${customer.name},</p>
      <p>Please review and sign your waiver by clicking <a href="${url}">here</a>.</p>
      <p>Thank you,</p>
      <p>The Inflatemate Team</p>
    `;
    await sendSignatureEmail({
      from: business?.email || "onboarding@resend.dev",
      to: customer.email,
      subject: 'Your Inflatemate Waiver is Ready for Signature',
      html: emailHtml,
    });
    console.log(`Waiver email sent to ${customer.email}`);

    console.log(`Booking ${booking.id} confirmed successfully`);
  } catch (error) {
    console.error('Error processing payment success:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
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