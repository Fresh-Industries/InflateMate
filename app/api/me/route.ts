// app/api/me/route.ts
import { getCurrentUserWithOrgAndBusiness } from '@/lib/auth/clerk-utils';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getCurrentUserWithOrgAndBusiness();
  if (!user) {
    return NextResponse.json({ business: null, subscription: null });
  }

  console.log(user)

  // find subscription status if business exists
  const orgId = user.membership?.organization?.clerkOrgId;
  const business = user.membership?.organization?.business;
  const supabaseOrgId = user.membership?.organization?.id;

const subscription = orgId
  ? await prisma.subscription.findUnique({
      where: { organizationId: supabaseOrgId },
      select: { status: true },
    })
  : null;


  return NextResponse.json({ business, subscription, orgId });
}
