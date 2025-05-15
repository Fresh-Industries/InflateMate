import { ThemeDefinition, ThemeColors } from './types';
import { makeBookingStyles, makeButtonStyles } from './themeFactories';
import { radii, shadows, motion, borderWidths, brandColors } from './tokens';
import { getContrastColor }              from './utils';

export const baseTheme: Partial<ThemeDefinition> = {
  headerBg:      (c: ThemeColors) => c.primary[100],
  headerTextColor:(c: ThemeColors) => c.text,
  boxShadow:     (_c, sc) => sc ? shadows.light : shadows.medium,
  extraBorderStyle: () => ({}),

  // Use your factory for both button sets
  buttonStyles:           makeButtonStyles({}, { role: 'primary' }),
  secondaryButtonStyles:  makeButtonStyles({}, { role: 'secondary' }),

  // Links
  linkStyles: {
    background: () => 'transparent',
    textColor:  () => brandColors.primary[500],
    border:     () => 'none',
    boxShadow:  () => shadows.light,
    hoverBackground: () => brandColors.primary[900],
    hoverTextColor:  () => getContrastColor(brandColors.primary[900]),
    hoverBorder:     () => `${borderWidths.thin} solid currentColor`,
    hoverBoxShadow:  () => shadows.medium,
    transition:  motion.duration.normal + ' ' + motion.easing.easeIn,
    borderRadius: radii.medium,
    active:      () => brandColors.primary[900],
  },

  // Cards
  cardStyles: {
    background: () => brandColors.primary[100],
    border:     () => `${borderWidths.thin} solid ${brandColors.primary[500]}33`,
    boxShadow:  () => shadows.light,
    textColor:  () => brandColors.primary[500],
    borderRadius: radii.medium,
  },

  // Booking (safe no‑ops if nothing overridden)
  bookingStyles: makeBookingStyles(),

  // Image/Text
  imageTextStyles: {
    containerBackground: () => brandColors.primary[100],
    titleColor:          () => brandColors.primary[500],
    textColor:           () => brandColors.primary[500],
    imageContainerStyle: () => ({ borderRadius: radii.small }),
  },
  imageStyles: () => ({ boxShadow: shadows.light, borderRadius: radii.small }),

  // You can add minimal defaults for any other blocks here...
};
