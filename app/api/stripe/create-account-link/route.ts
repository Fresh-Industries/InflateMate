import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";

export async function POST(req: NextRequest) {
  const user = await getCurrentUserWithOrgAndBusiness();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accountId, returnUrl, refreshUrl } = await req.json();

    if (!accountId) {
      return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      refresh_url: refreshUrl || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating account link:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account link" },
      { status: 500 }
    );
  }
} 