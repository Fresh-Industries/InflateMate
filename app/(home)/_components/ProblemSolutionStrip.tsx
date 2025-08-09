'use client'
import React, { useState } from "react";
import { XCircle, CheckCircle, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-defining the interfaces for clarity
interface Solution {
  title: string;
  description: string;
  icon: React.ElementType;
  stats: string[];
}

type Accent = 'teal' | 'coral' | 'yellow';

interface Problem {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: Accent;
  solution: Solution;
}


const problems: Problem[] = [ // Explicitly type the array
  {
    title: "Double‑bookings ruin weekends",
    description: "Overlapping schedules lead to disappointed customers, lost revenue, and weekend stress.",
    icon: Clock,
    accent: 'teal',
    solution: {
      title: "Real-time availability locks prevent overlaps",
      description: "Smart scheduling automatically blocks out **setup and takedown buffer times** and prevents **double-bookings of your units** entirely.", // Refined
      icon: Shield,
      stats: ["Booking conflicts eliminated", "Stop manually checking calendars", "Your calendar is always accurate"], // Refined
    }
  },
  {
    title: "Endless phone calls and manual messages", // Slight tweak to title
    description: "Hours wasted on phone tag, answering repetitive questions, and manual follow-ups for **bookings, payments, and waivers**.", // Refined
    icon: XCircle,
    accent: 'coral',
    solution: {
      title: "Automated communication keeps clients informed", // Slight tweak to solution title
      description: "Automated **booking confirmations, payment reminders, and delivery/pickup notifications** sent via email and (optional) SMS keep customers informed without lifting a finger.", // Refined
      icon: Zap,
      stats: ["Drastically reduce phone tag", "Customers get instant updates", "Streamline client communication"], // Refined
    }
  },
  {
    title: "Clunky legacy software with hidden fees", // Slight tweak to title
    description: "Complex software with confusing pricing, terrible support, and missing features.", // Kept
    icon: XCircle,
    accent: 'yellow',
    solution: {
      title: "Flat monthly pricing—every core feature unlocked", // Kept
      description: "One simple price gets you all essential features with no surprise charges or add-ons.", // Kept
      icon: CheckCircle,
      stats: ["Unlimited bookings", "All features included", "Free updates forever"], // Kept
    }
  },
];

export default function ProblemSolutionStrip() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section title */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {/* Updated Heading */}
          <h2 className="mb-3 text-3xl font-bold text-[#1F2937] md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Tired of bounce-house business headaches?
          </h2>
          {/* Updated Subtitle */}
          <p className="text-lg text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
            InflateMate solves the biggest pains of managing your rental operation, so you can focus on what matters — happy customers and growing your business.
          </p>
        </div>

        {/* Problem/Solution cards */}
        <div className="max-w-4xl mx-auto space-y-6">
          {problems.map((problem, idx) => (
            <ProblemCard
              key={idx}
              problem={problem}
              index={idx}
              isExpanded={expandedIndex === idx}
              onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Keeping the ProblemCard component function the same as provided,
// as the changes are only in the data structure passed to it.
// Ensure the ProblemCard component uses the Problem and Solution interfaces defined above.
// (Looks like it already does, which is great!)
interface ProblemCardProps { // Used to type ProblemCard component props
    problem: Problem;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}

function ProblemCard({ problem, index, isExpanded, onToggle }: ProblemCardProps) {
  const { title, description, icon: Icon, accent, solution } = problem;
  const SolutionIcon = solution.icon;

  // Staggered entrance animation for the problems
  return (
    <div className="relative">
      {/* "Journey line" connecting problems to solutions */}
      <div className={cn(
        "absolute left-8 top-20 bottom-0 w-0.5 transition-opacity",
        isExpanded ? "opacity-100" : "opacity-0",
        accent === 'teal' && 'bg-[#2DD4BF]',
        accent === 'coral' && 'bg-[#F87171]',
        accent === 'yellow' && 'bg-[#FACC15]'
      )} />

      {/* Problem Card */}
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`solution-${index}`}
        onClick={onToggle}
        className={cn(
          "relative z-10 w-full cursor-pointer rounded-2xl border border-black/10 bg-white p-6 text-left transition-colors",
          "hover:border-black/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6366F1]/25"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn("mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl", 
            accent === 'teal' && 'bg-[rgba(45,212,191,0.12)]',
            accent === 'coral' && 'bg-[rgba(248,113,113,0.12)]',
            accent === 'yellow' && 'bg-[rgba(250,204,21,0.18)]')
          }>
            <Icon className={cn("h-5 w-5",
              accent === 'teal' && 'text-[#2DD4BF]',
              accent === 'coral' && 'text-[#F87171]',
              accent === 'yellow' && 'text-[#92400E]')
            } />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#0B1220]" style={{ fontFamily: 'var(--font-heading)' }}>{title}</h3>
                <p className="mt-1 text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>{description}</p>
              </div>
              <div className={cn("mt-1 flex-shrink-0 transition-transform", isExpanded && "rotate-90")}> 
                <ArrowRight className="h-5 w-5 text-[#6366F1]" />
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* Solution Card - Animated expansion */}
      <div
        id={`solution-${index}`}
        className={cn(
          "relative z-10 ml-16 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out",
          isExpanded ? "max-h-[500px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        )}
      >
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(99,102,241,0.12)]">
              <SolutionIcon className="h-5 w-5 text-[#6366F1]" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#0B1220]" style={{ fontFamily: 'var(--font-heading)' }}>
                {solution.title}
              </h3>
              <p className="mb-4 mt-1 text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
                {solution.description}
              </p>

              <ul className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
                {solution.stats.map((stat: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg border border-black/10 bg-white p-3 text-sm text-[#334155]">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#6366F1]" />
                    <span className="font-medium">{stat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
