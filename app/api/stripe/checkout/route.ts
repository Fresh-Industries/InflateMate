import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { organizationId } = body; // Expect the internal organizationId

  if (!organizationId) {
    return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
  }

  // 1️⃣ Load org, include business, memberships, and subscription
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: organizationId },
    include: {
      business: true,
      memberships: { include: { user: true } },
      subscription: true,
    },
  });

  // Verify the organization exists and the user is a member
  const isMember = organization?.memberships.some(m => m.user.clerkUserId === userId);
  if (!organization || !isMember) {
    return NextResponse.json({ error: 'Organization not found or user not a member' }, { status: 404 });
  }

  // If a subscription already exists and is active/trialing, redirect
  if (organization.subscription && ['active', 'trialing'].includes(organization.subscription.status)) {
    return NextResponse.json({ url: `/dashboard/${organization.business?.id}` });
  }

  // 2️⃣ Find or create the Stripe Customer for this Organization
  let customerId = organization.subscription?.stripeCustomerId;

  if (!customerId) {
    // Use the first member as the "owner" for Stripe customer info
    const owner = organization.memberships[0]?.user;

    const customer = await stripe.customers.create({
      email: owner?.email ?? undefined,
      name: owner?.name ?? undefined,
      metadata: {
        internalOrganizationId: organization.id,
        clerkOrgId: organization.clerkOrgId,
      },
    });
    customerId = customer.id;

    // Create/Upsert a placeholder Subscription record linked to the Organization
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

  // 3️⃣ Create Checkout Session
  const priceId = process.env.STRIPE_PRICE_ID!;
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: {
        internalOrganizationId: organization.id,
        clerkOrgId: organizationId,
        clerkUserId: userId,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_API_HOST}/callback`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_HOST}/pricing`,
    payment_method_types: ['card'],
    metadata: {
      internalOrganizationId: organization.id,
      clerkOrgId: organizationId,
      clerkUserId: userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
