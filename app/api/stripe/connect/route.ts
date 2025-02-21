import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { getCurrentUser } from "@/lib/auth/utils";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        
        const accountSession = await stripe.accountSessions.create({
            account: body.account,
            components: {
                account_onboarding: { enabled: true },
            }
        });

        return NextResponse.json({
            client_secret: accountSession.client_secret,
        });
    } catch (error) {
        console.error(
            "An error occurred when calling the Stripe API to create an account session",
            error
        );
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}