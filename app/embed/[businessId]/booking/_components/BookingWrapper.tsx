// app/embed/[businessId]/booking/_components/BookingWrapper.tsx
"use client";

import { BookingForm } from '@/app/embed/_components/BookingForm';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { useEffect } from 'react';

interface BookingWrapperProps {
  businessId: string;
  redirectUrl?: string;
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
}

export function BookingWrapper({ businessId, redirectUrl, themeName, colors }: BookingWrapperProps) {
  
  // Get widgetId for secure messaging
  const getWidgetId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('widgetId');
  };
  
  // Send loaded message to parent
  useEffect(() => {
    const widgetId = getWidgetId();
    window.parent.postMessage({
      type: 'loaded',
      widgetId,
      businessId,
      widgetType: 'booking'
    }, '*');
  }, [businessId]);
  
  const handleSuccess = (bookingId?: string) => {
    // Send success message to parent
    const widgetId = getWidgetId();
    window.parent.postMessage({
      type: 'booking:success',
      widgetId,
      businessId,
      redirectUrl,
      bookingId
    }, '*');
  };

  const handleError = (error: string) => {
    // Send error message to parent
    const widgetId = getWidgetId();
    window.parent.postMessage({
      type: 'booking:error',
      widgetId,
      error
    }, '*');
  };

  return (
    <BookingForm 
      businessId={businessId}
      themeName={themeName}
      colors={colors}
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
} 