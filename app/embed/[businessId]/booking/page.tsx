import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { NewBookingForm } from '@/app/[domain]/booking/_components/customer-booking-form';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { notFound } from 'next/navigation';

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
    
    // Extract configuration from URL params, fallback to business colors
    const primaryColor = (search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const accentColor = (search.accentColor as string) || siteConfig.colors?.accent || '#f97316';
    const secondaryColor = (search.secondaryColor as string) || siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = (search.backgroundColor as string) || siteConfig.colors?.background || '#ffffff';
    const textColor = (search.textColor as string) || siteConfig.colors?.text || '#333333';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
    console.log('Embed booking colors:', {
      primary: primaryColor,
      accent: accentColor,
      secondary: secondaryColor,
      background: backgroundColor,
      text: textColor
    });
    
    // Build color scales
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(accentColor),
      secondary: makeScale(secondaryColor),
      background: makeScale(backgroundColor),
      text: makeScale(textColor)
    };

    return (
      <div className="p-4 min-h-screen">
        <NewBookingForm 
          businessId={business.id}
          themeName={themeName}
          colors={colors}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading embed booking page:', error);
    return notFound();
  }
} 