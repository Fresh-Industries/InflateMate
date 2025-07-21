import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';

interface SiteConfig {
  themeName?: {
    name: string;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const funnelId = searchParams.get('funnelId');
    const { businessId } = await params;


    if (type === 'sales-funnel' && funnelId) {
      // Fetch the sales funnel data
      const funnel = await prisma.salesFunnel.findFirst({
        where: {
          id: funnelId,
          businessId: businessId,
          isActive: true,
        },
      });

      if (!funnel) {
        return NextResponse.json(
          { error: 'Sales funnel not found or inactive' },
          { status: 404 }
        );
      }

      // Fetch business data for theme colors
      const business = await prisma.business.findUnique({
        where: { id: businessId },
        select: {
          name: true,
          siteConfig: true,
        },
      });

      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }

      // Get the site configuration
      const siteConfig = business.siteConfig as SiteConfig || {};
      
      // Generate theme colors
      const rawThemeName = (siteConfig.themeName?.name as string) || 'modern';
      const themeName = Object.keys(themeConfig).includes(rawThemeName) ? rawThemeName : 'modern';
      const theme = themeConfig[themeName] || themeConfig.modern;
      
      // Get base colors from site config with fallbacks
      const primaryColor = siteConfig.colors?.primary || '#4f46e5';
      const accentColor = siteConfig.colors?.accent || '#f97316';
      const secondaryColor = siteConfig.colors?.secondary || '#06b6d4';
      const backgroundColor = siteConfig.colors?.background || '#ffffff';
      const textColor = siteConfig.colors?.text || '#333333';
      
      const colors = {
        primary: {
          100: `${primaryColor}20`,
          500: primaryColor,
          900: `${primaryColor}dd`,
        },
        secondary: {
          100: `${secondaryColor}20`,
          500: secondaryColor,
          900: `${secondaryColor}dd`,
        },
        accent: {
          100: `${accentColor}20`,
          500: accentColor,
          900: `${accentColor}dd`,
        },
        background: {
          100: backgroundColor,
          500: '#f3f4f6',
          900: '#111827',
        },
        text: {
          100: '#ffffff',
          500: textColor,
          900: '#111827',
        },
      };

      return NextResponse.json({
        funnel: {
          id: funnel.id,
          name: funnel.name,
          popupTitle: funnel.popupTitle,
          popupText: funnel.popupText,
          popupImage: funnel.popupImage,
          formTitle: funnel.formTitle,
          thankYouMessage: funnel.thankYouMessage,
          isActive: funnel.isActive,
        },
        colors,
        theme,
        business: {
          name: business.name,
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching embed data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 

