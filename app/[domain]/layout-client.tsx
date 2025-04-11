'use client';
import { ReactNode, useState, useEffect } from 'react';
import { SalesFunnel as SalesFunnelType, SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel';
import Header from '@/app/[domain]/_components/Header';
import Footer from '@/app/[domain]/_components/Footer';
import { BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';
import { themeConfig, ThemeDefinition, ThemeColors } from '@/app/[domain]/_themes/themeConfig';

interface DomainLayoutClientProps {
  children: ReactNode;
  business: BusinessWithSiteConfig;
  domain: string;
  siteConfig: SiteConfig;
  themeName: string;
  colors: ThemeColors;
  activeFunnel?: SalesFunnelType;
}

export function DomainLayoutClient({ 
  children, 
  business, 
  siteConfig,
  colors,
  activeFunnel,
  themeName 
}: DomainLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const selectedTheme: ThemeDefinition = themeConfig[themeName.toLowerCase()] || themeConfig.modern;
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        business={business} 
        siteConfig={siteConfig} 
        colors={colors} 
        theme={selectedTheme}
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer business={business} theme={selectedTheme} colors={colors} />
      
      {isMounted && activeFunnel && (
        <SalesFunnelPopup 
          businessId={business.id}
          funnel={activeFunnel}
          colors={colors}
        />
      )}
    </div>
  );
} 