/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo, memo, useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  CreditCardIcon,
  Info,
  CheckCircle,
  ExternalLink,
  Globe,
  Code,
  Monitor,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOnboarding, OnboardingFormData } from "@/context/OnboardingContext";

const step1Schema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
});

const step2Schema = z.object({
  businessAddress: z.string().min(5, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().length(2, "State must be 2 letters"),
  businessZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  businessPhone: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .refine((s) => s.length === 10 || s.length === 11, {
      message: "Enter a valid phone number",
    }),
  businessEmail: z.string().email("Invalid email address"),
});

const step3Schema = z.object({
  websiteType: z.enum(["template", "embedded"], {
    required_error: "Please select a website type",
  }),
  customDomain: z.string().optional(),
}).refine(
  (data) => {
    if (data.websiteType === "embedded" && !data.customDomain) {
      return false;
    }
    if (data.customDomain && !data.customDomain.match(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)) {
      return false;
    }
    return true;
  },
  {
    message: "Custom domain is required for embedded components and must be a valid domain",
    path: ["customDomain"],
  }
);

const stepInfoContent = [
  {
    id: 1,
    title: "Business Identity",
    description:
      "Let's start with your business name. This will be used to create your business profile and help customers identify your bounce house rental service.",
    icon: <Building2 className="h-10 w-10 text-violet-600" />,
    features: [
      "Create business profile",
      "Set up account identity",
      "Enable customer recognition",
    ],
  },
  {
    id: 2,
    title: "Location & Contact",
    description:
      "Provide your primary business address and contact details. This helps us verify your business and ensures smooth communication with customers.",
    icon: <MapPin className="h-10 w-10 text-violet-600" />,
    features: [
      "Verify business location",
      "Enable customer contact",
      "Set delivery zones",
    ],
  },
  {
    id: 3,
    title: "Website & Integration",
    description:
      "Choose how you want to showcase your business online. Get a ready-made template website or integrate booking components into your existing site.",
    icon: <Globe className="h-10 w-10 text-violet-600" />,
    features: [
      "Template website with subdomain",
      "Custom domain support", 
      "Embedded booking components",
    ],
  },
  {
    id: 4,
    title: "Secure Payment Setup",
    description:
      "We've created your business profile. Now, let's connect with Stripe to securely process payments and manage your earnings from rentals.",
    icon: <CreditCardIcon className="h-10 w-10 text-violet-600" />,
    features: [
      "Secure payment processing",
      "Automatic transfers",
      "Financial reporting",
    ],
  },
];

const AnimatedContainer = ({
  children,
  currentStep,
  targetStep,
}: {
  children: React.ReactNode;
  currentStep: number;
  targetStep: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{
      opacity: currentStep === targetStep ? 1 : 0,
      x: currentStep === targetStep ? 0 : 20,
    }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    style={{ display: currentStep === targetStep ? "block" : "none" }}
  >
    {children}
  </motion.div>
);

const GradientText = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <span
      className={`bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent font-bold ${
        className ?? ""
      }`}
    >
      {children}
    </span>
  )
);
GradientText.displayName = "GradientText";

const StepIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  return (
    <div className="flex justify-center mb-10">
      <div className="flex items-center space-x-4">
        {steps.map((step) => (
          <div key={step} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: step <= currentStep ? 1 : 0.9,
                opacity: step <= currentStep ? 1 : 0.6,
              }}
              transition={{ duration: 0.3, delay: step * 0.1 }}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                step < currentStep
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                  : step === currentStep
                  ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white ring-4 ring-violet-200"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-semibold">{step}</span>
              )}
            </motion.div>
            {step < totalSteps && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step < currentStep ? 1 : 0 }}
                transition={{ duration: 0.5, delay: step * 0.1 }}
                className="mx-4 h-1 w-16 origin-left rounded-full"
                style={{
                  backgroundColor:
                    step < currentStep ? "#10b981" : "#e5e7eb",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FormInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  tooltipContent,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  maxLength?: number;
  tooltipContent?: string;
}) => (
  <TooltipProvider>
    <Tooltip delayDuration={150}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -2 }}
        className="relative group mb-6"
      >
        <TooltipTrigger asChild>
          <div className="flex items-center mb-2">
            <Label
              htmlFor={id}
              className="cursor-help text-sm font-semibold text-gray-700"
            >
              {label}
            </Label>
            {tooltipContent && (
              <Info className="ml-1.5 h-3 w-3 text-gray-400 group-hover:text-violet-500" />
            )}
          </div>
        </TooltipTrigger>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required
          className="h-12 w-full rounded-xl border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
        />
      </motion.div>
      {tooltipContent && (
        <TooltipContent side="top">
          <p>{tooltipContent}</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

const Step1 = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div>
      <FormInput
        id="businessName"
        label="Business Name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Bounce Kingdom Rentals"
      />
    </div>
  )
);
Step1.displayName = "Step1";

