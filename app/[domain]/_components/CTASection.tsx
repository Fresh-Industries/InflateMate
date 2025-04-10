'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';

interface CTASectionProps {
  business: BusinessWithSiteConfig;
  colors: { primary: string; accent: string };
}

export default function CTASection({ business, colors }: CTASectionProps) {
  const { primary: primaryColor, accent: accentColor } = colors;

  return (
    <section 
      className="py-16 md:py-20 text-white relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-md">Ready to Make Your Event Unforgettable?</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-95 font-light">
          Book your rental today and let the fun begin!
        </p>
        <Button 
          asChild
          size="lg" 
          className="text-xl font-bold shadow-xl hover:shadow-2xl transition-shadow duration-300 hover:scale-105 px-8 py-6"
          style={{ 
            backgroundColor: '#ffffff',
            color: primaryColor
          }}
        >
          <Link href={`/${business.customDomain || business.id}/booking`} className="flex items-center gap-3">
            Book Your Rental <ArrowRight className="h-6 w-6" />
          </Link>
        </Button>
      </div>
      
      {/* Optional decorative elements */}
      <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40"></div>
    </section>
  );
} 