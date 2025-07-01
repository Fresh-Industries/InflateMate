import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import InventoryClient from '@/app/[domain]/inventory/inventory-client';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedInventoryPage({ params, searchParams }: PageProps) {
  const { businessId } = await params;
  const search = await searchParams;

  try {
    const business = await getBusinessForEmbed(businessId);
    const siteConfig = business.siteConfig || {};
    
    // Extract configuration from URL params, fallback to business colors
    const primaryColor = (search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const accentColor = (search.accentColor as string) || siteConfig.colors?.accent || '#f97316';
    const secondaryColor = (search.secondaryColor as string) || siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = (search.backgroundColor as string) || siteConfig.colors?.background || '#ffffff';
    const textColor = (search.textColor as string) || siteConfig.colors?.text || '#333333';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
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
    });

    return (
      <div className="p-2 sm:p-4" style={{ 
        backgroundColor: colors.background[500],
        color: colors.text[900]
      }}>
        <InventoryClient 
          inventoryItems={inventoryItems}
          themeName={themeName}
          colors={colors}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading embed inventory page:', error);
    return notFound();
  }
} 