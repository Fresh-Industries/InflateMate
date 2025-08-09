"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  BarChart2,
  CalendarCheck,
  Calendar,
  Package,
  CreditCard,
  FileCheck2,
  Code,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-black/[0.06] bg-white pb-14 pt-14 md:pb-20 md:pt-20"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* TEXT */}
          <div className="w-full lg:w-1/2">
            <div className="mb-3 flex items-center justify-center lg:justify-start">
            </div>

            <h1
              id="hero-heading"
              className="text-center text-4xl font-extrabold tracking-tight text-[#1F2937] sm:text-5xl md:text-6xl lg:text-left"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Party rental software that books, tracks, and gets you paid.
            </h1>

            {/* Subheadline + features */}
            <div className="mx-auto mt-4 max-w-xl space-y-4 lg:mx-0">
              <p
                className="text-lg leading-relaxed text-[#475569] sm:text-xl"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Book smarter with real-time availability and an easy checkout. Manage inventory, customers, Stripe payments, DocuSeal waivers, and embeddable components — all in one dashboard with your own subdomain.
              </p>

              <ul className="grid list-none grid-cols-1 gap-2 text-[15px] text-[#334155] sm:grid-cols-2">
                <li>
                  <a href="#booking" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(45,212,191,0.12)]">
                      <Calendar className="h-4 w-4 text-[#2DD4BF]" />
                    </span>
                    Online booking (real-time)
                  </a>
                </li>
                <li>
                  <a href="#inventory" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(248,113,113,0.12)]">
                      <Package className="h-4 w-4 text-[#F87171]" />
                    </span>
                    Inventory management
                  </a>
                </li>
                <li>
                  <a href="#payments" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(99,102,241,0.12)]">
                      <CreditCard className="h-4 w-4 text-[#6366F1]" />
                    </span>
                    Stripe payments & balances
                  </a>
                </li>
                <li>
                  <a href="#waivers" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(250,204,21,0.18)]">
                      <FileCheck2 className="h-4 w-4 text-[#FACC15]" />
                    </span>
                    DocuSeal waivers (auto-sent & stored)
                  </a>
                </li>
                <li>
                  <a href="#embeds" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(45,212,191,0.12)]">
                      <Code className="h-4 w-4 text-[#2DD4BF]" />
                    </span>
                    Embeddable forms & template site
                  </a>
                </li>
                <li>
                  <a href="#dashboard" className="group inline-flex items-center gap-2 rounded-md px-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1]/40 focus-visible:ring-offset-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(99,102,241,0.12)]">
                      <LayoutDashboard className="h-4 w-4 text-[#6366F1]" />
                    </span>
                    Calendar dashboard
                  </a>
                </li>
              </ul>

        
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="group rounded-full bg-[#6366F1] px-7 py-6 text-base font-semibold text-white shadow-[0_6px_20px_rgba(99,102,241,0.18)] hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#4F46E5] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6366F1]/30"
                asChild
              >
                <Link href="/sign-up" aria-label="Get started" prefetch>
                  <span className="flex items-center">
                    Get started
                    <span className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-1">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </span>
                  </span>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border border-black/10 bg-white px-7 py-6 text-base font-semibold text-[#0B1220] shadow-none transition-colors hover:border-[#2DD4BF] hover:bg-[rgba(45,212,191,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6366F1]/25"
                asChild
              >
                <Link href="/demo" aria-label="See how it works" prefetch>
                  <span className="flex items-center">
                    <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(45,212,191,0.12)]">
                      <Play className="h-4 w-4 text-[#2DD4BF]" />
                    </span>
                    See how it works
                  </span>
                </Link>
              </Button>
            </div>

            <p className="mt-2 text-sm text-[#64748B]">Built with input from rental business owners.</p>
          </div>

          {/* VISUAL */}
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto max-w-[600px]">
              {/* Subtle background accent behind card */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-52 w-52 rounded-3xl bg-gradient-to-br from-[#6366F1]/[0.06] via-transparent to-transparent" aria-hidden="true" />
              <div className="rounded-3xl border border-black/[0.06] bg-white p-3 shadow-[0_24px_70px_rgba(2,6,23,0.07)] ring-1 ring-black/[0.05]">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl ring-1 ring-black/[0.04]">
                  <Image
                    src="/images/hero-dashboard.png"
                    alt="InflateMate dashboard showing bookings, payments, and inventory"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 600px"
                  />
                </div>

                {/* Floating KPI cards – subtle */}
                <div className="pointer-events-none absolute right-4 top-4 hidden rounded-xl border border-black/[0.06] bg-white/95 p-3 shadow-sm backdrop-blur-sm md:block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#6366F1] p-2">
                      <BarChart2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#334155]">Monthly Revenue</p>
                      <p className="text-base font-bold text-[#0B1220]">$12,580</p>
                    </div>
                  </div>
                </div>

                <div className="pointer-events-none absolute left-4 bottom-4 hidden rounded-xl border border-black/[0.06] bg-white/95 p-3 shadow-sm backdrop-blur-sm md:block">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#2DD4BF] p-2">
                      <CalendarCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#334155]">This Weekend</p>
                      <p className="text-base font-bold text-[#0B1220]">8 Bookings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* quiet frame, not a glow */}
              <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] ring-1 ring-black/[0.04]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
