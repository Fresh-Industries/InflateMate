// src/hooks/useBookingSubmission.ts

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation'; // Assuming Next.js router
import { BookingMetadata, ReservationPayload } from '@/types/booking';
import * as BookingService from '@/services/bookingService'; // Import your services

// Define parameters needed for submission calls
type SubmissionDetails = {
    businessId: string;
    formDetails: BookingMetadata; // All the user input data
    selectedItemsArray: Array<{ id: string; name: string; price: number; quantity: number; stripeProductId: string; }>;
    calculatedTotals: {
        subtotal: number;
        taxAmount: number;
        taxRate: number; // Needed for payload, even if derived
        total: number;
    };
    appliedCouponCode?: string;
    holdId: string | null; // Required for creating payment intent
    eventTimeZone: string; // Needed for API calls
};

type UseBookingSubmissionProps = {
    businessId: string;
    // Callbacks for lifecycle events
    onReservationSuccess?: (holdId: string, expiresAt: string) => void;
    onPaymentIntentCreated?: (clientSecret: string, bookingData: BookingMetadata) => void;
    onQuoteSent?: (stripeQuoteId: string, hostedQuoteUrl: string) => void;
    onSubmissionError?: (error: Error) => void; // Generic error callback
    onPaymentSuccess?: () => void; // Callback after successful Stripe payment (handled by PaymentForm)
};

