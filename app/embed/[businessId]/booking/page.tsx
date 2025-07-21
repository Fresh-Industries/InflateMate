// app/embed/[businessId]/booking/page.tsx
import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { BookingWrapper } from './_components/BookingWrapper';
import { notFound } from 'next/navigation';
import { makeScale } from '@/app/[domain]/_themes/utils';

interface PageProps {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedBookingPage({ params, searchParams }: PageProps) {
  const { businessId } = await params;
  const search = await searchParams;

  try {
    const business = await getBusinessForEmbed(businessId);
    const siteConfig = business.siteConfig || {};
    
    // Extract theme name correctly - use .name property like other pages
    const themeName = siteConfig.themeName?.name || 'modern';
    
    // Extract individual color values like other embed pages
    const primaryColor =  siteConfig.colors?.primary || '#4f46e5';
    const accentColor = siteConfig.colors?.accent || '#f97316';
    const secondaryColor = siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = siteConfig.colors?.background || '#ffffff';
    const textColor = siteConfig.colors?.text || '#333333';
    
    // Construct colors object using makeScale like other pages do
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(accentColor),
      secondary: makeScale(secondaryColor),
      background: makeScale(backgroundColor),
      text: makeScale(textColor)
    };

    if (!business) {
      notFound();
    }

    // Extract widget configuration
    const redirectUrl = search.redirectUrl as string;

    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <BookingWrapper 
          businessId={business.id}
          themeName={themeName}
          colors={colors}
          redirectUrl={redirectUrl || (typeof business.website === 'string' ? business.website : undefined)}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading embed booking page:', error);
    return notFound();
  }
} 