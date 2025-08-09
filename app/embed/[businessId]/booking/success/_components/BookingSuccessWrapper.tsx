"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingSuccessDisplay } from './BookingSuccessDisplay';
import { ThemeColors } from '@/app/[domain]/_themes/types';

interface BookingSuccessWrapperProps {
  businessId: string;
  colors: ThemeColors;
}

export function BookingSuccessWrapper({ businessId, colors }: BookingSuccessWrapperProps) {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const bookingId = searchParams.get('bookingId');
  const widgetId = searchParams.get('widgetId');
  
  // Get parent origin for security
  const getParentOrigin = () => {
    try {
      const referrer = document.referrer;
      if (referrer) {
        return new URL(referrer).origin;
      }
      return window.location.origin;
    } catch {
      return window.location.origin;
    }
  };
  
  useEffect(() => {
    // Send loaded message to parent with proper origin and widgetId
    const message = {
      type: 'loaded',
      businessId,
      widgetType: 'booking-success',
      bookingId,
      ...(widgetId && { widgetId })
    };
    
    try {
      const parentOrigin = getParentOrigin();
      window.parent.postMessage(message, parentOrigin);
    } catch (error) {
      console.warn('Could not send loaded message to parent:', error);
    }
  }, [businessId, bookingId, widgetId]);
  
  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError('Booking ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}/public`);
        
        if (!response.ok) {
          throw new Error(`Failed to load booking details: ${response.status}`);
        }
        
        const data = await response.json();
        setBookingDetails(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookingDetails();
  }, [bookingId, businessId]);
  
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading booking details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">❌</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  const handleReturnHome = () => {
    try {
      const parentOrigin = getParentOrigin();
      window.parent.postMessage({ type: 'return-home' }, parentOrigin);
    } catch (error) {
      console.warn('Could not send return-home message to parent:', error);
    }
  };

  return (
    <BookingSuccessDisplay 
      bookingDetails={bookingDetails}
      loading={loading}
      error={error}
      colors={colors}
      onReturnHome={handleReturnHome}
    />
  );
} 