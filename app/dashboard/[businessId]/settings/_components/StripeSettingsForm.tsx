"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch the business and account session data from your server, then initialize Connect.js.
  useEffect(() => {
    async function fetchBusinessAndInitStripe() {
      try {
        setIsLoading(true);

        // Fetch business data to get stripeAccountId
        const businessResponse = await fetch(`/api/businesses/${businessId}`);
        const business = await businessResponse.json();

        if (!business || !business.stripeAccountId) {
          setError("This business doesn't have a Stripe account yet.");
          setIsLoading(false);
          return;
        }
        setStripeAccountId(business.stripeAccountId);

        // Call your API endpoint to create an account session (returns clientSecret)
        const clientSecretResponse = await fetch(
          `/api/stripe/embedded-components?businessId=${businessId}`
        );
        const clientSecretData = await clientSecretResponse.json();

        if (!clientSecretResponse.ok) {
          throw new Error(
            clientSecretData.error || "Failed to load Stripe components"
          );
        }
        setClientSecret(clientSecretData.clientSecret);

        // Initialize Connect.js with the client secret and publishable key.
        // This returns a StripeConnectInstance used to power the embedded components.
        const stripeConnect = loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: async () => clientSecretData.clientSecret,
        });
        setStripeConnectInstance(stripeConnect);
      } catch (err) {
        console.error("Error loading Stripe Connect:", err);
        setError((err as Error).message || "Failed to load Stripe components");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBusinessAndInitStripe();
  }, [businessId]);

  

  return (
    <div className="p-6 space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Stripe Settings</CardTitle>
        <CardDescription>Manage your Stripe account settings</CardDescription>
      </CardHeader>
      
   <CardContent>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!isLoading && !error && !stripeAccountId && (
        <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
          <h3 className="text-amber-800 font-medium">No Stripe Account</h3>
          <p className="text-amber-700">
            You need to set up a Stripe account for this business first.
          </p>
        </div>
      )}

      {/* Only render the Connect embedded components when everything is ready */}
      {!isLoading &&
        !error &&
        stripeAccountId &&
        clientSecret &&
        stripeConnectInstance && (
          <div className="space-y-6">
    
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>

             
              
                <ConnectAccountManagement />
              
              
          
              </ConnectComponentsProvider>
           
          </div>
        )}

        </CardContent>
    </Card>
    </div>
  );
}
