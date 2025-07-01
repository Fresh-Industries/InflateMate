import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { prisma } from '@/lib/prisma';
import { SalesFunnelPopup } from '@/app/[domain]/_components/SalesFunnel/SalesFunnelPopup';
import { makeScale } from '@/app/[domain]/_themes/utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ businessId: string; funnelId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmbedSalesFunnelPage({ params, searchParams }: PageProps) {
  const { businessId, funnelId } = await params;
  const search = await searchParams;

  try {
    const [business, funnel] = await Promise.all([
      getBusinessForEmbed(businessId),
      prisma.salesFunnel.findFirst({
        where: { id: funnelId, businessId },
        include: {
          coupon: true ,
        }
      })
    ]);

    if (!funnel || !funnel.isActive) {
      return notFound();
    }

    const siteConfig = business.siteConfig || {};
    
    // Extract configuration from URL params, fallback to business colors
    const primaryColor = (search.primaryColor as string) || siteConfig.colors?.primary || '#4f46e5';
    const accentColor = (search.accentColor as string) || siteConfig.colors?.accent || '#f97316';
    const secondaryColor = (search.secondaryColor as string) || siteConfig.colors?.secondary || '#06b6d4';
    const backgroundColor = (search.backgroundColor as string) || siteConfig.colors?.background || '#ffffff';
    const textColor = (search.textColor as string) || siteConfig.colors?.text || '#333333';
    const themeName = (search.theme as string) || siteConfig.themeName?.name || 'modern';
    
    const colors = {
      primary: makeScale(primaryColor),
      accent: makeScale(accentColor),
      secondary: makeScale(secondaryColor),
      background: makeScale(backgroundColor),
      text: makeScale(textColor)
    };

    const theme = themeConfig[themeName] || themeConfig.modern;

    return (
      <div className="min-h-screen relative" style={{ 
        backgroundColor: colors.background[500],
      }}>
        <SalesFunnelPopup
          businessId={business.id}
          funnel={{
            id: funnel.id,
            name: funnel.name,
            popupTitle: funnel.popupTitle,
            popupText: funnel.popupText,
            popupImage: funnel.popupImage,
            formTitle: funnel.formTitle,
            thankYouMessage: funnel.thankYouMessage,
            couponId: funnel.couponId,
            isActive: funnel.isActive,
            theme
          }}
          colors={colors}
          theme={theme}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading embed sales funnel page:', error);
    return notFound();
  }
} 