// app/api/stripe/customer-portal/route.ts
import { NextResponse } from 'next/server';
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from '@/lib/auth/clerk-utils';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe-server';

export async function POST() {
  const user = await getCurrentUserWithOrgAndBusiness();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: user.memberships[0]?.organizationId },
      select: {
        id: true,
        business: { // Include business to get its ID for the return URL
            select: { id: true }
        },
        subscription: {
          select: {
            stripeCustomerId: true,
          },
        },
      },
    });

    if (!organization || !organization.business?.id || !organization.subscription?.stripeCustomerId) {
      console.warn(`Customer Portal request for user ${user.id} in org ${user.memberships[0]?.organizationId}: No organization, business, or linked Stripe customer found.`);
      return NextResponse.json({ error: 'Subscription or business information not found.' }, { status: 404 });
    }

    const businessId = organization.business.id;

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const customerId = organization.subscription.stripeCustomerId;

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_API_HOST}/dashboard/${businessId}/settings?section=billing`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("[STRIPE_CUSTOMER_PORTAL_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to create customer portal session." },
      { status: 500 }
    );
  }
}
