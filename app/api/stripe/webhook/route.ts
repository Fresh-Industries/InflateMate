import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const relevantEvents = new Set([
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'charge.refunded',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  // Only process relevant events
  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update payment and booking status
        await prisma.$transaction(async (tx) => {
          // Update payment status
          const payment = await tx.payment.update({
            where: { stripePaymentId: paymentIntent.id },
            data: { 
              status: 'COMPLETED',
              paidAt: new Date(),
            },
            include: {
              booking: true,
            },
          });

          if (payment.booking) {
            // Update booking status
            await tx.booking.update({
              where: { id: payment.booking.id },
              data: { 
                status: 'CONFIRMED',
                depositPaid: true,
              },
            });

            // Update customer stats
            await tx.customer.update({
              where: { id: payment.booking.customerId },
              data: {
                totalSpent: {
                  increment: payment.amount,
                },
              },
            });
          }
        });
        break;
      }

      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        await prisma.$transaction(async (tx) => {
          // Update payment status
          const payment = await tx.payment.update({
            where: { stripePaymentId: paymentIntent.id },
            data: { 
              status: 'FAILED',
              error: paymentIntent.last_payment_error?.message,
            },
            include: {
              booking: true,
            },
          });

          if (payment.booking) {
            // Update booking status to pending payment
            await tx.booking.update({
              where: { id: payment.booking.id },
              data: { 
                status: 'PENDING_PAYMENT',
                depositPaid: false,
              },
            });
          }
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        if (charge.payment_intent) {
          await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
              where: { stripePaymentId: charge.payment_intent.toString() },
              data: {
                status: 'REFUNDED',
                refundAmount: charge.amount_refunded / 100,
                refundReason: charge.refunds.data[0]?.reason || 'No reason provided',
              },
              include: {
                booking: true,
              },
            });

            if (payment.booking) {
              await tx.booking.update({
                where: { id: payment.booking.id },
                data: { 
                  status: 'CANCELLED',
                  depositPaid: false,
                },
              });

              // Update customer stats
              await tx.customer.update({
                where: { id: payment.booking.customerId },
                data: {
                  totalSpent: {
                    decrement: payment.refundAmount || payment.amount,
                  },
                },
              });
            }
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 