'use client'
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, BarChart2, ArrowRight, ArrowLeft, CheckCircle, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Type definitions
interface StepDetail {
  text: string;
  icon: React.ElementType;
}

interface Step {
  name: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details: StepDetail[];
  image?: string;
}

const steps: Step[] = [
  {
    name: "Customer Books Online",
    title: "Customers Book Their Perfect Inflatable",
    description: "Clients select date, time, and inflatable units through your branded booking portal.",
    icon: Calendar,
    color: "from-primary to-accent",
    details: [
      { text: "Real-time availability calendar", icon: Clock },
      { text: "Smart conflict prevention", icon: CheckCircle },
      { text: "Automatic buffer times", icon: ArrowRight },
    ],
    image: "/images/booking-screen.png",
  },
  {
    name: "Automated Waivers & Invoicing",
    title: "Waivers & Invoices Sent Instantly",
    description: "System automatically emails **safety waivers** and **online payment links** to customers immediately after booking.",
    icon: FileText,
    color: "from-accent to-blue-500",
    details: [
      { text: "Secure e-sign waivers", icon: CheckCircle },
      { text: "Professional invoice PDFs", icon: FileText },
      { text: "Accept online payments", icon: ArrowRight },
    ],
    image: "/images/invoice-screen.png",
  },
  {
    name: "Manage & Get Insights",
    title: "Manage, Analyze, & Confirm Bookings",
    description: "Manage upcoming **rentals**, view **inventory** performance, and get clear insights into your business all from one dashboard.",
    icon: BarChart2,
    color: "from-blue-500 to-primary",
    details: [
      { text: "Real-time booking alerts", icon: MessageSquare },
      { text: "Revenue forecasting", icon: BarChart2 },
      { text: "One-click confirmations", icon: CheckCircle },
    ],
    image: "/images/analytics-screen.png",
  },
];

// Reusable step button component
const StepButton = ({ 
  index, 
  isActive, 
  isCompleted, 
  onClick, 
  isAnimating 
}: { 
  index: number; 
  isActive: boolean; 
  isCompleted: boolean; 
  onClick: () => void; 
  isAnimating: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={isAnimating}
    className={cn(
      "relative flex items-center justify-center z-10",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      isAnimating && "pointer-events-none"
    )}
    aria-label={`Go to step ${index + 1}`}
    aria-current={isActive ? "step" : undefined}
  >
    <div 
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
        "border-2 shadow-sm",
        isActive 
          ? "bg-primary border-primary text-white scale-110" 
          : isCompleted 
            ? "bg-primary/10 border-primary text-primary"
            : "bg-card border-muted text-muted-foreground"
      )}
    >
      <span className="text-sm font-medium">{index + 1}</span>
    </div>
  </button>
);

export default function WorkflowStoryboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const changeStep = useCallback((stepIndex: number) => {
    if (isAnimating || stepIndex === activeStep) return;
    setIsAnimating(true);
    setActiveStep(stepIndex);
    setTimeout(() => setIsAnimating(false), 600);
  }, [activeStep, isAnimating]);

  const goToNextStep = useCallback(() => {
    changeStep(activeStep === steps.length - 1 ? 0 : activeStep + 1);
  }, [activeStep, changeStep]);

  const goToPrevStep = useCallback(() => {
    changeStep(activeStep === 0 ? steps.length - 1 : activeStep - 1);
  }, [activeStep, changeStep]);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How InflateMate <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Automates Your Rentals</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Watch the journey of a typical rental, showing how InflateMate streamlines everything from online booking to getting paid.
          </p>
        </motion.div>

        {/* Main workflow container */}
        <div className="max-w-6xl mx-auto">
          {/* Improved Step Indicator */}
          <div className="mb-16 relative">
            {/* Progress Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted rounded-full transform -translate-y-1/2">
              {/* Animated Progress */}
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                style={{
                  width: `${((activeStep) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Step Buttons */}
            <div className="relative flex justify-between">
              {steps.map((_, index) => (
                <StepButton
                  key={index}
                  index={index}
                  isActive={index === activeStep}
                  isCompleted={index < activeStep}
                  onClick={() => changeStep(index)}
                  isAnimating={isAnimating}
                />
              ))}
            </div>
            
            {/* Step Labels */}
            <div className="flex justify-between mt-2 text-sm">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "w-[33%] transition-opacity duration-300",
                    index === activeStep ? "opacity-100" : "opacity-50"
                  )}
                >
                  <p className={cn(
                    "truncate",
                    index === 0 ? "text-left" : 
                    index === steps.length - 1 ? "text-right" : "text-center"
                  )}>
                    {step.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Active step card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Content side */}
                  <div className="p-8 lg:p-10 lg:w-1/2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn(
                        "flex-shrink-0 p-3 rounded-xl bg-gradient-to-br text-white",
                        steps[activeStep].color
                      )}>
                        <ActiveIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">
                        {steps[activeStep].title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-8 text-lg">
                      {steps[activeStep].description}
                    </p>

                    {/* Step details */}
                    <div className="space-y-4">
                      {steps[activeStep].details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + (idx * 0.05) }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <detail.icon className="w-4 h-4" />
                          </div>
                          <span className="text-foreground">{detail.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Navigation buttons for mobile */}
                    <div className="flex justify-between mt-8 lg:hidden">
                      <button
                        onClick={goToPrevStep}
                        disabled={isAnimating}
                        className={cn(
                          "p-2 rounded-full border border-border hover:bg-muted transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          isAnimating && "pointer-events-none opacity-70"
                        )}
                        aria-label="Previous step"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={goToNextStep}
                        disabled={isAnimating}
                        className={cn(
                          "p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                          isAnimating && "pointer-events-none opacity-70"
                        )}
                        aria-label="Next step"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-0 bg-muted/30">
                    <img
                      src={steps[activeStep].image || '/placeholder.png'}
                      alt={`Illustration for ${steps[activeStep].title}`}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r opacity-20 from-transparent to-primary z-10" />

                    {/* Process flow indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-20">
                      <div className="flex items-center space-x-3 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                        {steps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => changeStep(idx)}
                            disabled={isAnimating}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all focus:outline-none",
                              idx === activeStep
                                ? "bg-primary w-6"
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
                              isAnimating && "pointer-events-none opacity-70"
                            )}
                            aria-label={`Go to step ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Side navigation buttons (desktop) */}
            <div className="hidden lg:block">
              <button
                onClick={goToPrevStep}
                disabled={isAnimating}
                className={cn(
                  "absolute top-1/2 -left-5 transform -translate-y-1/2 w-10 h-10 rounded-full",
                  "bg-card border border-border shadow-lg flex items-center justify-center",
                  "hover:bg-muted transition-colors z-20",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isAnimating && "pointer-events-none opacity-70"
                )}
                aria-label="Previous step"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextStep}
                disabled={isAnimating}
                className={cn(
                  "absolute top-1/2 -right-5 transform -translate-y-1/2 w-10 h-10 rounded-full",
                  "bg-primary text-white shadow-lg flex items-center justify-center",
                  "hover:bg-primary/90 transition-colors z-20",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isAnimating && "pointer-events-none opacity-70"
                )}
                aria-label="Next step"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Caption */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-8 text-center text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Say goodbye to manual spreadsheets. All booking, customer, and payment data is automatically synced.
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
