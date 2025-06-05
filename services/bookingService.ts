// src/services/bookingService.ts

import { InventoryItem, BookingMetadata, AvailabilitySearchFilters, BookingFullDetails } from '@/types/booking';

// --- Data Fetching Services ---

export async function fetchBusinessDetails(businessId: string): Promise<{
  id: string;
  name: string;
  stripeAccountId?: string;
  stripeConnectedAccountId?: string;
  defaultTaxRate?: number;
  applyTaxToBookings?: boolean;
  timeZone?: string;
  minNoticeHours?: number;
  maxNoticeHours?: number;
  minBookingAmount?: number;
  bufferBeforeHours?: number;
  bufferAfterHours?: number;
  // Add other business fields as needed
}> {
  const response = await fetch(`/api/businesses/${businessId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch business data");
  }
  return response.json();
}

export async function searchInventoryAvailability(businessId: string, filters: AvailabilitySearchFilters): Promise<InventoryItem[]> {
  const { date, startTime, endTime, tz, excludeBookingId } = filters;
  console.log("tz", tz);
  console.log("date", date);
  console.log("startTime", startTime);
  console.log("endTime", endTime);
  console.log("excludeBookingId", excludeBookingId);
  
  // Build URL with properly encoded individual parameters
  let url = `/api/businesses/${businessId}/availability?date=${encodeURIComponent(date)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}&tz=${encodeURIComponent(tz)}`;

  if (excludeBookingId) {
    url += `&excludeBookingId=${encodeURIComponent(excludeBookingId)}`;
  }

  console.log("Requesting availability with URL:", url); // Debug log
  
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to search availability");
  }
  
  return data.availableInventory || [];
}


export async function validateCoupon(businessId: string, code: string, amountBeforeTax: number): Promise<{ valid: boolean; discountAmount?: number; reason?: string }> {
  const response = await fetch(`/api/businesses/${businessId}/coupons/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, amountBeforeTax }),
  });
  const data = await response.json();
  if (!response.ok) {
      // API should ideally return valid: false and reason on !ok for validation errors
       return { valid: false, reason: data.error || "Coupon validation failed" };
  }
   // Assume API returns { valid: true, discountAmount: number } on success
  return data;
}


// --- Transaction/Action Services ---

export async function reserveItems(businessId: string, payload: {
    eventDate: string;
    startTime: string;
    endTime: string;
    eventTimeZone: string;
    selectedItems: Array<{ id: string; quantity: number; price: number }>;
}): Promise<{ holdId: string; expiresAt: string }> { // Assuming your API returns this
    const response = await fetch(`/api/businesses/${businessId}/bookings/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to reserve items.");
    }
    return data;
}


export async function createQuote(businessId: string, quoteDetails: BookingMetadata): Promise<{ stripeQuoteId: string; hostedQuoteUrl: string }> {
     const response = await fetch(`/api/businesses/${businessId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteDetails),
    });

    const data = await response.json();

    if (!response.ok) {
         // Handle specific API error structures if your API returns them
         // e.g., data.details for validation errors, data.field for conflicts
        const errorDetail = data.details || data.error || "Unknown API error";
        const error = new Error(errorDetail);
        // Optionally attach specific details to the error object
        // (Requires custom error types or adding properties)
        // if (data.details) (error as any).details = data.details;
        // if (data.field) (error as any).field = data.field;
        throw error;
    }

    return data; // Assuming data contains stripeQuoteId and hostedQuoteUrl
}


export async function createBookingPaymentIntent(businessId: string, bookingDetails: BookingMetadata & { amountCents: number, holdId: string }): Promise<{ clientSecret: string }> {
    const response = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to create payment intent.");
    }

    return data; // Assuming data contains clientSecret
}


export async function fetchBookingDetails(bookingId: string, businessId: string): Promise<BookingFullDetails> {
  const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}`);
  if (!response.ok) {
    // Consider more specific error handling based on response status or body
    const errorData = await response.json().catch(() => ({ error: "Failed to fetch booking details and could not parse error response." }));
    throw new Error(errorData.error || "Failed to fetch booking details.");
  }
  // The API is now expected to return data matching BookingFullDetails
  return response.json() as Promise<BookingFullDetails>; // Added 'as Promise<BookingFullDetails>' for clarity, though response.json() is already Promise<any>
}
