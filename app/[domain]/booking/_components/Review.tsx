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
import { Loader2, Package, Calendar, Home, User, MessageCircle, DollarSign, Tag, Receipt, CreditCard as CardIcon } from "lucide-react";
import React from "react";
import { SelectedItem, NewBookingState } from '@/types/booking';
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { ThemeColors } from "@/app/[domain]/_themes/types";

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
  isSubmittingPayment: boolean; // Renamed from isSubmitting for clarity

  // Functions to handle actions (passed from parent)
  setCouponCode: React.Dispatch<React.SetStateAction<string>>;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onProceedToPayment: () => void;
  
  // Theme props
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
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
  isSubmittingPayment,
  setCouponCode,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToPayment,
  themeName = "modern",
  colors,
}: ReviewPayStepProps) {
  const theme = themeConfig[themeName] ?? themeConfig.modern;

  // minimal, neutral fall‑back if a palette or style slice is missing
  const fallbackColors: ThemeColors = {
    primary: { 100: "#a5b4fc", 500: "#4f46e5", 900: "#312e81" },
    secondary: { 100: "#99f6e4", 500: "#06b6d4", 900: "#134e4a" },
    accent: { 100: "#fdba74", 500: "#f97316", 900: "#7c2d12" },
    background: { 100: "#ffffff", 500: "#f3f4f6", 900: "#111827" },
    text: { 100: "#ffffff", 500: "#6b7280", 900: "#111827" },
  };
  const c = colors ?? fallbackColors; // shorthand used below

  /* ----------------------------------------------------------------- */
  /*                          THEME STYLING                            */
  /* ----------------------------------------------------------------- */
  
  // Section styles - use bookingStyles from theme
  const sectionStyle = {
    background: theme.bookingStyles.formBackground(c),
    color: theme.bookingStyles.formTextColor(c),
    borderRadius: theme.cardStyles.borderRadius ?? "12px",
    boxShadow: theme.bookingStyles.formShadow(c),
    border: theme.bookingStyles.formBorder(c),
    animation: theme.animations?.elementEntrance || 'none',
    padding: '24px',
  };
  
  // Card styles
  const cardStyle = {
    background: theme.cardStyles.background(c),
    border: theme.cardStyles.border(c),
    boxShadow: theme.cardStyles.boxShadow(c),
    borderRadius: theme.cardStyles.borderRadius ?? "12px",
  };
  
  // Card header styles
  const cardHeaderStyle = {
    borderBottom: `1px solid ${c.primary[100]}20`,
  };
  
  // Card title styles
  const cardTitleStyle = {
    color: c.primary[900],
    fontWeight: 'bold',
  };
  
  // Input styles
  const inputStyle = {
    background: theme.bookingStyles.input.background(c),
    border: `1px solid ${theme.bookingStyles.input.border(c)}`,
    borderRadius: theme.bookingStyles.input.borderRadius?.(c) ?? "6px",
  };
  
  const labelStyle = {
    color: theme.bookingStyles.input.labelColor(c),
    fontWeight: 'medium',
  };
  
  // Heading styles
  const headingStyle = {
    color: c.primary[900],
    fontWeight: 'bold',
  };
  
  // Button styles
  const primaryButton = {
    backgroundColor: theme.buttonStyles.background(c),
    color: theme.buttonStyles.textColor(c),
    border: theme.buttonStyles.border?.(c) ?? "none",
    boxShadow: theme.buttonStyles.boxShadow?.(c),
    borderRadius: theme.buttonStyles.borderRadius ?? "9999px",
    transition: theme.buttonStyles.transition ?? "all 0.2s ease",
    ...(theme.buttonStyles.customStyles?.(c) ?? {}),
  };
  
  const primaryButtonHover = {
    backgroundColor: theme.buttonStyles.hoverBackground(c),
    color: theme.buttonStyles.hoverTextColor?.(c) ?? c.text[100],
    border: theme.buttonStyles.hoverBorder?.(c) ?? primaryButton.border,
    boxShadow: theme.buttonStyles.hoverBoxShadow?.(c) ?? primaryButton.boxShadow,
  };
  
  const secondaryButton = {
    backgroundColor: theme.secondaryButtonStyles?.background(c) ?? 'transparent',
    color: theme.secondaryButtonStyles?.textColor(c) ?? c.primary[500],
    border: theme.secondaryButtonStyles?.border?.(c) ?? `1px solid ${c.primary[500]}`,
    boxShadow: theme.secondaryButtonStyles?.boxShadow?.(c) ?? 'none',
    borderRadius: theme.secondaryButtonStyles?.borderRadius ?? "9999px",
    transition: theme.secondaryButtonStyles?.transition ?? "all 0.2s ease",
    ...(theme.secondaryButtonStyles?.customStyles?.(c) ?? {}),
  };
  
  const secondaryButtonHover = {
    backgroundColor: theme.secondaryButtonStyles?.hoverBackground?.(c) ?? c.primary[100],
    color: theme.secondaryButtonStyles?.hoverTextColor?.(c) ?? c.text[900],
    border: theme.secondaryButtonStyles?.hoverBorder?.(c) ?? secondaryButton.border,
    boxShadow: theme.secondaryButtonStyles?.hoverBoxShadow?.(c) ?? secondaryButton.boxShadow,
  };
  
  // Summary item styles
  const summaryItemStyle = {
    borderBottom: `1px solid ${c.primary[100]}20`,
    padding: '12px 0',
  };
  
  // Image container styles
  const imageContainerStyle = {
    border: `1px solid ${c.primary[100]}40`,
    borderRadius: theme.cardStyles.borderRadius ? `calc(${theme.cardStyles.borderRadius} - 4px)` : "8px",
    overflow: 'hidden',
  };

  return (
    <section className="space-y-6" style={sectionStyle}>
      <h3 className="text-xl font-semibold flex items-center gap-2" style={headingStyle}>
        <Receipt className="h-5 w-5" /> Review Your Booking
      </h3>

      {/* Selected Items Card */}
      {selectedItems.size > 0 && (
        <Card className="mb-4" style={cardStyle}>
          <CardHeader style={cardHeaderStyle}>
            <CardTitle className="flex items-center gap-2" style={cardTitleStyle}>
              <Package className="h-5 w-5" /> Selected Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from(selectedItems.values()).map(({ item, quantity }) => (
              <div key={item.id} style={summaryItemStyle} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  {item.primaryImage ? (
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md" style={imageContainerStyle}>
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                     <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md flex items-center justify-center text-muted-foreground text-sm text-center p-2" style={imageContainerStyle}>
                        No Image
                     </div>
                  )}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="sm:col-span-2">
                        <h4 className="font-semibold" style={{color: c.primary[900]}}>{item.name}</h4>
                         <p style={{color: c.text[500]}} className="text-sm">{item.type}</p>
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
                     <div>
                       <span className="font-medium">Price:</span> ${item.price.toFixed(2)} ea
                     </div>
                  </div>
                </div>
                {item.description && (
                    <div className="mt-2 text-sm line-clamp-2" style={{color: c.text[500]}}>
                        {item.description}
                    </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Event Details Card */}
      <Card className="mb-4" style={cardStyle}>
        <CardHeader style={cardHeaderStyle}>
          <CardTitle className="flex items-center gap-2" style={cardTitleStyle}>
            <Calendar className="h-5 w-5" /> Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
           <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1.5" style={{color: c.primary[900]}}>
                  <Home className="h-4 w-4" /> Event Location
                </h4>
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
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1.5" style={{color: c.primary[900]}}>
                  <User className="h-4 w-4" /> Customer Information
                </h4>
                <p>
                  <span className="font-medium">Name:</span> {newBooking.customerName}
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
            <div className="mt-4 text-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1.5" style={{color: c.primary[900]}}>
                <MessageCircle className="h-4 w-4" /> Special Instructions
              </h4>
              <p>{newBooking.specialInstructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary Card */}
      <Card style={cardStyle}>
        <CardHeader style={cardHeaderStyle}>
          <CardTitle className="flex items-center gap-2" style={cardTitleStyle}>
            <DollarSign className="h-5 w-5" /> Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Coupon input */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="coupon" className="flex items-center gap-1.5" style={labelStyle}>
                <Tag className="h-4 w-4" /> Coupon Code
              </Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                disabled={!!appliedCoupon || isApplyingCoupon || isSubmittingPayment}
                className={couponError ? "border-red-500" : ""}
                style={inputStyle}
              />
              {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>}
            </div>
            {!appliedCoupon ? (
              <Button
                onClick={onApplyCoupon}
                disabled={!couponCode || isApplyingCoupon || isSubmittingPayment}
                style={secondaryButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButton)}
              >
                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            ) : (
              <Button
                onClick={onRemoveCoupon}
                disabled={isApplyingCoupon || isSubmittingPayment}
                style={secondaryButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButton)}
              >
                Remove coupon
              </Button>
            )}
          </div>
          
          {/* Payment summary lines */}
          <div className="p-4 rounded-lg" style={{backgroundColor: `${c.background[500]}30`}}>
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between mb-2" style={{color: c.accent[500]}}>
                <span>-{appliedCoupon.code} coupon:</span>
                <span>- ${appliedCoupon.amount.toFixed(2)}</span>
              </div>
            )}
            {applyTax && taxRate > 0 && (
              <div className="flex justify-between mb-2" style={{color: c.text[500]}}>
                <span>Tax ({taxRate}%):</span>
                <span>${discountedTax.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" style={{backgroundColor: c.primary[100]}} />
            <div className="flex justify-between font-bold mt-2" style={{color: c.primary[900]}}>
              <span>Total:</span>
              <span>${discountedTotal.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proceed to Payment Button */}
      <div className="flex w-full flex-col sm:flex-row gap-4 justify-center mt-8">
         <Button
                onClick={onProceedToPayment}
                disabled={isSubmittingPayment || selectedItems.size === 0 || discountedTotal <= 0}
                className="w-full py-3 px-6 text-base"
                style={primaryButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButton)}
            >
                {isSubmittingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                     Proceed to Payment
                     <CardIcon className="ml-2 h-4 w-4" />
                  </>
                )}
            </Button>
         </div>
    </section>
  );
}
