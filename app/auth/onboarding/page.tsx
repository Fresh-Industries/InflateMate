'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2 } from "lucide-react";

// Business Identity Schema
const step1Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
});

// Location & Contact Schema
const step2Schema = z.object({
  businessAddress: z.string().min(5, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().length(2, "State must be 2 letters"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  businessPhone: z.string().regex(/^\+?1?\d{9,15}$/, "Invalid phone number"),
});

export default function OnboardingPage() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [accountLinkUrl, setAccountLinkUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
  });

  const handleNext = () => {
    try {
      if (currentStep === 1) {
        step1Schema.parse({
          businessName: formData.businessName,
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      step2Schema.parse({
        businessAddress: formData.businessAddress,
        businessCity: formData.businessCity,
        businessState: formData.businessState,
        businessZip: formData.businessZip,
        businessPhone: formData.businessPhone,
      });
      setIsLoading(true);

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during onboarding");
      }

      setAccountLinkUrl(data.accountLinkUrl);
      setCurrentStep(3);

      toast({
        title: "Success!",
        description: "Business created. Let&apos;s set up your payments!",
      });
    } catch (error) {
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
    }
  };

  const handleStripeRedirect = () => {
    if (accountLinkUrl) {
      window.location.href = accountLinkUrl;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Business Identity</h2>
            <div>
              <Label htmlFor="businessName" className="mb-1 block">Business Name</Label>
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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Location & Contact</h2>
            <div>
              <Label htmlFor="businessAddress" className="mb-1 block">Street Address</Label>
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
                <Label htmlFor="businessCity" className="mb-1 block">City</Label>
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
                <Label htmlFor="businessState" className="mb-1 block">State</Label>
                <Input
                  id="businessState"
                  value={formData.businessState}
                  onChange={(e) =>
                    setFormData({ ...formData, businessState: e.target.value.toUpperCase() })
                  }
                  placeholder="CA"
                  maxLength={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessZip" className="mb-1 block">ZIP Code</Label>
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
              <Label htmlFor="businessPhone" className="mb-1 block">Phone Number</Label>
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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Set Up Payments</h2>
            <p className="text-center text-muted-foreground mb-6">
              Let&apos;s set up your payment processing to start accepting bookings
            </p>
            {accountLinkUrl ? (
              <div className="text-center">
                <Button onClick={handleStripeRedirect} size="lg">
                  Continue to Stripe Setup
                </Button>
                <p className="mt-4 text-sm text-muted-foreground">
                  You&apos;ll be redirected to Stripe to complete your account setup
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-2">Setting up your payment account...</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <Card className="w-full max-w-lg shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">Welcome Onboard</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            {`Step ${currentStep} of ${totalSteps}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6">
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
              {currentStep > 1 && currentStep < 3 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {currentStep === 1 && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === 2 && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Business..." : "Set Up Payments"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
} 