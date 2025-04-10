'use client';

import React, { useState, useEffect } from 'react';
import { BusinessWithSiteConfig, DynamicSection } from '@/lib/business/domain-utils';
import HeroSection from '@/app/[domain]/_components/HeroSection';
import TrustIndicatorsSection from '@/app/[domain]/_components/TrustIndicatorsSection';
import FeaturesSection from '@/app/[domain]/_components/FeaturesSection';
import PopularRentalsSection from '@/app/[domain]/_components/PopularRentalsSection';
import CTASection from '@/app/[domain]/_components/CTASection';
import ContactAndServiceAreaSection from '@/app/[domain]/_components/ContactAndServiceAreaSection';
import SectionRenderer from '@/app/[domain]/_components/SectionRenderer';
import { SalesFunnel, SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel';

interface ModernLayoutProps {
  business: BusinessWithSiteConfig;
  sections: DynamicSection[];
  inventoryItems: any[];
  colors: { primary: string; accent: string; secondary: string };
  activeFunnel?: SalesFunnel;
}

export default function ModernLayout({ 
  business, 
  sections, 
  inventoryItems, 
  colors,
  activeFunnel
}: ModernLayoutProps) {
  const siteConfig = business.siteConfig || {};
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <main className="flex-grow theme-modern">
      <HeroSection business={business} siteConfig={siteConfig} colors={colors} />
      <TrustIndicatorsSection />
      <FeaturesSection colors={colors} />
      
      {sections.map((section) => (
        <section key={section.id} className="dynamic-section">
          <SectionRenderer section={section} />
        </section>
      ))}

      <PopularRentalsSection 
        business={business} 
        inventoryItems={inventoryItems} 
        colors={colors} 
      />
      <CTASection business={business} colors={colors} />
      <ContactAndServiceAreaSection business={business} colors={colors} />

      {isMounted && activeFunnel && (
        <SalesFunnelPopup 
          businessId={business.id}
          funnel={activeFunnel}
          colors={colors}
        />
      )}
    </main>
  );
} 