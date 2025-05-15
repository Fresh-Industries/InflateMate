// themeConfig.ts

import { ThemeDefinition } from '../types';
import { getContrastColor } from '../utils';
import { transitions } from '../tokens';

export const retroOverrides: Partial<ThemeDefinition> = {
  headerBg: (colors) => colors.primary,
  boxShadow: (colors, scrolled) => scrolled ? `inset 0 -12px 0 0 ${colors.accent}` : 'none',
  extraBorderStyle: (colors) => ({
    borderBottom: `8px solid ${colors.accent}`,
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  }),
  buttonStyles: {
    background: (colors) => colors.accent,
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.secondary}`,
    boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
    hoverBackground: (colors) => colors.secondary,
    hoverTextColor: (colors) => colors.text,
    hoverBorder: (colors) => `4px solid ${colors.primary}`,
    hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`,
    transition: transitions.default,
    borderRadius: '0px',
  },
  secondaryButtonStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.secondary}`,
    boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
    hoverBackground: (colors) => colors.secondary,
    hoverTextColor: (colors) => getContrastColor(colors.secondary),
    hoverBorder: (colors) => `4px solid ${colors.primary}`,
    hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`,
    transition: transitions.default,
    borderRadius: '0px',
  },
  cardStyles: {
    background: (colors) => colors.background || '#fffef8',
    border: (colors) => `5px solid ${colors.accent}`,
    boxShadow: (colors) => `5px 5px 0 ${colors.secondary}`,
    textColor: (colors) => colors.primary,
    borderRadius: '0px',
  },
  heroBackground: (colors) => colors.primary,
  heroTitleColor: (colors) => colors.text,
  heroTextColor: (colors) => colors.secondary,
  featureSectionStyles: {
    titleColor: (colors) => colors.accent,
    cardBackground: (colors) => colors.background,
    iconBackground: (colors, index) => [ colors.accent, colors.primary, colors.secondary ][index % 3],
    cardTitleColor: (colors, index) => [colors.primary, colors.primary, colors.primary][index % 3],
    cardTextColor: (colors) => colors.secondary,
    iconBorder: (colors, index) => [ `4px solid ${colors.secondary}`, `4px solid ${colors.accent}`, `4px solid ${colors.primary}` ][index % 3],
    iconBoxShadow: (colors, index) => [ `8px 8px 0 ${colors.secondary}`, `8px 8px 0 ${colors.accent}`, `8px 8px 0 ${colors.primary}` ][index % 3],
    iconBorderRadius: () => '16px',
  },
  popularRentalsStyles: {
    background: (colors) => ({ backgroundColor: colors.primary }),
    titleColor: (colors) => colors.text,
    cardBackgroundGradient: (colors) => colors.accent,
    priceColor: (colors) => colors.secondary,
  },
  ctaStyles: {
    background: (colors) => colors.accent,
    titleColor: (colors) => colors.secondary,
    textColor: (colors) => colors.text,
  },
  contactStyles: {
    background: (colors) => `${colors.background}`,
    titleColor: (colors) => colors.secondary,
    cardBackground: (colors) => `${colors.background}ff`,
    iconBackground: (colors, type) => ({ primary: `${colors.primary}`, accent: `${colors.accent}`, secondary: `${colors.secondary}` }[type]),
    textColor: (colors) => colors.accent,
    serviceAreaTagBackground: (colors, index) => [ colors.accent, colors.primary, colors.secondary ][index % 3],
    serviceAreaTagColor: (colors) => colors.text,
    cardBorder: (colors) => `4px solid ${colors.accent}`,
    cardBoxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
  },
  footerStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.secondary}`,
    boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
  },
  linkStyles: {
    background: (colors) => colors.primary,
    textColor: (colors) => colors.text,
    border: (colors) => `4px solid ${colors.secondary}`,
    boxShadow: (colors) => `8px 8px 0 ${colors.secondary}`,
    hoverBackground: (colors) => colors.secondary,
    hoverTextColor: (colors) => getContrastColor(colors.secondary),
    hoverBorder: (colors) => `4px solid ${colors.primary}`,
    hoverBoxShadow: (colors) => `4px 4px 0 ${colors.primary}`,
    transition: transitions.default,
    borderRadius: '0px',
    active: (colors) => colors.secondary,
  },
  imageStyles: (colors) => ({
    border: `4px solid ${colors.accent}`,
    borderRadius: '0',
    boxShadow: `8px 8px 0 ${colors.secondary}`,
    transition: transitions.default,
  }),
  bookingStyles: undefined,
  imageTextStyles: {
    containerBackground: (colors) => colors.background || '#fffef8',
    titleColor: (colors) => colors.accent,
    textColor: (colors) => colors.secondary,
    imageContainerStyle: (colors) => ({
      border: `4px solid ${colors.accent}`,
      borderRadius: '0px',
      boxShadow: `8px 8px 0 ${colors.secondary}`,
    }),
  },
};




