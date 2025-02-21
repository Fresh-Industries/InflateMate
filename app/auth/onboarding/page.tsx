"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Import your custom hook for Embedded Connect
import { useStripeConnect } from "@/hooks/use-stripe-connect";
// Embedded Connect components
import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

/* ------------------ Validation Schemas ------------------ */
const step1Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
});

const step2Schema = z.object({
  businessAddress: z.string().min(5, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().length(2, "State must be 2 letters"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  businessPhone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
});

export default function OnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Loading state for creating the business
  const [isLoading, setIsLoading] = useState(false);

  // The businessId returned from /api/onboarding
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [onboardingExited, setOnboardingExited] = useState(false);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);
  const stripeConnectInstance = useStripeConnect(connectedAccountId || "");


  // Keep your form data
  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
  });

  /* ------------- Step Navigation ------------- */
  const handleNext = () => {
    try {
      if (currentStep === 1) {
        // Validate step 1
        step1Schema.parse({ businessName: formData.businessName });
      }
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  /* 
    Handle form submission at step 2 
    - Creates the business in /api/onboarding 
    - Returns business + stripeAccountId 
    - We store businessId in state, proceed to step 3 for Embedded Onboarding
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate step 2
      step2Schema.parse({
        businessAddress: formData.businessAddress,
        businessCity: formData.businessCity,
        businessState: formData.businessState,
        businessZip: formData.businessZip,
        businessPhone: formData.businessPhone,
      });

      setIsLoading(true);
      setAccountCreatePending(true);
      setError(false);

      // Create your business (and Stripe account) in the backend
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(true);
        throw new Error(data.message || "Something went wrong during onboarding");
      }

      // Store the connected account ID and business ID
      setConnectedAccountId(data.stripeAccountId);
      setBusinessId(data.business.id);
      setAccountCreatePending(false);

      // Move to step 3
      setCurrentStep(3);

      toast({
        title: "Success!",
        description: "Business created. Let's set up your payments!",
      });
    } catch (error) {
      setError(true);
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setAccountCreatePending(false);
    }
  };

  /* ------------- Render UI for each step ------------- */
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic business name
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Business Identity</h2>
            <div>
              <Label htmlFor="businessName" className="mb-1 block">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                placeholder="Your Business Name"
                required
              />
            </div>
          </div>
        );

      case 2:
        // Step 2: Location & Contact
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Location &amp; Contact</h2>
            <div>
              <Label htmlFor="businessAddress" className="mb-1 block">
                Street Address
              </Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) =>
                  setFormData({ ...formData, businessAddress: e.target.value })
                }
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <Label htmlFor="businessCity" className="mb-1 block">
                  City
                </Label>
                <Input
                  id="businessCity"
                  value={formData.businessCity}
                  onChange={(e) =>
                    setFormData({ ...formData, businessCity: e.target.value })
                  }
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessState" className="mb-1 block">
                  State
                </Label>
                <Input
                  id="businessState"
                  value={formData.businessState}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessState: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="CA"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessZip" className="mb-1 block">
                  ZIP Code
                </Label>
                <Input
                  id="businessZip"
                  value={formData.businessZip}
                  onChange={(e) =>
                    setFormData({ ...formData, businessZip: e.target.value })
                  }
                  placeholder="90001"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessPhone" className="mb-1 block">
                Phone Number
              </Label>
              <Input
                id="businessPhone"
                type="tel"
                value={formData.businessPhone}
                onChange={(e) =>
                  setFormData({ ...formData, businessPhone: e.target.value })
                }
                placeholder="+1 555 1234567"
                required
              />
            </div>
          </div>
        );

      case 3:
        // Step 3: Embedded Stripe Onboarding
        return (
          <div>
            {stripeConnectInstance && (
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectAccountOnboarding
                  onExit={() => {
                    setOnboardingExited(true);
                    // Only redirect if we have a businessId and there's no error
                    if (businessId && !error) {
                      toast({
                        title: "Success!",
                        description: "Onboarding completed successfully.",
                      });
                      router.push(`/dashboard/${businessId}`);
                    }
                  }}
                />
              </ConnectComponentsProvider>
            )}
            {error && <p className="error">Something went wrong!</p>}
            {(connectedAccountId || accountCreatePending || onboardingExited) && (
              <div className="dev-callout">
                {connectedAccountId && <p>Your connected account ID is: <code className="bold">{connectedAccountId}</code></p>}
                {accountCreatePending && <p>Creating a connected account...</p>}
                {onboardingExited && <p>The Account Onboarding component has exited</p>}
              </div>
            )}
            <div className="info-callout">
              <p>
                This is a sample app for Connect onboarding using the Account Onboarding embedded component. <a href="https://docs.stripe.com/connect/onboarding/quickstart?connect-onboarding-surface=embedded" target="_blank" rel="noopener noreferrer">View docs</a>
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black">
      <Card className="w-full max-w-lg shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">Welcome Onboard</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            {`Step ${currentStep} of ${totalSteps}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            <div className="flex justify-between">
              {/* Show a "Back" button only on step 2 (and 3 if you want) */}
              {currentStep > 1 && currentStep < 3 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}

              {/* Step 1 -> Next */}
              {currentStep === 1 && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}

              {/* Step 2 -> Submit to create the business + get businessId */}
              {currentStep === 2 && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Business..." : "Set Up Payments"}
                </Button>
              )}

              {/* Step 3 -> No default button. The embedded component handles the flow. */}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
