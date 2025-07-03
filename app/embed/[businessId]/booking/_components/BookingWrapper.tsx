"use client";

import { BookingForm } from '@/app/embed/_components/BookingForm';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '@/app/[domain]/_themes/types';

interface BookingWrapperProps {
  businessId: string;
  successMessage: string;
  redirectUrl?: string;
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
}

export function BookingWrapper({ businessId, successMessage, redirectUrl, themeName, colors }: BookingWrapperProps) {
  const handleSuccess = () => {
    // Emit success event that the parent window can listen for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inflatemate:booking:success', {
        detail: {
          businessId,
          successMessage,
          redirectUrl
        }
      }));
    }
  };

  const handleError = (error: string) => {
    // Emit error event that the parent window can listen for
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('inflatemate:booking:error', {
        detail: { error }
      }));
    }
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