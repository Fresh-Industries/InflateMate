'use client'
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Users, Layout, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingSnapshot() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "solo",
      name: "Solo Plan",
      price: 60,
      description: "Perfect for individual operators just getting started",
      features: [
        "1 user account",
        "Core booking system",
        "Inventory management",
        "CRM & customer tracking",
        "Invoicing system",
        "Basic email notifications",
      ],
      limitations: ["No SMS messaging", "No team collaboration"],
      icon: <Users className="h-5 w-5" />,
      recommended: false,
      color: "bg-secondary/80",
      gradient: "from-secondary/40 to-background",
    },
    {
      id: "growth",
      name: "Growth Plan",
      price: 99,
      description: "Everything you need, up to 1,000 bookings per year",
      features: [
        "5 team members",
        "All Solo Plan features",
        "SMS notifications",
        "Organization switching",
        "Embedded booking components",
        "Priority support",
        "Advanced analytics",
      ],
      limitations: [],
      icon: <Zap className="h-5 w-5" />,
      recommended: true,
      color: "bg-primary/10",
      gradient: "from-primary/20 to-primary/5",
      callout: "MOST POPULAR",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative overflow-hidden">
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-24 left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-12 right-12 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4 px-3 py-1 bg-muted/50 text-muted-foreground">
            Simple, transparent pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Choose the Perfect Plan for Your Business
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            No hidden fees or complicated pricing tiers. Just the features you need to grow your bounce house rental business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              className={cn(
                "relative rounded-2xl overflow-hidden border group",
                plan.recommended ? "border-primary shadow-lg" : "border-border",
                hoveredPlan && hoveredPlan !== plan.id ? "opacity-80" : "opacity-100"
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
                      plan.recommended ? "bg-primary/20" : "bg-secondary/30"
                    )}>
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      <span className="text-xl">$</span>{plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </div>
                    {plan.id === "growth" && (
                      <div className="text-xs text-primary font-medium mt-1">
                        Lock in <strong>$79/mo</strong> before July 1
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle2 className={cn(
                        "h-5 w-5 mt-0.5",
                        plan.recommended ? "text-primary" : "text-accent"
                      )} />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="h-5 w-5 flex items-center justify-center mt-0.5">•</span>
                      <span>{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className={cn(
                      "w-full gap-2 text-sm h-11",
                      plan.recommended 
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                        : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    )}
                    asChild
                  >
                    <Link href={`/signup`}>
                      Get Started with {plan.name}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center mt-12">
          <div className="mb-4 flex items-center gap-3">
            <Layout className="text-muted-foreground h-5 w-5" />
            <p className="text-muted-foreground">
              Need a detailed breakdown of all features?
            </p>
          </div>
          <Link href="/pricing" passHref>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "group"
              )}
            >
              View Full Pricing Details
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 1.5,
                  repeatDelay: 0.5,
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
