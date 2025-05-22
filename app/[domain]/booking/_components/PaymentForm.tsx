"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { ThemeColors } from "@/app/[domain]/_themes/types";

interface PaymentFormProps {
  amount: number;
  customerEmail: string;
  onSuccess: () => Promise<void>;
  onError?: (error: string) => void;
  businessId: string;
  subtotal?: number;
  taxAmount?: number;
  taxRate?: number;
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
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
  themeName = "modern",
  colors,
  bookingId,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

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
  
  // Form container styles
  const formStyle = {
    background: theme.bookingStyles.formBackground(c),
    color: theme.bookingStyles.formTextColor(c),
    borderRadius: theme.cardStyles.borderRadius ?? "12px",
    boxShadow: theme.bookingStyles.formShadow(c),
    border: theme.bookingStyles.formBorder(c),
    padding: '24px',
    animation: theme.animations?.elementEntrance || 'none',
  };
  
  // Summary card styles
  const summaryCardStyle = {
    background: theme.bookingStyles.summaryCard.background(c),
    border: theme.bookingStyles.summaryCard.border(c),
    borderRadius: theme.cardStyles.borderRadius ? `calc(${theme.cardStyles.borderRadius} - 4px)` : "8px",
    boxShadow: theme.bookingStyles.summaryCard.shadow(c),
  };
  
  // Title styles
  const titleStyle = {
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
  
  // Error message styles
  const errorContainerStyle = {
    background: `${c.accent[100]}20`,
    border: `1px solid ${c.accent[500]}50`,
    color: c.accent[900],
    borderRadius: theme.cardStyles.borderRadius ? `calc(${theme.cardStyles.borderRadius} - 4px)` : "8px",
  };
  
  // Loading container styles
  const loadingContainerStyle = {
    background: c.background[500],
    border: `1px solid ${c.primary[100]}50`,
    borderRadius: theme.cardStyles.borderRadius ? `calc(${theme.cardStyles.borderRadius} - 4px)` : "8px",
    color: c.text[500],
  };

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
          return_url: window.location.origin,
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
        
        // Use the provided bookingId from props if available
        // If not, fall back to extracting from payment intent metadata
        const confirmedBookingId =
  bookingId ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((paymentIntent as any)?.metadata?.prismaBookingId as string | undefined);

        console.log('Booking ID:', confirmedBookingId);
        
        // Extract domain from the URL path
        const fullPath = window.location.pathname;
        console.log('Current pathname:', fullPath);

        // Extract just the domain part without additional path segments
        let domain = null;
        const domainMatch = fullPath.match(/^\/([^/]+)/);

        console.log('Domain match:', domainMatch);

        if (domainMatch && domainMatch[1]) {
          domain = domainMatch[1];
        }

        console.log('Extracted domain:', domain);

        // If domain is clearly not a real domain but a Next.js placeholder, ignore it
        if (domain === '[domain]' || domain === '%5Bdomain%5D') {
          domain = null;
          console.log('Ignoring Next.js placeholder domain');
        }

        // Build redirect URL - prevent double booking path by removing the booking segment
        const redirectUrl = domain
          ? `/${domain}/success?bookingId=${confirmedBookingId}&businessId=${businessId}`
          : `/success?bookingId=${confirmedBookingId}&businessId=${businessId}`;
            
        console.log('Redirecting to:', redirectUrl);
        
        // Redirect to success page
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
          
          // Use the provided bookingId from props if available
          // If not, fall back to extracting from payment intent metadata
          const confirmedBookingId = bookingId 
          
          // Redirect to success page with booking ID for processing status too
          if (confirmedBookingId) {
            // Extract domain from the URL path
            const fullPath = window.location.pathname;
            console.log('Current pathname:', fullPath);

            // Extract just the domain part without additional path segments
            let domain = null;
            const domainMatch = fullPath.match(/^\/([^/]+)/);

            console.log('Domain match:', domainMatch);

            if (domainMatch && domainMatch[1]) {
              domain = domainMatch[1];
            }

            console.log('Extracted domain:', domain);

            // If domain is clearly not a real domain but a Next.js placeholder, ignore it
            if (domain === '[domain]' || domain === '%5Bdomain%5D') {
              domain = null;
              console.log('Ignoring Next.js placeholder domain');
            }

            // Build redirect URL - prevent double booking path by removing the booking segment
            const redirectUrl = domain
              ? `/${domain}/success?bookingId=${confirmedBookingId}&businessId=${businessId}`
              : `/success?bookingId=${confirmedBookingId}&businessId=${businessId}`;
            
            console.log('Redirecting to:', redirectUrl);
            
            // Redirect to success page
            router.push(redirectUrl);
          } else {
            // Fallback if bookingId not available
            console.log('No bookingId found, redirecting to home');
            router.push(`/`);
          }
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
    <form onSubmit={handleSubmit} className="space-y-6" style={formStyle}>
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-6" style={titleStyle}>
        <CreditCard className="h-5 w-5" /> Complete Payment
      </h3>
      
      {(!stripe || !elements) && (
        <p className="text-center mb-4" style={{color: c.accent[500]}}>
          <Loader2 className="h-4 w-4 inline-block mr-2 animate-spin" />
          Loading payment system...
        </p>
      )}
      
      {errorMessage && (
        <div className="p-4 rounded-md flex items-start gap-2" style={errorContainerStyle}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {/* Payment Summary */}
      <div className="p-4 rounded-md space-y-2" style={summaryCardStyle}>
        <h3 className="font-medium flex items-center gap-2" style={{color: c.primary[900]}}>
          <DollarSign className="h-4 w-4" /> Payment Summary
        </h3>
        
        {subtotal !== undefined && (
          <div className="flex justify-between text-sm">
            <span style={{color: c.text[500]}}>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
        
        {taxAmount !== undefined && taxRate !== undefined && (
          <div className="flex justify-between text-sm">
            <span style={{color: c.text[500]}}>Tax ({taxRate}%):</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-medium pt-2 border-t" style={{borderColor: `${c.primary[100]}40`}}>
          <span>Total:</span>
          <span style={{color: c.primary[900]}}>${amount.toFixed(2)}</span>
        </div>
      </div>
      
      {stripe && elements ? (
        <div className="stripe-element-container">
          <PaymentElement />
        </div>
      ) : (
        <div className="p-4 rounded-md flex items-center justify-center" style={loadingContainerStyle}>
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading payment form...</span>
        </div>
      )}
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || isLoading} 
        className="w-full py-3 px-6 text-base"
        style={primaryButton}
        onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHover)}
        onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButton)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay ${amount.toFixed(2)}
            <CheckCircle className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
