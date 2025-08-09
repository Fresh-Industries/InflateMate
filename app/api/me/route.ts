// app/api/me/route.ts
import { getCurrentUserWithOrgAndBusiness, getPrimaryMembership } from '@/lib/auth/clerk-utils';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUserWithOrgAndBusiness();
  if (!user) {
    return NextResponse.json({ business: null, subscription: null });
  }

  console.log(user)

  // find subscription status if business exists
  const membership = getPrimaryMembership(user);
  const orgId = membership?.organization?.clerkOrgId;
  const business = membership?.organization?.business;
  const stripeAccountId = business?.stripeAccountId;
  const organizationId = membership?.organizationId;

const subscription = organizationId
  ? await prisma.subscription.findUnique({
      where: { organizationId: organizationId },
      select: { status: true },
    })
  : null;


  return NextResponse.json({ business, subscription, orgId, stripeAccountId });
}
