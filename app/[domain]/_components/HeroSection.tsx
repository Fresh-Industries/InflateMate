'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';

interface HeroSectionProps {
  business: BusinessWithSiteConfig;
  siteConfig: SiteConfig;
  colors: { primary: string; accent: string; secondary: string };
}

export default function HeroSection({ business, siteConfig, colors }: HeroSectionProps) {
  const { primary: primaryColor, accent: accentColor } = colors;
  const heroConfig = siteConfig.hero || {};
  const heroImageUrl = heroConfig.imageUrl || business.coverImage || '/images/placeholder-hero.svg'; // Fallback

  return (
    <section 
      className="py-20 md:py-28 overflow-hidden relative" 
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`,
        color: '#ffffff'
      }}
    >
      {/* Decorative elements can be kept or made theme-specific */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-36 -mt-36 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-8 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight drop-shadow-md">
              {heroConfig.title || `Welcome to ${business.name}!`}
            </h1>
            <p className="text-lg md:text-xl opacity-95 font-light">
              {heroConfig.description || business.description || 'Your premier source for fun event rentals!'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
              <Button 
                asChild
                size="lg" 
                className="text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{ 
                  backgroundColor: accentColor,
                  color: '#ffffff'
                }}
              >
                <Link href={`/${business.customDomain || business.id}/booking`} className="flex items-center gap-2">
                  Book Now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="text-lg font-bold bg-white/10 hover:bg-white/20 border-white text-white hover:scale-105 transition-all duration-300"
              >
                <Link href={`/${business.customDomain || business.id}/inventory`}>View Rentals</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <div className="bg-white p-2 rounded-xl md:rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 hover:scale-105">
              <div className="relative aspect-video w-full">
                <Image 
                  src={heroImageUrl}
                  alt={heroConfig.title || `${business.name} Hero Image`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg md:rounded-xl"
                  priority // Prioritize loading hero image
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 