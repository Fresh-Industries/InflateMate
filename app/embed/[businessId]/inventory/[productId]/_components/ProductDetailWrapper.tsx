"use client";

import { useEffect } from 'react';

interface ProductDetailWrapperProps {
  businessId: string;
  productId: string;
  children: React.ReactNode;
}

export function ProductDetailWrapper({ businessId, productId, children }: ProductDetailWrapperProps) {
  
  // Send loaded message to parent
  useEffect(() => {
    window.parent.postMessage({
      type: 'loaded',
      businessId,
      productId,
      widgetType: 'product'
    }, '*');
  }, [businessId, productId]);
  
  const handleBookingClick = () => {
    window.parent.postMessage({
      type: 'product:booking:click',
      productId,
      businessId
    }, '*');
  };
  
  const handleError = (error: string) => {
    window.parent.postMessage({
      type: 'product:error',
      error
    }, '*');
  };

  return (
    <div>
      {children}
    </div>
  );
} 