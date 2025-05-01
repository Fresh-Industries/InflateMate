// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';

export async function POST() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 1️⃣ load org → include business.user & existing subscription
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: {
      business: { include: { user: true } },
      subscription: true,
    },
  });
  if (!organization?.business?.user) {
    return NextResponse.json({ error: 'Org or owner not found' }, { status: 404 });
  }

  const owner = organization.business.user;
  let sub = organization.subscription;
  let customerId = sub?.stripeCustomerId;

  // 2️⃣ ensure Stripe Customer + placeholder Subscription row
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: owner.email ?? undefined,
      name: owner.name ?? undefined,
      metadata: {
        clerkUserId: owner.clerkUserId ?? userId,
        organizationId: organization.id,
      },
    });
    customerId = customer.id;

    sub = await prisma.subscription.upsert({
      where: { organizationId: organization.id },
      create: {
        organizationId: organization.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: '',
        status: 'incomplete',
        priceId: '',
        currentPeriodStart: new Date(0),
        currentPeriodEnd: new Date(0),
        cancelAtPeriodEnd: false,
      },
      update: { stripeCustomerId: customerId },
    });
  }

  // 3️⃣ create Checkout Session
  const priceId = process.env.STRIPE_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { organizationId: organization.id, userId },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    payment_method_types: ['card'],
    metadata: { organizationId: organization.id, userId },
  });

  return NextResponse.json({ url: session.url });
}
