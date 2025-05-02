// app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    // Consider a different status code or response if unauthorized but in a private route
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find the Organization linked to the active Clerk Organization ID
    // Include the subscription to get the status
    const organization = await prisma.organization.findUnique({
      where: { clerkOrgId: orgId },
      select: {
        subscription: {
          select: {
            status: true,
          },
        },
      },
    });

    // If the organization or subscription is not found, return null status
    if (!organization || !organization.subscription) {
       console.log(`Subscription status requested for user ${userId} in org ${orgId}: Organization or subscription not found.`);
      return NextResponse.json({ status: null });
    }

    // Return the subscription status
    return NextResponse.json({ status: organization.subscription.status });

  } catch (error) {
    console.error("[FETCH_SUBSCRIPTION_STATUS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription status." },
      { status: 500 }
    );
  }
}
