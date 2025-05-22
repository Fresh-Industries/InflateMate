/* eslint-disable @typescript-eslint/no-unused-vars */
// themeFactories.ts
// Factory helpers to generate complex sub-configurations with sensible defaults

import { BookingStylesConfig, ButtonStylesConfig, CardStylesConfig, LinkStylesConfig, ThemeColors } from './types';
import { radii, shadows, borderWidths, brandColors, semanticColors, typography, motion } from './tokens';
import { getContrastColor } from './utils';

// Button styles factory
export function makeButtonStyles(
  overrides: Partial<ButtonStylesConfig> = {},
  opts?: { role?: keyof ThemeColors; size?: keyof typeof typography.sizes }
): ButtonStylesConfig {
  const role = opts?.role || 'primary';
  const size = opts?.size || 'md';
  const base: ButtonStylesConfig = {
    background: (c: ThemeColors) => c[role][500],
    textColor: (c: ThemeColors) => getContrastColor(c[role][500]),
    border: (c: ThemeColors) => `${borderWidths.thin} solid ${c[role][500]}`,
    boxShadow: (_: ThemeColors) => shadows.light,
    hoverBackground: (c: ThemeColors) => c[role][900],
    hoverTextColor: (c: ThemeColors) => getContrastColor(c[role][900]),
    hoverBorder: (c: ThemeColors) => `${borderWidths.thin} solid ${c[role][900]}`,
    hoverBoxShadow: (_: ThemeColors) => shadows.medium,
    transition: `all ${motion.duration.normal} ${motion.easing.easeIn}`,
    borderRadius: radii.medium,
    fontWeight: String(typography.weights.bold),
    fontSize: typography.sizes[size],
  };
  return { ...base, ...overrides };
}

// Card styles factory
export function makeCardStyles(overrides: Partial<CardStylesConfig> = {}): CardStylesConfig {
  const base: CardStylesConfig = {
    background: (c: ThemeColors) => c.background[100],
    border: (c: ThemeColors) => `${borderWidths.thin} solid ${c.primary[500]}33`,
    boxShadow: (_: ThemeColors) => shadows.light,
    textColor: (c: ThemeColors) => c.text[900],
    borderRadius: radii.medium,
  };
  return { ...base, ...overrides };
}

// Link styles factory
export function makeLinkStyles(
  overrides: Partial<LinkStylesConfig> = {},
  opts?: { role?: keyof ThemeColors }
): LinkStylesConfig {
  const role = opts?.role || 'primary';
  const base: LinkStylesConfig = {
    background: (_: ThemeColors) => 'transparent',
    textColor: (c: ThemeColors) => c.text[500],
    border: (_: ThemeColors) => 'none',
    boxShadow: (_: ThemeColors) => 'none',
    hoverBackground: (c: ThemeColors) => c[role][100],
    hoverTextColor: (c: ThemeColors) => getContrastColor(c[role][100]),
    hoverBorder: (_: ThemeColors) => 'none',
    hoverBoxShadow: (_: ThemeColors) => 'none',
    transition: `all ${motion.duration.normal} ${motion.easing.easeIn}`,
    active: (c: ThemeColors) => c[role][900],
    borderRadius: radii.medium,
  };
  return { ...base, ...overrides };
}

// Booking styles factory
export function makeBookingStyles(overrides: Partial<BookingStylesConfig> = {}): BookingStylesConfig {
  const base: BookingStylesConfig = {
    formBackground: (c: ThemeColors) => c.background[100],
    formBorder: (c: ThemeColors) => `${borderWidths.thin} solid ${c.primary[500]}20`,
    formShadow: (_: ThemeColors) => shadows.light,
    formTextColor: (c: ThemeColors) => c.text[900],
    stepBackground: (c, active: boolean) => (active ? c.primary[500] : 'transparent'),
    stepBorder: (c, active: boolean) => `${borderWidths.medium} solid ${active ? c.primary[500] : c.primary[100]}40`,
    stepTextColor: (c: ThemeColors, active: boolean) => (active ? c.primary[500] : c.text[900]),
    stepIconColor: (c: ThemeColors, active: boolean) => (active ? getContrastColor(c.primary[500]) : c.text[900]),
    title: (c: ThemeColors) => ({ color: c.primary[900], fontWeight: 'bold' }),
    subtitle: (c: ThemeColors) => ({ color: c.text[500] }),
    availabilityCard: {
      background: (c: ThemeColors) => c.background[100],
      border: (c, sel: boolean) => `${borderWidths.thin} solid ${sel ? c.primary[500] : c.primary[100]}20`,
      shadow: (_: ThemeColors) => shadows.light,
      hoverShadow: (_: ThemeColors) => shadows.medium,
      selectedBackground: (c: ThemeColors) => `${c.primary[100]}10`,
      imageContainer: (c: ThemeColors) => `${c.primary[100]}10`,
      priceTag: {
        background: (c: ThemeColors) => c.primary[500],
        color: (c: ThemeColors) => getContrastColor(c.primary[500]),
      },
      specContainer: {
        background: (c: ThemeColors) => `${c.primary[100]}10`,
        border: (c: ThemeColors) => `${borderWidths.thin} solid ${c.primary[100]}20`,
      },
    },
    summaryCard: {
      background: (c: ThemeColors) => c.background[100],
      border: (c: ThemeColors) => `${borderWidths.thin} dashed ${c.primary[500]}`,
      shadow: (_: ThemeColors) => shadows.light,
      headerBackground: (c: ThemeColors) => `${c.primary[100]}20`,
      rowBackground: (c: ThemeColors, alt: boolean) => (alt ? `${c.primary[100]}10` : c.background[100]),
    },
    input: {
      background: (_: ThemeColors) => '#ffffff',
      border: (c: ThemeColors) => `1px dashed ${c.primary[100]}`,
      focusBorder: (c: ThemeColors) => c.primary[500],
      placeholderColor: (_: ThemeColors) => 'rgba(0,0,0,0.4)',
      labelColor: (c: ThemeColors) => c.text[900],
    },
    timeSlot: {
      background: (c: ThemeColors, avail: boolean) => (avail ? '#ffffff' : `${c.primary[100]}20`),
      border: (c: ThemeColors, avail: boolean) => `${borderWidths.thin} dashed ${avail ? c.primary[500] : c.primary[100]}`,
      textColor: (c: ThemeColors, avail: boolean) => (avail ? c.text[900] : c.primary[100]),
    },
  };
  return { ...base, ...overrides };
}