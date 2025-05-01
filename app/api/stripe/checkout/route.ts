// app/api/stripe/checkout/route.ts
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

  // 1️⃣ load org → include business.user & existing subscription
  const organization = await prisma.organization.findUnique({
    where: { clerkOrgId: organizationId },
    include: {
      business: { include: { user: true } },
      memberships: { include: { user: true } },
      subscription: true,
    },
  });
  // Verify the organization exists and the user is a member
  if (!organization || organization.memberships.length === 0) {
    return NextResponse.json({ error: 'Organization not found or user not a member' }, { status: 404 });
  }

  // If a subscription already exists and is active/trialing, redirect
  if (organization.subscription && ['active', 'trialing'].includes(organization.subscription.status)) {
      // Redirect to the dashboard or a page indicating they are already subscribed
       return NextResponse.json({ url: `/dashboard/${organization.business?.id}` }); // Assume business exists after onboarding
   }

   // Find or create the Stripe Customer for this Organization
  let customerId = organization.subscription?.stripeCustomerId;

  if (!customerId) {
    const owner = organization.business?.user; // Get the founding user details

    const customer = await stripe.customers.create({
      email: owner?.email ?? undefined,
      name: owner?.name ?? undefined,
      metadata: {
        internalOrganizationId: organization.id, // Link Stripe Customer to internal Organization ID
        clerkOrgId: organization.clerkOrgId, // Include Clerk Org ID
      },
    });
    customerId = customer.id;

    // Create/Upsert a placeholder Subscription record linked to the Organization
     await prisma.subscription.upsert({
       where: { organizationId: organization.id }, // Key on internal organizationId
       create: {
         organizationId: organization.id,
         stripeCustomerId: customerId,
         stripeSubscriptionId: '',
         status: 'incomplete', // Initial status
         priceId: '',
         currentPeriodStart: new Date(0),
         currentPeriodEnd: new Date(0),
         cancelAtPeriodEnd: false,
       },
       update: { stripeCustomerId: customerId }, // If it existed for some reason, update customer ID
     });
  }


  // 3️⃣ create Checkout Session
  const priceId = process.env.STRIPE_PRICE_ID!; // Ensure this is set

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
     subscription_data: {
      metadata: {
         internalOrganizationId: organization.id, // Pass internal Organization ID
         clerkOrgId: organization.clerkOrgId, // Pass Clerk Org ID
         clerkUserId: userId, // Pass Clerk User ID (optional, but can be helpful)
       },
     },
    // Set success_url and cancel_url to redirect back to your application
    success_url: `${process.env.NEXT_PUBLIC_API_HOST}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_HOST}/pricing`, // Redirect back to pricing if canceled
    payment_method_types: ['card'],
    metadata: {
       internalOrganizationId: organization.id, // Pass internal Organization ID
       clerkOrgId: organization.clerkOrgId, // Pass Clerk Org ID
       clerkUserId: userId, // Pass Clerk User ID
    },
  });

  return NextResponse.json({ url: session.url });
}