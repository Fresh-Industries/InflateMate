import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Verify that the business exists and is owned by the current user
    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
        organization: {
          clerkOrgId: user.membership?.organization?.clerkOrgId,
        },
      },
    });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }
    if (!business.stripeAccountId) {
      return NextResponse.json(
        { error: "Business does not have a Stripe account" },
        { status: 400 }
      );
    }

    // Create an account session with both "payments" and "payment_details" components enabled.
    // This configuration is based on the Stripe embedded components docs.
    const accountSession = await stripe.accountSessions.create({
      account: business.stripeAccountId,
      components: {
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: false,
          },
        },
        payment_details: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: false,
          },
        },
        account_management: {
          enabled: true,
          features: {
            external_account_collection: true,
          },
        },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
            external_account_collection: true,
          },
        },
      },
    });
    

    return NextResponse.json({
      clientSecret: accountSession.client_secret,
      accountId: business.stripeAccountId,
    });
  } catch (error) {
    console.error("Error creating Stripe account session:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
