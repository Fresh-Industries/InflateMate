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
  
  // Send loaded message to parent
  useEffect(() => {
    window.parent.postMessage({
      type: 'loaded',
      businessId,
      widgetType: 'booking'
    }, '*');
  }, [businessId]);
  
  const handleSuccess = (bookingId?: string) => {
    // Send success message to parent
    window.parent.postMessage({
      type: 'booking:success',
      businessId,
      redirectUrl,
      bookingId
    }, '*');
  };

  const handleError = (error: string) => {
    // Send error message to parent
    window.parent.postMessage({
      type: 'booking:error',
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