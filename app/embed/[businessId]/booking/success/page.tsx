import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { BookingSuccessWrapper } from './_components/BookingSuccessWrapper';
import { notFound } from 'next/navigation';
import { makeScale } from '@/app/[domain]/_themes/utils';

interface PageProps {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedBookingSuccessPage({ params }: PageProps) {
  const { businessId } = await params;

  try {
    const business = await getBusinessForEmbed(businessId);
    const siteConfig = business.siteConfig || {};
    
    // Extract colors
    const primaryColor = siteConfig.colors?.primary || '#4f46e5';
    const accentColor = siteConfig.colors?.accent || '#f97316';
    const secondaryColor = siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = siteConfig.colors?.background || '#ffffff';
    const textColor = siteConfig.colors?.text || '#333333';
    
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

    return (
      <BookingSuccessWrapper 
        businessId={business.id}
        colors={colors}
      />
    );
  } catch (error) {
    console.error('Error loading embed booking success page:', error);
    return notFound();
  }
} 