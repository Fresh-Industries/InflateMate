import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export interface BusinessForEmbed {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  siteConfig: any;
  [key: string]: unknown;
}

/**
 * Fetches a business by ID for embed functionality
 */
export async function getBusinessForEmbed(businessId: string): Promise<BusinessForEmbed> {
  console.log('Getting business for embed:', businessId);
  
  try {
    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });
    
    if (!business) {
      console.log('No business found for ID:', businessId);
      notFound();
    }
    
    console.log('Found business for embed:', business.name);
    return {
      ...business,
      siteConfig: business.siteConfig || {},
    };
  } catch (error) {
    console.error('Error fetching business for embed:', error);
    notFound();
  }
} 