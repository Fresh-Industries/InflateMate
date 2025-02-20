import { useState, useEffect } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";

export const useStripeConnect = (businessId: string) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const initializeStripeConnect = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Create or retrieve Stripe Connect account and get client secret
        const response = await fetch(`/api/businesses/${businessId}/stripe/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to initialize Stripe Connect");
        }

        const { clientSecret } = await response.json();

        // Initialize Stripe Connect
        const stripeConnect = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          clientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#0F172A",
            },
          },
        });

        setStripeConnectInstance(stripeConnect);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Stripe Connect initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripeConnect();
  }, [businessId]);

  return {
    stripeConnectInstance,
    isLoading,
    error,
  };
}; 