// lib/stripe-sync.ts
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';
import { SubscriptionType } from '@/prisma/generated/prisma';

/**
 * Syncs the most recent Stripe subscription for a customer into your DB.
 * If no subscription exists, upserts a row with status 'none'.
 */
export async function syncStripeDataToDB(customerId: string, plan: string): Promise<void> {
  console.log(`🔄 syncStripeDataToDB(${customerId})`);

  // 1️⃣ Fetch latest subscription from Stripe
  const list = await stripe.subscriptions.list({
    customer: customerId,
    limit: 1,
    expand: ['data.default_payment_method'],
    status: 'all',
  });

  // 2️⃣ If none, update existing record (if found) status to 'none'.
  if (list.data.length === 0) {
    console.warn(`⚠️ No Stripe subs for customer ${customerId}; attempting to mark existing as 'none'`);
    // Find existing subscription record by customer ID to update its status.
    // We don't create a 'none' record if one doesn't exist, as we lack organization context here.
    const updatedCount = await prisma.subscription.updateMany({
      where: { stripeCustomerId: customerId },
      data: { status: 'none' },
    });
    if (updatedCount.count > 0) {
        console.log(`✅ Marked existing subscription for customer ${customerId} as 'none'.`);
    } else {
        console.warn(`⚠️ No existing DB subscription found for customer ${customerId} to mark as 'none'.`);
    }
    return;
  }

  // 3️⃣ Otherwise extract the single subscription and organization info
  const sub = list.data[0];
  console.log('Processing subscription:', sub.id);
  const clerkOrgId    = sub.metadata.clerkOrgId;
  if (!clerkOrgId) {
    // Consider logging this specific sub ID for debugging
    console.error(`Missing clerkOrgId in subscription metadata for sub ${sub.id}, customer ${customerId}`);
    throw new Error(`Missing clerkOrgId in sub metadata for ${sub.id}`);
  }

  // Find the Prisma Organization ID using the clerkOrgId from metadata
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: clerkOrgId },
    select: { id: true }
  });

  if (!organization) {
    // If the organization doesn't exist in your DB, you can't link the subscription.
    // This might indicate an out-of-sync state between Clerk/Stripe and your DB.
    console.error(`Organization not found for clerkOrgId: ${clerkOrgId} (from sub ${sub.id}, customer ${customerId}). Cannot sync subscription.`);
    // Depending on requirements, you might throw, or just return/log. Throwing for now.
    throw new Error(`Organization not found for clerkOrgId: ${clerkOrgId}`);
  }
  const prismaOrganizationId = organization.id;
  console.log(`Found Prisma organizationId: ${prismaOrganizationId} for clerkOrgId: ${clerkOrgId}`);


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

  // 4️⃣ Idempotent upsert keyed on stripeCustomerId
  await prisma.subscription.upsert({
    where: { stripeCustomerId: customerId }, // <-- Use customerId as the key
    update: {
      // Update all fields with latest data from Stripe
      organizationId:       prismaOrganizationId, // <-- Use looked-up Prisma Org ID
      stripeSubscriptionId: stripeSubscriptionId, // <-- Update to latest Sub ID
      status,
      priceId,
      currentPeriodStart: new Date(startTs),
      currentPeriodEnd:   new Date(endTs),
      cancelAtPeriodEnd,
      type: plan.toUpperCase() as SubscriptionType,
    },
    create: {
      // Create with all fields required by the schema
      organizationId:       prismaOrganizationId, // <-- Use looked-up Prisma Org ID
      stripeSubscriptionId,
      stripeCustomerId:     customerId,
      status,
      priceId,
      currentPeriodStart: new Date(startTs),
      currentPeriodEnd:   new Date(endTs),
      cancelAtPeriodEnd,
      type: plan.toUpperCase() as SubscriptionType,
    }
  });

  // Updated log message
  console.log(`✅ Synced sub ${stripeSubscriptionId} for customer ${customerId} → org ${prismaOrganizationId}`);
}
