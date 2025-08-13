import Stripe from 'stripe';
import { stripe } from '@/lib/stripe-server';

// Interfaces for tax calculation
export interface TaxLineItem {
  inventoryId: string;
  quantity: number;
  price: number;
}

export interface CustomerDetails {
  address: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  addressSource: 'shipping' | 'billing';
}

export interface TaxCalculationResponse {
  calculation: Stripe.Tax.Calculation;
  taxAmountCents: number;
  totalAmountCents: number;
  subtotalAmountCents: number;
  taxRate: number; // Effective tax rate
}

export function convertBookingItemsToTaxLineItems(items: { inventoryId: string; quantity: number; price: number }[]): Stripe.Tax.CalculationCreateParams.LineItem[] {
  return items.map(item => ({
    amount: Math.round(item.price * item.quantity * 100), // Amount in cents
    reference: item.inventoryId, // Use inventory ID as reference
    tax_code: 'txcd_99999999', // Placeholder tax code for general goods/services
    quantity: 1, // Quantity for tax calculation is usually 1 per line item, total amount is already calculated
  }));
}

export function applyDiscountToLineItems(
  lineItems: Stripe.Tax.CalculationCreateParams.LineItem[],
  discountAmount: number, // in dollars
  discountType: 'PERCENTAGE' | 'FIXED'
): Stripe.Tax.CalculationCreateParams.LineItem[] {
  const discountAmountCents = Math.round(discountAmount * 100);

  if (discountType === 'FIXED') {
    // Distribute fixed discount proportionally across line items
    const totalLineItemAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);
    if (totalLineItemAmount === 0) return lineItems; // Avoid division by zero

    return lineItems.map(item => {
      const itemProportion = item.amount / totalLineItemAmount;
      const itemDiscount = Math.round(discountAmountCents * itemProportion);
      const newAmount = Math.max(0, item.amount - itemDiscount);
      return { ...item, amount: newAmount };
    });
  } else if (discountType === 'PERCENTAGE') {
    // Apply percentage discount to each line item
    const discountRate = discountAmount / 100; // discountAmount is already a percentage here
    return lineItems.map(item => ({
      ...item,
      amount: Math.round(item.amount * (1 - discountRate)),
    }));
  }
  return lineItems;
}

export async function calculateStripeTax(
  lineItems: Stripe.Tax.CalculationCreateParams.LineItem[],
  customerDetails: {
    address: {
      line1: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    addressSource: 'shipping' | 'billing';
  },
  stripeAccountId?: string
): Promise<TaxCalculationResponse> {
  try {
    console.log('[Tax Utils] Creating Stripe tax calculation with:', {
      lineItemsCount: lineItems.length,
      customerCity: customerDetails.address.city,
      customerState: customerDetails.address.state,
      customerPostalCode: customerDetails.address.postal_code,
      stripeAccountId
    });

    const stripeCustomerDetails: Stripe.Tax.CalculationCreateParams.CustomerDetails = {
      address: {
        line1: customerDetails.address.line1,
        city: customerDetails.address.city,
        state: customerDetails.address.state,
        postal_code: customerDetails.address.postal_code,
        country: customerDetails.address.country || 'US'
      },
      address_source: customerDetails.addressSource || 'shipping'
    };

    // Create tax calculation request parameters
    const calculationParams: Stripe.Tax.CalculationCreateParams = {
      currency: 'usd',
      line_items: lineItems,
      customer_details: stripeCustomerDetails,
      expand: ['line_items'] // Ensure line items are included in response
    };

    // Create the tax calculation
    const calculation = await stripe.tax.calculations.create(
      calculationParams,
      stripeAccountId ? { stripeAccount: stripeAccountId } : undefined
    );

    // Calculate tax amount from line items
    const taxAmountCents = calculation.line_items?.data?.reduce((total, item) => {
      return total + (item.amount_tax || 0);
    }, 0) || 0;

    const totalAmountCents = calculation.amount_total;
    const subtotalAmountCents = totalAmountCents - taxAmountCents;

    console.log('[Tax Utils] Stripe tax calculation created:', {
      id: calculation.id,
      amountTotal: totalAmountCents,
      taxAmountTotal: taxAmountCents,
      subtotalAmount: subtotalAmountCents
    });

    // Calculate effective tax rate
    const taxRate = subtotalAmountCents > 0
      ? (taxAmountCents / subtotalAmountCents) * 100
      : 0;

    return {
      calculation,
      taxAmountCents,
      totalAmountCents,
      subtotalAmountCents,
      taxRate: Math.round(taxRate * 100) / 100 // Round to 2 decimal places
    };

  } catch (error) {
    console.error('[Tax Utils] Error calculating Stripe tax:', error);
    throw new Error(`Failed to calculate tax: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}