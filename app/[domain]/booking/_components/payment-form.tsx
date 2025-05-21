"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeColors } from "../../_themes/types";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { BookingMetadata } from "./customer-booking-form";

interface PaymentFormProps {
  bookingData: BookingMetadata;
  clientSecret: string;
  onPaymentSuccess: () => Promise<void>;
  themeName: string;
  colors: ThemeColors;
  onError?: (error: string) => void;
}

export function PaymentForm({
  bookingData,
  onPaymentSuccess,
  themeName,
  colors,
  onError = () => {},
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const theme = themeConfig[themeName] || themeConfig.modern;
  const buttonStyles = theme.buttonStyles;
  const bookingStyles = theme.bookingStyles;

  const amount = parseFloat(bookingData.totalAmount) || 0;
  const subtotal = parseFloat(bookingData.subtotalAmount) || undefined;
  const taxAmount = parseFloat(bookingData.taxAmount) || undefined;
  const taxRate = parseFloat(bookingData.taxRate) || undefined;

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
          return_url: window.location.origin + `/dashboard/${bookingData.businessId}/bookings`,
          receipt_email: bookingData.customerEmail,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment confirmation error:", error);
        setErrorMessage(error.message || "An unexpected error occurred");
        onError(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent);
        toast({
          title: "Payment Successful",
          description: "Your booking has been confirmed",
        });
        
        router.push(`/dashboard/${bookingData.businessId}/bookings`);
        
        await onPaymentSuccess();
      } else {
        console.log("Payment status:", paymentIntent?.status);
        
        if (paymentIntent?.status === "processing") {
          toast({
            title: "Payment Processing",
            description: "Your payment is processing. We'll update you when it's complete.",
          });
          router.push(`/dashboard/${bookingData.businessId}/bookings`);
        } else {
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
  
  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: buttonStyles.background(colors),
    color: buttonStyles.textColor(colors),
    border: buttonStyles.border ? buttonStyles.border(colors) : undefined,
    boxShadow: buttonStyles.boxShadow ? buttonStyles.boxShadow(colors) : undefined,
    borderRadius: buttonStyles.borderRadius,
    transition: buttonStyles.transition,
  };

  const primaryButtonHoverStyle: React.CSSProperties = {
    backgroundColor: buttonStyles.hoverBackground(colors),
    color: buttonStyles.hoverTextColor ? buttonStyles.hoverTextColor(colors) : buttonStyles.textColor(colors),
    border: buttonStyles.hoverBorder ? buttonStyles.hoverBorder(colors) : (buttonStyles.border ? buttonStyles.border(colors) : undefined),
    boxShadow: buttonStyles.hoverBoxShadow ? buttonStyles.hoverBoxShadow(colors) : (buttonStyles.boxShadow ? buttonStyles.boxShadow(colors) : undefined),
  };
  
  const summaryStyle: React.CSSProperties = {
      backgroundColor: bookingStyles.input.background(colors),
      border: `1px solid ${bookingStyles.input.border(colors)}`,
      color: bookingStyles.input.labelColor(colors),
      padding: '1rem', 
      borderRadius: '8px',
      marginBottom: '1.5rem',
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
      
      <div style={summaryStyle}>
        <h3 className="font-medium mb-3 text-lg">Payment Summary</h3>
        
        {subtotal !== undefined && (
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: colors.text + 'aa' }}>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
        
        {taxAmount !== undefined && taxRate !== undefined && (
          <div className="flex justify-between text-sm mb-2">
             <span style={{ color: colors.text + 'aa' }}>Tax ({taxRate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-semibold pt-2 border-t" style={{ borderColor: colors.secondary + '40' }}>
          <span>Total:</span>
          <span>${amount.toFixed(2)}</span>
        </div>
      </div>
      
      {stripe && elements ? (
        <PaymentElement options={{layout: "tabs"}} />
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
        style={primaryButtonStyle}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHoverStyle)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButtonStyle)}
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