export function useBookingSubmission({
    businessId,
    onReservationSuccess,
    onPaymentIntentCreated,
    onQuoteSent,
    onSubmissionError,
    onPaymentSuccess, // Used by the success handler passed to PaymentForm
}: UseBookingSubmissionProps) {
  const { toast } = useToast();
  // const router = useRouter(); // To refresh/redirect
   // Combined loading state for any API submission within this hook
  const [isSubmitting, setIsSubmitting] = useState(false);
   // Specific loading state for quote, as it might happen alongside payment flow
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);

   // State to prepare data for the PaymentForm
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pendingBookingData, setPendingBookingData] = useState<BookingMetadata | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Control rendering of payment form

   // State for the item hold created in the first step
  const [holdId, setHoldId] = useState<string | null>(null);
  // const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null); // Can keep this if needed elsewhere


   // Function to handle the reservation call (Step 1 -> Step 2)
  const handleReserveItems = useCallback(async (payload: ReservationPayload) => {
       // Check if already submitting something else
       if (isSubmitting || isProcessingQuote) return;
       setIsSubmitting(true); // Set general submission loading

       try {
           const data = await BookingService.reserveItems(businessId, payload);

           setHoldId(data.holdId);
           // setHoldExpiresAt(data.expiresAt);

           if (onReservationSuccess) {
               onReservationSuccess(data.holdId, data.expiresAt);
           }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
       } catch (error: any) {
           console.error("Reservation failed:", error);
           setHoldId(null); // Clear holdId on failure
           // setHoldExpiresAt(null);
           const submissionError = error instanceof Error ? error : new Error("Failed to reserve items.");
           if (onSubmissionError) {
               onSubmissionError(submissionError);
           } else {
               toast({
                   title: "Reservation Failed",
                   description: submissionError.message,
                   variant: "destructive"
               });
           }
       } finally {
           setIsSubmitting(false); // Reset general submission loading
       }
   }, [businessId, isSubmitting, isProcessingQuote, onReservationSuccess, onSubmissionError, toast]);


  // Function to handle sending a quote (Action on Step 3)
  const handleSendQuote = useCallback(async (details: Omit<SubmissionDetails, 'holdId'>) => {
      // Check if already submitting something else
      if (isSubmitting || isProcessingQuote) return;
      setIsProcessingQuote(true); // Set specific quote loading

      try {
          const quoteDetails: BookingMetadata = {
            ...details.formDetails,
            selectedItems: details.selectedItemsArray,
            subtotalAmount: details.calculatedTotals.subtotal,
            taxAmount: details.calculatedTotals.taxAmount,
            taxRate: details.calculatedTotals.taxRate,
            totalAmount: details.calculatedTotals.total,
            businessId: businessId,
            bookingId: crypto.randomUUID(), // Generate quote ID client-side or let API do it
            eventTimeZone: details.eventTimeZone,
            couponCode: details.appliedCouponCode,
          };

          const data = await BookingService.createQuote(businessId, quoteDetails);

          if (onQuoteSent) {
              onQuoteSent(data.stripeQuoteId, data.hostedQuoteUrl);
          } else {
               // Default success handling if no callback provided
               toast({ title: "Quote Sent", description: `A quote has been sent to ${details.formDetails.customerEmail}.`, });
               // Assuming the parent component will handle sheet close and router refresh
          }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
           console.error("Quote submission failed:", error);
           const submissionError = error instanceof Error ? error : new Error("Failed to send quote.");

            // Check for specific API error structures if needed (e.g., Zod errors)
           const description = submissionError.message;
           // Example: if (error.details) description = formatZodErrors(error.details); // Need a helper for this

           if (onSubmissionError) {
               onSubmissionError(submissionError);
           } else {
               toast({ title: "Error Sending Quote", description, variant: "destructive", });
           }

      } finally {
          setIsProcessingQuote(false); // Reset specific quote loading
      }
  }, [businessId, isSubmitting, isProcessingQuote, onQuoteSent, onSubmissionError, toast]);


  // Function to handle creating the payment intent (Action on Step 3, leads to PaymentForm)
  const handleCreatePaymentIntent = useCallback(async (details: Omit<SubmissionDetails, 'isProcessingQuote'>) => {
      // Check if already submitting something else
      if (isSubmitting || isProcessingQuote) return;
      setIsSubmitting(true); // Set general submission loading

      if (!details.holdId) {
          const error = new Error("Item hold missing. Please restart the booking process.");
          if (onSubmissionError) {
             onSubmissionError(error);
          } else {
             toast({ title: "Booking Error", description: error.message, variant: "destructive" });
          }
          setIsSubmitting(false);
          return;
      }

      try {
          const amountCents = Math.round(details.calculatedTotals.total * 100);

          const bookingDetailsPayload: BookingMetadata & { amountCents: number } = {
            ...details.formDetails,
            // Note: Selected items are linked via the holdId, not needed explicitly in this payload
            // unless your API expects them again for final confirmation/storage.
            // Let's include them for completeness if the API needs them again.
             selectedItems: details.selectedItemsArray,
            subtotalAmount: details.calculatedTotals.subtotal,
            taxAmount: details.calculatedTotals.taxAmount,
            taxRate: details.calculatedTotals.taxRate,
            totalAmount: details.calculatedTotals.total,
            amountCents: amountCents,
            businessId: businessId,
             // API should ideally generate bookingId here, but matching holdId might be needed
             // or remove it if holdId is sufficient to link
             // bookingId: details.holdId, // Example if using holdId as bookingId
            eventTimeZone: details.eventTimeZone,
            couponCode: details.appliedCouponCode,
          };

          const data = await BookingService.createBookingPaymentIntent(businessId, { ...bookingDetailsPayload, holdId: details.holdId }); // Pass holdId explicitly

          setClientSecret(data.clientSecret);
          // Store the booking details to pass to the PaymentForm for metadata/display
          setPendingBookingData(bookingDetailsPayload); // Use the details passed into the hook

          setShowPaymentForm(true); // Signal to show the payment form

           if (onPaymentIntentCreated) {
              onPaymentIntentCreated(data.clientSecret, bookingDetailsPayload); // Pass booking data as confirmation
           }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
          console.error("Payment Intent creation failed:", error);
          setClientSecret(null);
          setPendingBookingData(null);
          setShowPaymentForm(false); // Hide payment form on error

          const submissionError = error instanceof Error ? error : new Error("Failed to prepare payment.");
           if (onSubmissionError) {
               onSubmissionError(submissionError);
           } else {
               toast({ title: "Payment Setup Error", description: submissionError.message, variant: "destructive", });
           }

      } finally {
          setIsSubmitting(false); // Reset general submission loading
      }
  }, [businessId, holdId, isSubmitting, isProcessingQuote, onPaymentIntentCreated, onSubmissionError, toast]);


    // Reset payment state when hiding the payment form
    const hidePaymentForm = useCallback(() => {
        setShowPaymentForm(false);
        setClientSecret(null);
        setPendingBookingData(null);
        // Important: Do NOT clear holdId here if it's needed to retry payment
        // Clear holdId only on reservation failure or when starting a new booking process.
    }, []);

    // Function to call when PaymentForm signals success
    // This hooks into the callback prop of PaymentForm
    const handlePaymentSuccessInternal = useCallback(() => {
        // Perform actions after payment is successful (e.g., close sheet, refresh router)
        // This hook can trigger the parent callback or perform actions directly
        if (onPaymentSuccess) {
            onPaymentSuccess(); // Let the parent handle sheet close/refresh
        } else {
             // Default success handling if no callback
             toast({ title: "Booking Confirmed", description: "Your booking has been successfully created", });
             // You might need access to sheetCloseRef or router refresh here,
             // or rely on the parent component to handle this via the callback.
             // Relying on the parent callback is cleaner for hook reusability.
        }
        // Reset payment specific state after success flow is handled
        setShowPaymentForm(false);
        setClientSecret(null);
        setPendingBookingData(null);
        setHoldId(null); // Clear hold after successful booking
    }, [onPaymentSuccess, toast]);


  return {
    isSubmitting, // General loading for reserve/payment intent
    isProcessingQuote, // Specific loading for quote
    holdId, // The reservation ID
    clientSecret, // For Stripe Elements
    pendingBookingData, // Booking data to pass to PaymentForm
    showPaymentForm, // Controls rendering of the PaymentForm
    handleReserveItems, // Call this for Step 1 -> Step 2
    handleSendQuote, // Call this for the Quote button
    handleCreatePaymentIntent, // Call this for the Payment button
    hidePaymentForm, // Call this if the user cancels the payment step
    handlePaymentSuccess: handlePaymentSuccessInternal, // Pass this function DOWN to the PaymentForm component
  };
}
