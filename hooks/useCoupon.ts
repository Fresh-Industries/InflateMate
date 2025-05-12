// src/hooks/useCoupon.ts

import { useState, useCallback } from 'react';
import * as BookingService from '@/services/bookingService'; // Import the service
import { useToast } from '@/hooks/use-toast'; // Assuming toast hook

type UseCouponProps = {
    businessId: string;
    amountBeforeTax: number; // The amount to validate the coupon against
};

export function useCoupon({ businessId, amountBeforeTax }: UseCouponProps) {
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; amount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = useCallback(async () => {
    setCouponError(null);
    if (!couponCode) {
        // Optionally show a toast or set an error if the code is empty
        return;
    }

    setIsApplyingCoupon(true);
    try {
       // Call the service function
      const data = await BookingService.validateCoupon(businessId, couponCode, amountBeforeTax);

      if (!data.valid) {
        setCouponError(data.reason || "Invalid coupon");
        setAppliedCoupon(null);
        toast({
           title: "Coupon Error",
           description: data.reason || "Invalid coupon code.",
           variant: "destructive"
        });
      } else {
        setAppliedCoupon({ code: couponCode.toUpperCase(), amount: data.discountAmount || 0 }); // Ensure code is uppercase and amount is number
        setCouponError(null);
        toast({
           title: "Coupon Applied",
           description: `Coupon "${couponCode.toUpperCase()}" applied successfully.`,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Catch any network or service errors
        console.error("Error applying coupon:", error);
        setCouponError(error.message || "Error applying coupon");
        setAppliedCoupon(null);
        toast({
           title: "Error",
           description: error.message || "Failed to apply coupon.",
           variant: "destructive"
        });
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [businessId, couponCode, amountBeforeTax, toast]); // Dependencies

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponCode(""); // Clear the input field as well
    setCouponError(null); // Clear any previous errors
    toast({
        title: "Coupon Removed",
        description: "The coupon has been removed.",
    });
  }, [toast]); // Dependencies

  return {
    couponCode,
    setCouponCode, // Allow parent to bind input value
    appliedCoupon,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  };
}
