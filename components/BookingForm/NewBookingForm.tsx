/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from "react";
import { EventDetailsStep } from "./Availbility";
import { CustomerDetailsStep } from "./CustomerInfo";
import { ReviewPayStep } from "./Summary";
import { useSelectedItems } from '@/hooks/useSelectedItems';
import { useCoupon } from '@/hooks/useCoupon';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { useBookingCalculations } from '@/hooks/useBookingCalculations';
import { NewBookingState, InventoryItem } from '@/types/booking';
import Header from "./Header";
import { Elements } from "@stripe/react-stripe-js";
import { getStripeInstance } from "@/lib/stripe-client";
import { PaymentForm } from "./PaymentForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { type Booking as PrismaBooking, type Customer as PrismaCustomer, type BookingItem as PrismaBookingItem, type Inventory as PrismaInventory, BookingStatus } from '@/prisma/generated/prisma';
import { formatDateToYYYYMMDD, formatTimeToHHMM, localToUTC } from '@/lib/utils';
import { addDays } from "date-fns";

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

type HoldState = {
  id: string | null;
  expiresAt: string | null;
  timer: number;
}

interface NewBookingFormProps {
  businessId: string;
}

export function NewBookingForm({ businessId }: NewBookingFormProps) {
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

  const [holdState, setHoldState] = useState<HoldState>({
    id: null,
    expiresAt: null,
    timer: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [displaySubtotal, setDisplaySubtotal] = useState<number | null>(null);
  const [displayTaxAmount, setDisplayTaxAmount] = useState<number | null>(null);
  const [displayTotal, setDisplayTotal] = useState<number | null>(null);

  const { selectedItems, selectInventoryItem, updateQuantity, clearSelection } = useSelectedItems();

  const itemsForCalculation = React.useMemo(() => Array.from(selectedItems.values()), [selectedItems]);

  const { businessData, taxRate, applyTax } = useBusinessDetails(businessId);
  const {
    couponCode,
    setCouponCode,
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

  useEffect(() => {
    if (!holdState.expiresAt) return;
    const interval = setInterval(() => {
      const end = new Date(holdState.expiresAt!).getTime();
      const seconds = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setHoldState((prev) => ({ ...prev, timer: seconds }));
      if (seconds <= 0) {
        clearInterval(interval);
        setHoldState({ id: null, expiresAt: null, timer: 0 });
        toast({
          title: "Reservation Expired",
          description: "Your item reservation has expired. Please start over.",
          variant: "destructive",
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdState.expiresAt, toast]);

  const handleSetHold = (id: string | null, expiresAt: string | null) => {
    const timer = expiresAt
      ? Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000))
      : 0;
  
    setHoldState({ id, expiresAt, timer });
  };

  const validateEventDetails = () => {
    if (!newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || selectedItems.size === 0) {
      toast({
        title: "Error",
        description: "Please complete all event details and select at least one item.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateCustomerInfo = () => {
    if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone) {
      toast({ title: "Error", description: "Please complete all customer details.", variant: "destructive" });
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

  // Separate function for preparing quote items payload
  const prepareQuoteItemsPayload = () => {
    return Array.from(selectedItems.values()).map(({ item, quantity }) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantity,
      stripeProductId: item.stripeProductId,
      stripePriceId: (item as unknown as { stripePriceId?: string }).stripePriceId,
    }));
  };

  const handleProceedToPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (!holdState.id) {
        throw new Error("No hold in place. Please start your booking again.");
      }
      const amountCents = Math.round(total * 100);
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        holdId: holdState.id,
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
      const clientSecret = paymentData.clientSecret;
      const bookingId = paymentData.bookingId;
      console.log('Received bookingId:', bookingId);

      if (!clientSecret) throw new Error("Missing client secret from server.");
      setClientSecret(clientSecret);
      setBookingId(bookingId);
      // Prefer Stripe Tax computed amounts when available
      const stripeSubtotal = typeof paymentData.stripeTaxSubtotal === 'number' ? paymentData.stripeTaxSubtotal : null;
      const stripeTax = typeof paymentData.stripeTaxAmount === 'number' ? paymentData.stripeTaxAmount : null;
      const stripeTotal = typeof paymentData.stripeTaxTotal === 'number' ? paymentData.stripeTaxTotal : null;
      setDisplaySubtotal(stripeSubtotal ?? rawSubtotal);
      setDisplayTaxAmount(stripeTax ?? taxAmount);
      setDisplayTotal(stripeTotal ?? total);
      setShowPaymentForm(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAsQuote = async () => {
    if (isProcessingQuote) return;
    if (!validateEventDetails() || !validateCustomerInfo()) return;
    setIsProcessingQuote(true);
    try {
      const quoteDetails = {
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
        selectedItems: prepareQuoteItemsPayload(),
        eventDate: newBooking.eventDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        eventTimeZone: newBooking.eventTimeZone,
        eventType: newBooking.eventType || 'OTHER',
        eventAddress: newBooking.eventAddress,
        eventCity: newBooking.eventCity,
        eventState: newBooking.eventState,
        eventZipCode: newBooking.eventZipCode,
        participantCount: newBooking.participantCount || 1,
        participantAge: newBooking.participantAge || "",
        specialInstructions: newBooking.specialInstructions || '',
        subtotalAmount: rawSubtotal,
        taxAmount: taxAmount,
        taxRate: taxRate || 0,
        totalAmount: total,
        businessId: businessId,
        holdId: holdState.id,
      };
      const response = await fetch(`/api/businesses/${businessId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteDetails),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create and send quote.");
      }
      toast({
        title: "Quote Sent",
        description: `A quote has been sent to ${newBooking.customerEmail}.`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send quote",
        variant: "destructive",
      });
    } finally {
      setIsProcessingQuote(false);
    }
  };

  // Step rendering
  return (
    <div className="space-y-8">
      <Header currentStep={currentStep} bookingId={null} />
      {/* Global Reservation Timer */}
      {holdState.id && holdState.expiresAt && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Reservation expires in:</span>
            <span className="ml-2 font-mono font-bold">{Math.floor(holdState.timer / 60)}:{(holdState.timer % 60).toString().padStart(2, "0")}</span>
          </div>
        </div>
      )}
      {/* Back Button */}
      {currentStep > 1 && (
        <div className="flex justify-start mb-4">
          <Button 
            onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            clientSecret,
            appearance: { theme: "stripe", variables: { colorPrimary: "#0F172A" } },
          }}
        >
          <PaymentForm
            amount={displayTotal ?? total}
            customerEmail={newBooking.customerEmail}
            businessId={businessId}
            subtotal={displaySubtotal ?? rawSubtotal}
            taxAmount={displayTaxAmount ?? taxAmount}
            taxRate={taxRate || 0}
            bookingId={bookingId || undefined}
            onSuccess={async () => {
              setShowPaymentForm(false);
              setClientSecret(null);
              setHoldState({ id: null, expiresAt: null, timer: 0 });
              setCurrentStep(1);
              setNewBooking(initialBooking);
              setCouponCode("");
              setTimeout(() => router.refresh(), 500);
            }}
            onError={(error) => {
              toast({
                title: "Payment Error",
                description: error,
                variant: "destructive",
              });
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
              holdId={holdState.id}
            />
          )}
          {currentStep === 2 && (
            <CustomerDetailsStep
              newBooking={newBooking}
              setNewBooking={setNewBooking}
              onContinue={() => setCurrentStep((s) => s + 1)}
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
              isProcessingQuote={isProcessingQuote}
              isSubmittingPayment={isSubmitting}
              setCouponCode={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              onRemoveItem={(itemId) => selectInventoryItem({ ...selectedItems.get(itemId)!.item, quantity: 0 }, 0)}
              onSendAsQuote={handleSendAsQuote}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
        </>
      )}
    </div>
  );
}
