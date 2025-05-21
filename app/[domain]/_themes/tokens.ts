// tokens.ts

import { ColorScale, makeScale } from "./utils";

// Brand tonal scales


export const brandColors: Record<'primary' | 'secondary' | 'accent', ColorScale> = {
  primary:   makeScale('#4f46e5'),
  secondary: makeScale('#06b6d4'),
  accent:    makeScale('#f97316'),
};


// Semantic roles mapped to brand or custom scales
export const semanticColors: Record<'info' | 'success' | 'warning' | 'error' | 'neutral', ColorScale> = {
  info:    brandColors.primary,   // informational messages
  success: brandColors.secondary, // success states
  warning: brandColors.accent,    // warning highlights
  error:   makeScale('#dc2626'),  // custom error red
  neutral: makeScale('#6b7280'),  // neutral grey
};

// Core design tokens
export const radii = {
  none:   '0',
  small:  '4px',
  medium: '12px',
  large:  '16px',
  pill:   '9999px',
};

export const shadows = {
  light:  '0 2px 6px rgba(0, 0, 0, 0.08)',
  medium: '0 4px 8px rgba(0, 0, 0, 0.12)',
  heavy:  '0 8px 16px rgba(0, 0, 0, 0.2)',
};

export const transitions = {
  default: 'all 0.3s ease',
};

export const borderWidths = {
  thin:   '1px',
  medium: '2px',
  thick:  '4px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
};

export const zIndices = {
  header: 100,
  footer: 100,
  modal: 200,
  dropdown: 300,
};

export const typography = {
  sizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    md: '1rem',      // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

export const grid = {
  containerMaxWidth: '1200px',
  gutter: spacing.md,
};

export const motion = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeIn: 'cubic-bezier(.4,0,.2,1)',
    easeOut: 'cubic-bezier(.2,0,.4,1)',
  },
};

