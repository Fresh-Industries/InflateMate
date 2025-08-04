"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BarChart2, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: mounted && !prefersReducedMotion ? 16 : 0 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const fadeUpDelayed = (delay: number) => ({
    initial: { opacity: 0, y: mounted && !prefersReducedMotion ? 16 : 0 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-16 pt-16 md:pb-24 md:pt-20 lg:pb-28 lg:pt-24"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/5 to-transparent" />
        <div
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full
                     bg-primary/10 blur-xl opacity-70 mix-blend-multiply
                     animate-blob"
          aria-hidden="true"
        />
        <div
          className="absolute right-[-5rem] top-1/2 h-80 w-80 rounded-full
                     bg-accent/10 blur-xl opacity-70 mix-blend-multiply
                     animate-blob animation-delay-2000"
          aria-hidden="true"
        />
        <div
          className="absolute left-20 -bottom-40 h-80 w-80 rounded-full
                     bg-accent/10 blur-xl opacity-70 mix-blend-multiply
                     animate-blob animation-delay-4000"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-grid-pattern opacity-5"
          aria-hidden="true"
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Text Column */}
          <div className="w-full space-y-6 text-center lg:w-1/2 lg:text-left">
            <motion.div
              {...fadeUp}
              className="mb-1 flex items-center justify-center gap-2 lg:justify-start"
            >
              <Badge className="rounded-full border-primary bg-muted/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                Built by a Bounce House Owner
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-700"
              >
                Trusted by Rentals
              </Badge>
            </motion.div>

            <motion.h1
              id="hero-heading"
              {...fadeUpDelayed(0.1)}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Run Your Bounce House{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Business on Autopilot
              </span>
            </motion.h1>

            <motion.p
              {...fadeUpDelayed(0.2)}
              className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0"
            >
              InflateMate is the modern, all-in-one platform to manage bookings,
              schedules, payments, and routing—saving hours each week and boosting
              your revenue.
            </motion.p>

            {/* Primary actions */}
            <motion.div
              {...fadeUpDelayed(0.3)}
              className="pt-4"
              role="group"
              aria-label="Primary actions"
            >
              <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Button
                  variant="primary-gradient"
                  size="lg"
                  className="group rounded-full px-6 py-6 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  asChild
                >
                  <Link
                    href="/sign-up"
                    aria-label="Get started with InflateMate"
                    prefetch
                  >
                    <span className="flex items-center">
                      Get Started
                      <span
                        className="ml-2 flex h-8 w-8 items-center justify-center rounded-full
                                   bg-white/20 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        <ArrowRight className="h-4 w-4 text-white" />
                      </span>
                    </span>
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="group rounded-full border-2 border-blue-600 bg-transparent px-6 py-6 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  asChild
                >
                  <Link href="/demo" aria-label="Watch the product demo" prefetch>
                    <span className="flex items-center">
                      <span
                        className="mr-2 flex h-8 w-8 items-center justify-center rounded-full
                                   bg-accent/10"
                        aria-hidden="true"
                      >
                        <Play className="h-4 w-4 text-accent" />
                      </span>
                      Watch Demo
                    </span>
                  </Link>
                </Button>
              </div>

              {/* Secondary reassurance */}
              <p className="mt-3 text-sm text-muted-foreground">
                Free 14-day trial. No credit card required.
              </p>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              {...fadeUpDelayed(0.35)}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start"
              aria-label="Trusted by"
            >
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Trusted by operators across the U.S.
              </span>
              <div className="flex items-center gap-4 opacity-80">
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="hidden h-6 w-20 rounded bg-gray-200 dark:bg-gray-800 sm:block" />
              </div>
            </motion.div>
          </div>

          {/* Visual Column */}
          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{
              opacity: 0,
              y: mounted && !prefersReducedMotion ? 16 : 0,
              scale: mounted && !prefersReducedMotion ? 0.98 : 1,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent to-primary opacity-30 blur-lg"
              aria-hidden="true"
            />
            <div
              className="relative mx-auto max-w-[580px] transform rounded-3xl border border-white/10 bg-card/95 p-4 shadow-2xl
                         backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 md:p-6"
            >
              {/* Skeleton shimmer while image loads */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 animate-pulse rounded-lg bg-gradient-to-r from-gray-200/40 via-gray-100/60 to-gray-200/40 dark:from-gray-800/40 dark:via-gray-700/60 dark:to-gray-800/40" />
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  <Image
                    src="/images/hero-dashboard.png"
                    alt="InflateMate dashboard showing bookings calendar, revenue, and tasks"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 580px, 580px"
                  />
                </div>
              </div>

              {/* Floating KPI Cards */}
              <div
                className="absolute right-4 top-4 z-10 transform rounded-xl border border-muted bg-card/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-2">
                    <BarChart2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Monthly Revenue
                    </p>
                    <p className="text-base font-bold text-green-600">$12,580</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute left-4 bottom-4 z-10 transform rounded-xl border border-muted bg-card/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2">
                    <CalendarCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">This Weekend</p>
                    <p className="text-base font-bold text-blue-600">8 Bookings</p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-2 right-1/4 z-10 hidden rounded-xl border border-muted bg-card p-3 shadow-lg md:block"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <span className="block h-2 w-2 rounded-full bg-green-500" />
                  <p className="whitespace-nowrap text-xs font-medium text-foreground">
                    Payment received: $350
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Below-the-fold prompt */}
        <motion.div
          {...fadeUpDelayed(0.45)}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground"
        >
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-700">
            Faster scheduling
          </span>
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-green-700">
            Fewer no-shows
          </span>
          <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-700">
            Integrated payments
          </span>
        </motion.div>
      </div>
    </section>
  );
}