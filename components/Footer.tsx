"use client";
import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Mail, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/30 bg-[var(--brand-indigo)] text-white pt-16 pb-10 overflow-hidden">
      

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand + blurb */}
          <div className="md:col-span-6 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="InflateMate home">
              <Image
                src="/images/inflatemate-logo.PNG"
                alt="InflateMate logo"
                width={52}
                height={52}
                className="rounded-md ring-1 ring-white/15"
                priority
              />
              <span className="text-3xl font-bold">InflateMate</span>
            </Link>
            
            <p className="text-base leading-relaxed max-w-xl text-white/80">
              Software that makes booking bounce houses effortless for you and magical for your customers.
            </p>

            {/* Contact */}
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/20 bg-white/10">
                <Mail className="h-5 w-5" />
              </div>
              <a href="mailto:hello@inflatemate.co" className="text-lg hover:opacity-90 transition-opacity">
                hello@inflatemate.co
              </a>
            </div>
            </div>

          {/* Primary links */}
          <div className="md:col-span-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
              <Button asChild variant="default" brand="coral" size="lg" className="px-7">
                <Link href="/pricing" className="inline-flex items-center">
                  View Pricing
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="outline" brand="white" size="lg" className="px-7">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            <div className="mt-6 text-sm text-white/80">
              Ready when you are. No setup headaches, just plug in and start taking bookings.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
              <p className="flex items-center">
              © {currentYear} InflateMate • Made with
              <Heart className="h-4 w-4 mx-1 text-[var(--brand-coral)] fill-[var(--brand-coral)]" />
              for rental businesses
              </p>
            <p className="inline-flex items-center gap-1">
              Product of
                <a 
                  href="https://www.freshdigitalsolutions.tech" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                className="hover:opacity-90 transition-opacity inline-flex items-center gap-1"
                >
                  Fresh Digital Solution
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>

          {/* Back to top */}
          <div className="flex justify-center mt-6">
            <a href="#top" aria-label="Back to top" className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors">
              <span>Back to top</span>
              <div className="h-7 w-7 rounded-full border border-white/20 flex items-center justify-center rotate-180 bg-white/10">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
