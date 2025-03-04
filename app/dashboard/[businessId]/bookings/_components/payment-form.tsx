"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  customerEmail: string;
  onSuccess: () => Promise<void>;
  onError?: (error: string) => void;
  businessId: string;
}

export function PaymentForm({
  amount,
  bookingId,
  customerEmail,
  onSuccess,
  onError = () => {},
  businessId,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Check if Stripe is loaded
  useEffect(() => {
    if (!stripe) {
      console.log("Stripe not yet loaded");
    } else {
      console.log("Stripe loaded successfully");
    }
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.error("Stripe has not loaded yet");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      console.log("Confirming payment...");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + `/dashboard/${businessId}/bookings`,
          receipt_email: customerEmail,
        },
        redirect: "if_required",
      });

      if (error) {
        // Show error to your customer
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "An unexpected error occurred");
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // The payment has been processed!
        console.log("Payment succeeded:", paymentIntent);
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed",
        });
        
        // Redirect manually to ensure it happens
        router.push(`/dashboard/${businessId}/bookings`);
        
        await onSuccess();
      } else {
        // Handle other paymentIntent statuses
        console.log("Payment status:", paymentIntent?.status);
        
        if (paymentIntent?.status === "processing") {
          toast({
            title: "Payment Processing",
            description: "Your payment is processing. We'll update you when it's complete.",
          });
          // Still redirect to bookings page
          router.push(`/dashboard/${businessId}/bookings`);
        } else {
          // Some other status
          setErrorMessage("Payment result unclear. Please check your email for confirmation.");
        }
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMessage);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(!stripe || !elements) && (
        <p className="text-center text-amber-500 mb-4">Stripe is still loading...</p>
      )}
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {errorMessage}
        </div>
      )}
      
      {stripe && elements ? (
        <PaymentElement />
      ) : (
        <div className="p-4 border border-gray-200 rounded-md flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading payment form...</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  );
}
