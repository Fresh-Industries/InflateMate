import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
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

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify that the business exists and has a Stripe account
    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
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
        account_onboarding: {
          enabled: true,
        },
        tax_registrations: {
          enabled: true,
        },
        tax_settings: {
          enabled: true,
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
