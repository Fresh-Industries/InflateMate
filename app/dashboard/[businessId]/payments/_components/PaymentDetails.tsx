'use client';

// Declare StripeConnect on window object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StripeConnect: any;
  }
}

import { useState, useEffect } from 'react';
import { 
  ConnectPaymentDetails,
  ConnectComponentsProvider 
} from '@stripe/react-connect-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PaymentDetailsProps {
  businessId: string;
  stripeAccountId: string | null;
  paymentId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentDetails({ 
  businessId, 
  stripeAccountId,
  paymentId, 
  isOpen, 
  onClose 
}: PaymentDetailsProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !paymentId || !stripeAccountId) {
      return;
    }

    const loadStripeConnectJs = async () => {
      try {
        setIsLoading(true);
        // Load Stripe Connect JS
        if (!window.StripeConnect) {
          const script = document.createElement('script');
          script.src = 'https://b.stripecdn.com/connect-js/v1/connect.js';
          script.async = true;
          document.body.appendChild(script);
          
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
        
        // Get the client secret from our API
        const response = await fetch(`/api/stripe/embedded-components?businessId=${businessId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load Stripe components");
        }
        
        setClientSecret(data.clientSecret);
        
        // Initialize Stripe Connect with the client secret
        if (window.StripeConnect && data.clientSecret) {
          const stripeConnect = window.StripeConnect(data.clientSecret);
          setStripeConnectInstance(stripeConnect);
        }
      } catch (err) {
        console.error("Error loading Stripe Connect:", err);
        setError((err as Error).message || "Failed to load payment details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStripeConnectJs();
  }, [businessId, stripeAccountId, isOpen, paymentId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && clientSecret && stripeConnectInstance && paymentId && (
          <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
            <ConnectPaymentDetails
              payment={paymentId}
              onClose={onClose}
            />
          </ConnectComponentsProvider>
        )}
      </DialogContent>
    </Dialog>
  );
} 