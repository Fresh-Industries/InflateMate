"use client";

import PopularRentals from '@/app/embed/_components/PopularRentals';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { useEffect } from 'react';

interface PopularRentalsWrapperProps {
  businessId: string;
  items: any[];
  colors: ThemeColors;
  themeName: keyof typeof themeConfig;
  businessDomain: string | null;
  embedConfig: any;
}

export function PopularRentalsWrapper({ 
  businessId, 
  items, 
  colors, 
  themeName, 
  businessDomain, 
  embedConfig 
}: PopularRentalsWrapperProps) {
  
  // Send loaded message to parent
  useEffect(() => {
    window.parent.postMessage({
      type: 'loaded',
      businessId,
      widgetType: 'popular-rentals',
      itemCount: items.length
    }, '*');
  }, [businessId, items.length]);
  
  const handleProductClick = (productId: string) => {
    window.parent.postMessage({
      type: 'popular-rentals:product:click',
      productId,
      businessId
    }, '*');
  };
  
  const handleError = (error: string) => {
    window.parent.postMessage({
      type: 'popular-rentals:error',
      error
    }, '*');
  };

  return (
    <PopularRentals 
      items={items}
      colors={colors}
      themeName={themeName}
      businessDomain={businessDomain}
      embedConfig={embedConfig}
    />
  );
} 