import { loadStripe } from '@stripe/stripe-js';

/**
 * Initialize Stripe with a connected account ID
 * @param connectedAccountId The Stripe connected account ID
 * @returns A Promise that resolves to a Stripe instance or null if initialization fails
 */
export function getStripeInstance(connectedAccountId?: string) {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    console.error('Missing Stripe publishable key in environment variables');
    return null;
  }

  if (!connectedAccountId) {
    console.error('Missing connected account ID for Stripe initialization');
    return null;
  }

  try {
    console.log(`Initializing Stripe with publishable key: ${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 8)}... and account: ${connectedAccountId.substring(0, 8)}...`);
    
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, {
      stripeAccount: connectedAccountId,
    });
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
}
