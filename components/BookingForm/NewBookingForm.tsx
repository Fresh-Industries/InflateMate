"use client";

import React, { useState } from "react";
import { EventDetailsStep } from "./Availbility";
import { CustomerDetailsStep } from "./CustomerInfo";
import { ReviewPayStep } from "./Summary";
import { useSelectedItems } from '@/hooks/useSelectedItems';
import { useCoupon } from '@/hooks/useCoupon';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { useBookingCalculations } from '@/hooks/useBookingCalculations';
import { NewBookingState } from '@/types/booking';
import Header from "./Header";
import { Elements } from "@stripe/react-stripe-js";
import { getStripeInstance } from "@/lib/stripe-client";
import { PaymentForm } from "./PaymentForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
};

export function NewBookingForm({ businessId }: { businessId: string }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [newBooking, setNewBooking] = useState<NewBookingState>(initialBooking);
  const [holdId, setHoldId] = useState<string | null>(null);
  const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Move useSelectedItems to the parent
  const { selectedItems, selectInventoryItem, updateQuantity } = useSelectedItems();
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { businessData, taxRate, applyTax } = useBusinessDetails(businessId);
  const [couponCode, setCouponCode] = useState("");
  const {
    appliedCoupon,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCoupon({ businessId, amountBeforeTax: 0 }); // amountBeforeTax will be set below

  // Calculations
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rawSubtotal, discountedSubtotal, taxAmount, total } = useBookingCalculations({
    selectedItems,
    taxRate: taxRate || 0,
    applyTax: !!applyTax,
    appliedCoupon,
  });

  const router = useRouter();

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // Remove item handler for summary
  const handleRemoveItem = (itemId: string) => {
    selectInventoryItem({ ...selectedItems.get(itemId)!.item, quantity: 0 }, 0);
  };

  const { toast } = useToast();

  // Timer countdown effect for hold
  React.useEffect(() => {
    if (!holdExpiresAt) return;
    const interval = setInterval(() => {
      const end = new Date(holdExpiresAt).getTime();
      const seconds = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimer(seconds);
      if (seconds <= 0) {
        clearInterval(interval);
        setHoldId(null);
        setHoldExpiresAt(null);
        toast({
          title: "Reservation Expired",
          description: "Your item reservation has expired. Please start over.",
          variant: "destructive",
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, toast]);

  // Function to handle hold updates
  const handleSetHold = (id: string | null, expiresAt: string | null) => {
    setHoldId(id);
    setHoldExpiresAt(expiresAt);
    if (expiresAt) {
      const end = new Date(expiresAt).getTime();
      setTimer(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    }
  };

  // Validation helpers
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

  // Payment handler: always send holdId, do not send bookingId
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
        holdId, // required for payment
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
      if (!clientSecret) throw new Error("Missing client secret from server.");
      setClientSecret(clientSecret);
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

  // Quote handler: always generate a new bookingId, do not use holdId
  const handleSendAsQuote = async () => {
    if (isProcessingQuote) return;
    if (!validateEventDetails() || !validateCustomerInfo()) return;
    setIsProcessingQuote(true);
    try {
      const selectedItemsArray = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        stripeProductId: item.stripeProductId,
      }));
      if (selectedItemsArray.length === 0) {
        toast({
          title: "Selection Needed",
          description: "Please select at least one item for the quote.",
          variant: "destructive",
        });
        return;
      }
      const quoteDetails = {
        ...newBooking,
        selectedItems: selectedItemsArray,
        subtotalAmount: rawSubtotal,
        taxAmount: taxAmount,
        taxRate: taxRate || 0,
        totalAmount: total,
        businessId: businessId,
        bookingId: crypto.randomUUID(), // always new for quote
        eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      const response = await fetch(`/api/businesses/${businessId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteDetails),
      });
      const data = await response.json();
      if (!response.ok) {
        toast({
          title: "Error Sending Quote",
          description: data.error || "Failed to create and send quote.",
          variant: "destructive",
        });
        throw new Error(data.error || "Failed to create quote");
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
      <Header currentStep={currentStep} />
      
      {/* Global Reservation Timer */}
      {holdId && holdExpiresAt && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Reservation expires in:</span>
            <span className="ml-2 font-mono font-bold">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}</span>
          </div>
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
            amount={total}
            customerEmail={newBooking.customerEmail}
            businessId={businessId}
            subtotal={rawSubtotal}
            taxAmount={taxAmount}
            taxRate={taxRate || 0}
            onSuccess={async () => {
              setShowPaymentForm(false);
              setClientSecret(null);
              setHoldId(null);
              setHoldExpiresAt(null);
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
              holdId={holdId}
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
              selectedItems={selectedItems}
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
              onRemoveItem={handleRemoveItem}
              onSendAsQuote={handleSendAsQuote}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 2 && (
              <Button onClick={handleBack} variant="outline">Back</Button>
            )}
          </div>
          {currentStep > 2 && (
            <Button onClick={() => setCurrentStep((s) => s + 1)} variant="primary-gradient">Continue</Button>
          )}
        </>
      )}
    </div>
  );
}
