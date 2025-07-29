"use client";

import InventoryClient from '@/app/embed/_components/InventoryPage';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { useEffect } from 'react';

interface InventoryWrapperProps {
  businessId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inventoryItems: any[];
  themeName: string;
  colors: ThemeColors;
  businessDomain: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embedConfig: any;
}

export function InventoryWrapper({ 
  businessId, 
  inventoryItems, 
  themeName, 
  colors, 
  businessDomain, 
  embedConfig 
}: InventoryWrapperProps) {
  
  // Send loaded message to parent
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const widgetId = params.get('widgetId');
    window.parent.postMessage({
      type: 'loaded',
      widgetId,
      businessId,
      widgetType: 'inventory'
    }, '*');
  }, [businessId]);

  return (
    <InventoryClient 
      inventoryItems={inventoryItems}
      themeName={themeName}
      colors={colors}
      businessDomain={businessDomain}
      embedConfig={embedConfig}
    />
  );
} 