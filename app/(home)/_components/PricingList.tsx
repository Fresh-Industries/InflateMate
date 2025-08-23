// updated pricing grid to reflect Starter and Growth plans as discussed
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
import { cn } from '@/lib/utils';

// --------------------
// Types & Data Models
// --------------------

type PlanId = 'starter' | 'growth';

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

// --------------------
// Plan Configuration
// --------------------

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 50,
    description: 'Everything you need to run a single‑operator rental business.',
    features: [
      '1 admin seat',
      'Branded booking website / subdomain',
      'Unlimited items & bookings',
      'Real‑time conflict checks',
      'Stripe payments & digital waivers',
      'Embedded booking components',
      'Basic CRM & revenue dashboard'
    ],
    limitations: [
      
    ],
    icon: <Users className="h-5 w-5" />,
    recommended: false,
    gradient: 'from-secondary/40 to-background'
  },
  {
    id: 'growth',
    name: 'Growth Plan (Founding Members)',
    price: 100,
    description: 'Invite your team and get first access to every new feature we ship.',
    features: [
      'Up to 3 user seats',
      'All Starter features',
      'Priority chat support',
      '500 outbound SMS/mo included when SMS launches',
      'Early access to new modules & roadmap voting',
      'Coupons & lead‑capture pop‑ups'
    ],
    limitations: [],
    icon: <Zap className="h-5 w-5" />,
    recommended: true,
    gradient: 'from-primary/20 to-primary/5',
    callout: 'FOUNDING MEMBERS'
  }
];

// --------------------
// Component
// --------------------

export default function PricingGrid() {
  const [hoveredPlan, setHoveredPlan] = useState<PlanId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const orgId = useSearchParams().get('orgId') ?? undefined;

  async function handleSubscribe(planId: PlanId) {
    if (!isLoaded) return; // wait for Clerk
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onMouseEnter={() => setHoveredPlan(plan.id)}
          onMouseLeave={() => setHoveredPlan(null)}
          className={cn(
            'group relative overflow-hidden rounded-2xl border transition-all duration-200',
            plan.recommended ? 'border-[#6366F1] shadow-[0_20px_60px_rgba(2,6,23,0.06)]' : 'border-black/10 shadow-[0_12px_30px_rgba(2,6,23,0.04)]',
            hoveredPlan && hoveredPlan !== plan.id ? 'opacity-70' : 'opacity-100',
            'hover:-translate-y-0.5'
          )}
        >
          {/* subtle tinted backdrop per plan */}
          <div
            className={cn(
              'absolute inset-0 -z-10',
              plan.recommended ? 'bg-[rgba(99,102,241,0.04)]' : 'bg-[rgba(45,212,191,0.03)]'
            )}
          />

          {/* badge */}
          {plan.recommended && (
            <div className="absolute right-3 top-3">
              <div className="rounded-full bg-[#6366F1] px-3 py-1 text-xs font-semibold text-white">
                {plan.callout}
              </div>
            </div>
          )}

          <div className="p-8">
            {/* header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div
                  className={cn(
                    'mb-3 inline-flex items-center justify-center rounded-lg p-2',
                    plan.recommended
                      ? 'bg-[rgba(99,102,241,0.12)] text-[#6366F1]'
                      : 'bg-[rgba(45,212,191,0.12)] text-[#0F766E]'
                  )}
                >
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0B1220]" style={{ fontFamily: 'var(--font-heading)' }}>{plan.name}</h3>
                <p className="mt-1 text-sm text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>{plan.description}</p>
              </div>
              <div className="text-right text-[#0B1220]">
                <div className="text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="text-xl" style={{ fontFamily: 'var(--font-body)' }}>$</span>
                  {plan.price}
                  <span className="text-sm font-normal text-[#64748B]">/mo</span>
                </div>
              </div>
            </div>

            {/* features */}
            <div className="mb-8 space-y-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-[#0B1220]">
                  <CheckCircle2
                    className={cn(
                      'mt-0.5 h-5 w-5 flex-shrink-0',
                      plan.recommended ? 'text-[#6366F1]' : 'text-[#2DD4BF]'
                    )}
                  />
                  <span>{f}</span>
                </div>
              ))}

              {plan.limitations.map((lim, i) => (
                <div key={`lim-${i}`} className="flex items-start gap-2 text-[#64748B]">
                  <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-destructive/80" />
                  <span>{lim}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Button
                size="lg"
                className="w-full gap-2 text-base"
                variant={plan.recommended ? 'default' : 'outline'}
                brand={plan.recommended ? 'indigo' : 'teal'}
                disabled={isLoading && hoveredPlan === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isLoading && hoveredPlan === plan.id
                  ? 'Redirecting…'
                  : plan.recommended
                  ? 'Get Started Today'
                  : `Choose ${plan.name}`}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
