"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Calendar,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white pb-16 pt-16 md:pb-24 md:pt-24 mt-6"
    >
             {/* Subtle background decoration */}
       <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,rgba(99,102,241,0.1),transparent)] opacity-20" />
      
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 md:gap-16 lg:flex-row">
          {/* TEXT */}
          <div className="w-full lg:w-1/2">
            <div className="text-center lg:text-left">
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Run your rental business on{" "}
                                 <span className="text-[var(--brand-indigo)]">autopilot</span>
              </h1>

              <p
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0"
                style={{ fontFamily: "var(--font-body)" }}
              >
                InflateMate turns your bounce house and party rental business into a 24/7 booking machine. Get paid upfront, prevent double-bookings, and let customers book instantly online.
              </p>
            </div>

            {/* Key benefits */}
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Calendar,
                  title: "24/7 Online Bookings",
                  description: "Customers book instantly without phone calls or back-and-forth texts"
                },
                {
                  icon: Package,
                  title: "Smart Inventory Tracking",
                  description: "Never double-book equipment or wonder what's available when"
                },
                {
                  icon: CreditCard,
                  title: "Automatic Payments",
                  description: "Get paid upfront with deposits and automated invoicing"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 mt-0.5">
                    <benefit.icon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild variant="default" brand="indigo" size="lg">
                <Link href="/sign-up" prefetch>
                  Start free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" brand="coral" size="lg">
                <Link href="/demo" prefetch>
                  <Play className="h-4 w-4" />
                  See how it works
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* VISUAL */}
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto max-w-[600px]">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-50">
                  <Image
                    src="/images/hero-dashboard.png"
                    alt="InflateMate dashboard showing rental bookings and inventory management"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 600px"
                  />
                </div>

                {/* Simple floating stats - no animation */}
                <div className="absolute -right-3 top-6 hidden rounded-lg border border-slate-200 bg-white p-3 shadow-lg md:block">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="font-medium text-slate-900">Live booking</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Bounce house - $150</p>
                </div>

                <div className="absolute -left-3 bottom-6 hidden rounded-lg border border-slate-200 bg-white p-3 shadow-lg md:block">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-slate-900">Next delivery</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">Tomorrow at 10 AM</p>
                </div>
              </div>

              {/* Subtle background glow */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-indigo-100 to-teal-100 opacity-20 blur-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom section - simple value props */}
        <div className="mt-16 border-t border-slate-200 pt-12">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Built for Rentals</h3>
              <p className="mt-2 text-sm text-slate-600">Designed specifically for bounce house and party rental businesses</p>
            </div>
            
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 mb-4">
                <Clock className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Save Time</h3>
              <p className="mt-2 text-sm text-slate-600">Automate bookings, contracts, and payments so you can focus on growth</p>
            </div>
            
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Easy Setup</h3>
              <p className="mt-2 text-sm text-slate-600">Get started in minutes with our simple setup wizard</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}