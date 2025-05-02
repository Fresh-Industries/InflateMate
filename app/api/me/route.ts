// app/api/me/route.ts
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.json({ business: null, subscription: null });
  }

  // find your organization → its business
  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    select: {
      business: { select: { id: true } },
    },
  });
  const business = org?.business ?? null;

  // find subscription status if business exists
  const subscription = business
    ? await prisma.subscription.findUnique({
        where: { organizationId: business.id },
        select: { status: true },
      })
    : null;

  return NextResponse.json({ business, subscription, orgId });
}
