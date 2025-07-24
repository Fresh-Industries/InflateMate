// FeatureBento – refactored for Tailwind JIT safety, a11y, and lighter bundle
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Box,
  FileText,
  ArrowRight,
  Check,
  Clock,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const COLOR_KEY = {
  'from-indigo-500 to-blue-500': 'indigo',
  'from-emerald-500 to-teal-500': 'emerald',
  'from-pink-500 to-purple-500': 'pink',
  'from-blue-500 to-teal-500': 'blue',
} as const;

type Gradient = keyof typeof COLOR_KEY;

type Shape = 'circle' | 'hexagon' | 'diamond' | 'waves';

interface Feature {
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: Gradient;
  spot: string;
  shape: Shape;
  stats: string[];
  accent?: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    name: 'Seamless Online Booking',
    description:
      'Let customers instantly book inflatables 24/7, with real‑time availability and automated buffer times. No more back‑and‑forth calls.',
    icon: Calendar,
    href: '#booking',
    color: 'from-indigo-500 to-blue-500',
    spot: 'lg:col-span-2 lg:row-span-1',
    shape: 'circle',
    stats: [
      'Booked while you sleep',
      'Eliminate missed calls',
      'Buffer times prevent overlaps',
    ],
    accent: <Clock className="w-5 h-5 text-indigo-200" aria-hidden />,
  },
  {
    name: 'Inflatable Inventory Insights',
    description:
      'Track popularity, auto‑tag categories, and predict demand to maximise rental revenue.',
    icon: Box,
    href: '#inventory',
    color: 'from-emerald-500 to-teal-500',
    spot: 'lg:col-span-1 lg:row-span-2',
    shape: 'hexagon',
    stats: ['Know your top earners', 'Optimise usage', 'Prevent double bookings'],
    accent: (
      <div
        className="absolute right-8 top-24 w-20 h-20 opacity-10"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500 w-full h-full">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Lead‑Generating Pop‑ups & Coupons',
    description:
      'Turn visitors into bookings with eye‑catching pop‑ups and coupon flows that auto‑build your marketing list.',
    icon: Box,
    href: '#marketing',
    color: 'from-pink-500 to-purple-500',
    spot: 'lg:col-span-1 lg:row-span-1',
    shape: 'diamond',
    stats: ['Automated lead capture', 'Grow your list', 'Track conversions'],
  },
  {
    name: 'Customisable Business Website',
    description:
      'Launch a professional, mobile‑friendly site in minutes. Pick a theme, drop in content, start taking bookings.',
    icon: FileText,
    href: '#website',
    color: 'from-blue-500 to-teal-500',
    spot: 'lg:col-span-1 lg:row-span-1',
    shape: 'waves',
    stats: ['Quick set‑up', 'Pro themes', 'Showcase inventory'],
  },
];

const BORDER_MAP: Record<string, string> = {
  indigo: 'border-indigo-500/20',
  emerald: 'border-emerald-500/20',
  pink: 'border-pink-500/20',
  blue: 'border-blue-500/20',
};

const TEXT_MAP: Record<string, string> = {
  indigo: 'text-indigo-500/20',
  emerald: 'text-emerald-500/20',
  pink: 'text-pink-500/20',
  blue: 'text-blue-500/20',
};

