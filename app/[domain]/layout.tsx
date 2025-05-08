import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { DomainLayoutClient } from './layout-client';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface SalesFunnel {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  popupTitle: string;
  popupText: string;
  popupImage: string | null;
  formTitle: string;
  thankYouMessage: string;
  couponId: string | null;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function generateMetadata(
  { params }: { params: Promise<{ domain: string }> }
): Promise<Metadata> {
  const domain = decodeURIComponent((await params).domain);
  
  try {
    // Get the business data
    
    const business = await getBusinessByDomain(domain);
    
    
    // Use business name as title
    const title = business.name;
    const description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    const businessLogo = business.logo; // Get logo URL
    
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
      // Conditionally add icons only if logo exists
      icons: businessLogo ? {
        icon: [{ url: businessLogo }],
        // Optionally add apple-touch-icon etc. if you have them
        // apple: [{ url: businessLogo }], 
      } : null, // Set to null if no logo
      metadataBase: new URL(`https://${domain}`),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Inflatable Rentals',
      description: 'Premium inflatable rentals for birthdays, events, and parties.',
    };
  }
}

export default async function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const domain = decodeURIComponent((await params).domain);
  console.log('Domain layout rendered with domain:', domain);
  const isStaticAsset = (domain: string) =>
    domain.endsWith('.svg') ||
    domain.endsWith('.png') ||
    domain.endsWith('.jpg') ||
    domain.endsWith('.ico') ||
    domain.endsWith('.webmanifest') ||
    domain.endsWith('.css') ||
    domain.endsWith('.js') ||
    domain.startsWith('_next/') ||
    domain === 'favicon.ico';
  
  if (isStaticAsset(domain)) {
    // Option 1: Let Next.js handle it (do nothing)
    return;
    // Option 2: Or, if in middleware, call NextResponse.next()
  }
  
  try {
    const business = await getBusinessByDomain(domain);
    const siteConfig = business.siteConfig || {};
    const colors = {
       primary: siteConfig.colors?.primary || '#3b82f6',
       secondary: siteConfig.colors?.secondary || '#6b7280',
       accent: siteConfig.colors?.accent || '#ef4444',
       background: siteConfig.colors?.background || '#ffffff',
       text: siteConfig.colors?.text || '#333333',
    };
    console.log('Colors:', colors.text);
    const themeName = siteConfig.themeName?.name || 'modern';
    
    
    let activeFunnelData: SalesFunnel | null = null; 
    try {
      activeFunnelData = await prisma.salesFunnel.findFirst({
        where: {
          businessId: business.id,
          isActive: true,
          
        },
      });
    } catch (error) {
      console.error("Error fetching active sales funnel:", error);
    }

    return (
      <DomainLayoutClient 
        business={business}
        domain={domain}
        themeName={themeName as string}
        colors={colors}
        activeFunnel={activeFunnelData ? {...activeFunnelData} : undefined}
      >
        {children}
      </DomainLayoutClient>
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('notFound')) {
        console.log(`Business not found for domain in layout: ${domain}`);
        notFound();
    } else {
        console.error('Error fetching business in layout:', error);
        return <html><body>Error loading site layout.</body></html>;
    }
  }
} 