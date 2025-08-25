"use client";
import React from "react";
import Link from "next/link";
import { Heart, ArrowRight, Mail, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block" aria-label="InflateMate home">
              <Image
                src="/images/inflatemate-Navbar.PNG"
                alt="InflateMate logo"
                width={900}
                height={300}
                priority
                className="h-28 w-auto"
              />
            </Link>
            
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              The all-in-one platform that turns your bounce house rental business 
              into a 24/7 booking machine.
            </p>

            {/* Contact */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <a 
                href="mailto:hello@inflatemate.co" 
                className="text-slate-700 hover:text-indigo-600 transition-colors font-medium"
              >
                hello@inflatemate.co
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Ready to grow your business?
              </h3>
              <p className="text-slate-600">
                Join the waitlist and be among the first to transform your rental business.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="default" brand="indigo" size="lg">
                <Link href="/waitlist" className="inline-flex items-center">
                  Join Waitlist
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>

              <Button asChild variant="outline" brand="slate" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <Link 
              href="/pricing" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p className="flex items-center gap-1">
              © {currentYear} InflateMate • Made with
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              for rental businesses
            </p>
            
            <p className="flex items-center gap-1">
              Product of
              <a 
                href="https://www.freshdigitalsolutions.tech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-slate-700 transition-colors inline-flex items-center gap-1 font-medium"
              >
                Fresh Digital Solutions
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Back to Top */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors group"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <div className="h-8 w-8 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-slate-400 transition-colors">
                <ArrowRight className="h-4 w-4 -rotate-90" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}