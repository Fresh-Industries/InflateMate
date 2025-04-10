import React, { Suspense } from 'react';
// import { notFound } from 'next/navigation'; // Removed as getBusinessByDomain handles this
import { getBusinessByDomain, SiteConfig, DynamicSection } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

// Dynamically import theme layouts
const ModernLayout = React.lazy(() => import('./_themes/modern/ModernLayout'));
const PlayfulLayout = React.lazy(() => import('./_themes/playful/PlayfulLayout'));
const BouncyLayout = React.lazy(() => import('./_themes/bouncy/BouncyLayout'));

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { domain: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain);
  
  try {
    const business = await getBusinessByDomain(domain);
    const title = business.name;
    const description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    const heroTitle = business.siteConfig?.hero?.title;
    const heroDescription = business.siteConfig?.hero?.description;
    
    return {
      title,
      description: heroDescription || description,
      openGraph: {
        title: heroTitle || title,
        description: heroDescription || description,
        images: business.coverImage ? [business.coverImage] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: heroTitle || title,
        description: heroDescription || description,
        images: business.coverImage ? [business.coverImage] : [],
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes('notFound')) {
        console.log(`Business not found during metadata generation for domain: ${domain}`);
         return {
            title: 'Page Not Found',
            description: 'Could not find the requested page.'
         }
    } else {
        console.error('Error generating metadata:', error);
        return {
            title: 'Inflatable Rentals',
            description: 'Premium inflatable rentals for birthdays, events, and parties.',
        };
    }
  }
}

export default async function DomainPage({ params }: PageProps) {
  console.log("Domain page rendered with domain:", params.domain);
  
  const domain = decodeURIComponent(params.domain);
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = (business.siteConfig || {}) as SiteConfig;
    
    const colors = {
       primary: siteConfig.colors?.primary || '#4f46e5', 
       accent: siteConfig.colors?.accent || '#f97316', 
       secondary: siteConfig.colors?.secondary || '#06b6d4', 
    };

    // Fetch inventory items only
    const inventoryItems = await prisma.inventory.findMany({
        where: { businessId: business.id, status: "AVAILABLE" },
        select: { 
            id: true, name: true, description: true, price: true, 
            primaryImage: true, type: true 
        },
        take: 3, 
      });
    
    // Correctly access landing sections
    const landingSections: DynamicSection[] = siteConfig.landing?.sections || [];
    console.log("landingSections", landingSections);

    // Determine theme name (ensure themeName is the string name, not the Theme object)
    const themeName = siteConfig.themeName?.name || 'modern'; // Access .name property

    let LayoutComponent;
    switch (themeName) {
      case 'playful':
        LayoutComponent = PlayfulLayout;
        break;
      case 'bouncy':
        LayoutComponent = BouncyLayout;
        break;
      case 'modern':
      default:
        LayoutComponent = ModernLayout;
        break;
    }

    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading theme...</div>}>
        <LayoutComponent 
          business={business}
          sections={landingSections}
          inventoryItems={inventoryItems}
          colors={colors}
        />
      </Suspense>
    );
  } catch (error) {
    console.error(`Error rendering page for domain ${domain}:`, error);
    return <div className="flex items-center justify-center min-h-screen text-red-600">Error loading page. Please try again later.</div>;
  }
}