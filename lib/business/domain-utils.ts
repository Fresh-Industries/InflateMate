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
  backgroundColor?: string;
}

export interface VideoTextSectionContent {
  title?: string;
  text: string;
  videoUrl: string;
  videoPosition?: 'left' | 'right';
  backgroundColor?: string;
}

export interface TextCard {
  id: string;
  title: string;
  description: string;
  icon?: string; // e.g., Lucide icon name
  backgroundColor?: string;
}

export interface TextCardsSectionContent {
  title?: string;
  cards: TextCard[];
  backgroundColor?: string;
}

// Define the structure for a dynamic section
export interface DynamicSection {
  id: string; // Unique identifier for the section
  type: 'text' | 'imageText' | 'videoText' | 'textCards';
  page: 'landing' | 'about'; // Or other page identifiers
  content: TextSectionContent | ImageTextSectionContent | VideoTextSectionContent | TextCardsSectionContent;
  backgroundColor?: string;
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
    text?: string;
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
  
  // 1. First check if this is a subdomain of the root domain or localhost
  if (domainWithoutPort.includes('.')) {
    const subdomain = domainWithoutPort.split('.')[0];
    console.log('Checking subdomain:', subdomain);
    
    // Check subdomain field in DB directly
    business = await prisma.business.findFirst({
      where: {
        subdomain,
      }
    });

    console.log('Business:', business);
    
    if (business) {
      console.log('Found business by subdomain field:', business.name);
      return {
        ...business,
        siteConfig: business.siteConfig as SiteConfig || {},
      };
    }
    
    // Fallback to name-based subdomain matching for localhost testing
    if (domainWithoutPort.includes('.localhost')) {
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
        console.log('Found business by name-based subdomain:', business.name);
        return {
          ...business,
          siteConfig: business.siteConfig as SiteConfig || {},
        };
      }
    }
  }
  
  // 2. Try to find by custom domain
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
  
  // 3. Try to find by the domain parameter (for direct subdomain access)
  // Extract subdomain if the domainParam is a subdomain format
  if (domainParam.includes('.')) {
    const subdomain = domainParam.split('.')[0];
    
    business = await prisma.business.findFirst({
      where: {
        subdomain,
      }
    });
    
    if (business) {
      console.log('Found business by domain parameter subdomain:', business.name);
      return {
        ...business,
        siteConfig: business.siteConfig as SiteConfig || {},
      };
    }
  } else {
    // 4. Try direct matching with domainParam as a subdomain
    business = await prisma.business.findFirst({
      where: {
        subdomain: domainParam,
      }
    });
    
    if (business) {
      console.log('Found business by direct subdomain match:', business.name);
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