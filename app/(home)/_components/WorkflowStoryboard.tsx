'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, BarChart2, ArrowRight, CheckCircle, MessageSquare, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Customer books online",
    description: "Clients select date, time, and inflatable units through your branded booking portal.",
    icon: Calendar,
    color: "from-primary to-accent",
    details: [
      { text: "Real-time availability calendar", icon: Clock },
      { text: "Smart conflict prevention", icon: CheckCircle },
      { text: "Automatic buffer times", icon: ArrowRight },
    ],
    image: "/images/booking-screen.png", // You'll need placeholder images
  },
  {
    title: "Auto‑waiver & invoice sent",
    description: "System automatically emails liability waivers and payment links to customers.",
    icon: FileText,
    color: "from-accent to-blue-500",
    details: [
      { text: "Legal e-signature waivers", icon: CheckCircle },
      { text: "Branded invoice PDFs", icon: FileText },
      { text: "Multiple payment options", icon: ArrowRight },
    ],
    image: "/images/invoice-screen.png", // You'll need placeholder images
  },
  {
    title: "Owner reviews analytics & confirms",
    description: "Get insights into your business and manage all upcoming bookings from one dashboard.",
    icon: BarChart2,
    color: "from-blue-500 to-primary",
    details: [
      { text: "Real-time booking alerts", icon: MessageSquare },
      { text: "Revenue forecasting", icon: BarChart2 },
      { text: "One-click confirmations", icon: CheckCircle },
    ],
    image: "/images/analytics-screen.png", // You'll need placeholder images
  },
];

export default function WorkflowStoryboard() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToNextStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevStep = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const { icon: ActiveIcon } = steps[activeStep];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Your business, automated
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See how InflateMate handles your entire workflow automatically, from booking to delivery.
          </p>
        </motion.div>

        {/* Main workflow container */}
        <div className="max-w-6xl mx-auto">
          {/* Progress bar */}
          <div className="relative h-1 bg-muted rounded-full mb-12 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: `${(1/steps.length) * 100}%` }}
              animate={{ 
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                x: `${(activeStep / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Step markers */}
            <div className="absolute inset-0 flex justify-between">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setActiveStep(index);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full -mt-4 transition-all duration-300 flex items-center justify-center border-2",
                    index <= activeStep 
                      ? "bg-primary border-primary text-white" 
                      : "bg-card border-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </button>
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
                        "p-3 rounded-xl bg-gradient-to-br text-white",
                        `bg-gradient-to-br ${steps[activeStep].color}`
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
                          transition={{ delay: 0.2 + (idx * 0.1) }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
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
                        className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                        aria-label="Previous step"
                      >
                        <ArrowRight className="w-5 h-5 transform rotate-180" />
                      </button>
                      <button 
                        onClick={goToNextStep}
                        className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
                        aria-label="Next step"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image side with gradient overlay */}
                  <div className="relative lg:w-1/2 min-h-[300px] lg:min-h-0 bg-muted/30">
                    {/* Placeholder for illustration */}
                    <div className="absolute inset-0 bg-gradient-to-r opacity-10 from-transparent to-primary" />
                    
                    {/* This is where you'd place an actual screenshot or illustration */}
                    <div className="relative h-full flex items-center justify-center p-6">
                      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl border border-border">
                        {/* Replace with actual images */}
                        <div className="aspect-video w-full bg-card relative">
                          {/* Fallback placeholder */}
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.05, 1],
                                rotate: [0, 1, 0, -1, 0],
                              }}
                              transition={{ repeat: Infinity, duration: 5 }}
                              className="w-full max-w-xs"
                            >
                              {/* Replace with actual images when you have them */}
                              <div className="p-4 border border-dashed border-muted rounded-lg bg-secondary/50 text-center">
                                <ActiveIcon className="w-12 h-12 mx-auto text-primary mb-4" />
                                <p className="text-foreground font-medium">
                                  {steps[activeStep].title} visualization
                                </p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Process flow indicators */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        {steps.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (!isAnimating) {
                                setIsAnimating(true);
                                setActiveStep(idx);
                                setTimeout(() => setIsAnimating(false), 500);
                              }
                            }}
                            className={cn(
                              "w-2.5 h-2.5 rounded-full transition-all",
                              idx === activeStep 
                                ? "bg-primary w-8" 
                                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
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
                className="absolute top-1/2 -left-5 transform -translate-y-1/2 w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Previous step"
              >
                <ArrowRight className="w-5 h-5 transform rotate-180" />
              </button>
              <button 
                onClick={goToNextStep}
                className="absolute top-1/2 -right-5 transform -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
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
              All synced in Supabase—no manual data entry required
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
