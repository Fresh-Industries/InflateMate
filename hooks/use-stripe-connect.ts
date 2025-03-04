import { useState, useEffect } from "react";
import { loadConnectAndInitialize, StripeConnectInstance } from "@stripe/connect-js";

export const useStripeConnect = (connectedAccountId: string) => {
  const [stripeConnectInstance, setStripeConnectInstance] = useState<StripeConnectInstance | undefined>();

  useEffect(() => {
    if (connectedAccountId) {
      const fetchClientSecret = async () => {
        const response = await fetch(`/api/stripe/connect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ account: connectedAccountId }),
        });

        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(`An error occurred: ${error}`);
        } else {
          const { client_secret: clientSecret } = await response.json();
          return clientSecret;
        }
      };

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error("Stripe publishable key is not defined");
      }

      setStripeConnectInstance(
        loadConnectAndInitialize({
          publishableKey,
          fetchClientSecret: fetchClientSecret,
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#007aff",            // Apple's signature blue
              colorBackground: "#ffffff",           // clean white background
              colorText: "#1d1d1f",                 // subtle dark text
              colorDanger: "#ff3b30",               // Apple-like red for errors
              borderRadius: "12px",                 // smooth, rounded corners
              spacingUnit: "8px",                   // consistent spacing
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            },
          },
        })
      );
    }
  }, [connectedAccountId]);

  return stripeConnectInstance;
};

export default useStripeConnect;
