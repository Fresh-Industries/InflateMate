// app/embed/_components/BookingForm.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { EventDetailsStep } from "./EventDetails";
import { CustomerDetailsStep } from "./CustomerDetails";
import { ReviewPayStep } from "./Review";
import { useSelectedItems } from '@/hooks/useSelectedItems';
import { useCoupon } from '@/hooks/useCoupon';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { useBookingCalculations } from '@/hooks/useBookingCalculations';
import { NewBookingState, InventoryItem } from '@/types/booking';
import { Elements } from "@stripe/react-stripe-js";
import { getStripeInstance } from "@/lib/stripe-client";
import { PaymentForm } from "./PaymentForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { type Booking as PrismaBooking, type Customer as PrismaCustomer, type BookingItem as PrismaBookingItem, type Inventory as PrismaInventory, BookingStatus } from '@/prisma/generated/prisma';
import { formatDateToYYYYMMDD, formatTimeToHHMM, localToUTC } from '@/lib/utils';
import { addDays } from "date-fns";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { ThemeColors } from "@/app/[domain]/_themes/types";

const initialBooking: NewBookingState = {
  bounceHouseId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  eventDate: "",
  startTime: "09:00",
  endTime: "17:00",
  eventType: "OTHER",
  eventAddress: "",
  eventCity: "",
  eventState: "",
  eventZipCode: "",
  participantCount: 1,
  participantAge: "",
  specialInstructions: "",
  eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
};

interface BookingFormProps {
  businessId: string;
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
  onSuccess?: (bookingId?: string) => void;
  onError?: (error: string) => void;
}

