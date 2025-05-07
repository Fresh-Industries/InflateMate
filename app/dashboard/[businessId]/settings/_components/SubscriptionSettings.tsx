// app/dashboard/[businessId]/settings/page.tsx (Client-side)
"use client";

import { useState, useEffect } from 'react';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator'; // Assuming you have a Separator component
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have a Skeleton component

export default function SettingsPage() {
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { organization, isLoaded: isOrgLoaded } = useOrganization(); // Need this to check for the organization
  const router = useRouter();
  const { toast } = useToast();

  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true); // State to track subscription status loading

  // Fetch subscription status when organization data is loaded
  useEffect(() => {
      const fetchSubscriptionStatus = async () => {
          if (!isOrgLoaded || !organization?.id) {
              // Wait for organization data or if no organization is found
              setIsSubscriptionLoading(false); // Stop loading if no organization
              return;
          }

          setIsSubscriptionLoading(true);
          try {
              const res = await fetch(`/api/stripe/subscriptions?organizationId=${organization.id}`);
              const data = await res.json();

              if (res.ok) {
                  setSubscriptionStatus(data.status || null);
              } else {
                  console.error('Failed to fetch subscription status:', data.error);
                  setSubscriptionStatus('unknown'); // Indicate an error
                   toast({
                     title: "Subscription Status Error",
                     description: data.error || "Failed to fetch subscription status.",
                     variant: "destructive",
                   });
              }
          } catch (error) {
              console.error('Error fetching subscription status:', error);
               setSubscriptionStatus('unknown'); // Indicate an error
                toast({
                  title: "Subscription Status Error",
                  description: "An unexpected error occurred while fetching subscription status.",
                  variant: "destructive",
                });
          } finally {
              setIsSubscriptionLoading(false);
          }
      };

      fetchSubscriptionStatus();

  }, [isOrgLoaded, organization?.id, toast]); // Re-run when organization data is loaded


  const handleManageSubscription = async () => {
    // Ensure user is logged in and organization data is loaded
    if (!isAuthLoaded || !userId) {
        router.replace('/sign-in');
        return;
    }
     if (!isOrgLoaded || !organization?.id) {
         console.warn("Attempted to manage subscription before organization data is loaded or available.");
          toast({
            title: "Subscription Error",
            description: "Organization data is not available yet.",
            variant: "destructive",
          });
         return; // Prevent action if organization data isn't ready
     }

    setIsPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
         // No body needed for this specific portal API call if using auth() for orgId
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // Redirect the user to the Stripe Customer Portal
        window.location.href = data.url;
      } else {
        console.error('Failed to get Customer Portal URL:', data.error);
         toast({
           title: "Subscription Error",
           description: data.error || "Failed to access subscription portal.",
           variant: "destructive",
         });
      }
    } catch (error) {
      console.error('Error creating Customer Portal session:', error);
       toast({
         title: "Subscription Error",
         description: "An unexpected error occurred while accessing the subscription portal.",
         variant: "destructive",
       });
    } finally {
      setIsPortalLoading(false);
    }
  };

  // You might want to add checks here to ensure the user is an admin
  // before showing the billing settings section or the manage button.
  // For example, you can check the user's role from the organization object:
  // const userMembership = organization?.memberships?.find(m => m.user.id === userId);
  // const isAdmin = userMembership?.role === 'admin'; // Assuming 'admin' role

  if (!isAuthLoaded || !isOrgLoaded) {
      return (
         <div className="space-y-6">
             <Skeleton className="h-8 w-64" />
             <Skeleton className="h-4 w-96" />
             <Separator />
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-4 w-80" />
             <Skeleton className="h-10 w-56 mt-4" />
         </div>
      ); // Show skeleton while Clerk data loads
  }

  // If Clerk data is loaded but no organization is found, redirect to onboarding or show a message
   if (!organization) {
       console.log("Settings page: No organization found for the user. Redirecting to onboarding.");
       router.replace('/onboarding'); // Or a page explaining they need to join/create an organization
       return null; // Or a message
   }


  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Billing & Subscription</h2>
        <p className="text-gray-600 mt-1">Manage your subscription and view billing history.</p>

        <Separator className="my-6" />

        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl text-gray-800">Subscription Status</CardTitle>
                <CardDescription className="text-gray-600">Your current plan and billing details.</CardDescription>
            </CardHeader>
            <CardContent>
                {isSubscriptionLoading ? (
                    <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-t-transparent border-blue-500 rounded-full animate-spin mr-3"></div>
                        <p className="text-gray-600">Loading status...</p>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-700 font-medium">
                            Status: <span className={`font-semibold ${subscriptionStatus === 'active' ? 'text-green-600' : subscriptionStatus === 'trialing' ? 'text-blue-600' : subscriptionStatus === 'canceled' ? 'text-red-600' : 'text-gray-500'}`}>
                                {subscriptionStatus ? subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1) : 'Not Subscribed'}
                            </span>
                        </p>
                         {subscriptionStatus && subscriptionStatus !== 'unknown' && subscriptionStatus !== 'canceled' && (
                             <p className="text-sm text-gray-500 mt-1">Access the portal to see plan details, billing cycle, etc.</p>
                         )}

                        {subscriptionStatus === 'canceled' && (
                             <p className="text-sm text-red-600 mt-1">Your subscription is canceled.</p>
                        )}
                         {subscriptionStatus === 'unknown' && (
                              <p className="text-sm text-gray-500 mt-1">Could not retrieve subscription status.</p>
                         )}
                        {!subscriptionStatus && !isSubscriptionLoading && (
                            <p className="text-gray-500 mt-1">You do not have an active subscription.</p>
                        )}

                        <Button
                           onClick={handleManageSubscription}
                           disabled={isPortalLoading || isSubscriptionLoading || !subscriptionStatus || subscriptionStatus === 'unknown'} // Disable if loading, status unknown, or no status
                           className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isPortalLoading ? 'Opening Portal...' : 'Manage Subscription & Billing'}
                        </Button>

                        {/* Optionally add a button to go to pricing page if not subscribed */}
                         {!subscriptionStatus && !isSubscriptionLoading && (
                            <Button
                              onClick={() => router.push('/pricing')}
                              variant="outline"
                              className="mt-6 ml-4 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                              View Pricing Plans
                            </Button>
                         )}


                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

