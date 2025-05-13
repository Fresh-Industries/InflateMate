// src/hooks/useBookingCalculations.ts

import { useMemo } from 'react';
import { SelectedItem } from '@/types/booking';

type UseBookingCalculationsProps = {
  selectedItems: Map<string, SelectedItem>;
  taxRate: number;
  applyTax: boolean;
  appliedCoupon: { code: string; amount: number } | null;
};

export function useBookingCalculations({
  selectedItems,
  taxRate,
  applyTax,
  appliedCoupon,
}: UseBookingCalculationsProps) {

  const rawSubtotal = useMemo(() => {
     let subtotal = 0;
     selectedItems.forEach(({ item, quantity }) => {
       subtotal += item.price * quantity;
     });
     return subtotal;
  }, [selectedItems]);

  const discountedSubtotal = useMemo(() => {
      if (!appliedCoupon) return rawSubtotal;
      return Math.max(0, rawSubtotal - appliedCoupon.amount);
  }, [rawSubtotal, appliedCoupon]);

  const taxAmount = useMemo(() => {
      if (!applyTax || taxRate <= 0) return 0;
       // Tax is typically calculated on the *discounted* subtotal
      return discountedSubtotal * (taxRate / 100);
  }, [discountedSubtotal, taxRate, applyTax]);

  const total = useMemo(() => {
      return discountedSubtotal + taxAmount;
  }, [discountedSubtotal, taxAmount]);


  return {
    rawSubtotal, // Pre-discount, pre-tax
    discountedSubtotal, // Post-discount, pre-tax
    taxAmount,
    total, // Final total including discount and tax
  };
}