export function BookingForm({ businessId, themeName, colors, onSuccess, onError }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [newBooking, setNewBooking] = useState<NewBookingState>(() => ({
    eventDate: formatDateToYYYYMMDD(addDays(new Date(), 2).toString()),
    startTime: "09:00",
    endTime: "17:00",
    eventType: "",
    eventAddress: "",
    eventCity: "",
    eventState: "",
    eventZipCode: "",
    eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    specialInstructions: "",
    bounceHouseId: "",
    participantCount: 1,
    participantAge: "",
  }));

  const [holdId, setHoldId] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [bookingId, setBookingId] = useState<string | null>(null);

  const { selectedItems, selectInventoryItem, updateQuantity, clearSelection } = useSelectedItems();

  const itemsForCalculation = React.useMemo(() => Array.from(selectedItems.values()), [selectedItems]);

  const { businessData, taxRate, applyTax } = useBusinessDetails(businessId);
  const [couponCode, setCouponCode] = useState("");
  const {
    appliedCoupon,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCoupon({ 
    businessId, 
    amountBeforeTax: itemsForCalculation.reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0)
  });

  const { rawSubtotal, discountedSubtotal, taxAmount, total } = useBookingCalculations({
    selectedItems: new Map(itemsForCalculation.map(({ item, quantity }) => [item.id, { item, quantity }])),
    taxRate: taxRate || 0,
    applyTax: !!applyTax,
    appliedCoupon,
  });

  const router = useRouter();
  const { toast } = useToast();

  // Get theme config
  const theme = themeConfig[themeName ?? 'modern'] ?? themeConfig.modern;
  
  // minimal, neutral fall‑back if a palette or style slice is missing
  const fallbackColors: ThemeColors = {
    primary: { 100: "#a5b4fc", 500: "#4f46e5", 900: "#312e81" },
    secondary: { 100: "#99f6e4", 500: "#06b6d4", 900: "#134e4a" },
    accent: { 100: "#fdba74", 500: "#f97316", 900: "#7c2d12" },
    background: { 100: "#ffffff", 500: "#f3f4f6", 900: "#111827" },
    text: { 100: "#ffffff", 500: "#6b7280", 900: "#111827" },
  };
  const c = colors ?? fallbackColors; // shorthand used below
  
  // Back button styles
  const backButtonStyle = {
    color: c.text[500],
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: theme.buttonStyles.borderRadius ?? '0.375rem',
    transition: 'all 0.2s ease',
  };
  
  const backButtonHoverStyle = {
    ...backButtonStyle,
    color: c.primary[900],
    backgroundColor: `${c.primary[100]}30`,
  };
  
  // Timer styles
  const timerContainerStyle = {
    background: `linear-gradient(90deg, ${c.primary[500]}, ${c.accent[500]})`,
    color: c.text[100],
    borderRadius: '9999px',
    boxShadow: theme.cardStyles.boxShadow(c),
    padding: '0.75rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };
  
  const timerValueStyle = {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginLeft: '0.5rem',
  };

  useEffect(() => {
    if (!holdExpiresAt) return;
    const interval = setInterval(() => {
      const end = new Date(holdExpiresAt).getTime();
      const seconds = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimer(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setHoldId(null);
        setHoldExpiresAt(null);
        const errorMessage = "Your item reservation has expired. Please start over.";
        toast({
          title: "Reservation Expired",
          description: errorMessage,
          variant: "destructive",
        });
        onError?.(errorMessage); // Call the parent's error callback
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, toast]);

  const handleSetHold = (id: string | null, expiresAt: string | null) => {
    setHoldId(id);
    setHoldExpiresAt(expiresAt);
    if (expiresAt) {
      const end = new Date(expiresAt).getTime();
      setTimer(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    }
  };

  const validateEventDetails = () => {
    if (!newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || selectedItems.size === 0) {
      const errorMessage = "Please complete all event details and select at least one item.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage); // Call the parent's error callback
      return false;
    }
    return true;
  };

  const validateCustomerInfo = () => {
    if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone) {
      const errorMessage = "Please complete all customer details.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
      onError?.(errorMessage); // Call the parent's error callback
      return false;
    }
    return true;
  };

  const prepareItemsPayload = () => {
    const tz = newBooking.eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return Array.from(selectedItems.values()).map(({ item, quantity }) => {
      const startUTC = localToUTC(
        newBooking.eventDate,
        newBooking.startTime,
        tz
      );
      const endUTC = localToUTC(
        newBooking.eventDate,
        newBooking.endTime,
        tz
      );
      return {
        inventoryId: item.id,
        quantity,
        price: item.price,
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
        status: BookingStatus.HOLD
      };
    });
  };

  const handleProceedToPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!holdId) {
        throw new Error("No hold in place. Please start your booking again.");
      }
      const amountCents = Math.round(total * 100);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        holdId,
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
        eventDate: newBooking.eventDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        eventAddress: newBooking.eventAddress,
        eventCity: newBooking.eventCity,
        eventState: newBooking.eventState,
        eventZipCode: newBooking.eventZipCode,
        eventTimeZone: tz,
        eventType: newBooking.eventType,
        participantCount: newBooking.participantCount,
        participantAge: newBooking.participantAge
          ? Number(newBooking.participantAge)
          : null,
        specialInstructions: newBooking.specialInstructions,
        subtotalAmount: rawSubtotal,
        taxAmount: taxAmount,
        taxRate: taxRate || 0,
        totalAmount: total,
        amountCents,
        couponCode: appliedCoupon?.code || undefined,
      };
      const paymentResponse = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Failed to create payment intent.");
      }
      
      if (paymentData.clientSecret) {
        setClientSecret(paymentData.clientSecret);
        const bookingId = paymentData.bookingId;
        console.log('Received bookingId:', bookingId);
        setBookingId(bookingId);
        setShowPaymentForm(true);
      } else {
        throw new Error("No client secret received from the server.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process booking";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage); // Call the parent's error callback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {holdId && holdExpiresAt && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full" style={timerContainerStyle}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Reservation expires in:</span>
            <span style={timerValueStyle}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
          </div>
        </div>
      )}
      {currentStep > 1 && (
        <div className="flex justify-start mb-4">
          <Button 
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
            className="text-gray-600 flex items-center"
            style={backButtonStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, backButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, backButtonStyle)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
        </div>
      )}
      {showPaymentForm && clientSecret ? (
        <Elements
          stripe={getStripeInstance(businessData?.stripeAccountId || businessData?.stripeConnectedAccountId)}
          options={{
            clientSecret: clientSecret,
            appearance: { theme: "stripe", variables: { colorPrimary: "#0F172A" } },
          }}
        >
          <PaymentForm
            amount={total}
            customerEmail={newBooking.customerEmail}
            businessId={businessId}
            subtotal={rawSubtotal}
            taxAmount={taxAmount}
            taxRate={taxRate || 0}
            themeName={themeName}
            colors={colors}
            bookingId={bookingId || undefined}
            onSuccess={async (receivedBookingId) => {
              setShowPaymentForm(false);
              setHoldId(null);
              setHoldExpiresAt(null);
              setCurrentStep(1);
              setNewBooking(initialBooking);
              setCouponCode("");
              onSuccess?.(receivedBookingId || undefined); // Call the parent's success callback with bookingId
              setTimeout(() => router.refresh(), 500);
            }}
            onError={(error) => {
              toast({
                title: "Payment Error",
                description: error,
                variant: "destructive",
              });
              onError?.(error); // Call the parent's error callback
            }}
          />
        </Elements>
      ) : (
        <>
          {currentStep === 1 && (
            <EventDetailsStep
              businessId={businessId}
              newBooking={newBooking}
              setNewBooking={setNewBooking}
              onContinue={() => setCurrentStep((s) => s + 1)}
              selectedItems={selectedItems}
              selectInventoryItem={selectInventoryItem}
              updateQuantity={updateQuantity}
              setHoldId={handleSetHold}
              holdId={holdId}
              themeName={themeName}
              colors={colors}
            />
          )}
          {currentStep === 2 && (
            <CustomerDetailsStep
              newBooking={newBooking}
              setNewBooking={setNewBooking}
              onContinue={() => setCurrentStep((s) => s + 1)}
              themeName={themeName}
              colors={colors}
            />
          )}
          {currentStep === 3 && (
            <ReviewPayStep
              newBooking={newBooking}
              selectedItems={new Map(itemsForCalculation.map(({ item, quantity }) => [item.id, { item, quantity }]))}
              taxRate={taxRate || 0}
              applyTax={!!applyTax}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              subtotal={rawSubtotal}
              discountedTax={taxAmount}
              discountedTotal={total}
              isApplyingCoupon={isApplyingCoupon}
              isSubmittingPayment={isSubmitting}
              setCouponCode={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onProceedToPayment={handleProceedToPayment}
              themeName={themeName}
              colors={colors}
            />
          )}
        </>
      )}
    </div>
  );
}
