import { notFound } from 'next/navigation';
import { getBusinessByDomain } from '@/lib/business/domain-utils';
import { NewBookingForm } from "./_components/customer-booking-form";
import { Metadata } from 'next';
import { ThemeColors } from '../_themes/types';
import { makeScale } from '../_themes/utils';
import { themeConfig } from '../_themes/themeConfig';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ domain: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const domain = decodeURIComponent(params.domain);

  try {
    // Get the business data
    const business = await getBusinessByDomain(domain);
    
    // Create booking-specific metadata
    const title = `Book Now | ${business.name}`;
    const description = `Reserve your bounce house or inflatable rental with ${business.name}. Easy online booking for your next party or event.`;
    
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
      title: 'Book Now | Inflatable Rentals',
      description: 'Reserve your bounce house or inflatable rental for your next party or event.',
    };
  }
}

export default async function BookingPage({ params }: { params: Promise<{ domain: string }> }) {
  const domain = decodeURIComponent((await params).domain);
  console.log('Booking page rendered with domain:', domain);
  
  try {
    // Use the domain utils to find the business by either custom domain or subdomain
    const business = await getBusinessByDomain(domain);
    console.log('Business:', business);

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
    
    return (
      <div className="container mx-auto px-4 py-8">
          <div>
            <NewBookingForm 
              businessId={business.id} 
              themeName={themeName} 
              colors={colors} 
            />
          </div>
        </div>
    );
  } catch (error) {
    console.error('Error fetching business by domain:', error);
    return notFound();
  }
} 