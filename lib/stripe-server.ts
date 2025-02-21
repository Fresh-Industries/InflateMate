import Stripe from 'stripe';

// Server-side Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
});

interface CreatePaymentIntentParams {
  amount: number;
  customerEmail: string;
  metadata: {
    bounceHouseId: string;
    eventDate: string;
    businessId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
}

// Create a payment intent
export async function createPaymentIntent({
  amount,
  customerEmail,
  metadata,
}: CreatePaymentIntentParams) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata,
      receipt_email: customerEmail,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Validate a coupon code
export async function validateCoupon(
  code: string,
  businessId: string,
  amount: number
) {
  // TODO: Implement coupon validation logic
  return null;
}

export { stripe }; 