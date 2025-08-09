'use client'
import React, { useState, useCallback } from "react";
import Image from "next/image";
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
  const ACCENTS = [
    { hex: '#2DD4BF', rgba: 'rgba(45,212,191,0.12)' }, // teal
    { hex: '#FACC15', rgba: 'rgba(250,204,21,0.18)' }, // yellow
    { hex: '#F87171', rgba: 'rgba(248,113,113,0.12)' }, // coral
  ] as const;
  const currentAccent = ACCENTS[activeStep % ACCENTS.length];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle grid only */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#1F2937]" style={{ fontFamily: 'var(--font-heading)' }}>
            See how InflateMate automates your rentals
          </h2>
          <p className="text-lg text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
            Follow a typical rental from online booking to getting paid.
          </p>
        </div>

        {/* Main workflow container */}
        <div className="max-w-6xl mx-auto">
          {/* Improved Step Indicator */}
          <div className="mb-16 relative">
            {/* Progress Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-black/10 rounded-full transform -translate-y-1/2">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{ width: `${((activeStep) / (steps.length - 1)) * 100}%`, backgroundColor: currentAccent.hex }}
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
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(2,6,23,0.06)] border border-black/10 bg-white">
                <div className="flex flex-col lg:flex-row">
                  {/* Content side */}
                  <div className="p-8 lg:p-10 lg:w-1/2">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-shrink-0 p-3 rounded-xl" style={{ backgroundColor: currentAccent.rgba }}>
                        <ActiveIcon className="w-6 h-6" style={{ color: currentAccent.hex }} />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0B1220]">
                        {steps[activeStep].title}
                      </h3>
                    </div>

                    <p className="text-[#475569] mb-8 text-lg">
                      {steps[activeStep].description}
                    </p>

                    {/* Step details */}
                    <div className="space-y-4">
                      {steps[activeStep].details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentAccent.rgba, color: currentAccent.hex }}>
                            <detail.icon className="w-4 h-4" />
                          </div>
                          <span className="text-[#0B1220]">{detail.text}</span>
                        </div>
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
                  <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-0 bg-white">
                    <Image
                      src={steps[activeStep].image || '/placeholder.png'}
                      alt={`Illustration for ${steps[activeStep].title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {/* Neutral frame */}
                    <div className="absolute inset-0 ring-1 ring-black/5 z-10 pointer-events-none" />

                    {/* Process flow indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-20">
                      <div className="flex items-center space-x-3 bg-white/85 backdrop-blur-sm px-4 py-2 rounded-full">
                        {steps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => changeStep(idx)}
                            disabled={isAnimating}
                            className={cn(
                              "w-2 h-2 rounded-full transition-all focus:outline-none",
                              idx === activeStep ? "w-6" : "bg-black/30 hover:bg-black/50",
                              isAnimating && "pointer-events-none opacity-70"
                            )}
                            style={idx === activeStep ? { backgroundColor: currentAccent.hex } : undefined}
                            aria-label={`Go to step ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
          <div className="flex items-center justify-center gap-2 mt-8 text-center text-[#64748B]">
            <span className="inline-flex items-center gap-2 bg-black/[0.04] px-3 py-1 rounded-full text-sm">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
              Say goodbye to manual spreadsheets. All booking, customer, and payment data is automatically synced.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
