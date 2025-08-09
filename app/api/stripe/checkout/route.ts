// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserWithOrgAndBusiness, getPrimaryMembership } from '@/lib/auth/clerk-utils';

export async function POST(req: Request) {
  // 1️⃣ Load user + org + business + subscription
  const userWithOrg = await getCurrentUserWithOrgAndBusiness();
  if (!userWithOrg) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const membership = getPrimaryMembership(userWithOrg);
  if (!membership) {
    return NextResponse.json({ error: 'No organization found' }, { status: 401 });
  }
  
  console.log(userWithOrg)

  const { organization } = membership;
  const { business, subscription } = organization;

  if (!organization) {
    return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
  }

  // 2️⃣ Parse and validate request body
  const { organizationId, plan } = await req.json();
  console.log(organizationId, plan)
  if (!organizationId || !plan) {
    return NextResponse.json(
      { error: 'Organization ID and plan are required' },
      { status: 400 }
    );
  }

  // Sanity check: ensure the clerkOrgId matches
  console.log(organization.clerkOrgId, organizationId)
  if (organization.clerkOrgId !== organizationId) {
    return NextResponse.json(
      { error: 'Organization mismatch' },
      { status: 403 }
    );
  }

  // 3️⃣ If already active or trialing, just send them to the dashboard
  if (subscription && ['active', 'trialing'].includes(subscription.status)) {
    return NextResponse.json({ url: `/dashboard/${business?.id}` });
  }

  // 4️⃣ Find or create Stripe Customer
  let customerId = subscription?.stripeCustomerId;
  if (!customerId) {
    // Use the user's email/name from prisma record
    const customer = await stripe.customers.create({
      email: userWithOrg.email ?? undefined,
      name: userWithOrg.name ?? undefined,
      metadata: {
        internalOrganizationId: organization.id,
        clerkOrgId: organization.clerkOrgId,
      },
    });
    customerId = customer.id;

    // Upsert a placeholder subscription record
    await prisma.subscription.upsert({
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

  // 5️⃣ Map plan keys to your env‑stored Stripe Price IDs
  const priceIdMap: Record<string,string> = {
    solo: process.env.STRIPE_SOLO_PRICE_ID!,
    growth: process.env.STRIPE_GROWTH_PRICE_ID!,
  };
  const priceId = priceIdMap[plan];
  console.log(priceId)
  if (!priceId) {
    return NextResponse.json(
      { error: `Unknown plan: ${plan}` },
      { status: 400 }
    );
  }

  // 6️⃣ Create the Checkout Session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: {
        internalOrganizationId: organization.id,
        clerkOrgId: organization.clerkOrgId,
        clerkUserId: userWithOrg.clerkUserId,
      },
    },
    success_url:  `${process.env.NEXT_PUBLIC_API_HOST}/callback`,
    cancel_url:   `${process.env.NEXT_PUBLIC_API_HOST}/pricing`,
    payment_method_types: ['card'],
    metadata: {
      internalOrganizationId: organization.id,
      clerkOrgId: organization.clerkOrgId,
      clerkUserId: userWithOrg.clerkUserId,
    },
  });

  return NextResponse.json({ url: session.url });
}
