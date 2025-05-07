// app/api/stripe/success/route.ts (Completed and Adjusted for Best Practice)
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { syncStripeDataToDB } from '@/lib/stripe-sync';
import { stripe } from '@/lib/stripe-server';
import { NextRequest } from 'next/server'; // Import NextRequest

const CALLBACK = '/callback';
const PRICING  = '/pricing'; // Or maybe a specific success/error page?

export async function GET(req: NextRequest) {
  const { userId } = await auth(); // We only need userId here. orgId might not be the *active* org yet.
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  console.log(`Processing Stripe success callback for user: ${userId}, session: ${sessionId}`);

  if (!userId || !sessionId) {
    console.error("Success URL hit without userId or sessionId.");
    // Redirect to pricing or a general error page if required info is missing
    return NextResponse.redirect(PRICING);
  }

  try {
      // 1. Retrieve the Checkout Session from Stripe
      // This is important to get the customer_id and potentially metadata
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const customerId = session.customer as string; // Customer ID is linked to the session

      if (!customerId) {
           console.error(`Checkout session ${sessionId} has no customer ID. Cannot sync subscription.`);
           // If no customer ID, something is fundamentally wrong with the session.
           // Redirect to pricing or an error page.
           return NextResponse.redirect(PRICING);
      }

      // 2. Trigger the data sync from Stripe to your database
      // The sync function should find the relevant Organization based on the customer
      // (e.g., via metadata on the Customer or Subscription) and update the Subscription record.
      console.log(`Triggering data sync for customer: ${customerId}`);
      await syncStripeDataToDB(customerId);
      console.log(`Data sync triggered for customer: ${customerId}`);


       // 3. After syncing, redirect the user back into your application flow.
       // Redirecting to `/callback` is the best practice. The /callback page
       // will check the user's status (onboarded, subscribed) based on your DB
       // and redirect them to the appropriate page (dashboard, onboarding, pricing).

       console.log(`Redirecting user ${userId} to ${CALLBACK} after successful checkout.`);

       // You could optionally pass parameters to the callback if needed,
       // e.g., the organizationId if you reliably retrieved it.
       // However, /callback is designed to fetch the latest state itself,
       // which is more robust.

       return NextResponse.redirect(CALLBACK);


  } catch (error) {
       console.error(`Error processing Stripe success for session ${sessionId}:`, error);

       // Handle errors during session retrieval or sync.
       // Redirect the user to the pricing page or a specific error page.
       // Avoid showing sensitive error details to the user.
       return NextResponse.redirect(PRICING);
  }
}
