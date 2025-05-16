// app/[domain]/_components/FeatureGrid.tsx
// Server component — no client‑side JS bundle.
// Renders a 3‑column (1 on mobile) grid of feature cards that automatically adapts
// to the active theme + brand colours.

import React from 'react';
import { ThemeColors } from '../../_themes/types';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
export interface FeatureItem {
  icon: string;   // Emoji or URL to an SVG – we just render whatever we get.
  title: string;
  description: string;
}

interface FeatureGridProps {
  items: FeatureItem[];
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
}

export default function FeatureGrid({ items, themeName, colors }: FeatureGridProps) {
  const theme = themeConfig[themeName];
  const featureStyles = theme.featureSectionStyles;
  const cardBase = theme.cardStyles;

  const featureTitleStyle: React.CSSProperties = {
    color: featureStyles ? featureStyles.titleColor(colors) : colors.primary[500],
  };

  const getCardStyle = (idx: number): React.CSSProperties => ({
    background: featureStyles ? featureStyles.cardBackground(colors, idx) : `${colors.primary}10`,
    borderRadius: cardBase.borderRadius || '16px',
    border: cardBase.border(colors),
    boxShadow: cardBase.boxShadow(colors),
    padding: '2rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  });

  const getIconContainerStyle = (idx: number): React.CSSProperties => ({
    background: featureStyles ? featureStyles.iconBackground(colors, idx) : `${colors.primary}20`,
    border: featureStyles ? featureStyles.iconBorder(colors, idx) : cardBase.border(colors),
    boxShadow: featureStyles ? featureStyles.iconBoxShadow(colors, idx) : cardBase.boxShadow(colors),
    borderRadius: featureStyles ? featureStyles.iconBorderRadius(colors) : '9999px',
    width: '5rem',
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2rem',
  });

  const getTitleStyle = (idx: number): React.CSSProperties => ({
    color: featureStyles ? featureStyles.cardTitleColor(colors, idx) : colors.primary[500],
  });

  const textStyle: React.CSSProperties = {
    color: featureStyles ? featureStyles.cardTextColor(colors) : '#6b7280',
  };

  return (
    <section className="py-20" style={{ background: colors.background[500] }}>
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-5xl font-bold text-center mb-16"
          style={featureTitleStyle}
        >
          Why Choose Our Bounce Houses?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {items.map((item, idx) => (
            <div
              key={idx}
              style={getCardStyle(idx)}
              className="text-center hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Icon */}
              <div style={getIconContainerStyle(idx)}>
                <span>{item.icon}</span>
              </div>

              {/* Title */}
              <h3 style={getTitleStyle(idx)} className="text-2xl font-bold mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p style={textStyle} className="text-lg">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
