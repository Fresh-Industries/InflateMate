"use client";

import { useRouter } from "next/navigation";
import { SalesFunnelForm } from "./SalesFunnelForm";

interface SalesFunnelFormWrapperProps {
  businessId: string;
  funnel?: {
    id: string;
    name: string;
    popupTitle: string;
    popupText: string;
    popupImage?: string;
    formTitle: string;
    thankYouMessage: string;
    couponId?: string;
    isActive: boolean;
  };
  returnUrl: string;
}

export function SalesFunnelFormWrapper({
  businessId,
  funnel,
  returnUrl,
}: SalesFunnelFormWrapperProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(returnUrl);
  };

  const handleCancel = () => {
    router.push(returnUrl);
  };

  return (
    <SalesFunnelForm
      businessId={businessId}
      funnel={funnel}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
} 