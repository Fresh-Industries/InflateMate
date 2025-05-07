import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming prisma client is initialized here
import { stripe } from "@/lib/stripe-server"; // Make sure stripe client is initialized
import { z } from "zod";
import Stripe from "stripe";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Import Prisma error type
import { findOrCreateStripeCustomer } from "@/lib/stripe/customer-utils"; // Import the helper function

// Define a schema for validation
const invoiceSchema = z.object({
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
  bookingId: z.string().uuid("Valid Booking ID is required"),
  eventTimeZone: z.string().optional()
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;

  if (!businessId) {
    return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Validate request body
    const validation = invoiceSchema.safeParse(body);
    if (!validation.success) {
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

      // 2. Find or create the Prisma customer
      let customer = await prisma.customer.findUnique({
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
                  address: eventAddress,
                  city: eventCity,
                  state: eventState,
                  zipCode: eventZipCode,
                  businessId: businessId,
              },
          });
      } else {
          console.log(`Updating existing customer: ${customerEmail}`);
          customer = await prisma.customer.update({
              where: { id: customer.id },
              data: { 
                  name: customerName,
                  phone: customerPhone,
               },
          });
      }

      // 3. Get or Create Stripe Customer ID using the helper function
      const stripeCustomerId = await findOrCreateStripeCustomer(
        customerEmail,
        customerName,
        customerPhone,
        eventCity,
        eventState,
        eventAddress,
        eventZipCode,
        businessId,
        stripeConnectedAccountId
      );
      console.log(`Using Stripe Customer ID from helper: ${stripeCustomerId}`);
      
      if (!stripeCustomerId) { 
         throw new Error("Missing Stripe Customer ID after calling helper"); 
      }

      // 4. Create Stripe Invoice Items
      console.log(`Creating ${selectedItems.length} invoice items for Stripe customer ${stripeCustomerId}`);
      const invoiceItemPromises = selectedItems.map(item => {
        const unitAmountCents = Math.round(item.price * 100);

        return stripe.invoiceItems.create({
          customer: stripeCustomerId,
          amount: unitAmountCents * item.quantity,
          currency: 'usd',
          description: item.name,
        }, { stripeAccount: stripeConnectedAccountId });
      });
      await Promise.all(invoiceItemPromises);
      console.log("Successfully created Stripe invoice items.");

      // 5. Create Stripe Invoice (Draft)
      console.log("Creating Stripe invoice...");
      const stripeInvoice = await stripe.invoices.create({
        customer: stripeCustomerId, // Use the ID obtained from the helper
        collection_method: 'send_invoice',

        days_until_due: 7, 
        auto_advance: false, 
        metadata: {
          prismaBookingId: bookingId,
          prismaBusinessId: businessId,
          prismaCustomerId: customer.id,
        },
        description: `Invoice for event on ${eventDate}`, 
      }, { stripeAccount: stripeConnectedAccountId });
      console.log(`Created Stripe draft invoice: ${stripeInvoice.id}`);

      // 6. Finalize the Invoice
      if (!stripeInvoice || !stripeInvoice.id) {
        console.error("Stripe Invoice creation failed to return an ID before finalization.");
        throw new Error("Failed to create Stripe invoice before finalization");
      }
      console.log(`Finalizing Stripe invoice: ${stripeInvoice.id}`);
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id, { 
        stripeAccount: stripeConnectedAccountId 
      });
      console.log(`Finalized Stripe invoice: ${finalizedInvoice.id}, Status: ${finalizedInvoice.status}`);

      if (!finalizedInvoice || !finalizedInvoice.id || (finalizedInvoice.status !== 'open' && finalizedInvoice.status !== 'paid')) {
          console.error("Stripe Invoice finalization did not return expected result (open or paid):", finalizedInvoice);
          throw new Error("Failed to confirm Stripe invoice finalization with expected status");
      }

      // Prepare dates
      const startDateTime = new Date(`${eventDate}T${startTime}`);
      const endDateTime = new Date(`${eventDate}T${endTime}`); 
      const invoiceIssuedAt = finalizedInvoice.status_transitions?.finalized_at ? new Date(finalizedInvoice.status_transitions.finalized_at * 1000) : new Date();
      const invoiceDueAt = finalizedInvoice.due_date ? new Date(finalizedInvoice.due_date * 1000) : null;
      const internalExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour hold

      // 7. Create Booking, BookingItems, and Invoice in DB Transaction
      console.log("Starting database transaction for Booking and Invoice...");
      const [newBooking, newInvoice] = await prisma.$transaction(async (tx) => {
          const createdBooking = await tx.booking.create({
              data: {
                  id: bookingId,
                  eventDate: new Date(eventDate),
                  startTime: startDateTime,
                  endTime: endDateTime,
                  status: 'PENDING',
                  totalAmount: totalAmount, // Use number (Float)
                  subtotalAmount: subtotalAmount, // Use number (Float)
                  taxAmount: taxAmount, // Use number (Float)
                  taxRate: taxRate, // Use number (Float)
                  eventType: eventType,
                  eventAddress: eventAddress,
                  eventCity: eventCity,
                  eventState: eventState,
                  eventZipCode: eventZipCode,
                  eventTimeZone: eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                  participantCount: participantCount,
                  participantAge: participantAge ? parseInt(participantAge, 10) : null,
                  specialInstructions: specialInstructions,
                  businessId: businessId,
                  customerId: customer.id, 
                  inventoryItems: {
                      create: selectedItems.map(item => ({
                          inventoryId: item.id, 
                          quantity: item.quantity, 
                          price: item.price, // Use number (Float)
                      })),
                  },
              },
          });

          const createdInvoice = await tx.invoice.create({
              data: {
                  status: 'OPEN',
                  // Pass numbers (Float)
                  amountDue: totalAmount, 
                  amountPaid: 0, 
                  amountRemaining: totalAmount, 
                  currency: finalizedInvoice.currency.toUpperCase(),
                  stripeInvoiceId: finalizedInvoice.id, 
                  hostedInvoiceUrl: finalizedInvoice.hosted_invoice_url,
                  invoicePdfUrl: finalizedInvoice.invoice_pdf,
                  issuedAt: invoiceIssuedAt,
                  dueAt: invoiceDueAt,
                  expiresAt: internalExpiresAt, 
                  businessId: businessId,
                  customerId: customer.id,
                  bookingId: createdBooking.id,
              }
          });
          
           // Update customer booking count and last booking 
           await tx.customer.update({
              where: { id: customer.id },
              data: {
                bookingCount: { increment: 1 },
                // Pass number for increment (Float)
                totalSpent: { increment: totalAmount }, 
                lastBooking: new Date(),
              }
            });

          console.log(`Transaction successful: Booking ${createdBooking.id}, Invoice ${createdInvoice.id}`);
          return [createdBooking, createdInvoice];
      });
      console.log("Database transaction completed.");

      // --- End: Database and Stripe Operations ---

      return NextResponse.json(
        { 
          message: "Invoice sent successfully via Stripe", 
          bookingId: newBooking.id,
          invoiceId: newInvoice.id,
          stripeInvoiceId: newInvoice.stripeInvoiceId 
        }, 
        { status: 200 } // 200 OK
      );

    } catch (error) {
      // Enhanced Error Handling
      console.error("[INVOICE_CREATION_ERROR]", error); // Log the raw error

      if (error instanceof z.ZodError) {
         console.error("Validation Error Details:", error.errors);
         return NextResponse.json({ error: "Invalid input data provided.", details: error.flatten().fieldErrors }, { status: 400 });
      }
       if (error instanceof Stripe.errors.StripeError) {
          console.error("Stripe API Error:", { code: error.code, message: error.message, type: error.type });
          // Provide a more user-friendly message if possible
          let userMessage = "An error occurred while processing the invoice with our payment provider.";
          if (error.code === 'account_invalid') {
            userMessage = "Stripe account configuration error. Please contact support.";
          } else if (error.code === 'parameter_invalid') {
            userMessage = `Invalid data sent to payment provider: ${error.param}.`;
          }
          return NextResponse.json({ error: userMessage, stripeErrorCode: error.code }, { status: 500 });
      }
       if (error instanceof PrismaClientKnownRequestError) {
           console.error("Prisma Database Error:", { code: error.code, meta: error.meta });
           // Example: Handle unique constraint violation
           if (error.code === 'P2002') {
                return NextResponse.json({ error: "A record with this identifier already exists.", field: error.meta?.target }, { status: 409 }); // Conflict
           }
           return NextResponse.json({ error: "A database error occurred.", code: error.code }, { status: 500 });
       }
       if (error instanceof Error) {
            // Generic error handling
            console.error("Generic Error:", error.message);
            return NextResponse.json({ error: error.message || "An unexpected internal server error occurred." }, { status: 500 });
       }

      // Fallback for non-Error objects thrown
      console.error("Unknown Error Type:", error);
      return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }

  } catch (error) {
    console.error("Error processing invoice request:", error);
    // Handle Prisma errors specifically if needed (e.g., P2002 unique constraint)
    if (error instanceof z.ZodError) {
       return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 });
    }
     if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json({ error: `Stripe Error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 