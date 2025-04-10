'use client';
import { ReactNode, useState, useEffect } from 'react';
import { SalesFunnel, SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel';
import Header from '@/app/[domain]/_components/Header';
import Footer from '@/app/[domain]/_components/Footer';

interface Business {
  id: string;
  name: string;
  logo?: string;
  [key: string]: unknown;
}

interface SiteConfig {
  colors?: {
    primary?: string;
    secondary?: string;
  };
  [key: string]: unknown;
}

interface DomainLayoutClientProps {
  children: ReactNode;
  business: Business;
  domain: string;
  siteConfig: SiteConfig;
  colors: {
    primary?: string;
    secondary?: string;
  };
  activeFunnel?: SalesFunnel;
}

export function DomainLayoutClient({ 
  children, 
  business, 
  siteConfig,
  colors,
  activeFunnel
}: DomainLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header business={business} siteConfig={siteConfig} colors={colors} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer business={business} siteConfig={siteConfig} colors={colors} />
      
      {/* Sales Funnel Popup - Only render on client side */}
      {isMounted && activeFunnel && (
        <SalesFunnelPopup 
          businessId={business.id}
          funnel={activeFunnel}
          colors={{
            primary: colors.primary || "#3b82f6",
            secondary: colors.secondary || "#6b7280",
          }}
        />
      )}
    </div>
  );
} 