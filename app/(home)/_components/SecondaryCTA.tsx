'use client'
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";

export default function SecondaryCTAStrip() {
  return (
    <section className="relative overflow-hidden py-16 bg-white/80">
      {/* Subtle background only */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      {/* Faint corner accent */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-3xl bg-[#6366F1]/[0.06]" aria-hidden />

      <div className="container relative mx-auto max-w-5xl px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="mb-3 text-2xl font-bold text-[#1F2937] md:text-3xl" style={{ fontFamily: 'var(--font-heading)' }}>
              Ready to transform your bounce house rental business?
            </h2>
            <p className="text-[#475569]" style={{ fontFamily: 'var(--font-body)' }}>
              Get started with InflateMate today and streamline your operations.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
            <Button
              size="lg"
              className="h-12 rounded-full bg-[#6366F1] px-6 font-medium text-white shadow-[0_10px_30px_rgba(99,102,241,0.18)] transition-colors hover:bg-[#5458E3] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6366F1]/30"
              asChild
            >
              <Link href="/sign-up">
                Get Started {/* Updated button text */}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border border-black/10 bg-white px-6 text-[#0B1220] transition-colors hover:border-[#2DD4BF] hover:bg-[rgba(45,212,191,0.08)]"
              asChild
            >
              <Link href="/demo">
                <Play className="h-4 w-4 text-[#2DD4BF]" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 border-t border-black/10 pt-6 text-sm text-[#475569] md:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(99,102,241,0.12)]">
              <CheckCircle className="h-4 w-4 text-[#6366F1]" />
            </span>
            <span>Monthly billing, cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(250,204,21,0.18)]">
              <CheckCircle className="h-4 w-4 text-[#FACC15]" />
            </span>
            <span>Secure online payments</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(45,212,191,0.12)]">
              <CheckCircle className="h-4 w-4 text-[#2DD4BF]" />
            </span>
            <span>Dedicated support team</span>
          </div>
        </div>
      </div>
    </section>
  );
}
