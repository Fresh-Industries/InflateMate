import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

// Define types for different section content structures
export interface TextSectionContent {
  title?: string;
  text: string;
}

export interface ImageTextSectionContent {
  title?: string;
  text: string;
  imageUrl: string;
  imageKey?: string; // Optional key for deleting from UploadThing
  imagePosition?: 'left' | 'right';
}

export interface VideoTextSectionContent {
  title?: string;
  text: string;
  videoUrl: string;
  videoPosition?: 'left' | 'right';
}

export interface TextCard {
  id: string;
  title: string;
  description: string;
  icon?: string; // e.g., Lucide icon name
}

export interface TextCardsSectionContent {
  title?: string;
  cards: TextCard[];
}

// Define the structure for a dynamic section
export interface DynamicSection {
  id: string; // Unique identifier for the section
  type: 'text' | 'imageText' | 'videoText' | 'textCards';
  page: 'landing' | 'about'; // Or other page identifiers
  content: TextSectionContent | ImageTextSectionContent | VideoTextSectionContent | TextCardsSectionContent;
}

export interface Theme {
  id: string;
  name: string;
}

export interface SiteConfig {
  themeName?: Theme;
  hero?: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  landing?: {
    sections?: DynamicSection[];
  };
  about?: {
    title?: string;
    description?: string;
    dynamicSections?: DynamicSection[];
  };
  contact?: {
    title?: string;
  };
  pages?: Record<string, {
    title?: string;
    content?: string;
    imageUrl?: string;
  }>;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
}

export interface BusinessWithSiteConfig {
  id: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  customDomain?: string | null;
  siteConfig: SiteConfig | null;
  [key: string]: unknown;
}

/**
 * Fetches a business by domain from either the host header or the domain parameter
 */
export async function getBusinessByDomain(domainParam: string): Promise<BusinessWithSiteConfig> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const domainWithoutPort = host.split(':')[0];
  
  console.log('Getting business by domain:', domainParam);
  console.log('Host header:', host);
  
  let business = null;
  
  // First check if this is a subdomain of localhost
  if (domainWithoutPort.includes('.localhost')) {
    const subdomain = domainWithoutPort.split('.')[0];
    console.log('Checking subdomain:', subdomain);
    
    // Try to find by formatted business name
    business = await prisma.business.findFirst({
      where: {
        OR: [
          // Try to match by name (with formatting similar to what we do in the UI)
          {
            name: {
              contains: subdomain.replace(/-/g, ' '),
              mode: 'insensitive'
            }
          },
          // Also try to match by name with hyphens replaced by spaces
          {
            name: {
              contains: subdomain.replace(/-/g, ''),
              mode: 'insensitive'
            }
          },
          // Fallback to business ID
          {
            id: subdomain
          }
        ]
      }
    });
    
    if (business) {
      console.log('Found business by subdomain:', business.name);
      return {
        ...business,
        siteConfig: business.siteConfig as SiteConfig || {},
      };
    }
  }
  
  // If not found by subdomain, try to find by custom domain
  // For testing, we'll also check if the custom domain is set to the domain parameter
  business = await prisma.business.findFirst({
    where: {
      customDomain: domainWithoutPort,
    },
  });
  
  if (business) {
    console.log('Found business by custom domain:', business.name);
    return {
      ...business,
      siteConfig: business.siteConfig as SiteConfig || {},
    };
  }
  
  // If not found by host, try to find by the domain parameter
  business = await prisma.business.findFirst({
    where: {
      customDomain: domainParam,
    },
  });
  
  if (business) {
    console.log('Found business by domain parameter:', business.name);
    return {
      ...business,
      siteConfig: business.siteConfig as SiteConfig || {},
    };
  }
  
  // If still not found, check if domain parameter is a business name subdomain
  if (domainParam.includes('.localhost')) {
    const subdomain = domainParam.split('.')[0];
    
    business = await prisma.business.findFirst({
      where: {
        OR: [
          // Try to match by name (with formatting similar to what we do in the UI)
          {
            name: {
              contains: subdomain.replace(/-/g, ' '),
              mode: 'insensitive'
            }
          },
          // Also try to match by name with hyphens replaced by spaces
          {
            name: {
              contains: subdomain.replace(/-/g, ''),
              mode: 'insensitive'
            }
          },
          // Fallback to business ID
          {
            id: subdomain
          }
        ]
      }
    });
    
    if (business) {
      console.log('Found business by domain parameter subdomain:', business.name);
      return {
        ...business,
        siteConfig: business.siteConfig as SiteConfig || {},
      };
    }
  }
  
  // If no business found, return 404
  console.log('No business found for domain:', domainParam);
  notFound();
} 