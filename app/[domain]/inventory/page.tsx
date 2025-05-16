import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import InventoryClient from './inventory-client';
import { makeScale } from '../_themes/utils';
import { themeConfig } from '../_themes/themeConfig';
import { ColorScale } from '../_themes/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

// Define inventory item type for export
export interface InventoryItem {
  id: string;
  name: string;
  description?: string | null;
  dimensions: string;
  capacity: number;
  price: number;
  setupTime: number;
  teardownTime: number;
  primaryImage?: string | null;
  type: string;
  status: string;
  [key: string]: unknown; // For any other properties
}

export interface ThemeColors {
  primary: ColorScale;
  accent: ColorScale;
  secondary: ColorScale;
  background: ColorScale;
  text: ColorScale;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    
    // Create inventory-specific metadata
    const title = `Inventory | ${business.name}`;
    const description = `Browse our selection of premium inflatable rentals for your next event. ${business.name} offers a variety of bounce houses, water slides, and games.`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: business.coverImage ? [business.coverImage] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: business.coverImage ? [business.coverImage] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Inventory | Inflatable Rentals',
      description: 'Browse our selection of premium inflatable rentals for your next event.',
    };
  }
}

// Server component
export default async function InventoryPage(props: { params: Promise<{ domain: string }> }) {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    

    
      // Determine Theme
  const rawThemeName = (siteConfig.themeName?.name as string) || 'modern';
  const themeName = Object.keys(themeConfig).includes(rawThemeName) ? rawThemeName : 'modern';

// Get base colors from site config with fallbacks
const primaryColor = siteConfig.colors?.primary || '#4f46e5';
const accentColor = siteConfig.colors?.accent || '#f97316';
const secondaryColor = siteConfig.colors?.secondary || '#06b6d4';
const backgroundColor = siteConfig.colors?.background || '#ffffff';
const textColor = siteConfig.colors?.text || '#333333';

// Define Colors with scales for each color using makeScale
const colors: ThemeColors = {
  primary: makeScale(primaryColor),
  accent: makeScale(accentColor),
  secondary: makeScale(secondaryColor),
  background: makeScale(backgroundColor),
  text: makeScale(textColor)
};
    // Fetch available inventory items for this business with all details
    const inventoryItems = await prisma.inventory.findMany({
      where: {
        businessId: business.id,
        status: "AVAILABLE",
      },
    });
    
    return (
      <InventoryClient 
        inventoryItems={inventoryItems} 
        themeName={themeName}
        colors={colors}
      />
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 