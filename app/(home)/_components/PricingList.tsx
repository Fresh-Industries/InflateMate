'use client'
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Users, ArrowRight, DollarSign, XCircle } from "lucide-react"; // Added necessary icons
import { cn } from "@/lib/utils";

// Define interface for Plan structure for type safety
interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations: string[]; // Keep limitations for clarity if needed, or rephrase as excluded features
  icon: React.ReactElement;
  recommended: boolean;
  color: string; // Tailwind color class or similar for styling
  gradient: string; // Tailwind gradient classes
  callout?: string; // Optional callout text like "MOST POPULAR"
}


export default function PricingSnapshot() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans: Plan[] = [ // Explicitly type the array
    {
      id: "solo",
      name: "Solo Plan",
      price: 60,
      description: "Manage your entire operation as a one-person show.", // More benefit-driven
      features: [
        "1 user account", // Clear limit
        "Core online booking system", // Specific feature
        "Inflatable inventory management", // Specific feature
        "Customer tracking (CRM)", // Specific feature
        "Quotes & invoicing", // Specific feature
        "Website builder access", // Mention the builder
        "Automated email notifications & waivers", // Specific feature
      ],
      // Rephrased limitations as "Key Exclusions" for clarity
      limitations: [
        "No team members (1 user only)", // Specific limitation
        "No integrated SMS messaging", // Specific limitation
        "No embedded booking components", // Specific limitation
      ],
      icon: <Users className="h-5 w-5" />, // Users icon fits Solo
      recommended: false,
      color: "bg-secondary/80",
      gradient: "from-secondary/40 to-background",
    },
    {
      id: "growth",
      name: "Growth Plan",
      price: 99,
      description: "Scale your operations with a team and unlock advanced features.", // Benefit-driven
      features: [
        "Up to 5 team members", // Clear limit
        "All Solo Plan features included", // Highlight inclusion
        "Integrated SMS messaging", // Specific feature
        "Seamless team collaboration", // Benefit of multiple users
        "Embed booking on your existing site", // Benefit of embedded components
        "Priority customer support", // Specific benefit
      ],
      limitations: [], // No specific limitations listed for growth (core features included)
      icon: <Zap className="h-5 w-5" />, // Zap icon fits Growth/Power
      recommended: true,
      color: "bg-primary/10",
      gradient: "from-primary/20 to-primary/5",
      callout: "MOST POPULAR",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative overflow-hidden">
      {/* Background elements */}
      {/* Adjusted background gradient */}
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Decorative elements - Adjusted colors to match plan gradients */}
      <div className="absolute top-24 left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10" /> {/* Used secondary color */}

      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          {/* Updated Badge text */}
          <Badge variant="outline" className="mb-4 px-3 py-1 bg-muted/50 text-muted-foreground">
            Simple Pricing for Rental Pros
          </Badge>
          {/* Updated Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Get the Right Tools to <span className="text-primary">Grow Your Bounce House Business</span>
          </h2>
          {/* Updated Subtitle */}
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Predictable monthly pricing with no hidden fees, usage limits, or long-term contracts. Just the features you need to book more rentals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={cn(
                "relative rounded-2xl overflow-hidden border group transition-opacity duration-300", // Added transition class
                plan.recommended ? "border-primary shadow-lg" : "border-border",
                hoveredPlan && hoveredPlan !== plan.id ? "opacity-60" : "opacity-100" // Dim less when not hovered
              )}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} -z-10`} />

              {/* Popular tag */}
              {plan.recommended && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-xs px-4 py-1 rounded-bl-lg font-semibold">
                    {plan.callout}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={cn(
                      "inline-flex items-center justify-center p-2 rounded-lg mb-3",
                      plan.recommended ? "bg-primary/20 text-primary" : "bg-secondary/30 text-secondary-foreground" // Added text colors
                    )}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3> {/* Ensured text-foreground */}
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right text-foreground"> {/* Ensured text-foreground */}
                    <div className="text-3xl font-bold">
                      <span className="text-xl">$</span>{plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-2 text-foreground" // Ensured text-foreground
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }} // Reduced delay for faster animation
                    >
                      <CheckCircle2 className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0", // Added flex-shrink
                        plan.recommended ? "text-primary" : "text-accent"
                      )} />
                      <span>{feature}</span>
                    </motion.div>
                  ))}

                  {/* Limitations/Exclusions List */}
                  {plan.limitations.length > 0 && (
                    <>
                      {plan.limitations.map((limitation, index) => (
                         <motion.div
                            key={`limitation-${index}`} // Unique key for limitations
                            className="flex items-start gap-2 text-muted-foreground"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: plan.features.length * 0.05 + index * 0.05, duration: 0.3 }} // Stagger after features
                         >
                            <XCircle className={cn(
                              "h-5 w-5 mt-0.5 flex-shrink-0 text-destructive/80" // Used XCircle and destructive color
                            )} />
                           <span>{limitation}</span>
                         </motion.div>
                      ))}
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className={cn(
                      "w-full gap-2 text-base h-11", // Increased text size slightly
                      plan.recommended
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20" // Added subtle shadow
                        : "bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md shadow-secondary/20", // Added subtle shadow
                    )}
                    asChild
                  >
                    {/* Link includes the plan ID */}
                    <Link href={`/signup?plan=${plan.id}`}>
                      {plan.recommended ? "Get Started Today" : `Choose ${plan.name}`} {/* More direct CTA text */}
                      <ArrowRight className="h-4 w-4 ml-1" /> {/* Added margin */}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Pricing Details Link */}
        <div className="flex flex-col items-center mt-12">
          {/* Updated text */}
          <div className="mb-4 flex items-center gap-3 text-foreground"> {/* Ensured text-foreground */}
            <DollarSign className="text-primary h-5 w-5 flex-shrink-0" /> {/* Used DollarSign icon */}
            <p className="text-center max-w-sm md:max-w-none"> {/* Added max-width for better centering on small screens */}
               Looking for more detail on features, users, or add-ons?
            </p>
          </div>
          <Link href="/pricing" passHref > {/* Added legacyBehavior for passHref */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "group text-primary border-primary hover:bg-primary/5 hover:text-primary transition-colors" // Enhanced hover state
              )}
            >
              View Full Pricing Details
              <motion.span
                className="inline-block ml-2 group-hover:translate-x-1 transition-transform" // Added group-hover translate animation
                animate={{ x: [0, 5, 0] }} // Kept original subtle bobbing animation
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 1.5,
                  repeatDelay: 2, // Increased delay slightly
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
