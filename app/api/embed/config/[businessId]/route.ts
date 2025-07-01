import { NextRequest, NextResponse } from 'next/server';
import { getBusinessForEmbed } from '@/lib/business/embed-utils';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    
    const business = await getBusinessForEmbed(businessId);

    // Get available widgets data
    const [inventoryCount, salesFunnels] = await Promise.all([
      prisma.inventory.count({
        where: { businessId: business.id, status: 'AVAILABLE' }
      }),
      prisma.salesFunnel.findMany({
        where: { businessId: business.id, isActive: true },
        select: { id: true, name: true, popupTitle: true }
      })
    ]);

    const siteConfig = business.siteConfig || {};
    
    const config = {
      businessId: business.id,
      businessName: business.name,
      availableWidgets: {
        booking: true,
        inventory: inventoryCount > 0,
        salesFunnels: salesFunnels.map(funnel => ({
          id: funnel.id,
          name: funnel.name,
          title: funnel.popupTitle || funnel.name
        }))
      },
      defaultTheme: siteConfig.themeName?.name || 'modern',
      availableThemes: [
        'modern',
        'playful', 
        'retro'
      ],
      defaultColors: {
        primary: siteConfig.colors?.primary || '#4f46e5',
        accent: siteConfig.colors?.accent || '#f97316',
        secondary: siteConfig.colors?.secondary || '#06b6d4',
        background: siteConfig.colors?.background || '#ffffff',
        text: siteConfig.colors?.text || '#333333'
      },
      embedUrls: {
        booking: `/embed/${businessId}/booking`,
        inventory: `/embed/${businessId}/inventory`,
        product: `/embed/${businessId}/inventory/[productId]`,
        salesFunnel: `/embed/${businessId}/sales-funnel/[funnelId]`
      },
      sdkUrl: '/embed/sdk'
    };

    return NextResponse.json(config, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // 5 minutes cache
      }
    });

  } catch (error) {
    console.error('Error fetching embed config:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 