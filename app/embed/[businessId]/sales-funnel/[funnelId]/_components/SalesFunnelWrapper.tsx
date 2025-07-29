//app/embed/[businessId]/sales-funnel/[funnelId]/_components/SalesFunnelWrapper.tsx
"use client";

import { SalesFunnelPopup } from '@/app/embed/_components/SalesFunnelPopup';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { useEffect } from 'react';
import ErrorBoundary from '@/app/embed/_components/ErrorBoundary';

interface SalesFunnelWrapperProps {
  businessId: string;
  funnel: {
    id: string;
    name: string;
    popupTitle: string;
    popupText: string;
    popupImage: string | null;
    formTitle: string;
    thankYouMessage: string;
    couponId: string | null;
    isActive: boolean;
  };
  colors: ThemeColors;
  themeName: string;
}

export function SalesFunnelWrapper({ businessId, funnel, colors, themeName }: SalesFunnelWrapperProps) {
  // Derive theme from themeConfig
  const theme = themeConfig[themeName] ?? themeConfig.modern;
  
  // Send loaded message to parent - add delay to ensure React is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.parent) {
        const params = new URLSearchParams(window.location.search);
        const widgetId = params.get('widgetId');
        window.parent.postMessage({
          type: 'sales-funnel:loaded',
          widgetId,
          businessId,
          funnelId: funnel.id,
          widgetType: 'sales-funnel'
        }, '*');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [businessId, funnel.id]);

  return (
    <ErrorBoundary>
      <SalesFunnelPopup
        businessId={businessId}
        funnel={{
          ...funnel,
          theme
        }}
        colors={colors}
        theme={theme}
        isEmbed={true}
      />
    </ErrorBoundary>
  );
} 