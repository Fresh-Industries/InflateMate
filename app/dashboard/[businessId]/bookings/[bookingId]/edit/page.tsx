'use client';

import { useEffect, useState } from 'react';
import { fetchBookingDetails } from '@/services/bookingService';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookingFullDetails } from '@/types/booking';
import { EditBookingForm } from '@/components/BookingForm/edit/EditBookingForm';

export default function EditBookingPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const bookingId = params.bookingId as string;

  const [bookingDetails, setBookingDetails] = useState<BookingFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        const data = await fetchBookingDetails(bookingId, businessId);
        setBookingDetails(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Failed to load booking details.');
        } else {
          setError('An unknown error occurred while loading booking details.');
        }
        console.error('Error loading booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId && businessId) {
      loadBooking();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, businessId]);

  if (loading) return <div className="container mx-auto p-4">Loading booking details...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-600">Error: {error}</div>;
  if (!bookingDetails) return <div className="container mx-auto p-4">No booking found or data is not in the expected format.</div>;

  const expirationTime = bookingDetails.booking?.expiresAt 
    ? new Date(bookingDetails.booking.expiresAt)
    : null;

  // Check if booking has expired
  const hasExpired = expirationTime 
    ? new Date() > expirationTime 
    : false;

  // If booking has expired, show message
  if (hasExpired) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This booking has expired and can no longer be edited.
              </p>
              <div className="mt-4 flex">
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
                >
                  Return to bookings
                </Button>
                <Button 
                  className="ml-3" 
                  onClick={() => router.push(`/dashboard/${businessId}/bookings/create`)}
                >
                  Create new booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render just the EditBookingForm component without additional headers or timers
  return (
    <div className="container mx-auto p-6">
      <EditBookingForm
        businessId={businessId}
        bookingDetails={bookingDetails}
      />
    </div>
  );
}
