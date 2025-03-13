import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import InventoryClient from './inventory-client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { domain: string };
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
export default async function InventoryPage({ params }: { params: { domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    
    // Set default colors if not provided
    const primaryColor = colors.primary || "#3b82f6";
    const secondaryColor = colors.secondary || "#6b7280";
    
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
        domain={domain} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
      />
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 