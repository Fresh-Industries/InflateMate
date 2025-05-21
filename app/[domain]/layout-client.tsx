'use client';
import { ReactNode, useState, useEffect, useMemo } from 'react';
import { SalesFunnel as SalesFunnelType, SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel';
import Header from '@/app/[domain]/_components/Header';
import Footer from '@/app/[domain]/_components/Footer';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeDefinition, ThemeColors } from '@/app/[domain]/_themes/types';
import { makeScale } from '@/app/[domain]/_themes/utils';

// Temporary type until everything is migrated
type OldColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

interface DomainLayoutClientProps {
  children: ReactNode;
  business: BusinessWithSiteConfig;
  domain: string;
  themeName: string;
  colors: ThemeColors | OldColors;
  activeFunnel?: Omit<SalesFunnelType, 'theme'>;
}

export function DomainLayoutClient({ 
  children, 
  business, 
  colors: rawColors,
  activeFunnel,
  themeName 
}: DomainLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  const selectedTheme: ThemeDefinition = useMemo(() => {
    return themeConfig[themeName.toLowerCase()] || themeConfig.modern;
  }, [themeName]);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Convert colors to ThemeColors if not already
  const colors = useMemo(() => {
    // Check if colors is already in the ColorScale format
    if ('primary' in rawColors && typeof rawColors.primary === 'object' && '500' in rawColors.primary) {
      return rawColors as ThemeColors;
    }
    
    // Convert from flat colors to ColorScale
    const oldColors = rawColors as OldColors;
    return {
      primary: makeScale(oldColors.primary),
      secondary: makeScale(oldColors.secondary),
      accent: makeScale(oldColors.accent),
      background: makeScale(oldColors.background),
      text: makeScale(oldColors.text)
    };
  }, [rawColors]);
  
  return (
    <>
      <Header 
        business={business} 
        colors={colors} 
        theme={selectedTheme}
      />
      
      <div className={`flex flex-col min-h-screen ${themeName}-theme`}>
        <main className="flex-1">
          {children}
        </main>
        
        <Footer 
          business={business} 
          themeName={themeName} 
          colors={colors} 
        />
        
        {isMounted && activeFunnel && (
          <SalesFunnelPopup 
            businessId={business.id}
            funnel={{...activeFunnel, theme: selectedTheme}}
            colors={colors}
            theme={selectedTheme}
          />
        )}
      </div>
      
      {/* Apply theme-specific global background styles */}
      <style jsx global>{`
        ${selectedTheme.globalBackground ? selectedTheme.globalBackground(colors).overlay : ''}
        
        body {
          padding-top: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        header {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }
      `}</style>
    </>
  );
} 