export function FeatureBento() {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-500/5 rounded-full mix-blend-multiply blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-teal-500/5 rounded-full mix-blend-multiply blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              The Modern Tools to <span className="text-primary">Book More Bounce Houses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
  const colourKey = COLOR_KEY[feature.color];

  return (
    <Link
      href={feature.href}
      className={cn('group relative block', feature.spot)}
      tabIndex={0}
      aria-label={feature.name}
    >
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-3xl p-4 sm:p-6 md:p-8 transition-all duration-500',
          'bg-gradient-to-br bg-clip-padding border border-transparent backdrop-blur-sm bg-card/80',
          'hover:shadow-lg hover:border-secondary/20 hover:-translate-y-1',
          'min-h-[260px] md:min-h-[320px]'
        )}
      >
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
          <div className={cn('absolute inset-0 bg-gradient-to-br', feature.color)} />
        </div>

        {/* Decorative shapes */}
        <ShapeDecor shape={feature.shape} colourKey={colourKey} />

        {/* Header icon & optional stars */}
        <div className="relative z-10 mb-6 flex justify-between items-start">
          <div className={cn('p-3 rounded-xl shadow-lg bg-gradient-to-br', feature.color)}>
            <feature.icon className="w-6 h-6 text-white" aria-hidden />
          </div>
          <div className="hidden sm:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {feature.name}
          </h3>
          <p className="text-muted-foreground mb-6">{feature.description}</p>

          <ul className="space-y-2 mt-auto">
            {feature.stats.map((s) => (
              <li
                key={s}
                className="flex items-center text-sm text-muted-foreground"
              >
                <Check className="w-4 h-4 mr-2 text-primary" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Accent element */}
        <div className="absolute inset-0 pointer-events-none">{feature.accent}</div>

        {/* CTA */}
        <div className="absolute bottom-6 right-6 group-hover:opacity-100 opacity-0 transition-opacity z-20">
          <div className="flex items-center text-primary font-medium">
            <span className="mr-1">Explore</span>
            <ArrowRight className="w-4 h-4" aria-hidden />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ShapeProps {
  shape: Shape;
  colourKey: string;
}

function ShapeDecor({ shape, colourKey }: ShapeProps) {
  const borderClass = BORDER_MAP[colourKey];
  const textClass = TEXT_MAP[colourKey];

  switch (shape) {
    case 'circle':
      return (
        <div
          className={cn('absolute -top-10 md:-top-20 -right-10 md:-right-20 w-20 h-20 md:w-40 md:h-40 rounded-full opacity-20', borderClass)}
          aria-hidden
        />
      );
    case 'hexagon':
      return (
        <svg className={cn('absolute -bottom-8 md:-bottom-16 -left-8 md:-left-16 w-16 h-16 md:w-32 md:h-32 opacity-20', textClass)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.2 3.4 12 1 6.8 3.4 2 12l4.8 8.6L12 23l5.2-2.4L22 12 17.2 3.4z" />
        </svg>
      );
    case 'diamond':
      return (
        <div
          className={cn('absolute -bottom-6 md:-bottom-12 -right-6 md:-right-12 w-12 h-12 md:w-24 md:h-24 opacity-10 rotate-45 border-2 border-dashed', borderClass)}
          aria-hidden
        />
      );
    case 'waves':
      return (
        <svg className={cn('absolute -top-5 md:-top-10 -right-5 md:-right-10 w-10 h-10 md:w-20 md:h-20 opacity-20', textClass)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8.2 19H5v-2h3.2c1.3 0 2.4-.8 2.8-2 .4-1.2-.1-2.6-1.3-3.2-.4-.3-.8-.5-1.2-.7-1.1-.8-2.1-1.6-2.5-2.8S5.8 5 7 4.4c.5-.2 1-.4 1.5-.4H12v2H8.5c-.8 0-1.5.5-1.8 1.2-.3.7 0 1.5.6 1.9.5.4 1.1.7 1.6 1 .9.6 1.9 1.3 2.5 2.2 1.2 1.5 1.5 3.6.8 5.4-.7 1.8-2.4 3-4.3 3.3-.3 0-.6.1-.9.1M18 18.5c-.7 0-1.4-.1-2.1-.3-1.4-.4-2.6-1.4-3.3-2.7-.7-1.3-.9-2.8-.5-4.2.4-1.4 1.4-2.6 2.7-3.3 2.6-1.4 5.9-.5 7.3 2.1.5.8.7 1.7.7 2.7h-2c0-.7-.2-1.3-.4-1.9-.8-1.5-2.7-2-4.2-1.2-.8.4-1.3 1.1-1.5 1.9-.2.8-.1 1.7.3 2.4.4.8 1.1 1.3 1.9 1.5.8.2 1.7.1 2.4-.3.5-.3 1-.8 1.2-1.3h2c-.4 1.1-1.1 2-2.1 2.7-.8.5-1.5.7-2.4.9z" />
        </svg>
      );
  }
}
