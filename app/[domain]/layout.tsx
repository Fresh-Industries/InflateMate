import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { DomainLayoutClient } from './layout-client';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: { domain: string } }
): Promise<Metadata> {
  const domain = decodeURIComponent(params.domain);
  
  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    
    // Use business name as title
    const title = business.name;
    const description = business.description || 'Premium inflatable rentals for birthdays, events, and parties.';
    
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
      icons: business.logo ? [business.logo] : [],
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
  children: ReactNode;
  params: { domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  console.log('Domain layout rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    
    // Get the site configuration
    const siteConfig = business.siteConfig || {};
    const colors = siteConfig.colors || {};
    
    return (
      <DomainLayoutClient business={business} siteConfig={siteConfig} colors={colors}>
        {children}
      </DomainLayoutClient>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 