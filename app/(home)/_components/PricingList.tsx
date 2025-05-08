'use client';

import React, { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Zap,
  Users,
  ArrowRight,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type PlanId = 'solo' | 'growth';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations: string[];
  icon: React.ReactElement;
  recommended: boolean;
  gradient: string;
  callout?: string;
}

const plans: Plan[] = [
  {
    id: 'solo',
    name: 'Solo Plan',
    price: 60,
    description: 'Manage your entire operation as a one‑person show.',
    features: [
      '1 user account',
      'Core online booking system',
      'Inflatable inventory management',
      'Customer tracking (CRM)',
      'Quotes & invoicing',
      'Website builder access',
      'Automated email notifications & waivers'
    ],
    limitations: [
      'No team members (1 user only)',
      'No integrated SMS messaging',
      'No embedded booking components'
    ],
    icon: <Users className="h-5 w-5" />,
    recommended: false,
    gradient: 'from-secondary/40 to-background'
  },
  {
    id: 'growth',
    name: 'Growth Plan',
    price: 99,
    description: 'Scale your operations with a team and unlock advanced features.',
    features: [
      'Up to 5 team members',
      'All Solo Plan features included',
      'Integrated SMS messaging',
      'Seamless team collaboration',
      'Embed booking on your existing site',
      'Priority customer support'
    ],
    limitations: [],
    icon: <Zap className="h-5 w-5" />,
    recommended: true,
    gradient: 'from-primary/20 to-primary/5',
    callout: 'MOST POPULAR'
  }
];

export default function PricingGrid() {
  const [hoveredPlan, setHoveredPlan] = useState<PlanId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const orgId = useSearchParams().get('orgId') ?? undefined;

  async function handleSubscribe(planId: PlanId) {
    if (!isLoaded) return;          // wait for Clerk
    if (!userId || !orgId) {
      router.replace('/sign-in');
      return;
    }

    setIsLoading(true);
    setHoveredPlan(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId: orgId, plan: planId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url!;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: 'Subscription Error',
        description: err.message,
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <motion.div
          key={plan.id}
          onMouseEnter={() => setHoveredPlan(plan.id)}
          onMouseLeave={() => setHoveredPlan(null)}
          whileHover={{ y: -5, transition: { type: 'spring', stiffness: 300 } }}
          className={cn(
            'relative rounded-2xl overflow-hidden border group transition-opacity duration-300',
            plan.recommended ? 'border-primary shadow-lg' : 'border-border',
            hoveredPlan && hoveredPlan !== plan.id ? 'opacity-60' : 'opacity-100'
          )}
        >
          {/* gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} -z-10`} />

          {/* “Most Popular” badge */}
          {plan.recommended && (
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-primary-foreground text-xs px-4 py-1 rounded-bl-lg font-semibold">
                {plan.callout}
              </div>
            </div>
          )}

          <div className="p-8">
            {/* header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div
                  className={cn(
                    'inline-flex items-center justify-center p-2 rounded-lg mb-3',
                    plan.recommended
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary/30 text-secondary-foreground'
                  )}
                >
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>
              <div className="text-right text-foreground">
                <div className="text-3xl font-bold">
                  <span className="text-xl">$</span>{plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
              </div>
            </div>

            {/* features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-2 text-foreground"
                >
                  <CheckCircle2
                    className={cn(
                      'h-5 w-5 mt-0.5 flex-shrink-0',
                      plan.recommended ? 'text-primary' : 'text-accent'
                    )}
                  />
                  <span>{f}</span>
                </motion.div>
              ))}

              {plan.limitations.map((lim, i) => (
                <motion.div
                  key={`lim-${i}`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: plan.features.length * 0.05 + i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-destructive/80" />
                  <span>{lim}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className={cn(
                  'w-full gap-2 text-base h-11',
                  plan.recommended
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                    : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md shadow-secondary/20'
                )}
                disabled={isLoading && hoveredPlan === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isLoading && hoveredPlan === plan.id
                  ? 'Redirecting…'
                  : plan.recommended
                  ? 'Get Started Today'
                  : `Choose ${plan.name}`}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
