import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';
import { sendSignatureEmail } from '@/lib/sendEmail';

export async function POST(req: NextRequest, { params }: { params: Promise<{ businessId: string; bookingId: string }>}) {
  const { businessId, bookingId } = await params;

  try {
    // 1) Load business, booking (+currentQuote), customer, stripeCustomerId
    const business = await prisma.business.findUnique({ where: { id: businessId }});
    if (!business?.stripeAccountId) {
      return NextResponse.json({ error: 'Stripe not connected' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, currentQuote: true, inventoryItems: { include: { inventory: true } }, }
    });
    if (!booking || !booking.customer) {
      return NextResponse.json({ error: 'Booking/customer not found' }, { status: 404 });
    }

    // decide source of items: prefer currentQuote amounts if present else booking items
    const items = booking.inventoryItems.map(it => ({
      description: it.inventory.name,
      unitAmount: it.price, // already stored
      qty: it.quantity,
      stripeProductId: it.inventory.stripeProductId || null,
      stripePriceId: it.inventory.stripePriceId || null,
    }));

    // You should already have stripeCustomerId via your helper; fetch/create if needed
    const customerStripe = await prisma.customerStripeAccount.findFirst({
      where: { customerId: booking.customer.id, businessId }
    });
    if (!customerStripe?.stripeCustomerId) {
      return NextResponse.json({ error: 'Stripe customer missing' }, { status: 400 });
    }

    const stripeAccount = business.stripeAccountId;

    // Ensure Stripe customer has email and destination address before creating invoice (used for tax)
    await stripe.customers.update(customerStripe.stripeCustomerId, {
      email: booking.customer.email,
      address: {
        line1: booking.eventAddress || undefined,
        city: booking.eventCity || undefined,
        state: booking.eventState || undefined,
        postal_code: booking.eventZipCode || undefined,
        country: 'US',
      }
    }, { stripeAccount });

    // 2) Create invoice (send_invoice) with automatic tax
    const inv = await stripe.invoices.create({
      customer: customerStripe.stripeCustomerId,
      collection_method: 'send_invoice',
      days_until_due: 3,
      automatic_tax: { enabled: true },
      metadata: {
        prismaBusinessId: businessId,
        prismaBookingId: bookingId,
        prismaCustomerId: booking.customer.id,
        prismaSource: 'dashboard_send_invoice',
      },
    }, { stripeAccount });

    // 3) Add lines - prefer price reference when available for automatic tax
    for (const it of items) {
      const unitAmount = (it.unitAmount || 0);
      const quantity = it.qty || 1;
      if (quantity <= 0 || unitAmount <= 0) {
        console.warn(`Skipping invoice item with non-positive amount/qty: ${it.description}`);
        continue;
      }

      try {
        if (it.stripeProductId) {
          // Use product with explicit tax_behavior
          await stripe.invoiceItems.create({
            customer: customerStripe.stripeCustomerId,
            invoice: inv.id,
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(unitAmount * 100),
              product: it.stripeProductId,
              tax_behavior: 'exclusive',
            },
            quantity,
            description: it.description,
          }, { stripeAccount });
        } else if (it.stripePriceId) {
          // Retrieve price to obtain its product id, then create inline price_data with tax_behavior
          const priceObj = await stripe.prices.retrieve(it.stripePriceId, { stripeAccount });
          const productId = (priceObj.product as unknown as string) || undefined;
          if (productId) {
            await stripe.invoiceItems.create({
              customer: customerStripe.stripeCustomerId,
              invoice: inv.id,
              price_data: {
                currency: 'usd',
                unit_amount: Math.round(unitAmount * 100),
                product: productId,
                tax_behavior: 'exclusive',
              },
              quantity,
              description: it.description,
            }, { stripeAccount });
          } else {
            await stripe.invoiceItems.create({
              customer: customerStripe.stripeCustomerId,
              invoice: inv.id,
              currency: 'usd',
              amount: Math.round(unitAmount * quantity * 100),
              description: it.description,
            }, { stripeAccount });
          }
        } else {
          // Last fallback: raw amount line
          await stripe.invoiceItems.create({
            customer: customerStripe.stripeCustomerId,
            invoice: inv.id,
            currency: 'usd',
            amount: Math.round(unitAmount * quantity * 100),
            description: it.description,
          }, { stripeAccount });
        }
        console.log(`Successfully created invoice item for: ${it.description}`);
      } catch (itemError) {
        console.error(`Error creating invoice item for ${it.description}:`, itemError);
        throw itemError;
      }
    }

    // 4) Finalize + send
    const finalized = await stripe.invoices.finalizeInvoice(inv.id!, { auto_advance: true }, { stripeAccount });
    await stripe.invoices.sendInvoice(finalized.id!, {}, { stripeAccount });

    // Re-fetch to confirm if Stripe actually queued an email
    const refreshed = await stripe.invoices.retrieve(finalized.id!, { stripeAccount });

    // Log useful diagnostics
    console.log({
      stripeAccount,
      amount_due: finalized.amount_due,
      hosted: finalized.hosted_invoice_url,
      sent_at: (refreshed.status_transitions as { sent_at?: number })?.sent_at,
    });

    // Fallback to Resend if Stripe email didn't go out (common on Custom)
    if (!(refreshed.status_transitions as { sent_at?: number })?.sent_at) {
      // Defensive: require a recipient and link
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
            <p><a href="${hosted}">View & Pay Invoice</a></p>
            <p>Due: ${refreshed.due_date ? new Date(refreshed.due_date * 1000).toLocaleString() : '—'}</p>
          `,
        });
        console.log('[SendInvoice] Stripe email disabled or unavailable; sent via Resend.');
      } else {
        console.warn('[SendInvoice] No hosted URL or recipient; cannot email invoice.');
      }
    }

    // 5) Upsert DB (optimistic; webhook remains source of truth)
    const invoiceRow = await prisma.invoice.upsert({
      where: { stripeInvoiceId: finalized.id },
      update: {
        status: 'OPEN',
        amountDue: (finalized.amount_due ?? 0) / 100,
        amountRemaining: (finalized.amount_remaining ?? 0) / 100,
        amountPaid: (finalized.amount_paid ?? 0) / 100,
        currency: (finalized.currency ?? 'usd').toUpperCase(),
        hostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
        invoicePdfUrl: finalized.invoice_pdf ?? null,
        dueAt: finalized.due_date ? new Date(finalized.due_date * 1000) : null,
        metadata: finalized.metadata as Record<string, string>,
      },
      create: {
        stripeInvoiceId: finalized.id,
        status: 'OPEN',
        amountDue: (finalized.amount_due ?? 0) / 100,
        amountRemaining: (finalized.amount_remaining ?? 0) / 100,
        amountPaid: (finalized.amount_paid ?? 0) / 100,
        currency: (finalized.currency ?? 'usd').toUpperCase(),
        hostedInvoiceUrl: finalized.hosted_invoice_url ?? null,
        invoicePdfUrl: finalized.invoice_pdf ?? null,
        dueAt: finalized.due_date ? new Date(finalized.due_date * 1000) : null,
        businessId,
        customerId: booking.customer.id,
        bookingId: booking.id,
        metadata: finalized.metadata as Record<string, string>,
      }
    });

    // 6) Mark current quote as ACCEPTED when invoice is sent
    if (booking.currentQuote?.id) {
      try {
        await prisma.quote.update({
          where: { id: booking.currentQuote.id },
          data: { status: 'ACCEPTED' },
        });
      } catch (e) {
        console.warn(`[SendInvoice] Failed to mark quote ${booking.currentQuote.id} as ACCEPTED:`, e);
      }
    }

    return NextResponse.json({
      message: 'Invoice created and sent',
      stripeInvoiceId: invoiceRow.stripeInvoiceId,
      hostedInvoiceUrl: invoiceRow.hostedInvoiceUrl,
      dueAt: invoiceRow.dueAt,
    });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
} 