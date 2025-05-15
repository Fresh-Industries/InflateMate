'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { getContrastColor } from '@/app/[domain]/_themes/utils';
import { ThemeColors } from '../../_themes/types';

interface Props {
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
  /** Main headline */
  title: string;
  /** Supporting copy */
  subtitle: string;
  /** Where the big button should go */
  ctaHref?: string;
  /** Button label */
  ctaLabel?: string;
}

export default function CTA({
  themeName,
  colors,
  title,
  subtitle,
  ctaHref = '/booking',
  ctaLabel = 'Book Your Bounce House'
}: Props) {
  const theme = themeConfig[themeName];

  /* ---- section-level styles ---- */
  const sectionStyle: React.CSSProperties = {
    background: theme.ctaStyles?.background(colors) ??
      `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    color: theme.ctaStyles?.textColor(colors) ?? getContrastColor(colors.primary)
  };

  /* ---- headline / copy ---- */
  const titleStyle: React.CSSProperties = {
    color: theme.ctaStyles?.titleColor(colors) ?? getContrastColor(colors.primary)
  };
  const textStyle: React.CSSProperties = {
    color: theme.ctaStyles?.textColor(colors) ?? getContrastColor(colors.secondary)
  };

  /* ---- button ---- */
  const secondaryButton = {
    background:
      themeConfig[themeName].secondaryButtonStyles?.background(colors) ??
      themeConfig[themeName].buttonStyles.background(colors),
    color:
      themeConfig[themeName].secondaryButtonStyles?.textColor(colors) ??
      themeConfig[themeName].buttonStyles.textColor(colors),
    border:
      themeConfig[themeName].secondaryButtonStyles?.border?.(colors) ??
      themeConfig[themeName].buttonStyles.border?.(colors) ??
      'none',
    boxShadow:
      themeConfig[themeName].secondaryButtonStyles?.boxShadow?.(colors) ??
      themeConfig[themeName].buttonStyles.boxShadow?.(colors),
    borderRadius:
      themeConfig[themeName].secondaryButtonStyles?.borderRadius ??
      themeConfig[themeName].buttonStyles.borderRadius,
    transition:
      themeConfig[themeName].secondaryButtonStyles?.transition ??
      themeConfig[themeName].buttonStyles.transition ??
      'all .25s ease',
  };

  const secondaryHover = {
    background:
      themeConfig[themeName].secondaryButtonStyles?.hoverBackground?.(colors) ??
      secondaryButton.background,
    color:
      themeConfig[themeName].secondaryButtonStyles?.hoverTextColor?.(colors) ??
      secondaryButton.color,
    border:
      themeConfig[themeName].secondaryButtonStyles?.hoverBorder?.(colors) ??
      secondaryButton.border,
    boxShadow:
      themeConfig[themeName].secondaryButtonStyles?.hoverBoxShadow?.(colors) ??
      secondaryButton.boxShadow,
    transform: 'scale(1.06)',
  };

  return (
    <section className="py-20 relative overflow-hidden" style={sectionStyle}>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2
          className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-md"
          style={titleStyle}
        >
          {title}
        </h2>

        <p
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-95 font-light"
          style={textStyle}
        >
          {subtitle}
        </p>

        <Button
          asChild
          size="lg"
          className="text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-10 py-7"
          style={secondaryButton}
          onMouseEnter={(e) =>
            Object.assign(e.currentTarget.style, secondaryHover)
          }
          onMouseLeave={(e) =>
            Object.assign(e.currentTarget.style, secondaryButton)
          }
        >
          <Link href={ctaHref} className="flex items-center gap-3">
            {ctaLabel} <ArrowRight className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* simple decorative blobs (optional / purely presentational) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 opacity-20"></div>
    </section>
  );
}
