import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Stripe } from "stripe";
import { stripe } from "@/lib/stripe-server";
import { syncStripeDataToDB } from "@/lib/stripe-sync";

export async function POST(req: NextRequest) {
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SUB_SECRET as string;

  console.log("[WEBHOOK:SUBS] Received Stripe webhook, verifying signature...");

  let event: Stripe.Event;
  try {
    if (!sig) {
      console.error("[WEBHOOK:SUBS] No Stripe signature found in request");
      return NextResponse.json({ error: "No Stripe signature" }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error("[WEBHOOK:SUBS] STRIPE_WEBHOOK_SUB_SECRET env var is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const requestBody = await req.text();
    event = stripe.webhooks.constructEvent(requestBody, sig, webhookSecret);
    console.log(`[WEBHOOK:SUBS] Webhook verified: ${event.type} - Event ID: ${event.id}`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`[WEBHOOK:SUBS] Signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
      case "customer.subscription.trial_will_end":
      case "customer.subscription.pending_update_applied":
      case "customer.subscription.pending_update_expired": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscription(subscription);
        break;
      }

      default: {
        console.log(`[WEBHOOK:SUBS] Unhandled event type: ${event.type}`);
      }
    }

    console.log(
      `[WEBHOOK:SUBS] Finished processing event ${event.id} (${event.type}). Sending 200 OK to Stripe.`,
    );
    return NextResponse.json({ message: "Webhook processed successfully" }, { status: 200 });
  } catch (error) {
    const eventId = (event as Stripe.Event | undefined)?.id ?? "unknown";
    const eventType = (event as Stripe.Event | undefined)?.type ?? "unknown";
    console.error(
      `[WEBHOOK:SUBS] Critical error during webhook processing (event ${eventId}, type ${eventType}):`,
      error,
    );
    return NextResponse.json({ error: "Critical error processing webhook internally." }, { status: 200 });
  }
}

async function handleSubscription(subscription: Stripe.Subscription) {
  console.log(`[WEBHOOK:SUBS] Subscription event: ${subscription.id}`);

  try {
    const priceId = subscription.items?.data?.[0]?.price?.id ?? "";
    const priceIdMap: Record<string, string> = {
      [process.env.STRIPE_SOLO_PRICE_ID || ""]: "solo",
      [process.env.STRIPE_GROWTH_PRICE_ID || ""]: "growth",
    };
    const planFromPrice = priceIdMap[priceId];
    const plan = (subscription.metadata?.plan || planFromPrice || "growth").toString();

    const customerId = subscription.customer as string;
    console.log(
      `[WEBHOOK:SUBS] Syncing subscription for customer: ${customerId} (plan: ${plan}, priceId: ${priceId})`,
    );
    await syncStripeDataToDB(customerId, plan);
  } catch (error) {
    console.error(`[WEBHOOK:SUBS] Error handling subscription ${subscription.id}:`, error);
  }
}


