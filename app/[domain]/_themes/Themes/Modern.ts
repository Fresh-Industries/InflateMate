// Modern Theme

import { ThemeDefinition, ThemeColors } from '../types';
import { makeButtonStyles, makeLinkStyles } from '../themeFactories';
import { radii, shadows, borderWidths } from '../tokens';
import { getContrastColor } from '../utils';

export const modernOverrides: Partial<ThemeDefinition> = {
  // Header
  headerBg: (c: ThemeColors) => c.primary[100],
  boxShadow: (_c, scrolled) => scrolled ? shadows.light : 'none',
  extraBorderStyle: (c: ThemeColors) => ({
    borderBottom: `1px solid ${c.primary[100]}33`
  }),

  // Buttons
  buttonStyles: makeButtonStyles({
    background: (c: ThemeColors) => c.primary[500],
    textColor: () => '#ffffff',
    hoverBackground: (c: ThemeColors) => c.accent[500]
  }, { role: 'primary', size: 'lg' }),
  secondaryButtonStyles: makeButtonStyles({
    background: () => 'transparent',
    textColor: (c: ThemeColors) => c.secondary[900],
    border: (c: ThemeColors) => `${borderWidths.thin} solid ${c.secondary[500]}`,
    hoverBackground: (c: ThemeColors) => c.secondary[100]
  }, { role: 'secondary', size: 'md' }),

  // Links
  linkStyles: makeLinkStyles({}, { role: 'secondary' }),

  // Cards
  cardStyles: {
    background: (c) => c.background[100],
    border: (c) => `${borderWidths.thin} solid ${c.primary[100]}33`,
    boxShadow: () => shadows.light,
    textColor: (c) => c.text[900],
    borderRadius: radii.large,
  },

  // Hero
  heroBackground: (c) => c.primary[100],
  heroTitleColor: (c) => c.primary[900],
  heroTextColor: (c) => c.text[900],
  heroAccentElements(colors) {
    return {
      topLeft: {
        background: colors.primary[500],
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        opacity: 0.2,
        pointerEvents: 'none',
      },
      topRight: {
        background: colors.secondary[500],
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        opacity: 0.2,
        pointerEvents: 'none',
      },
      bottomLeft: {
        background: colors.accent[900],
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        opacity: 0.2,
        pointerEvents: 'none',
      },
      bottomRight: {
        background: colors.primary[900],
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        opacity: 0.2,
        pointerEvents: 'none',
      }
    }
  },

  // Feature Section
  featureSectionStyles: {
    titleColor: (c) => c.text[900],
    cardBackground: (c) => c.secondary[100],
    iconBackground: (c, i) => {
      const a = c.accent;
      const s = c.secondary;
      return [ s[100], a[100], s[100] ][i % 3];
    },
    cardTitleColor: (c) => c.text[900],
    cardTextColor: (c) => c.text[500],
    iconBorder: (c) => `1px solid ${c.primary[100]}33`,
    iconBoxShadow: () => shadows.light,
    iconBorderRadius: () => radii.medium,
  },

  // Popular Rentals
  popularRentalsStyles: {
    background: (c) => c.primary[100],
    titleColor: (c) => c.text[900],
    cardBackgroundGradient: (c) =>
      `linear-gradient(135deg, ${c.accent[100]}, ${c.accent[500]})`,
    priceColor: (c) => c.accent[500],
  },

  // CTA
  ctaStyles: {
    background: (c) => c.accent[500],
    titleColor: (c) => getContrastColor(c.accent[500]),
    textColor: (c) => getContrastColor(c.accent[500]),
  },

  // Contact
  contactStyles: {
    background: (c) => c.background[100],
    titleColor: (c) => c.primary[500],
    cardBackground: (c) => c.background[100],
    iconBackground: (c: ThemeColors, type: "primary" | "secondary" | "accent") => {
      return c[type][100];
    },
    textColor: (c) => c.text[900],
    serviceAreaTagBackground: (c) => c.primary[100],
    serviceAreaTagColor: (c) => c.primary[500],
    cardBorder: (c) => `${borderWidths.thin} solid ${c.primary[100]}33`,
    cardBoxShadow: () => shadows.light,
  },

  // Footer
  footerStyles: {
    background: (c) => c.primary[100],
    textColor: (c) => c.text[900],
    border: (c) => `${borderWidths.medium} solid ${c.secondary[500]}`,
    boxShadow: () => shadows.heavy,
    socialIconStyles: (c) => ({
      background: c.primary[100],
      color: c.text[900],
      border: `1px solid ${c.primary[100]}33`,
      boxShadow: shadows.light,
    }),
  },

  // Inherit bookingStyles from base or factories
  bookingStyles: undefined,

  // ImageTextSection
  imageTextStyles: {
    containerBackground: (c) => c.background[100],
    titleColor: (c) => c.primary[500],
    textColor: (c) => c.text[900],
    imageContainerStyle: () => ({ borderRadius: radii.small, boxShadow: shadows.light }),
  },

  // Images
  imageStyles: () => ({ borderRadius: radii.medium, boxShadow: shadows.medium }),
};