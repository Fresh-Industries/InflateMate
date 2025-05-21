"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingFullDetails, SelectedItem, Coupon } from "@/types/booking";
import { TagIcon } from "lucide-react";
import { utcToLocal } from "@/lib/utils";
// Removed unused imports

interface EditSummaryCardProps {
  bookingDetails: BookingFullDetails;
  selectedItems: Map<string, SelectedItem>;
  customerData: {
    name: string;
    email: string;
    phone: string;
    specialInstructions: string | null;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge: string;
  };
  subtotal: number;
  taxAmount: number;
  total: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  isApplyingCoupon: boolean;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
}

export function EditSummaryCard({
  bookingDetails,
  selectedItems,
  customerData,
  subtotal,
  taxAmount,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  couponError,
  isApplyingCoupon,
  handleApplyCoupon,
  handleRemoveCoupon,
}: EditSummaryCardProps) {
  return (
    <div className="space-y-6">
      {/* Event Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="font-medium">
                {bookingDetails.booking?.startTime && bookingDetails.booking?.eventTimeZone
                  ? utcToLocal(
                      typeof bookingDetails.booking.startTime === 'string' 
                        ? new Date(bookingDetails.booking.startTime) 
                        : bookingDetails.booking.startTime,
                      bookingDetails.booking.eventTimeZone, 
                      'MMM d, yyyy'
                    )
                  : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Time</h3>
              <p className="font-medium">
                {bookingDetails.booking?.startTime && bookingDetails.booking?.endTime && bookingDetails.booking?.eventTimeZone
                  ? `${utcToLocal(
                      typeof bookingDetails.booking.startTime === 'string' 
                        ? new Date(bookingDetails.booking.startTime) 
                        : bookingDetails.booking.startTime,
                      bookingDetails.booking.eventTimeZone, 
                      'h:mm a'
                    )} - 
                     ${utcToLocal(
                      typeof bookingDetails.booking.endTime === 'string' 
                        ? new Date(bookingDetails.booking.endTime) 
                        : bookingDetails.booking.endTime,
                      bookingDetails.booking.eventTimeZone, 
                      'h:mm a'
                    )}`
                  : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="font-medium">
                {customerData.eventAddress || bookingDetails.booking?.eventAddress || "No address provided"}
              </p>
            </div>
          </div>
          
          {/* Participant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Participants</h3>
              <p className="font-medium">{customerData.participantCount || bookingDetails.booking?.participantCount || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Age Range</h3>
              <p className="font-medium">{customerData.participantAge || bookingDetails.booking?.participantAge || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from(selectedItems.values()).map(({ item, quantity }) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)} × {quantity}</p>
              </div>
              <p className="font-medium">${(item.price * quantity).toFixed(2)}</p>
            </div>
          ))}

          <div className="pt-2">
            {/* Coupon Input */}
            <div className="space-y-2 mb-4">
              <div className="flex gap-2">
                <div className="flex-grow">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!appliedCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <Button variant="outline" onClick={handleRemoveCoupon}>
                    Remove
                  </Button>
                ) : (
                  <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode}>
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                )}
              </div>
              
              {couponError && (
                <p className="text-sm text-red-500">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="flex items-center gap-2 py-1 px-2 bg-green-50 text-green-700 rounded">
                  <TagIcon className="h-4 w-4" />
                  <span className="text-sm">Coupon applied: {appliedCoupon.code}</span>
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1 text-right">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              )}
              
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon.code}):</span>
                  <span>-${(subtotal - (total - taxAmount)).toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="font-medium">{customerData.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="font-medium">{customerData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="font-medium">{customerData.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Event Address</h3>
              <p className="font-medium">
                {customerData.eventAddress && customerData.eventCity && customerData.eventState && customerData.eventZipCode
                  ? `${customerData.eventAddress}, ${customerData.eventCity}, ${customerData.eventState} ${customerData.eventZipCode}`
                  : "No address provided"}
              </p>
            </div>
            {(customerData.specialInstructions || bookingDetails.booking?.specialInstructions) && (
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Special Instructions</h3>
                <p className="whitespace-pre-wrap">{customerData.specialInstructions || bookingDetails.booking?.specialInstructions}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