const Step2 = memo(
  ({
    formData,
    onFieldChange,
  }: {
    formData: {
      businessAddress: string;
      businessCity: string;
      businessState: string;
      businessZip: string;
      businessPhone: string;
      businessEmail: string;
    };
    onFieldChange: (field: string, value: string) => void;
  }) => (
    <div>
      <FormInput
        id="businessAddress"
        label="Street Address"
        value={formData.businessAddress}
        onChange={(e) =>
          onFieldChange("businessAddress", e.target.value)
        }
        placeholder="123 Main Street"
        tooltipContent="Enter the primary address where you store your bounce houses or conduct business."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormInput
          id="businessCity"
          label="City"
          value={formData.businessCity}
          onChange={(e) =>
            onFieldChange("businessCity", e.target.value)
          }
          placeholder="Los Angeles"
        />
        <FormInput
          id="businessState"
          label="State"
          value={formData.businessState}
          onChange={(e) =>
            onFieldChange("businessState", e.target.value.toUpperCase())
          }
          placeholder="CA"
          maxLength={2}
        />
        <FormInput
          id="businessZip"
          label="ZIP Code"
          value={formData.businessZip}
          onChange={(e) =>
            onFieldChange("businessZip", e.target.value)
          }
          placeholder="90210"
        />
      </div>

      <FormInput
        id="businessPhone"
        label="Phone Number"
        type="tel"
        value={formData.businessPhone}
        onChange={(e) =>
          onFieldChange("businessPhone", e.target.value)
        }
        placeholder="+1 (555) 123-4567"
      />

      <FormInput
        id="businessEmail"
        label="Business Email"
        type="email"
        value={formData.businessEmail}
        onChange={(e) =>
          onFieldChange("businessEmail", e.target.value)
        }
        placeholder="business@example.com"
      />
    </div>
  )
);
Step2.displayName = "Step2";

