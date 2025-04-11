// themeConfig.ts

import React from 'react';
import { PartyPopper } from 'lucide-react';

export interface ThemeColors {
  primary: string;
  accent: string;
  secondary: string;
}

export interface ThemeDefinition {
  // Header styles
  headerBg: (colors: ThemeColors, scrolled: boolean) => string;
  boxShadow: (colors: ThemeColors, scrolled: boolean) => string;
  extraBorderStyle: (colors: ThemeColors) => React.CSSProperties;
  renderDecorations: (colors: ThemeColors) => React.ReactElement | null;
  // Button styles
  buttonStyles: {
    background: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
    border?: (colors: ThemeColors) => string;
    shadow?: (colors: ThemeColors) => string;
    hoverBackground: (colors: ThemeColors) => string;
    hoverTextColor?: (colors: ThemeColors) => string;
    hoverBorder?: (colors: ThemeColors) => string;
    hoverShadow?: (colors: ThemeColors) => string;
    transition?: string;
  };
  // Card styles
  cardStyles: {
    background: (colors: ThemeColors) => string;
    border: (colors: ThemeColors) => string;
    shadow: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
  };
  // Footer styles
  footerStyles: {
    background: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
    linkColor: (colors: ThemeColors) => string;
    linkHoverColor: (colors: ThemeColors) => string;
    borderColor: (colors: ThemeColors) => string;
  };
  // New styles
  heroBackground?: (colors: ThemeColors) => string;
  heroTitleColor?: (colors: ThemeColors) => string;
  heroTextColor?: (colors: ThemeColors) => string;
  // Feature section styles
  featureSectionStyles?: {
    titleColor: (colors: ThemeColors) => string;
    cardBackground: (colors: ThemeColors, index: number) => string;
    iconBackground: (colors: ThemeColors, index: number) => string;
    cardTitleColor: (colors: ThemeColors, index: number) => string;
    cardTextColor: (colors: ThemeColors) => string;
  };
  // Popular Rentals section styles
  popularRentalsStyles?: {
    background: (colors: ThemeColors) => string;
    titleColor: (colors: ThemeColors) => string;
    cardBackgroundGradient: (colors: ThemeColors) => string;
    priceColor: (colors: ThemeColors) => string;
  };
  // CTA section styles
  ctaStyles?: {
    background: (colors: ThemeColors) => string;
    titleColor: (colors: ThemeColors) => string;
    textColor: (colors: ThemeColors) => string;
  };
  // Contact section styles
  contactStyles?: {
    background: (colors: ThemeColors) => string;
    titleColor: (colors: ThemeColors) => string;
    cardBackground: (colors: ThemeColors) => string;
    iconBackground: (colors: ThemeColors, type: 'primary' | 'accent' | 'secondary') => string;
    textColor: (colors: ThemeColors) => string;
    serviceAreaTagBackground: (colors: ThemeColors, index: number) => string;
    serviceAreaTagColor: (colors: ThemeColors, index: number) => string;
  };
}

