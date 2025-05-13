"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ConnectPayments,
  ConnectPaymentDetails,
  ConnectComponentsProvider,
  ConnectPayouts,
  
} from "@stripe/react-connect-js";
import PaymentAnalytics from "./_components/PaymentAnalytics";
import InvoicesAndQuotes from "./_components/InvoicesandQuotes";

export default function PaymentsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stripeConnectInstance, setStripeConnectInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

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

  const handleClosePaymentDetails = () => {
    setShowPaymentDetails(false);
    setSelectedPaymentId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payments
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage your payments and payouts
          </p>
        </div>
      </div>

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
            <Tabs defaultValue="payments" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
                <TabsTrigger value="invoicesandquotes">Invoices and Quotes</TabsTrigger>
              </TabsList>
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <TabsContent value="overview" className="space-y-6">
                  <PaymentAnalytics businessId={businessId} />
                </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  
                    <ConnectPayments />
                    {showPaymentDetails && selectedPaymentId && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Payment Details</h3>
                            <button
                              onClick={handleClosePaymentDetails}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                          <ConnectPaymentDetails
                            payment={selectedPaymentId}
                            onClose={handleClosePaymentDetails}
                          />
                        </div>
                      </div>
                    )}
                  
                </div>
              </TabsContent>
              <TabsContent value="payouts" className="space-y-6">
                <ConnectPayouts />
              </TabsContent>
              </ConnectComponentsProvider>
              <TabsContent value="invoicesandquotes" className="space-y-6">
              <InvoicesAndQuotes />
            </TabsContent>
            </Tabs>
           
          </div>
        )}
    </div>
  );
}
