"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const router = useRouter();

  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null
  );
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);

  // Fetch subscription status from /api/me
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setIsSubscriptionLoading(true);
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          setSubscriptionStatus("unknown");
          setIsSubscriptionLoading(false);
          router.replace("/sign-in");
          return;
        }
        const data = await res.json();
        if (data.subscription && data.subscription.status) {
          setSubscriptionStatus(data.subscription.status);
        } else {
          setSubscriptionStatus(null);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
        setSubscriptionStatus("unknown");
        toast.error("An unexpected error occurred while fetching subscription status.");
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [router, toast]);

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to access subscription portal.");
      }
    } catch (error) {
      console.error("Error fetching subscription portal:", error);
      toast.error("An unexpected error occurred while accessing the subscription portal.");
    } finally {
      setIsPortalLoading(false);
    }
  };

  if (isSubscriptionLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Separator />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-10 w-56 mt-4" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Billing & Subscription
        </h2>
        <p className="text-gray-600 mt-1">
          Manage your subscription and view billing history.
        </p>

        <Separator className="my-6" />

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Subscription Status
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your current plan and billing details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-gray-700 font-medium">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    subscriptionStatus === "active"
                      ? "text-green-600"
                      : subscriptionStatus === "trialing"
                      ? "text-blue-600"
                      : subscriptionStatus === "canceled"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {subscriptionStatus
                    ? subscriptionStatus.charAt(0).toUpperCase() +
                      subscriptionStatus.slice(1)
                    : "Not Subscribed"}
                </span>
              </p>
              {subscriptionStatus &&
                subscriptionStatus !== "unknown" &&
                subscriptionStatus !== "canceled" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Access the portal to see plan details, billing cycle, etc.
                  </p>
                )}

              {subscriptionStatus === "canceled" && (
                <p className="text-sm text-red-600 mt-1">
                  Your subscription is canceled.
                </p>
              )}
              {subscriptionStatus === "unknown" && (
                <p className="text-sm text-gray-500 mt-1">
                  Could not retrieve subscription status.
                </p>
              )}
              {!subscriptionStatus && !isSubscriptionLoading && (
                <p className="text-gray-500 mt-1">
                  You do not have an active subscription.
                </p>
              )}

              <Button
                onClick={handleManageSubscription}
                disabled={
                  isPortalLoading ||
                  isSubscriptionLoading ||
                  !subscriptionStatus ||
                  subscriptionStatus === "unknown"
                }
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPortalLoading
                  ? "Opening Portal..."
                  : "Manage Subscription & Billing"}
              </Button>

              {!subscriptionStatus && !isSubscriptionLoading && (
                <Button
                  onClick={() => router.push("/pricing")}
                  variant="outline"
                  className="mt-6 ml-4 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  View Pricing Plans
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
