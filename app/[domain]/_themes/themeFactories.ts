/* eslint-disable @typescript-eslint/no-unused-vars */
// themeFactories.ts
// Factory helpers to generate complex sub-configurations with sensible defaults

import { BookingStylesConfig, ButtonStylesConfig, CardStylesConfig, LinkStylesConfig, ThemeColors } from './types';
import { radii, shadows, borderWidths, brandColors, semanticColors, typography, motion } from './tokens';
import type { ColorScale } from './utils';
import { makeScale } from './utils';
import { getContrastColor } from './utils';

// Button styles factory
export function makeButtonStyles(
  overrides: Partial<ButtonStylesConfig> = {},
  opts?: { role?: keyof typeof brandColors; size?: keyof typeof typography.sizes }
): ButtonStylesConfig {
  const role = opts?.role || 'primary';
  const size = opts?.size || 'md';
  const baseScale = (c: ThemeColors) => makeScale(c[role]);
  const base: ButtonStylesConfig = {
    background: (c: ThemeColors) => baseScale(c)[500],
    textColor: (c: ThemeColors) => getContrastColor(baseScale(c)[500]),
    border: (c: ThemeColors) => `${borderWidths.thin} solid ${baseScale(c)[500]}`,
    boxShadow: (_: ThemeColors) => shadows.light,
    hoverBackground: (c: ThemeColors) => baseScale(c)[900],
    hoverTextColor: (c: ThemeColors) => getContrastColor(baseScale(c)[900]),
    hoverBorder: (c: ThemeColors) => `${borderWidths.thin} solid ${baseScale(c)[900]}`,
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
    background: (c: ThemeColors) => c.background,
    border: (c: ThemeColors) => `${borderWidths.thin} solid ${c.primary}33`,
    boxShadow: (_: ThemeColors) => shadows.light,
    textColor: (c: ThemeColors) => c.text,
    borderRadius: radii.medium,
  };
  return { ...base, ...overrides };
}

// Link styles factory
export function makeLinkStyles(
  overrides: Partial<LinkStylesConfig> = {},
  opts?: { role?: keyof typeof brandColors }
): LinkStylesConfig {
  const role = opts?.role || 'primary';
  const baseScale = (c: ThemeColors) => makeScale(c[role]);
  const base: LinkStylesConfig = {
    background: (_: ThemeColors) => 'transparent',
    textColor: (c: ThemeColors) => baseScale(c)[500],
    border: (_: ThemeColors) => 'none',
    boxShadow: (_: ThemeColors) => 'none',
    hoverBackground: (c: ThemeColors) => baseScale(c)[100],
    hoverTextColor: (c: ThemeColors) => getContrastColor(baseScale(c)[100]),
    hoverBorder: (_: ThemeColors) => 'none',
    hoverBoxShadow: (_: ThemeColors) => 'none',
    transition: `all ${motion.duration.normal} ${motion.easing.easeIn}`,
    active: (c: ThemeColors) => baseScale(c)[900],
    borderRadius: radii.medium,
  };
  return { ...base, ...overrides };
}

// Booking styles factory
export function makeBookingStyles(overrides: Partial<BookingStylesConfig> = {}): BookingStylesConfig {
  const baseScale = (c: ThemeColors) => makeScale(c.primary);
  const base: BookingStylesConfig = {
    formBackground: (c: ThemeColors) => c.background,
    formBorder: (c: ThemeColors) => `${borderWidths.thin} solid ${baseScale(c)[500]}20`,
    formShadow: (_: ThemeColors) => shadows.light,
    formTextColor: (c: ThemeColors) => c.text,
    stepBackground: (c, active: boolean) => (active ? baseScale(c)[500] : 'transparent'),
    stepBorder: (c, active: boolean) => `${borderWidths.medium} solid ${active ? baseScale(c)[500] : baseScale(c)[100]}40`,
    stepTextColor: (c: ThemeColors, active: boolean) => (active ? baseScale(c)[500] : c.text),
    stepIconColor: (c: ThemeColors, active: boolean) => (active ? getContrastColor(baseScale(c)[500]) : c.text),
    availabilityCard: {
      background: (c: ThemeColors) => c.background,
      border: (c, sel: boolean) => `${borderWidths.thin} solid ${sel ? baseScale(c)[500] : baseScale(c)[100]}20`,
      shadow: (_: ThemeColors) => shadows.light,
      hoverShadow: (_: ThemeColors) => shadows.medium,
      selectedBackground: (c: ThemeColors) => `${baseScale(c)[100]}10`,
      imageContainer: (c: ThemeColors) => `${baseScale(c)[100]}10`,
      priceTag: {
        background: (c: ThemeColors) => baseScale(c)[500],
        color: (c: ThemeColors) => getContrastColor(baseScale(c)[500]),
      },
      specContainer: {
        background: (c: ThemeColors) => `${baseScale(c)[100]}10`,
        border: (c: ThemeColors) => `${borderWidths.thin} solid ${baseScale(c)[100]}20`,
      },
    },
    summaryCard: {
      background: (c: ThemeColors) => c.background,
      border: (c: ThemeColors) => `${borderWidths.thin} dashed ${baseScale(c)[500]}`,
      shadow: (_: ThemeColors) => shadows.light,
      headerBackground: (c: ThemeColors) => `${baseScale(c)[100]}20`,
      rowBackground: (c: ThemeColors, alt: boolean) => (alt ? `${baseScale(c)[100]}10` : c.background),
    },
    input: {
      background: (_: ThemeColors) => '#ffffff',
      border: (c: ThemeColors) => `1px dashed ${baseScale(c)[100]}`,
      focusBorder: (c: ThemeColors) => baseScale(c)[500],
      placeholderColor: (_: ThemeColors) => 'rgba(0,0,0,0.4)',
      labelColor: (c: ThemeColors) => c.text,
    },
    timeSlot: {
      background: (c: ThemeColors, avail: boolean) => (avail ? '#ffffff' : `${baseScale(c)[100]}20`),
      border: (c: ThemeColors, avail: boolean) => `${borderWidths.thin} dashed ${avail ? baseScale(c)[500] : baseScale(c)[100]}`,
      textColor: (c: ThemeColors, avail: boolean) => (avail ? c.text : baseScale(c)[100]),
    },
  };
  return { ...base, ...overrides };
}