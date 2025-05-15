// themeConfig.ts

import { ThemeDefinition } from '../types';
import { getContrastColor } from '../utils';
import { transitions } from '../tokens';



export const playfulOverrides: Partial<ThemeDefinition> = {
  headerBg: (colors) => colors.primary,
  boxShadow: (_, scrolled) => scrolled ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 6px rgba(0,0,0,0.05)',
  extraBorderStyle: (colors) => ({ borderBottom: `4px solid ${colors.accent}` }),
  buttonStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.accent}`,
    boxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
    hoverBackground: (colors) => colors.secondary,
    hoverTextColor: (colors) => colors.text,
    hoverBorder: (colors) => `4px solid ${colors.accent}`,
    hoverBoxShadow: (colors) => `0px 0px 0 ${colors.primary}`,
    transition: transitions.default,
    borderRadius: '9999px',
  },
  secondaryButtonStyles: {
    background: () => 'transparent',
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.accent}`,
    boxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
    hoverBackground: (colors) => colors.primary,
    hoverTextColor: (colors) => getContrastColor(colors.primary),
    hoverBorder: (colors) => `4px solid ${colors.accent}`,
    hoverBoxShadow: (colors) => `0px 0px 0 ${colors.primary}`,
    transition: transitions.default,
    borderRadius: '9999px',
  },
  cardStyles: {
    background: (colors) => colors.background,
    border: (colors) => `3px solid ${colors.accent}`,
    boxShadow: () => '0 4px 8px rgba(0,0,0,0.12)',
    textColor: (colors) => getContrastColor(colors.background),
    borderRadius: '20px',
  },
  heroBackground: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
  heroTitleColor: (colors) => colors.text,
  heroTextColor: (colors) => colors.secondary,
  featureSectionStyles: {
    titleColor: (colors) => colors.primary,
    cardBackground: (colors, index) => [ `${colors.primary}90`, `${colors.accent}90`, `${colors.secondary}90` ][index % 3],
    iconBackground: (colors, index) => [ `${colors.primary}`, `${colors.accent}`, `${colors.secondary}` ][index % 3],
    cardTitleColor: (colors) => colors.text,
    cardTextColor: (colors) => colors.secondary,
    iconBorder: (colors) => `4px solid ${colors.primary}33`,
    iconBoxShadow: () => '0 4px 8px rgba(0,0,0,0.15)',
    iconBorderRadius: () => '16px',
  },
  popularRentalsStyles: {
    background: (colors) => ({
      backgroundColor: colors.background || '#ffffff',
      backgroundImage: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary}),\n          radial-gradient(circle at 15% 85%, ${colors.primary}25, transparent 50%),\n          radial-gradient(circle at 85% 25%, ${colors.secondary}25, transparent 50%)`,
    }),
    titleColor: (colors) => colors.text,
    cardBackgroundGradient: (colors) => `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    priceColor: (colors) => colors.accent,
  },
  ctaStyles: {
    background: (colors) => `linear-gradient(135deg, ${colors.accent}, ${colors.accent}90)`,
    titleColor: (colors) => getContrastColor(colors.accent),
    textColor: (colors) => getContrastColor(colors.accent),
  },
  contactStyles: {
    background: (colors) => `${colors.background}f5`,
    titleColor: (colors) => colors.primary,
    cardBackground: (colors) => `${colors.background}ff`,
    iconBackground: (colors, type) => ({ primary: `${colors.primary}30`, accent: `${colors.accent}30`, secondary: `${colors.secondary}30` }[type]),
    textColor: (colors) => colors.text,
    serviceAreaTagBackground: (colors, index) => [ `${colors.primary}20`, `${colors.accent}20`, `${colors.secondary}20` ][index % 3],
    serviceAreaTagColor: (colors, index) => [ colors.primary, colors.accent, colors.secondary ][index % 3],
    cardBorder: (colors) => `2px solid ${colors.accent}`,
    cardBoxShadow: (colors) => `0 4px 8px ${colors.secondary}20`,
  },
  footerStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => getContrastColor(colors.primary),
    border: (colors) => `4px solid ${colors.secondary}`,
    boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
  },
  linkStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => colors.text,
    border: (colors) => `2px solid ${colors.accent}`,
    boxShadow: (colors) => `0 0 0 ${colors.secondary}00`,
    hoverBackground: (colors) => colors.primary,
    hoverTextColor: (colors) => colors.text,
    hoverBorder: (colors) => `2px solid ${colors.accent}`,
    hoverBoxShadow: (colors) => `0 0 0 ${colors.secondary}00`,
    transition: transitions.default,
    active: (colors) => colors.secondary,
    borderRadius: '9999px',
  },
  imageStyles: (colors) => ({
    border: `2px solid ${colors.accent}`,
    borderRadius: '20px',
    boxShadow: `0 6px 10px ${colors.secondary}30`,
    transition: transitions.default,
  }),
  bookingStyles: undefined,
  imageTextStyles: {
    containerBackground: (colors) => colors.background,
    titleColor: (colors) => colors.primary,
    textColor: (colors) => getContrastColor(colors.background),
    imageContainerStyle: (colors) => ({
      border: `3px dashed ${colors.accent}`,
      borderRadius: '20px',
      boxShadow: '0 6px 10px rgba(0,0,0,0.12)',
    }),
  },
};