const Step3 = memo(
  ({
    formData,
    onFieldChange,
  }: {
    formData: Pick<OnboardingFormData, 'websiteType' | 'customDomain'>;
    onFieldChange: (field: string, value: string) => void;
  }) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700">
          Choose your website option
        </Label>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Template Website Option */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
              formData.websiteType === "template"
                ? "border-violet-500 bg-violet-50/50 ring-2 ring-violet-200"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => onFieldChange("websiteType", "template")}
          >
            <div className="flex items-start space-x-4">
              <div className={`rounded-lg p-2 ${
                formData.websiteType === "template" 
                  ? "bg-violet-100" 
                  : "bg-gray-100"
              }`}>
                <Monitor className={`h-6 w-6 ${
                  formData.websiteType === "template" 
                    ? "text-violet-600" 
                    : "text-gray-600"
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Template Website</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get a complete website with booking system, ready to go
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-500">
                  <li>• Professional design templates</li>
                  <li>• Built-in booking system</li>
                  <li>• *.inflatemate.co subdomain included</li>
                  <li>• Optional custom domain</li>
                </ul>
              </div>
            </div>
            {formData.websiteType === "template" && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
            )}
          </motion.div>

          {/* Embedded Components Option */}
          <motion.div
            whileHover={{ y: -2 }}
            className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 ${
              formData.websiteType === "embedded"
                ? "border-violet-500 bg-violet-50/50 ring-2 ring-violet-200"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => onFieldChange("websiteType", "embedded")}
          >
            <div className="flex items-start space-x-4">
              <div className={`rounded-lg p-2 ${
                formData.websiteType === "embedded" 
                  ? "bg-violet-100" 
                  : "bg-gray-100"
              }`}>
                <Code className={`h-6 w-6 ${
                  formData.websiteType === "embedded" 
                    ? "text-violet-600" 
                    : "text-gray-600"
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Embedded Components</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Add booking widgets to your existing website
                </p>
                <ul className="mt-3 space-y-1 text-xs text-gray-500">
                  <li>• Keep your current website</li>
                  <li>• Add booking widgets anywhere</li>
                  <li>• Requires your own domain</li>
                  <li>• Full customization control</li>
                </ul>
              </div>
            </div>
            {formData.websiteType === "embedded" && (
              <div className="absolute top-3 right-3">
                <CheckCircle className="h-5 w-5 text-violet-600" />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Custom Domain Input */}
      {(formData.websiteType === "template" || formData.websiteType === "embedded") && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FormInput
            id="customDomain"
            label={
              formData.websiteType === "embedded" 
                ? "Your Domain (Required)" 
                : "Custom Domain (Optional)"
            }
            value={formData.customDomain || ""}
            onChange={(e) => onFieldChange("customDomain", e.target.value)}
            placeholder="yourdomain.com"
            tooltipContent={
              formData.websiteType === "embedded"
                ? "Enter the domain where you want to embed the booking components"
                : "Enter your custom domain or leave empty to use the provided subdomain"
            }
          />
          {formData.websiteType === "template" && !formData.customDomain && (
            <p className="text-sm text-gray-500 mt-2">
              <strong>Don&apos;t have a domain?</strong> No worries! We&apos;ll provide you with a free subdomain like{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                yourbusiness.inflatemate.co
              </code>
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
);
Step3.displayName = "Step3";

export default function OnboardingPage() {  
  const { toast } = useToast();  
  const router = useRouter();  
  const { userId, isLoaded: isAuthLoaded } = useAuth();  
  const { state, setCurrentStep, updateFormData, setConnectedAccountId, setBusinessId, setNewlyCreatedOrg, setIsLoading, setError, setIsCreatingAccountLink, resetToStep } = useOnboarding();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check if user already has a business on component mount
  useEffect(() => {
    async function checkExistingBusiness() {
      if (!isAuthLoaded || !userId) return;
      
      setIsCheckingStatus(true);
      try {
        const response = await fetch("/api/me");
        const data = await response.json();
        console.log(data);
        
        if (response.ok && data.business) {
          setCurrentStep(4);
          setConnectedAccountId(data.stripeAccountId);
          setNewlyCreatedOrg(data.orgId);
          setBusinessId(data.business.id);
        }
      } catch (err) {
        console.error("Failed to check business status:", err);
      } finally {
        setIsCheckingStatus(false);
      }
    }
    
    checkExistingBusiness();
  }, [isAuthLoaded, userId, setCurrentStep, setConnectedAccountId, setNewlyCreatedOrg, setBusinessId]);

  const currentStepDetails = useMemo(
    () => stepInfoContent.find((s) => s.id === state.currentStep),
    [state.currentStep]
  );

  const handleFieldChange = (field: string, value: string) =>
    updateFormData({ [field]: value });

  const handleNext = () => {
    try {
      if (state.currentStep === 1) {
        step1Schema.parse({ businessName: state.formData.businessName });
      } else if (state.currentStep === 2) {
        step2Schema.parse(state.formData);
      } else if (state.currentStep === 3) {
        step3Schema.parse(state.formData);
      }
      setCurrentStep(state.currentStep + 1);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: err.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => setCurrentStep(Math.max(1, state.currentStep - 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      step3Schema.parse(state.formData);
      setIsLoading(true);
      setError(false);

      if (!isAuthLoaded || !userId) {
        toast({
          title: "Error",
          description: "You must be logged in to onboard.",
          variant: "destructive",
        });
        router.replace("/sign-in");
        return;
      }

      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        throw new Error(data.message || "Onboarding failed");
      }

      setConnectedAccountId(data.stripeAccountId);
      setNewlyCreatedOrg(data.orgId);
      setBusinessId(data.business.id);
      setCurrentStep(4);
      toast({
        title: "Success!",
        description: "Business created. Let's complete your payment setup.",
      });
    } catch (err) {
      setError(true);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeOnboarding = async () => {
    if (!state.connectedAccountId) return;

    try {
      setIsCreatingAccountLink(true);
      
      const response = await fetch("/api/stripe/create-account-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: state.connectedAccountId,
          returnUrl: `${window.location.origin}/pricing?orgId=${state.newlyCreatedOrg}`,
          refreshUrl: `${window.location.origin}/onboarding`,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create account link");
      }

      // Redirect to Stripe's hosted onboarding
      window.location.href = data.url;
    } catch (err) {
      setError(true);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to start onboarding",
        variant: "destructive",
      });
    } finally {
      setIsCreatingAccountLink(false);
    }
  };

  const renderStepContent = () => {
    if (state.currentStep === 1)
      return (
        <Step1
          value={state.formData.businessName}
          onChange={(v) => handleFieldChange("businessName", v)}
        />
      );
    if (state.currentStep === 2)
      return (
        <Step2 formData={state.formData} onFieldChange={handleFieldChange} />
      );
    if (state.currentStep === 3)
      return (
        <Step3 formData={state.formData} onFieldChange={handleFieldChange} />
      );
    if (state.currentStep === 4)
      return (
        <div>
          {state.connectedAccountId ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-gray-100 bg-white p-8 shadow-lg text-center"
            >
              <div className="mb-6">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                  <CreditCardIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Complete Your Stripe Setup
                </h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to securely connect your bank account and complete your payment setup with Stripe.
                </p>
              </div>                            <Button                onClick={handleStripeOnboarding}                disabled={state.isCreatingAccountLink}                className="bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-700 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 mx-auto"              >                {state.isCreatingAccountLink ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Stripe Setup
                    <ExternalLink className="h-4 w-4" />
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                You&apos;ll be redirected to Stripe&apos;s secure platform to complete your setup
              </p>
            </motion.div>
          ) : (
            <div className="rounded-xl border border-gray-100 bg-white p-12 shadow-lg text-center">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-violet-500" />
              <p>Preparing your payment setup…</p>
            </div>
          )}
          {state.error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              Something went wrong with the payment setup. Please try again or contact support.
            </div>
          )}
        </div>
      );
    return null;
  };

  // Show loading spinner while checking business status
  if (isCheckingStatus) {
    return (
      <main className="flex w-full h-screen items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-violet-500" />
          <p className="text-gray-600 font-medium">Checking your business status...</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex w-full justify-center py-8">
      {state.isLoading && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="rounded-2xl border border-white/10 bg-violet-900/40 p-8 backdrop-blur-md text-white">
            <div className="mb-6 h-14 w-14 animate-spin rounded-full border-4 border-t-transparent border-white" />
            <p>Setting up your organization…</p>
          </div>
        </motion.div>
      )}

      <Card className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white/95 shadow-2xl backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600" />

        <div className="flex flex-col lg:flex-row">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-2/5 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-violet-200/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl" />
            <div className="absolute top-1/4 -right-8 w-24 h-24 bg-purple-200/20 rounded-full blur-xl" />
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #8b5cf6 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
            </div>
            <div className="relative z-10">
              {currentStepDetails?.icon && (
                <motion.div
                  key={`icon-${state.currentStep}`}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                  className="mb-8 w-20 h-20 rounded-2xl bg-white shadow-xl border border-violet-100/50 flex items-center justify-center backdrop-blur-sm"
                >
                  {currentStepDetails.icon}
                </motion.div>
              )}
              {currentStepDetails && (
                <motion.div
                  key={`content-${state.currentStep}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    <GradientText>
                      {currentStepDetails.title}
                    </GradientText>
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed mb-10">
                    {currentStepDetails.description}
                  </p>
                  <div className="space-y-4">
                    {currentStepDetails.features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {f}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12">
            <CardHeader className="pb-8 pt-0 text-center">
              <CardTitle className="mb-3 text-3xl font-bold tracking-tight">
                <GradientText>Setup Your Account</GradientText>
              </CardTitle>
              <CardDescription className="text-gray-500">
                Step {state.currentStep} of {stepInfoContent.length} • Almost there!
              </CardDescription>
            </CardHeader>

            <CardContent>
              <StepIndicator
                currentStep={state.currentStep}
                totalSteps={stepInfoContent.length}
              />

              <form
                onSubmit={
                  state.currentStep === 3
                    ? handleSubmit
                    : (e) => e.preventDefault()
                }
              >
                <AnimatedContainer
                  currentStep={state.currentStep}
                  targetStep={1}
                >
                  {renderStepContent()}
                </AnimatedContainer>
                <AnimatedContainer
                  currentStep={state.currentStep}
                  targetStep={2}
                >
                  {renderStepContent()}
                </AnimatedContainer>
                <AnimatedContainer
                  currentStep={state.currentStep}
                  targetStep={3}
                >
                  {renderStepContent()}
                </AnimatedContainer>
                <AnimatedContainer
                  currentStep={state.currentStep}
                  targetStep={4}
                >
                  {renderStepContent()}
                </AnimatedContainer>

                {state.currentStep < 4 && (
                  <div className="mt-8 flex justify-between border-t border-gray-100 pt-8">
                    {state.currentStep > 1 ? (
                      <Button
                        variant="outline"
                        onClick={handleBack}
                      >
                        ← Back
                      </Button>
                    ) : (
                      <div />
                    )}
                    {state.currentStep === 1 || state.currentStep === 2 ? (
                      <Button onClick={handleNext}>
                        Continue →
                      </Button>
                    ) : (
                      <Button type="submit" disabled={state.isLoading}>
                        {state.isLoading
                          ? "Processing…"
                          : "Complete Setup →"}
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </main>
  );
}
