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
    const params = new URLSearchParams(window.location.search);
    const widgetId = params.get('widgetId');
    window.parent.postMessage({
      type: 'loaded',
      widgetId,
      businessId,
      productId,
      widgetType: 'product'
    }, '*');
  }, [businessId, productId]);
  
  return (
    <div>
      {children}
    </div>
  );
} 