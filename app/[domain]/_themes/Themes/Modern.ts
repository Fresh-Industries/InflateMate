// themeConfig.ts

import { ThemeDefinition, ThemeColors } from '../types';
import { makeButtonStyles, makeLinkStyles } from '../themeFactories';
import { radii, shadows, borderWidths } from '../tokens';
import { getContrastColor } from '../utils';

export const modernOverrides: Partial<ThemeDefinition> = {
  // Header
  headerBg:       (colors: ThemeColors) => colors.primary,
  boxShadow:      (_c, scrolled) => scrolled ? shadows.light : shadows.medium,
  extraBorderStyle:(colors) => ({
    borderBottom: `1px solid ${colors.primary}33`
  }),

  // Buttons
  buttonStyles:          makeButtonStyles({}, { role: 'primary', size: 'lg' }),
  secondaryButtonStyles: makeButtonStyles({}, { role: 'secondary', size: 'md' }),

  // Links
  linkStyles: makeLinkStyles({}, { role: 'accent' }),

  // Cards
  cardStyles: {
    background:   (c) => c.primary,
    border:       (c) => `${borderWidths.thin} solid ${c.primary}33`,
    boxShadow:    () => shadows.light,
    textColor:    (c) => c.text,
    borderRadius: radii.large,
  },

  // Hero
  heroBackground: (c) => c.primary,
  heroTitleColor: (c) => c.text,
  heroTextColor:  (c) => c.text,

  // Feature Section
  featureSectionStyles: {
    titleColor:      (c) => c.text,
    cardBackground:  (c) => c.primary,
    iconBackground:  (c, i) => {
      const a = c.accent;
      const s = c.secondary;
      return [ `${s}50`, `${a}50`, `${s}50` ][i % 3];
    },
    cardTitleColor:  (c) => c.text,
    cardTextColor:   (c) => c.text,
    iconBorder:      (c) => `1px solid ${c.primary}33`,
    iconBoxShadow:   () => shadows.light,
    iconBorderRadius:() => radii.medium,
  },

  // Popular Rentals
  popularRentalsStyles: {
    background: (c) => ({
      backgroundImage: `
        linear-gradient(
          135deg,
          ${c.primary},
          ${c.secondary}
        )
      `
    }),
    titleColor:            (c) => c.text,
    cardBackgroundGradient:(c) => {
      const a = c.accent;
      return `linear-gradient(135deg, ${a}100, ${a}500)`;
    },
    priceColor:            (c) => c.accent,
  },

  // CTA
  ctaStyles: {
    background: (c) => c.accent,
    titleColor: (c) => getContrastColor(c.accent),
    textColor:  (c) => getContrastColor(c.accent),
  },

  // Contact
  contactStyles: {
    background:               (c) => c.background,
    titleColor:               (c) => c.primary,
    cardBackground:           (c) => c.primary,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iconBackground:           (c) => c.primary,
    textColor:                (c) => c.text,
    serviceAreaTagBackground: (c) => c.primary,
    serviceAreaTagColor:      (c) => c.primary,
    cardBorder:               (c) => `${borderWidths.thin} solid ${c.primary}`,
    cardBoxShadow:            () => shadows.light,
  },

  // Footer
  footerStyles: {
    background: (c) => c.primary,
    textColor:  (c) => getContrastColor(c.secondary),
    border:     (c) => `${borderWidths.medium} solid ${c.secondary}`,
    boxShadow:  () => shadows.heavy,
  },

  // Inherit bookingStyles from base or factories
  bookingStyles: undefined,

  // ImageTextSection
  imageTextStyles: {
    containerBackground: (c) => c.primary,
    titleColor:          (c) => c.primary,
    textColor:           (c) => c.text,
    imageContainerStyle: () => ({ borderRadius: radii.small, boxShadow: shadows.light }),
  },

  // Images
  imageStyles: () => ({ borderRadius: radii.medium, boxShadow: shadows.medium }),
};
