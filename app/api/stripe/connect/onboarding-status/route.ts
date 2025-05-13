import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";

export async function GET(req: NextRequest) {
  const user = await getCurrentUserWithOrgAndBusiness();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  if (!accountId) {
    return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    // Stripe docs: requirements.currently_due is empty if fully onboarded
    const isOnboarded =
      Array.isArray(account.requirements?.currently_due) &&
      account.requirements.currently_due.length === 0;
    return NextResponse.json({ isOnboarded });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 