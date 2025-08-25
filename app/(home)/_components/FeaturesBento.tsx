// FeatureBento – refactored for Tailwind JIT safety, a11y, and lighter bundle
'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Box, FileText, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  spot: string;
  stats: string[];
}

const FEATURES: Feature[] = [
  {
    name: 'Seamless Online Booking',
    description:
      'Let customers instantly book inflatables 24/7, with real‑time availability and automated buffer times. No more back‑and‑forth calls.',
    icon: Calendar,
    href: '#booking',
    spot: 'lg:col-span-2 lg:row-span-1',
    stats: [
      'Booked while you sleep',
      'Eliminate missed calls',
      'Buffer times prevent overlaps',
    ],
  },
  {
    name: 'Inflatable Inventory Insights',
    description:
      'Track popularity, auto‑tag categories, and predict demand to maximise rental revenue.',
    icon: Box,
    href: '#inventory',
    spot: 'lg:col-span-1 lg:row-span-2',
    stats: ['Know your top earners', 'Optimise usage', 'Prevent double bookings'],
  },
  {
    name: 'Lead‑Generating Pop‑ups & Coupons',
    description:
      'Turn visitors into bookings with eye‑catching pop‑ups and coupon flows that auto‑build your marketing list.',
    icon: Box,
    href: '#marketing',
    spot: 'lg:col-span-1 lg:row-span-1',
    stats: ['Automated lead capture', 'Grow your list', 'Track conversions'],
  },
  {
    name: 'Customisable Business Website',
    description:
      'Launch a professional, mobile‑friendly site in minutes. Pick a theme, drop in content, start taking bookings.',
    icon: FileText,
    href: '#website',
    spot: 'lg:col-span-1 lg:row-span-1',
    stats: ['Quick set‑up', 'Pro themes', 'Showcase inventory'],
  },
];

// Accent styles per feature (disciplined pops)
const FEATURE_ACCENT: Record<string, 'teal' | 'coral' | 'indigo' | 'yellow'> = {
  '#booking': 'teal',
  '#inventory': 'coral',
  '#marketing': 'yellow',
  '#website': 'indigo',
};

const ACCENT_BG: Record<'teal' | 'coral' | 'indigo' | 'yellow', string> = {
  teal: 'bg-[rgba(45,212,191,0.12)]',
  coral: 'bg-[rgba(248,113,113,0.12)]',
  indigo: 'bg-[rgba(99,102,241,0.12)]',
  yellow: 'bg-[rgba(250,204,21,0.18)]',
};
const ACCENT_FG: Record<'teal' | 'coral' | 'indigo' | 'yellow', string> = {
  teal: 'text-[#2DD4BF]',
  coral: 'text-[#F87171]',
  indigo: 'text-[#6366F1]',
  yellow: 'text-[#FACC15]',
};

export function FeatureBento() {
  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center md:mb-16">
            <h2 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl text-[#1F2937]" style={{ fontFamily: 'var(--font-heading)' }}>
              The modern tools to book more rentals
            </h2>
            <div className="mx-auto mb-6 h-1.5 w-20 rounded-full bg-[#6366F1]/90" />
            <p className="mx-auto max-w-2xl text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
              InflateMate unifies booking, inventory, marketing & website management—built exclusively for inflatables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 md:gap-6 gap-x-0 md:gap-x-6 relative">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.name} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  feature: Feature;
}

function FeatureCard({ feature }: CardProps) {
  const accentKey = FEATURE_ACCENT[feature.href] ?? 'indigo';

  return (
    <Link
      href={feature.href}
      className={cn('group relative block outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2', feature.spot)}
      tabIndex={0}
      aria-label={feature.name}
    >
      <div className={cn(
        'relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white p-6 sm:p-6 md:p-7',
        'shadow-[0_8px_30px_rgba(2,6,23,0.05)] transition-transform duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5',
        'min-h-[260px] md:min-h-[320px]'
      )}>
        {/* Header icon */}
        <div className="mb-5 flex items-start justify-between">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-full', ACCENT_BG[accentKey])}>
            <feature.icon className={cn('h-5 w-5', ACCENT_FG[accentKey])} aria-hidden />
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <h3 className="mb-2 text-lg font-bold text-[#0B1220]" style={{ fontFamily: 'var(--font-heading)' }}>
            {feature.name}
          </h3>
          <p className="mb-5 text-[15px] leading-relaxed text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
            {feature.description}
          </p>

          <ul className="mt-auto space-y-2">
            {feature.stats.map((s) => (
              <li key={s} className="flex items-center text-sm text-[#64748B]">
                <Check className="mr-2 h-4 w-4 text-[#6366F1]" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-5 flex items-center text-[#6366F1]">
          <span className="mr-1 text-sm font-medium">Explore</span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </div>
      </div>
    </Link>
  );
}