export const themeConfig: { [key: string]: ThemeDefinition } = {
  modern: {
    // Minimal, neutral header with a subtle gradient and faint shadow on scroll
    headerBg: (_colors, scrolled) =>
      scrolled ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.96)',
    boxShadow: (_colors, scrolled) =>
      scrolled ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    extraBorderStyle: (_colors) => ({}),
    // A single, crisp horizontal divider at the top center
    renderDecorations: (colors) => (
      <div
        className="absolute left-1/2 top-0 transform -translate-x-1/2"
        aria-hidden="true"
      >
        <hr style={{ width: '30%', borderTop: `1px solid ${colors.primary}` }} />
      </div>
    ),
    buttonStyles: {
      // Smooth and refined gradient
      background: (colors) =>
        `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      textColor: () => '#ffffff',
      hoverBackground: (colors) =>
        `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    },
    cardStyles: {
      background: () => '#ffffff',
      border: (colors) => `1px solid ${colors.primary}30`,
      shadow: () => '0 1px 4px rgba(0,0,0,0.08)',
      textColor: () => '#111111',
    },
    footerStyles: {
      background: () => '#f3f4f6',
      textColor: () => '#6b7280',
      linkColor: () => '#4b5563',
      linkHoverColor: (colors) => colors.primary,
      borderColor: () => '#e5e7eb',
    },
    heroBackground: (colors) => `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    heroTitleColor: () => '#ffffff',
    heroTextColor: () => '#ffffff',
    featureSectionStyles: {
      titleColor: (colors) => colors.primary,
      cardBackground: (colors, index) => [`${colors.primary}10`, `${colors.accent}10`, `${colors.secondary}10`][index % 3],
      iconBackground: (colors, index) => [`${colors.primary}20`, `${colors.accent}20`, `${colors.secondary}20`][index % 3],
      cardTitleColor: (colors, index) => [colors.primary, colors.accent, colors.secondary][index % 3],
      cardTextColor: () => '#6b7280',
    },
    popularRentalsStyles: {
      background: () => '#f8fafc',
      titleColor: (colors) => colors.primary,
      cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      priceColor: (colors) => colors.primary,
    },
    ctaStyles: {
      background: (colors) => `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
      titleColor: () => '#ffffff',
      textColor: () => '#ffffff',
    },
    contactStyles: {
      background: () => '#f3f4f6',
      titleColor: (colors) => colors.primary,
      cardBackground: () => '#ffffff',
      iconBackground: (colors, type) => ({ primary: `${colors.primary}20`, accent: `${colors.accent}20`, secondary: `${colors.secondary}20` }[type]),
      textColor: () => '#6b7280',
      serviceAreaTagBackground: (colors, index) => [`${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15`][index % 3],
      serviceAreaTagColor: (colors, index) => [colors.primary, colors.accent, colors.secondary][index % 3],
    }
  },
  playful: {
    // Vibrant multi-tone header that shouts fun with a bold gradient
    headerBg: (_colors, _scrolled) =>
      `linear-gradient(90deg, #FF6B6B, #FECF57, #48DBFB)`,
    boxShadow: (_colors, scrolled) =>
      scrolled ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
    extraBorderStyle: (_colors) => ({ borderBottom: '3px dashed #FECF57' }),
    // Lively decorative SVGs and animated icons invoke a playful spirit
    renderDecorations: (_colors) => (
      <>
        {/* Rotating Star */}
        <div className="absolute top-4 left-3 animate-spin-slow" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            strokeWidth="2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#FF6B6B' }}
          >
            <polygon points="12 2 15 8 22 9 17 14 18 21 12 18 6 21 7 14 2 9 9 8 12 2" />
          </svg>
        </div>
        {/* Pulsing Party Popper */}
        <div className="absolute bottom-3 right-4 animate-pulse" aria-hidden="true">
          <PartyPopper className="h-6 w-6" style={{ color: '#FECF57' }} />
        </div>
      </>
    ),
    buttonStyles: {
      background: (_colors) =>
        `linear-gradient(100deg, #FF6B6B, #FECF57)`,
      textColor: () => '#ffffff',
      border: () => `2px solid #48DBFB`,
      shadow: () => '0 2px 4px rgba(0,0,0,0.15)',
      hoverBackground: () =>
        `linear-gradient(100deg, #FECF57, #FF6B6B)`,
      hoverBorder: () => `2px solid #FF6B6B`,
      hoverShadow: () => '0 4px 8px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
    },
    cardStyles: {
      background: () => '#ffffff',
      border: () => '1px solid #48DBFB80',
      shadow: () => '0 4px 8px rgba(0,0,0,0.12)',
      textColor: () => '#333333',
    },
    footerStyles: {
      background: () =>
        `linear-gradient(180deg, #FF6B6B20, #FECF5720)`,
      textColor: () => '#333333',
      linkColor: () => '#FF6B6B',
      linkHoverColor: () => '#FECF57',
      borderColor: () => '#48DBFB40',
    },
    heroBackground: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
    heroTitleColor: () => '#ffffff',
    heroTextColor: () => '#ffffff',
    featureSectionStyles: {
      titleColor: () => '#FF6B6B',
      cardBackground: (_colors, index) => ['#FF6B6B20', '#FECF5720', '#48DBFB20'][index % 3],
      iconBackground: (_colors, index) => ['#FF6B6B40', '#FECF5740', '#48DBFB40'][index % 3],
      cardTitleColor: (_colors, index) => ['#FF6B6B', '#FECF57', '#48DBFB'][index % 3],
      cardTextColor: () => '#555',
    },
    popularRentalsStyles: {
      background: () => '#FFF5F5',
      titleColor: () => '#FF6B6B',
      cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      priceColor: () => '#FECF57',
    },
    ctaStyles: {
      background: (colors) => `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
      titleColor: () => '#ffffff',
      textColor: () => '#ffffff',
    },
    contactStyles: {
      background: () => '#FFFDF5',
      titleColor: () => '#FF6B6B',
      cardBackground: () => '#ffffff',
      iconBackground: (_colors, type) => ({ primary: '#FF6B6B40', accent: '#FECF5740', secondary: '#48DBFB40' }[type]),
      textColor: () => '#555',
      serviceAreaTagBackground: (_colors, index) => ['#FF6B6B30', '#FECF5730', '#48DBFB30'][index % 3],
      serviceAreaTagColor: (_colors, index) => ['#FF6B6B', '#FECF57', '#48DBFB'][index % 3],
    }
  },
  retro: {
    // A throwback header with an old-school, textured paper vibe
    headerBg: (_colors, _scrolled) => '#F3E7D1',
    boxShadow: (colors, scrolled) =>
      scrolled ? `inset 0 -4px 0 0 ${colors.primary}` : 'none',
    extraBorderStyle: (colors) => ({ borderBottom: `4px solid ${colors.primary}` }),
    // Retro decoration using bold lines and an off-kilter accent block
    renderDecorations: (colors) => (
      <>
        <div className="absolute top-0 left-0 w-full" aria-hidden="true">
          <div style={{ height: '2px', backgroundColor: colors.primary }} />
        </div>
        <div className="absolute bottom-0 right-0 transform rotate-6" aria-hidden="true">
          <div style={{ width: '40px', height: '4px', backgroundColor: colors.accent }} />
        </div>
      </>
    ),
    buttonStyles: {
      background: (colors) => colors.primary,
      textColor: (colors) => colors.accent,
      border: (colors) => `2px solid ${colors.secondary}`,
      shadow: (colors) => `4px 4px 0 ${colors.secondary}`,
      hoverBackground: (colors) => colors.secondary,
      hoverTextColor: (colors) => colors.primary,
      hoverBorder: (colors) => `2px solid ${colors.primary}`,
      hoverShadow: (colors) => `2px 2px 0 ${colors.primary}`,
      transition: 'all 0.25s ease',
    },
    cardStyles: {
      background: () => '#FFF8F0',
      border: (colors) => `2px solid ${colors.primary}`,
      shadow: () => '0 2px 6px rgba(0,0,0,0.1)',
      textColor: () => '#333333',
    },
    footerStyles: {
      background: (colors) => colors.accent,
      textColor: (colors) => colors.secondary,
      linkColor: (colors) => colors.primary,
      linkHoverColor: (colors) => colors.secondary,
      borderColor: (colors) => colors.primary,
    },
    heroBackground: (colors) => `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
    heroTitleColor: (colors) => colors.primary,
    heroTextColor: (colors) => colors.primary,
    featureSectionStyles: {
      titleColor: (colors) => colors.primary,
      cardBackground: (colors, index) => [colors.accent+'20', colors.secondary+'20', colors.primary+'20'][index % 3],
      iconBackground: (colors, index) => [colors.accent+'40', colors.secondary+'40', colors.primary+'40'][index % 3],
      cardTitleColor: (colors, index) => [colors.accent, colors.secondary, colors.primary][index % 3],
      cardTextColor: () => '#4a4a4a',
    },
    popularRentalsStyles: {
      background: () => '#F3E7D1',
      titleColor: (colors) => colors.primary,
      cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      priceColor: (colors) => colors.accent,
    },
    ctaStyles: {
      background: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      titleColor: (colors) => colors.accent,
      textColor: (colors) => colors.accent,
    },
    contactStyles: {
      background: () => '#FFF8F0',
      titleColor: (colors) => colors.primary,
      cardBackground: () => '#F3E7D1',
      iconBackground: (colors, type) => ({ primary: colors.primary+'40', accent: colors.accent+'40', secondary: colors.secondary+'40' }[type]),
      textColor: () => '#4a4a4a',
      serviceAreaTagBackground: (colors, index) => [colors.primary+'30', colors.accent+'30', colors.secondary+'30'][index % 3],
      serviceAreaTagColor: (colors, index) => [colors.primary, colors.accent, colors.secondary][index % 3],
    }
  },
  bouncey: {
    // A dynamic, energetic header with a bold, animated gradient and rounded edge flourish
    headerBg: (colors, _scrolled) =>
      `linear-gradient(145deg, ${colors.secondary}cc, ${colors.accent}cc)`,
    boxShadow: (_colors, scrolled) =>
      scrolled ? '0 5px 15px rgba(0,0,0,0.3)' : '0 3px 8px rgba(0,0,0,0.2)',
    extraBorderStyle: (colors) => ({
      borderBottom: `5px solid ${colors.primary}`,
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
    }),
    // Bouncy decorations with animated circles that bring lively motion
    renderDecorations: (colors) => (
      <>
        <div
          className="absolute top-2 left-5 w-5 h-5 rounded-full animate-bounce"
          style={{ backgroundColor: colors.primary }}
          aria-hidden="true"
        />
        <div
          className="absolute top-6 right-3 w-6 h-6 rounded-full animate-bounce animation-delay-2000"
          style={{ backgroundColor: colors.accent }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-2 right-10 w-4 h-4 rounded-full animate-bounce"
          style={{ backgroundColor: colors.secondary }}
          aria-hidden="true"
        />
      </>
    ),
    buttonStyles: {
      background: (colors) =>
        `linear-gradient(160deg, ${colors.primary}, ${colors.accent})`,
      textColor: () => '#ffffff',
      shadow: () => '0 3px 6px rgba(0,0,0,0.1)',
      hoverBackground: (colors) =>
        `linear-gradient(160deg, ${colors.accent}, ${colors.primary})`,
      hoverShadow: () => '0 5px 10px rgba(0,0,0,0.15)',
      transition: 'all 0.3s ease',
    },
    cardStyles: {
      background: () => '#ffffff',
      border: (colors) => `1px solid ${colors.accent}80`,
      shadow: () => '0 4px 10px rgba(0,0,0,0.12)',
      textColor: () => '#222222',
    },
    footerStyles: {
      background: (colors) => `${colors.secondary}20`,
      textColor: (colors) => `${colors.primary}B0`,
      linkColor: (colors) => colors.accent,
      linkHoverColor: (colors) => colors.primary,
      borderColor: (colors) => `${colors.accent}40`,
    },
    heroBackground: (colors) => `linear-gradient(145deg, ${colors.primary}, ${colors.accent})`,
    heroTitleColor: () => '#ffffff',
    heroTextColor: () => '#ffffff',
    featureSectionStyles: {
      titleColor: (colors) => colors.primary,
      cardBackground: (colors, index) => [`${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15`][index % 3],
      iconBackground: (colors, index) => [`${colors.primary}30`, `${colors.accent}30`, `${colors.secondary}30`][index % 3],
      cardTitleColor: (colors, index) => [colors.primary, colors.accent, colors.secondary][index % 3],
      cardTextColor: () => '#444',
    },
    popularRentalsStyles: {
      background: () => '#f7faff',
      titleColor: (colors) => colors.primary,
      cardBackgroundGradient: (colors) => `linear-gradient(160deg, ${colors.primary}, ${colors.accent})`,
      priceColor: (colors) => colors.accent,
    },
    ctaStyles: {
      background: (colors) => `linear-gradient(160deg, ${colors.secondary}, ${colors.primary})`,
      titleColor: () => '#ffffff',
      textColor: () => '#ffffff',
    },
    contactStyles: {
      background: () => '#fafbff',
      titleColor: (colors) => colors.primary,
      cardBackground: () => '#ffffff',
      iconBackground: (colors, type) => ({ primary: `${colors.primary}30`, accent: `${colors.accent}30`, secondary: `${colors.secondary}30` }[type]),
      textColor: () => '#444',
      serviceAreaTagBackground: (colors, index) => [`${colors.primary}20`, `${colors.accent}20`, `${colors.secondary}20`][index % 3],
      serviceAreaTagColor: (colors, index) => [colors.primary, colors.accent, colors.secondary][index % 3],
    },
  }
};
