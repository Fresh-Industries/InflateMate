"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Loader2, Check, CalendarIcon, MapPinIcon, Clock, Package, DollarSign, AlertCircle, Phone, Mail } from 'lucide-react';

interface BookingSuccess {
  id: string;
  status: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  specialInstructions?: string;
  customer: {
    name: string;
    email: string;
  } | null;
  items: {
    id: string;
    name: string;
    description?: string;
    image?: string;
    quantity: number;
    price: number;
  }[];
  business: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  } | null;
  hasSignedWaiver: boolean;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingDetails, setBookingDetails] = useState<BookingSuccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const bookingId = searchParams.get('bookingId');
  const businessId = searchParams.get('businessId');
  
  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        console.error('Missing bookingId parameter');
        setError('Booking ID is missing');
        setLoading(false);
        return; // Don't redirect, just show error
      }
      
      if (!businessId) {
        console.error('Missing businessId parameter');
        setError('Business ID is missing');
        setLoading(false);
        return; // Don't redirect, just show error
      }
      
      try {
        console.log(`Fetching booking details: businessId=${businessId}, bookingId=${bookingId}`);
        const bookingResponse = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}/public`);
        
        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json().catch(() => ({}));
          console.error('API error response:', bookingResponse.status, errorData);
          throw new Error(`Failed to load booking details: ${bookingResponse.status}`);
        }
        
        const data = await bookingResponse.json();
        console.log('Booking details received:', data);
        setBookingDetails(data);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details. Please check your email for confirmation.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookingDetails();
  }, [bookingId, businessId]);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };
  
  const formatTime = (timeString: string) => {
    try {
      return format(new Date(timeString), 'h:mm a');
    } catch (e) {
      console.error('Error formatting time:', e);
      return timeString;
    }
  };
  
  const returnHome = () => {
    const path = window.location.pathname;
    const domainMatch = path.match(/\/([^/]+)/);
    const domain = domainMatch ? domainMatch[1] : '';
    
    if (domain && domain !== '[domain]' && domain !== '%5Bdomain%5D') {
      router.push(`/`);
    } else {
      router.push('/');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading your booking details...</p>
      </div>
    );
  }
  
  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-xl font-bold text-red-700">Something went wrong</h1>
          </div>
          <p className="text-red-700 mb-4">{error || 'Could not find booking details'}</p>
          <p className="text-slate-600">Please check your email for booking confirmation or contact the business for assistance.</p>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={returnHome}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Thank you for your booking. We&apos;ve sent a confirmation email to {bookingDetails.customer?.email}.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>#{bookingDetails.id.slice(0, 8)}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Date and Time */}
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">Event Date</h3>
                  <p>{formatDate(bookingDetails.eventDate)}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatTime(bookingDetails.startTime)} - {formatTime(bookingDetails.endTime)}</span>
                  </div>
                </div>
              </div>
              
              {/* Location */}
              {bookingDetails.eventAddress && (
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p>{bookingDetails.eventAddress}</p>
                    <p className="text-sm text-gray-600">
                      {bookingDetails.eventCity}, {bookingDetails.eventState} {bookingDetails.eventZipCode}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Items */}
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Items Booked</span>
                </h3>
                
                <div className="space-y-4">
                  {bookingDetails.items.map(item => (
                    <div key={item.id} className="flex justify-between border-b pb-3">
                      <div className="flex gap-3">
                        {item.image && (
                          <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm text-gray-700">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-medium">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Payment Summary */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${bookingDetails.subtotalAmount.toFixed(2)}</span>
                  </div>
                  
                  {bookingDetails.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${bookingDetails.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${bookingDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="mt-2 bg-green-50 rounded-md p-3 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">Payment completed</span>
                  </div>
                </div>
              </div>
              
              {/* Special Instructions */}
              {bookingDetails.specialInstructions && (
                <div className="mt-4 bg-amber-50 rounded-md p-3">
                  <h4 className="font-medium text-amber-800 mb-1">Special Instructions</h4>
                  <p className="text-amber-700">{bookingDetails.specialInstructions}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Waiver and Contact Info */}
        <div className="space-y-6">
          {/* Waiver Card */}
          <Card className={bookingDetails.hasSignedWaiver ? "bg-green-50" : "bg-amber-50"}>
            <CardHeader>
              <CardTitle className="text-lg">
                {bookingDetails.hasSignedWaiver ? "Waiver Signed" : "Waiver Required"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookingDetails.hasSignedWaiver ? (
                <p className="text-gray-700">
                  Thank you for completing your waiver!
                </p>
              ) : (
                <p className="text-gray-700">
                  Please check your email for a link to sign the required waiver before your event.
                </p>
              )}
            </CardContent>
            {!bookingDetails.hasSignedWaiver && (
              <CardFooter>
                <p className="text-xs text-gray-600">
                  Note: All participants must have a signed waiver before using the bounce house.
                </p>
              </CardFooter>
            )}
          </Card>
          
          {/* Business Contact Info */}
          {bookingDetails.business && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Have Questions?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-medium">{bookingDetails.business.name}</h3>
                
                {bookingDetails.business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <a 
                      href={`tel:${bookingDetails.business.phone}`} 
                      className="text-primary hover:underline"
                    >
                      {bookingDetails.business.phone}
                    </a>
                  </div>
                )}
                
                {bookingDetails.business.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a 
                      href={`mailto:${bookingDetails.business.email}`} 
                      className="text-primary hover:underline"
                    >
                      {bookingDetails.business.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <div className="text-center pt-4">
            <Button variant="outline" onClick={returnHome}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 