"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { useStripeConnect } from "@/hooks/use-stripe-connect";

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
  const [isLoading, setIsLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
  });

  const stripeConnectInstance = useStripeConnect(connectedAccountId || "");

  const handleNext = () => {
    try {
      if (currentStep === 1) {
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
      setError(false);

      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(true);
        throw new Error(data.message || "Something went wrong during onboarding");
      }

      setConnectedAccountId(data.stripeAccountId);
      setBusinessId(data.business.id);

      setCurrentStep(3);
      toast({
        title: "Success!",
        description: "Business created. Let's complete your payment setup.",
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
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Business Identity</h2>
            <div>
              <Label htmlFor="businessName" className="mb-1 block text-gray-700 font-medium">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Your Business Name"
                className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Location &amp; Contact</h2>
            <div>
              <Label htmlFor="businessAddress" className="mb-1 block text-gray-700 font-medium">
                Street Address
              </Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                placeholder="123 Main St"
                className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all"
                required
              />
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div>
                <Label htmlFor="businessCity" className="mb-1 block text-gray-700 font-medium">
                  City
                </Label>
                <Input
                  id="businessCity"
                  value={formData.businessCity}
                  onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                  placeholder="City"
                  className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessState" className="mb-1 block text-gray-700 font-medium">
                  State
                </Label>
                <Input
                  id="businessState"
                  value={formData.businessState}
                  onChange={(e) => setFormData({ ...formData, businessState: e.target.value.toUpperCase() })}
                  placeholder="CA"
                  maxLength={2}
                  className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all"
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessZip" className="mb-1 block text-gray-700 font-medium">
                  ZIP Code
                </Label>
                <Input
                  id="businessZip"
                  value={formData.businessZip}
                  onChange={(e) => setFormData({ ...formData, businessZip: e.target.value })}
                  placeholder="90001"
                  className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all" 
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessPhone" className="mb-1 block text-gray-700 font-medium">
                Phone Number
              </Label>
              <Input
                id="businessPhone"
                type="tel"
                value={formData.businessPhone}
                onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                placeholder="+1 555 1234567"
                className="rounded-lg border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 transition-all"
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xl font-semibold text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Complete Your Onboarding</p>
            {stripeConnectInstance ? (
              <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                <ConnectAccountOnboarding
                  onExit={() => {
                    toast({
                      title: "Success!",
                      description: "Onboarding completed successfully.",
                    });
                    router.push(`/dashboard/${businessId}`);
                  }}
                />
              </ConnectComponentsProvider>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading payment setup...</p>
              </div>
            )}
            {error && <p className="text-red-600 text-center mt-2 font-medium">Something went wrong!</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl border border-gray-100 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Welcome Onboard</CardTitle>
          <CardDescription className="text-gray-600 mt-1">{`Step ${currentStep} of ${totalSteps}`}</CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <div className="mb-6">
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between">
              {currentStep > 1 && currentStep < 3 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  Back
                </Button>
              )}
              {currentStep === 1 && (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all ml-auto"
                >
                  Next
                </Button>
              )}
              {currentStep === 2 && (
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all ml-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
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
