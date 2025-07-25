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
  
  useEffect(() => {
    // Send loaded message to parent
    window.parent.postMessage({
      type: 'loaded',
      businessId,
      widgetType: 'booking-success',
      bookingId
    }, '*');
  }, [businessId, bookingId]);
  
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
  
  const handleReturnHome = () => {
    // Send relative path info instead of full URL
    window.parent.postMessage({
      type: 'navigation',
      action: 'return-home',
      path: '/'
    }, '*');
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