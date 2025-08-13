// src/hooks/useBookingCalculations.ts

import { useMemo } from 'react';
import { SelectedItem } from '@/types/booking';
import { TaxCalculationResponse } from '@/lib/stripe/frontend-tax-utils';

type UseBookingCalculationsProps = {
  selectedItems: Map<string, SelectedItem>;
  taxRate: number;
  applyTax: boolean;
  appliedCoupon: { code: string; amount: number } | null;
  // Optional Stripe Tax calculation to override manual calculation
  stripeTaxResult?: TaxCalculationResponse | null;
  // Whether to use Stripe Tax calculation when available
  useStripeTax?: boolean;
};

export function useBookingCalculations({
  selectedItems,
  taxRate,
  applyTax,
  appliedCoupon,
  stripeTaxResult,
  useStripeTax = true,
}: UseBookingCalculationsProps) {

  const rawSubtotal = useMemo(() => {
     let subtotal = 0;
     selectedItems.forEach(({ item, quantity }) => {
       subtotal += item.price * quantity;
     });
     return subtotal;
  }, [selectedItems]);

  // If Stripe Tax is available and enabled, use those results
  const usingStripeTax = useStripeTax && stripeTaxResult && stripeTaxResult.success;



  const discountedSubtotal = useMemo(() => {
    if (usingStripeTax && stripeTaxResult) {
      return stripeTaxResult.subtotalCents / 100; // Convert from cents to dollars
    }
    
    // Fallback to manual calculation
    if (!appliedCoupon) return rawSubtotal;
    return Math.max(0, rawSubtotal - appliedCoupon.amount);
  }, [usingStripeTax, stripeTaxResult, rawSubtotal, appliedCoupon]);

  const taxAmount = useMemo(() => {
    if (usingStripeTax && stripeTaxResult) {
      return stripeTaxResult.taxCents / 100; // Convert from cents to dollars
    }
    
    // Fallback to manual calculation
    if (!applyTax || taxRate <= 0) return 0;
    // Tax is typically calculated on the *discounted* subtotal
    return discountedSubtotal * (taxRate / 100);
  }, [usingStripeTax, stripeTaxResult, discountedSubtotal, taxRate, applyTax]);

  const total = useMemo(() => {
    if (usingStripeTax && stripeTaxResult) {
      return stripeTaxResult.totalCents / 100; // Convert from cents to dollars
    }
    
    // Fallback to manual calculation
    return discountedSubtotal + taxAmount;
  }, [usingStripeTax, stripeTaxResult, discountedSubtotal, taxAmount]);

  const effectiveTaxRate = useMemo(() => {
    if (usingStripeTax && stripeTaxResult) {
      return stripeTaxResult.taxRate;
    }
    
    // Fallback to manual tax rate
    return applyTax ? taxRate : 0;
  }, [usingStripeTax, stripeTaxResult, applyTax, taxRate]);

  return {
    rawSubtotal, // Pre-discount, pre-tax
    discountedSubtotal, // Post-discount, pre-tax (or Stripe calculated)
    taxAmount, // Tax amount (Stripe calculated or manual)
    total, // Final total including discount and tax
    effectiveTaxRate, // Effective tax rate being applied
    usingStripeTax, // Whether Stripe Tax calculation is being used
    stripeTaxError: stripeTaxResult?.error || null, // Any error from Stripe Tax
  };
}
