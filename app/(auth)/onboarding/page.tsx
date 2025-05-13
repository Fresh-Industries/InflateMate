"use client";

import { useState, useMemo, memo } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ConnectAccountOnboarding, ConnectComponentsProvider } from "@stripe/react-connect-js";
import { useStripeConnect } from "@/hooks/use-stripe-connect";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Building2, MapPin, CreditCardIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Animated container for step transitions
const AnimatedContainer = ({ children, currentStep, targetStep }: { children: React.ReactNode, currentStep: number, targetStep: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: currentStep === targetStep ? 1 : 0, y: currentStep === targetStep ? 0 : 20 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    style={{ display: currentStep === targetStep ? "block" : "none" }}
  >
    {children}
  </motion.div>
);

// Enhanced gradient text component
const GradientText = memo(({ children, className }: { children: React.ReactNode, className: string }) => (
  <span className={`bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent font-bold ${className || ''}`}>
    {children}
  </span>
));
GradientText.displayName = 'GradientText';

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center mb-8 w-full">
      {steps.map((step) => (
        <div key={step} className="flex items-center">
          <div 
            className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${
              step < currentStep 
                ? "bg-violet-600 text-white" 
                : step === currentStep 
                ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white ring-4 ring-violet-100" 
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {step < currentStep ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-sm font-medium">{step}</span>
            )}
          </div>
          
          {step < totalSteps && (
            <div 
              className={`h-1 w-12 ${
                step < currentStep ? "bg-violet-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Animated input component with improved styling and added tooltip support
const FormInput = ({ id, label, value, onChange, placeholder, type = "text", maxLength, className = "", tooltipContent }: { id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string, maxLength?: number, className?: string, tooltipContent?: string }) => (
  <TooltipProvider>
    <Tooltip delayDuration={150}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <TooltipTrigger asChild>
          <div className="flex items-center mb-1.5">
            <Label htmlFor={id} className="block text-gray-700 font-medium cursor-help">
              {label}
            </Label>
            {tooltipContent && (
              <Info className="h-4 w-4 text-gray-400 ml-1" />
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
          className={`rounded-lg border-gray-200 bg-white/50 shadow-sm h-11 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/30 transition-all ${className}`}
          required
        />
      </motion.div>
      {tooltipContent && (
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
);

// Memoized form step components with enhanced visuals
const Step1 = memo(({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-center mb-8">
      <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center">
        <Building2 className="h-10 w-10 text-violet-600" />
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-center mb-6">
      <GradientText className="text-2xl font-bold text-center mb-6">Business Identity</GradientText>
    </h2>
    
    <motion.p 
      className="text-gray-600 text-center mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Let&apos;s start with your business name to create your account
    </motion.p>
    
    <FormInput
      id="businessName"
      label="Business Name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Your Business Name"
    />
  </div>
));
Step1.displayName = 'Step1';

const Step2 = memo(({ formData, onFieldChange }: { formData: { businessAddress: string, businessCity: string, businessState: string, businessZip: string, businessPhone: string, businessEmail: string }, onFieldChange: (field: string, value: string) => void }) => (
  <div className="space-y-6">
    <div className="flex justify-center mb-8">
      <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center">
        <MapPin className="h-10 w-10 text-violet-600" />
      </div>
    </div>
    
    <h2 className="text-2xl font-bold text-center mb-6">
      <GradientText className="text-2xl font-bold text-center mb-6">Location &amp; Contact</GradientText>
    </h2>
    
    <motion.p 
      className="text-gray-600 text-center mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Please provide your business address and contact information
    </motion.p>
    
    <FormInput
      id="businessAddress"
      label="Street Address"
      value={formData.businessAddress}
      onChange={(e) => onFieldChange('businessAddress', e.target.value)}
      placeholder="123 Main St"
      tooltipContent="Enter the primary address where you store your bounce houses or conduct business."
    />
    
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <FormInput
        id="businessCity"
        label="City"
        value={formData.businessCity}
        onChange={(e) => onFieldChange('businessCity', e.target.value)}
        placeholder="City"
      />
      
      <FormInput
        id="businessState"
        label="State"
        value={formData.businessState}
        onChange={(e) => onFieldChange('businessState', e.target.value.toUpperCase())}
        placeholder="CA"
        maxLength={2}
      />
      
      <FormInput
        id="businessZip"
        label="ZIP Code"
        value={formData.businessZip}
        onChange={(e) => onFieldChange('businessZip', e.target.value)}
        placeholder="90001"
      />
    </div>
    
    <FormInput
      id="businessPhone"
      label="Phone Number"
      type="tel"
      value={formData.businessPhone}
      onChange={(e) => onFieldChange('businessPhone', e.target.value)}
      placeholder="+1 555 1234567"
    />
    
    <FormInput
      id="businessEmail"
      label="Business Email"
      value={formData.businessEmail}
      onChange={(e) => onFieldChange('businessEmail', e.target.value)}
      placeholder="business@example.com"
    />
  </div>
));
Step2.displayName = 'Step2';

export default function OnboardingPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { userId, isLoaded: isAuthLoaded } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessId, setBusinessId] = useState(null);
  const [error, setError] = useState(false);
  const [connectedAccountId, setConnectedAccountId] = useState(null);
  const [newlyCreatedOrg, setNewlyCreatedOrg] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
    businessEmail: "",
  });

  const stripeConnectInstance = useStripeConnect(connectedAccountId || "");

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      if (!isAuthLoaded || !userId) {
        toast({
          title: "Error",
          description: "You must be logged in to onboard.",
          variant: "destructive",
        });
        router.replace('/sign-in');
        return;
      }

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
      setNewlyCreatedOrg(data.orgId);

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

  const handleOnboardingExit = async () => {
    if (newlyCreatedOrg) {
      console.log("Stripe Connect exited. Redirecting to pricing with orgId:", newlyCreatedOrg);
      router.replace(`/pricing?orgId=${newlyCreatedOrg}`);
    } else {
      console.warn("Stripe Connect exited, but no newlyCreatedClerkOrgId available. Redirecting to pricing without orgId.");
      router.replace('/');
    }
  };

  const renderStep = () => {
    return (
      <>
        <AnimatedContainer currentStep={currentStep} targetStep={1}>
          <Step1 
            value={formData.businessName} 
            onChange={(value) => handleFieldChange('businessName', value)} 
          />
        </AnimatedContainer>
        
        <AnimatedContainer currentStep={currentStep} targetStep={2}>
          <Step2 
            formData={formData} 
            onFieldChange={handleFieldChange} 
          />
        </AnimatedContainer>
        
        <AnimatedContainer currentStep={currentStep} targetStep={3}>
          <div className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center">
                <CreditCardIcon className="h-10 w-10 text-violet-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-6">
              <GradientText className="text-2xl font-bold text-center mb-6">Complete Payment Setup</GradientText>
            </h2>
            
            <motion.p 
              className="text-gray-600 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              We&apos;ve created your business profile. Now let&apos;s set up your payment processing.
            </motion.p>
            
            {stripeConnectInstance && connectedAccountId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
                  <ConnectAccountOnboarding onExit={handleOnboardingExit} />
                </ConnectComponentsProvider>
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto border-4 border-t-transparent border-violet-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading payment setup...</p>
              </div>
            )}
            
            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-center mt-4 font-medium bg-red-50 p-3 rounded-lg"
              >
                Something went wrong with the payment setup!
              </motion.p>
            )}
          </div>
        </AnimatedContainer>
      </>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const progressWidth = useMemo(() => 
    `${(currentStep / 3) * 100}%`
  , [currentStep]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-violet-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-violet-100/40 to-transparent" />
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-indigo-100/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-violet-100/50 blur-3xl" />
      
      {isLoading && newlyCreatedOrg && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="flex flex-col items-center text-white bg-violet-900/40 p-8 rounded-2xl backdrop-blur-md">
            <div className="w-14 h-14 border-4 border-t-transparent border-white rounded-full animate-spin mb-6"></div>
            <p className="text-lg font-medium">Setting up your organization...</p>
          </div>
        </motion.div>
      )}
      
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur-md relative overflow-hidden z-10">
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 to-indigo-500" />
        
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            <GradientText className="text-3xl font-extrabold tracking-tight">Welcome Onboard</GradientText>
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2 text-base">
            Let&apos;s set up your business account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 py-8">
          <StepIndicator currentStep={currentStep} totalSteps={3} />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            
            {/* Buttons only for steps 1 and 2 */}
            {currentStep < 3 && (
              <motion.div 
                className="flex justify-between mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-all h-11 px-6 shadow-sm"
                  >
                    Back
                  </Button>
                )}
                
                {currentStep === 1 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="primary-gradient"
                    className="h-11 px-6 ml-auto"
                  >
                    Next
                  </Button>
                )}
                
                {currentStep === 2 && (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    variant="primary-gradient"
                    className="h-11 px-6 ml-auto"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Business...
                      </span>
                    ) : (
                      "Set Up Payments"
                    )}
                  </Button>
                )}
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
