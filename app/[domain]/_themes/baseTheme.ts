import { ThemeDefinition, ThemeColors } from './types';
import { makeBookingStyles, makeButtonStyles } from './themeFactories';
import { radii, shadows, motion, borderWidths } from './tokens';
import { getContrastColor }              from './utils';

export const baseTheme: Partial<ThemeDefinition> = {
  headerBg:      (c: ThemeColors) => c.primary[100],
  headerTextColor:(c: ThemeColors) => c.text[900],
  boxShadow:     (_c, sc) => sc ? shadows.light : shadows.medium,
  extraBorderStyle: () => ({}),



  // Use your factory for both button sets
  buttonStyles:           makeButtonStyles({}, { role: 'primary' }),
  secondaryButtonStyles:  makeButtonStyles({}, { role: 'secondary' }),

  // Links
  linkStyles: {
    background: () => 'transparent',
    textColor:  (c) => c.text[500],
    border:     () => 'none',
    boxShadow:  () => shadows.light,
    hoverBackground: (c) => c.primary[900],
    hoverTextColor:  (c) => getContrastColor(c.primary[900]),
    hoverBorder:     () => `${borderWidths.thin} solid currentColor`,
    hoverBoxShadow:  () => shadows.medium,
    transition:  motion.duration.normal + ' ' + motion.easing.easeIn,
    borderRadius: radii.medium,
    active:      (c) => c.primary[900],
    activeBoxShadow: (c) => `inset 0 0 0 2px ${c.primary[900]}`,
  },

  // Cards
  cardStyles: {
    background: (c) => c.primary[100],
    border:     (c) => `${borderWidths.thin} solid ${c.primary[500]}33`,
    boxShadow:  () => shadows.light,
    textColor:  (c) => c.primary[900],
    borderRadius: radii.medium,
  },

  // Booking (safe no‑ops if nothing overridden)
  bookingStyles: makeBookingStyles(),

  // Image/Text
  imageTextStyles: {
    containerBackground: (c) => c.primary[100],
    titleColor:          (c) => c.primary[500],
    textColor:           (c) => c.primary[900],
    imageContainerStyle: () => ({ borderRadius: radii.small }),
  },
  imageStyles: () => ({ boxShadow: shadows.light, borderRadius: radii.small }),

  // You can add minimal defaults for any other blocks here...
};
