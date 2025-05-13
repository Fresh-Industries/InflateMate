"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, X } from "lucide-react"; // Import icons needed here
import React from "react";
import { SelectedItem, NewBookingState } from '@/types/booking';

interface ReviewPayStepProps {
  // Data needed for display
  newBooking: NewBookingState; // Need all details for the summary
  selectedItems: Map<string, SelectedItem>;
  taxRate: number;
  applyTax: boolean;
  couponCode: string;
  appliedCoupon: { code: string; amount: number } | null;
  couponError: string | null;

  // Calculated values
  subtotal: number;
  discountedTax: number;
  discountedTotal: number; // Renamed from getDiscountedTotal for clarity as a passed value

  // Loading states for actions
  isApplyingCoupon: boolean;
  isProcessingQuote: boolean;
  isSubmittingPayment: boolean; // Renamed from isSubmitting for clarity

  // Functions to handle actions (passed from parent)
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onRemoveItem: (itemId: string) => void; // Function to remove an item
  onSendAsQuote: () => void;
  onProceedToPayment: () => void;
}

export function ReviewPayStep({
  newBooking,
  
  selectedItems,
  taxRate,
  applyTax,
  couponCode,
  appliedCoupon,
  couponError,
  subtotal, // Use passed calculated values
  discountedTax,
  discountedTotal,
  isApplyingCoupon,
  isProcessingQuote,
  isSubmittingPayment,
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  onRemoveItem,
  onSendAsQuote,
  onProceedToPayment,
}: ReviewPayStepProps) {
  console.log({
    isSubmittingPayment,
    isProcessingQuote,
    selectedItemsSize: selectedItems.size,
    discountedTotal
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Booking</h3>

      {/* Selected Items Card */}
      {selectedItems.size > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Selected Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(selectedItems.values()).map(({ item, quantity }) => (
              <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0"> {/* Added last:pb-0 */}
                <div className="flex items-start gap-4">
                  {item.primaryImage ? (
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border"> {/* Added border */}
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                     <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100 flex items-center justify-center text-muted-foreground text-sm text-center p-2">
                        No Image
                     </div>
                  )}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1"> {/* Adjusted layout */}
                    <div className="sm:col-span-2"> {/* Item name spans both columns on small screens+ */}
                        <h4 className="font-semibold">{item.name}</h4>
                         <p className="text-muted-foreground text-sm">{item.type}</p> {/* Moved type here */}
                    </div>

                    {item.dimensions && (
                        <div>
                           <span className="font-medium">Size:</span> {item.dimensions}
                        </div>
                    )}
                     <div>
                        <span className="font-medium">Capacity:</span> {item.capacity} people
                     </div>
                     <div>
                       <span className="font-medium">Quantity:</span> {quantity}
                     </div>
                     {/* Display individual item price x quantity */}
                     <div>
                       <span className="font-medium">Price:</span> ${item.price.toFixed(2)} ea
                     </div>

                  </div>
                  {/* Remove Item Button - calls the prop function */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => onRemoveItem(item.id)} // Call the prop function
                    aria-label={`Remove ${item.name}`} // Added accessibility label
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Optional: Display item description if present */}
                {item.description && (
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                    </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Event Details Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"> {/* Reduced text size slightly */}
            <div>
              <p>
                <span className="font-medium">Date:</span> {newBooking.eventDate}
              </p>
              <p>
                <span className="font-medium">Rental Period:</span> 24-Hour Rental
              </p>
              <p>
                <span className="font-medium">Delivery/Setup:</span> {newBooking.startTime}
              </p>
              <p>
                <span className="font-medium">Pickup:</span> {newBooking.endTime} (next day)
              </p>
            </div>
             <div>
               <p>
                 <span className="font-medium">Event Type:</span> {newBooking.eventType}
               </p>
               <p>
                 <span className="font-medium">Participants:</span> {newBooking.participantCount}
               </p>
               {newBooking.participantAge && (
                 <p>
                   <span className="font-medium">Age Range:</span> {newBooking.participantAge}
                 </p>
               )}
             </div>
          </div>
           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"> {/* Added a separate grid for address */}
              <div>
                <p>
                  <span className="font-medium">Address:</span> {newBooking.eventAddress}
                </p>
                <p>
                  <span className="font-medium">City:</span> {newBooking.eventCity}
                </p>
                <p>
                  <span className="font-medium">State:</span> {newBooking.eventState}
                </p>
                <p>
                  <span className="font-medium">Zip Code:</span> {newBooking.eventZipCode}
                </p>
              </div>
              {/* Customer Info - moved here from Step 2 review section in original */}
               <div>
                  <p>
                    <span className="font-medium">Customer:</span> {newBooking.customerName}
                  </p>
                   <p>
                     <span className="font-medium">Email:</span> {newBooking.customerEmail}
                   </p>
                   <p>
                     <span className="font-medium">Phone:</span> {newBooking.customerPhone}
                   </p>
               </div>
           </div>

          {newBooking.specialInstructions && (
            <div className="mt-4 text-sm"> {/* Reduced text size */}
              <p className="font-medium">Special Instructions:</p>
              <p>{newBooking.specialInstructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coupon input */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="coupon">Coupon Code</Label>
              <Input
                id="coupon"
                value={couponCode} // Use prop
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())} // Use prop setter
                placeholder="Enter coupon code"
                disabled={!!appliedCoupon || isApplyingCoupon || isProcessingQuote || isSubmittingPayment} // Disable if coupon applied or processing
                className={couponError ? "border-red-500" : ""} // Use prop
              />
              {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>} {/* Use prop */}
            </div>
            {!appliedCoupon ? ( // Use prop
              <Button
                onClick={onApplyCoupon} // Call prop function
                disabled={!couponCode || isApplyingCoupon || isProcessingQuote || isSubmittingPayment} // Disable if no code or processing
                variant="outline"
              >
                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"} {/* Use prop */}
              </Button>
            ) : (
              <Button
                onClick={onRemoveCoupon} // Call prop function
                variant="ghost"
                type="button"
                disabled={isApplyingCoupon || isProcessingQuote || isSubmittingPayment} // Disable while processing
              >
                Remove coupon
              </Button>
            )}
          </div>
          {/* Payment summary lines - Use passed calculated values */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span> {/* Use passed prop */}
          </div>
          {appliedCoupon && ( // Use prop
            <div className="flex justify-between text-green-600">
              <span>-{appliedCoupon.code} coupon:</span> {/* Use prop */}
              <span>- ${appliedCoupon.amount.toFixed(2)}</span> {/* Use prop */}
            </div>
          )}
          {applyTax && taxRate > 0 && ( // Use props
            <div className="flex justify-between text-muted-foreground">
              <span>Tax ({taxRate}%):</span> {/* Use prop */}
              <span>${discountedTax.toFixed(2)}</span> {/* Use passed prop */}
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${discountedTotal.toFixed(2)}</span> {/* Use passed prop */}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons (Quote and Payment) - Moved into the step component */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8"> {/* Use justify-end instead of ml-auto */}
         {/* Send as Quote Button */}
         <Button
                 onClick={onSendAsQuote} // Call prop function
                 disabled={isSubmittingPayment || isProcessingQuote || selectedItems.size === 0} // Disable while processing or no items
                 variant="outline"
                 className="w-full sm:w-auto"
             >
                 {isProcessingQuote ? ( // Use prop
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Quote...
                    </>
                 ) : (
                    "Send as Quote"
                 )}
             </Button>

            {/* Proceed to Payment Button */}
            <Button
                onClick={onProceedToPayment} // Call prop function
                disabled={isSubmittingPayment || isProcessingQuote || selectedItems.size === 0 || discountedTotal <= 0} // Disable while processing or no items/total <= 0
                variant="primary-gradient"
                className="w-full sm:w-auto"
            >
                {isSubmittingPayment ? ( // Use prop
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                     Proceed to Payment
                     <CreditCard className="ml-2 h-4 w-4" />
                  </>
                )}
            </Button>
         </div>
    </div>
  );
}
