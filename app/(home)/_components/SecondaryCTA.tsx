'use client'
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronRight } from "lucide-react";

export default function SecondaryCTAStrip() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/20 to-accent/10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="relative container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="text-center md:text-left max-w-xl">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to transform your bounce house rental business?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Start your 14-day free trial today. No credit card required.
            </motion.p>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-2 h-12 px-6 rounded-full shadow-lg shadow-primary/20"
              asChild
            >
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-background/80 hover:bg-background border-primary/20 text-foreground gap-2 h-12 px-6 rounded-full backdrop-blur-sm"
              asChild
            >
              <Link href="/demo">
                <Play className="h-4 w-4 text-primary" />
                Watch Demo
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* Trust indicators */}
        <motion.div 
          className="mt-8 pt-6 border-t border-primary/10 flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <span>Full access to all features</span>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-primary" />
            <span>Live support during trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
