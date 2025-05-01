// lib/stripe-sync.ts
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';

/**
 * Syncs the most recent Stripe subscription for a customer into your DB.
 * If no subscription exists, upserts a row with status 'none'.
 */
export async function syncStripeDataToDB(customerId: string): Promise<void> {
  console.log(`🔄 syncStripeDataToDB(${customerId})`);

  // 1️⃣ Fetch latest subscription from Stripe
  const list = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    expand: ['data.default_payment_method'],
    status: 'all',
  });

  // 2️⃣ If none, upsert a 'none' status row
  if (list.data.length === 0) {
    console.warn(`⚠️ No Stripe subs for customer ${customerId}; marking 'none'`);
    // Find org by existing stripeCustomerId
    const existing = await prisma.subscription.findFirst({
      where: { stripeCustomerId: customerId },
      select: { organizationId: true }
    });
    if (existing?.organizationId) {
      await prisma.subscription.upsert({
        where: { organizationId: existing.organizationId },
        update: { status: 'none' },
        create: {
          organizationId:         existing.organizationId,
          stripeCustomerId:       customerId,
          stripeSubscriptionId:   '',
          priceId:                '',
          status:                 'none',
          currentPeriodStart:     new Date(0),
          currentPeriodEnd:       new Date(0),
          cancelAtPeriodEnd:      false,
        }
      });
    }
    return;
  }

  // 3️⃣ Otherwise extract the single subscription
  const sub = list.data[0];
  const orgId    = sub.metadata.organizationId;
  if (!orgId) {
    throw new Error(`Missing organizationId in sub metadata for ${sub.id}`);
  }

  const stripeSubscriptionId = sub.id;
  const status               = sub.status;
  const priceId              = sub.items.data[0]?.price.id ?? '';
  // Use intersection type to tell TS about expected properties
  const typedSub = sub as import('stripe').Stripe.Subscription & {
    current_period_start?: number;
    current_period_end?: number;
    cancel_at_period_end?: boolean;
  };
  const startTs              = (typedSub.current_period_start ?? 0) * 1000;
  const endTs                = (typedSub.current_period_end   ?? 0) * 1000;
  const cancelAtPeriodEnd    = Boolean(typedSub.cancel_at_period_end);

  // 4️⃣ Idempotent upsert keyed on stripeSubscriptionId
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId },
    update: {
      stripeCustomerId:    customerId,
      status,
      priceId,
      currentPeriodStart: new Date(startTs),
      currentPeriodEnd:   new Date(endTs),
      cancelAtPeriodEnd,
    },
    create: {
      organizationId:      orgId,
      stripeSubscriptionId,
      stripeCustomerId:    customerId,
      status,
      priceId,
      currentPeriodStart: new Date(startTs),
      currentPeriodEnd:   new Date(endTs),
      cancelAtPeriodEnd,
    }
  });

  console.log(`✅ Synced sub ${stripeSubscriptionId} → org ${orgId}`);
}
