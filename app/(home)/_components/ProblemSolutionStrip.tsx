'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Re-defining the interfaces for clarity
interface Solution {
  title: string;
  description: string;
  icon: React.ElementType;
  stats: string[];
}

interface Problem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  solution: Solution;
}


const problems: Problem[] = [ // Explicitly type the array
  {
    title: "Double‑bookings ruin weekends",
    description: "Overlapping schedules lead to disappointed customers, lost revenue, and weekend stress.",
    icon: Clock,
    color: "from-red-500/90 to-orange-500/90",
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
    color: "from-pink-500/90 to-rose-500/90",
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
    color: "from-orange-500/90 to-amber-500/90",
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
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          {/* Updated Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Tired of Bounce House Business <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Headaches</span>?
          </h2>
          {/* Updated Subtitle */}
          <p className="text-muted-foreground text-lg">
            InflateMate solves the biggest pains of managing your rental operation, so you can focus on what matters – happy customers and growing your business.
          </p>
        </motion.div>

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
  const { title, description, icon: Icon, color, solution } = problem;
  const SolutionIcon = solution.icon;

  // Staggered entrance animation for the problems
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* "Journey line" connecting problems to solutions */}
      <div className={cn(
        "absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b",
        isExpanded ? "opacity-100" : "opacity-0",
        color
      )} />

      {/* Problem Card */}
      <motion.div
        onClick={onToggle}
        className={cn(
          "relative z-10 rounded-2xl p-1 cursor-pointer transition-all duration-500",
          "bg-gradient-to-r bg-card shadow-lg hover:shadow-xl", // bg-gradient-to-r here seems unused as bg-card overrides it?
          isExpanded ? "mb-3 border-secondary" : "border-transparent",
          isExpanded ? `border-2 shadow-lg shadow-primary/10` : "border-0"
        )}
        whileHover={{ scale: isExpanded ? 1 : 1.01 }}
        layout
      >
        <div className="rounded-xl overflow-hidden bg-card"> {/* Inner card content area */}
          <div className="flex items-start gap-4 p-6">
            {/* Problem icon with gradient background */}
            <div className={cn(
              "flex-shrink-0 p-3 rounded-xl bg-gradient-to-br mt-1",
              color
            )}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="text-muted-foreground mt-1">{description}</p>
                </div>

                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 mt-1"
                >
                  <ArrowRight className="w-5 h-5 text-primary" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Solution Card - Animated expansion */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="ml-16 relative z-10" // Offset to align with the journey line
          >
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-secondary">
              <div className="flex items-start gap-4">
                {/* Solution icon with gradient background */}
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-primary to-accent mt-1">
                  <SolutionIcon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 mb-4">
                    {solution.description}
                  </p>

                  {/* Key stats/benefits with animations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    {solution.stats.map((stat: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }} // Stagger animation
                        className="flex items-center gap-2 bg-card p-3 rounded-lg border border-border"
                      >
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-medium text-foreground">{stat}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
