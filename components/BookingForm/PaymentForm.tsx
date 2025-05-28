"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
  amount: number;
  customerEmail: string;
  onSuccess: () => Promise<void>;
  onError?: (error: string) => void;
  businessId: string;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  bookingId?: string;
}

export function PaymentForm({
  amount,
  customerEmail,
  onSuccess,
  onError = () => {},
  businessId,
  subtotal,
  taxAmount,
  taxRate,
  bookingId,
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
        
        // Get the booking ID from props or payment intent metadata
        const confirmedBookingId = bookingId || 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((paymentIntent as any)?.metadata?.prismaBookingId as string | undefined);
        console.log('Booking ID:', confirmedBookingId);

        // Extract domain from path to construct redirect URL
        const fullPath = window.location.pathname;
        console.log('Current pathname:', fullPath);

        // Build redirect URL to success page
        const redirectUrl = `/dashboard/${businessId}/bookings`;
        
        console.log('Redirecting to:', redirectUrl);
        router.push(redirectUrl);
        
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
      
      {/* Payment Summary */}
      <div className="p-4 border rounded-md space-y-2 bg-muted/30">
        <h3 className="font-medium">Payment Summary</h3>
        
        {subtotal !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
        
        {taxAmount !== undefined && taxRate !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax ({taxRate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-2 border-t">
          <span>Total:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
      </div>
      
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
        variant="primary-gradient"
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
