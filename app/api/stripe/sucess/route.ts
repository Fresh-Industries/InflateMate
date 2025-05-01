// app/api/stripe/success/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { syncStripeDataToDB } from '@/lib/stripe-sync';

const CALLBACK = '/callback';
const PRICING  = '/pricing';

export async function GET() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) {
    return NextResponse.redirect(PRICING);
  }

  const sub = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
    select: { stripeCustomerId: true },
  });
  if (!sub?.stripeCustomerId) {
    return NextResponse.redirect(PRICING);
  }

  // pull down the real subscription object and update your DB
  await syncStripeDataToDB(sub.stripeCustomerId);

  const updated = await prisma.subscription.findUnique({
    where: { organizationId: orgId },
    select: { status: true },
  });
  const isActive = ['active', 'trialing'].includes(updated?.status ?? '');

  return NextResponse.redirect(isActive ? CALLBACK : PRICING);
}
