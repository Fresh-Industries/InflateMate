'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { Button } from '@/components/ui/button';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';

/**
 * Shape of a rental coming from Prisma.
 */
export interface RentalItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  primaryImage?: string | null;
  type: string;
}

interface EmbedConfig {
  pageRoutes?: {
    booking?: string;
    inventory?: string;
    product?: string;
  };
  showPrices?: boolean;
  showDescriptions?: boolean;
  redirectUrl?: string;
  successMessage?: string;
}

interface Props {
  items: RentalItem[];
  colors: ThemeColors;
  themeName: keyof typeof themeConfig;
  businessDomain?: string | null; // customDomain from business
  embedConfig?: EmbedConfig | null;
  fallbackEmoji?: string;
}

const typeEmoji: Record<string, string> = {
  BOUNCE_HOUSE: '🏰',
  WATER_SLIDE: '🌊',
  GAME: '🎮',
  OTHER: '🎉',
};

export default function PopularRentals({ 
  items, 
  colors, 
  themeName, 
  businessDomain,
  embedConfig,
  fallbackEmoji = '🎈' 
}: Props) {
  const theme = themeConfig[themeName];
  const sectionAnimation = theme.animations?.sectionTransition || "fadeIn 0.3s ease";
  const itemAnimation = theme.animations?.elementEntrance || "popIn 0.3s ease-out";

  // Helper function to get the correct booking link
  const getBookingLink = () => {
    if (!businessDomain) return '/booking';
    
    const pageRoute = embedConfig?.pageRoutes?.booking || '/booking';
    return `${businessDomain}${pageRoute}`;
  };

  // Helper function to get the correct product link
  const getProductLink = (itemId: string) => {
    if (!businessDomain) return `/inventory/${itemId}`;
    
    const pageRoute = embedConfig?.pageRoutes?.product || '/inventory';
    return `${businessDomain}${pageRoute}/${itemId}`;
  };

  const handleItemClick = (itemId: string) => {
    const url = getProductLink(itemId);
    window.top!.location.href = url;
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getBookingLink();
    window.top!.location.href = url;
  };

  /** Primary button style */
  const buttonStyles: React.CSSProperties = {
    background: theme.buttonStyles.background(colors),
    color: theme.buttonStyles.textColor(colors),
    border: theme.buttonStyles.border?.(colors) ?? 'none',
    boxShadow: theme.buttonStyles.boxShadow?.(colors) ?? 'none',
    transition: theme.buttonStyles.transition ?? 'all .3s ease',
    borderRadius: theme.buttonStyles.borderRadius ?? '12px',
  };

  // Card base styles pulled from theme
  const baseCard = {
    background: theme.cardStyles.background(colors),
    border: theme.cardStyles.border(colors),
    boxShadow: theme.cardStyles.boxShadow(colors),
    borderRadius: theme.cardStyles.borderRadius ?? '16px',
    color: theme.cardStyles.textColor(colors),
  } as const;

  // Gradient or flat colour for the top half of the card
  const topBackground = theme.popularRentalsStyles?.cardBackgroundGradient(colors) ??
    `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`;

  const priceColour = theme.popularRentalsStyles?.priceColor(colors) ?? colors.accent;

  const showPrices = embedConfig?.showPrices !== false;
  const showDescriptions = embedConfig?.showDescriptions !== false;

  return (
    <section
      className={`py-20 relative overflow-hidden ${themeName}-theme popular-rentals`}
      style={{ 
        background: theme.popularRentalsStyles?.background(colors) ?? 'transparent',
        animation: sectionAnimation
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2
          className={`text-3xl md:text-5xl font-bold text-center mb-16 ${themeName}-theme section-title`}
          style={{ color: theme.popularRentalsStyles?.titleColor(colors) ?? colors.primary[500] }}
        >
          Our Most Popular Rentals
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-10 bg-white/70 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <p className="text-gray-600 mb-8 text-xl">No inventory items available right now.</p>
            <Button 
              size="lg" 
              style={buttonStyles} 
              className="text-lg font-bold hover:scale-105 transition-transform duration-300"
              onClick={handleBookingClick}
            >
              <div className="flex items-center gap-2">
                Contact Us to Book <ArrowRight className="h-5 w-5" />
              </div>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 group"
                style={{
                  ...baseCard,
                  animation: itemAnimation
                }}
              >
                <div
                  className="h-56 flex items-center justify-center overflow-hidden cursor-pointer"
                  style={{
                    background: topBackground,
                    borderTopLeftRadius: baseCard.borderRadius,
                    borderTopRightRadius: baseCard.borderRadius,
                  }}
                  onClick={() => handleItemClick(item.id)}
                >
                  {item.primaryImage ? (
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ borderTopLeftRadius: baseCard.borderRadius, borderTopRightRadius: baseCard.borderRadius }}
                    />
                  ) : (
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {typeEmoji[item.type] ?? fallbackEmoji}
                    </span>
                  )}
                </div>

                <div className="p-8">
                  <h3 
                    className="text-2xl font-bold mb-3 cursor-pointer hover:opacity-80" 
                    style={{ color: baseCard.color }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.name}
                  </h3>
                  {showDescriptions && (
                    <p className="mb-6 text-lg" style={{ color: baseCard.color }}>
                      {item.description ?? 'Perfect for any event or party!'}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    {showPrices && (
                      <span className="text-2xl font-bold" style={{ color: priceColour as string }}>
                        ${item.price}/day
                      </span>
                    )}

                    <Button
                      size="default"
                      className="px-6 py-2 font-bold hover:scale-105 transition-transform duration-300"
                      style={buttonStyles}
                      onClick={handleBookingClick}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* subtle radial accents for a bit of flair */}
      <div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${colors.primary}1A, transparent 70%)` }}
      />
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, ${colors.accent}1A, transparent 70%)` }}
      />
    </section>
  );
}
