"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
  ConnectTaxSettings,
  ConnectTaxRegistrations,
} from "@stripe/react-connect-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StripeTaxesForm() {
  const params = useParams();
  const businessId = params.businessId as string;

  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);

        // Fetch business to get account id
        const businessRes = await fetch(`/api/businesses/${businessId}`);
        if (!businessRes.ok) {
          throw new Error("Failed to fetch business");
        }
        const business = await businessRes.json();
        if (!business?.stripeAccountId) {
          setError("This business doesn't have a Stripe account yet.");
          setIsLoading(false);
          return;
        }
        setStripeAccountId(business.stripeAccountId);

        // Onboarding status
        const onboardingStatusRes = await fetch(
          `/api/stripe/connect/onboarding-status?accountId=${business.stripeAccountId}`
        );
        if (onboardingStatusRes.ok) {
          const onboardingStatus = await onboardingStatusRes.json();
          if (!onboardingStatus.isOnboarded) {
            setShowOnboarding(true);
          }
        }

        // Account session for embedded components
        const clientSecretResponse = await fetch(
          `/api/stripe/embedded-components?businessId=${businessId}`
        );
        const clientSecretData = await clientSecretResponse.json();
        if (!clientSecretResponse.ok) {
          throw new Error(clientSecretData.error || "Failed to load Stripe components");
        }
        setClientSecret(clientSecretData.clientSecret);

        const stripeConnect = loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: async () => clientSecretData.clientSecret,
        });
        setStripeConnectInstance(stripeConnect);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error loading Stripe Taxes components:", err);
        setError((err as Error).message || "Failed to load Stripe components");
      } finally {
        setIsLoading(false);
      }
    }
    if (businessId) init();
  }, [businessId]);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Taxes</CardTitle>
          <CardDescription>Manage tax settings and registrations</CardDescription>
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
              <p className="text-amber-700">You need to set up a Stripe account for this business first.</p>
            </div>
          )}

          {!isLoading && !error && stripeAccountId && clientSecret && stripeConnectInstance && (
            <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
              {showOnboarding ? (
                <ConnectAccountOnboarding onExit={() => setShowOnboarding(false)} />
              ) : (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-lg font-medium mb-2">Tax Settings</h3>
                    <ConnectTaxSettings />
                  </section>
                  <section>
                    <h3 className="text-lg font-medium mb-2">Tax Registrations</h3>
                    <ConnectTaxRegistrations />
                  </section>
                </div>
              )}
            </ConnectComponentsProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


