'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BarChart2, CalendarCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Added Link import
import { motion } from "framer-motion"; // Added motion import

export default function Hero() {
  return (
    <section className="relative pt-16 md:pt-20 lg:pt-24 pb-16 md:pb-24 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-accent/10 rounded-full mix-blend-multiply blur-xl opacity-70 animate-blob animation-delay-4000" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Column */}
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            {/* Social proof / Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted mb-2" // Removed text-muted class as Badge styles it
            >
            {/* Kept this badge text - it's a strong differentiator */}
            <Badge className="uppercase text-sm tracking-wide border-primary text-primary bg-muted/50"> {/* Added bg-muted/50 for contrast */}
              Built By a Bounce House Owner
            </Badge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Run Your Bounce House&nbsp;
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
            Business On Autopilot
          </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0" // Changed to text-muted-foreground for better hierarchy
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Tired of outdated software and manual work? InflateMate is the modern, all-in-one platform designed by a rental pro to streamline operations, boost bookings, and free up your time. {/* Updated subheadline text */}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button variant="primary-gradient" size="lg" className="group" asChild>
                <Link href="/signup">
                  <div className="flex items-center">
                    <span className="font-bold">Get Started Now</span>
                    <span className="ml-2 flex items-center justify-center rounded-full bg-white/20 p-2 transform transition-transform group-hover:translate-x-1">
                      <ArrowRight className="w-3 h-3 text-white" />
                    </span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group !border-muted !text-foreground bg-transparent backdrop-blur-sm hover:bg-muted/50"
                asChild
              >
                <Link href="/demo">
                  <div className="flex items-center">
                    <span className="mr-2 flex items-center justify-center rounded-full bg-accent/10 p-2">
                      <Play className="w-3 h-3 text-accent" />
                    </span>
                    <span>Watch Demo</span>
                  </div>
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Visual Column */}
          <motion.div
            className="w-full lg:w-1/2 relative"
             initial={{ opacity: 0, y: 20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-3xl blur-lg opacity-30 animate-pulse" />
            <div className="relative mx-auto max-w-[580px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-card/95 backdrop-blur-sm p-4 md:p-6 transform hover:-translate-y-2 transition-all duration-500">
              <div className="w-full aspect-[16/10] relative rounded-lg overflow-hidden">
                {/* Ensure Image component is used correctly with priority */}
                <Image
                  src="/images/hero-dashboard.png"
                  alt="InflateMate Dashboard" // Added alt text
                  fill
                  className="object-cover object-top"
                  priority // Keep priority for LCP
                />
              </div>

              {/* Floating cards - Text color ensured */}
              <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-muted transform hover:scale-105 transition-all duration-300 z-10"> {/* Added z-index */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-2">
                    <BarChart2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Monthly Revenue</p>
                    <p className="text-base font-bold text-green-600">$12,580</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-muted transform hover:scale-105 transition-all duration-300 z-10"> {/* Added z-index */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-2">
                    <CalendarCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">This Weekend</p>
                    <p className="text-base font-bold text-blue-600">8 Bookings</p>
                  </div>
                </div>
              </div>

              <div className="hidden md:block absolute -bottom-2 right-1/4 bg-card rounded-xl shadow-lg p-3 border border-muted z-10"> {/* Added z-index */}
                <div className="flex items-center gap-2">
                  <span className="block w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs font-medium text-foreground whitespace-nowrap">
                    Payment received: $350
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
