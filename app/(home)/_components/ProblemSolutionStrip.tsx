'use client'
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  {
    title: "Double‑bookings ruin weekends",
    description: "Overlapping schedules lead to disappointed customers, lost revenue, and weekend stress.",
    icon: Clock,
    color: "from-red-500/90 to-orange-500/90",
    solution: {
      title: "Real-time availability locks prevent overlaps",
      description: "Smart scheduling automatically blocks unavailable times and prevents double-bookings entirely.",
      icon: Shield,
      stats: ["99.8% booking accuracy", "Zero manual calendar checks", "Instant conflict resolution"],
    }
  },
  {
    title: "Endless phone calls and missed messages",
    description: "Hours wasted managing inquiries, client questions, and manual follow-ups.",
    icon: XCircle,
    color: "from-pink-500/90 to-rose-500/90",
    solution: {
      title: "Automated alerts via email & SMS keep clients in the loop",
      description: "Seamless communication with customers through every step of their booking journey.",
      icon: Zap,
      stats: ["82% fewer support calls", "24/7 automated responses", "95% client satisfaction"],
    }
  },
  {
    title: "Clunky legacy tools with hidden fees",
    description: "Complex software with confusing pricing, terrible support, and missing features.",
    icon: XCircle,
    color: "from-orange-500/90 to-amber-500/90",
    solution: {
      title: "Flat monthly pricing—every core feature unlocked",
      description: "One simple price gets you all essential features with no surprise charges or add-ons.",
      icon: CheckCircle, 
      stats: ["Unlimited bookings", "All features included", "Free updates forever"],
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Real problems, solved
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We&apos;ve built solutions to the biggest headaches facing bounce house businesses today.
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

interface Problem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;    
  solution: {
    title: string;
    description: string;
    icon: React.ElementType;
    stats: string[];
  };
}


function ProblemCard({ problem, index, isExpanded, onToggle }: { problem: Problem , index: number, isExpanded: boolean, onToggle: () => void }) {
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
          "bg-gradient-to-r bg-card shadow-lg hover:shadow-xl",
          isExpanded ? "mb-3 border-secondary" : "border-transparent",
          isExpanded ? `border-2 shadow-lg shadow-primary/10` : "border-0"
        )}
        whileHover={{ scale: isExpanded ? 1 : 1.01 }}
        layout
      >
        <div className="rounded-xl overflow-hidden bg-card">
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
            className="ml-16 relative z-10"
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
                        transition={{ delay: 0.2 + (i * 0.1) }}
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
