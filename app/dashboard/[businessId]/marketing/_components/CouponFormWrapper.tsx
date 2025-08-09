"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CouponForm } from "./CouponForm";

interface CouponFormWrapperProps {
  businessId: string;
  mode: "create" | "edit";
  coupon?: {
    id: string;
    code: string;
    description: string | null;
    discountType: "PERCENTAGE" | "FIXED";
    discountAmount: number;
    maxUses: number | null;
    usedCount: number;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    minimumAmount: number | null;
  };
}

export function CouponFormWrapper({ 
  businessId, 
  mode, 
  coupon 
}: CouponFormWrapperProps) {
  const router = useRouter();
  
  const handleSuccess = () => {
    toast.success(`Coupon ${mode === "create" ? "created" : "updated"} successfully.`);
    router.push(`/dashboard/${businessId}/marketing/coupons`);
  };
  
  const handleCancel = () => {
    router.push(`/dashboard/${businessId}/marketing/coupons`);
  };
  
  return (
    <CouponForm 
      businessId={businessId} 
      coupon={coupon}
      onSuccess={handleSuccess} 
      onCancel={handleCancel}
    />
  );
} 