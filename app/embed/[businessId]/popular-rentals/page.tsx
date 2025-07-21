import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PopularRentalsWrapper } from './_components/PopularRentalsWrapper';

interface PageProps {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedPopularRentalsPage({ params, searchParams }: PageProps) {
  const { businessId } = await params;
  const search = await searchParams;

  try {
    const business = await getBusinessForEmbed(businessId);
    const siteConfig = business.siteConfig || {};
    
    // Extract color overrides from URL params, fallback to business colors
    const primaryColor =(search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const accentColor = (search.accentColor as string) || siteConfig.colors?.accent || '#f97316';
    const secondaryColor = (search.secondaryColor as string) || siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = (search.backgroundColor as string) || siteConfig.colors?.background || '#ffffff';
    const textColor = (search.textColor as string) || siteConfig.colors?.text || '#333333';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
    // Extract widget configuration from URL params
    const limit = parseInt((search.limit as string) || '6');
    const showPrices = search.showPrices !== 'false';
    const showDescriptions = search.showDescriptions !== 'false';
    
    // Build color scales
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(accentColor),
      secondary: makeScale(secondaryColor),
      background: makeScale(backgroundColor),
      text: makeScale(textColor)
    };

    // Fetch available inventory items for this business
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        businessId: business.id,
        status: "AVAILABLE",
      },
      take: Math.min(limit, 12), // Cap at 12 items max
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Merge URL params with business embedConfig, giving URL params priority
    const businessEmbedConfig = (business.embedConfig as Record<string, unknown>) || {};
    const embedConfig = {
      ...businessEmbedConfig,
      showPrices: search.showPrices !== undefined ? showPrices : (businessEmbedConfig.showPrices as boolean),
      showDescriptions: search.showDescriptions !== undefined ? showDescriptions : (businessEmbedConfig.showDescriptions as boolean),
    };

    return (
      <div style={{ 
        backgroundColor: colors.background[500],
        color: colors.text[900],
        minHeight: '400px'
      }}>
        <PopularRentalsWrapper 
          businessId={business.id}
          items={inventoryItems}
          colors={colors}
          themeName={themeName as keyof typeof themeConfig}
          businessDomain={business.customDomain as string | null}
          embedConfig={embedConfig}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading embed popular rentals page:', error);
    return notFound();
  }
} 