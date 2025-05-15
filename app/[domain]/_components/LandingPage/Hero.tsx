'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { Button } from '@/components/ui/button';
import { getContrastColor } from '@/app/[domain]/_themes/utils';
import { ThemeColors } from '@/app/[domain]/_themes/types';

/** Props expected from DomainPage */
export interface HeroProps {
  colors: ThemeColors;
  themeName: keyof typeof themeConfig;
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryCtaHref?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  colors,
  themeName,
  title,
  subtitle,
  imageUrl,
  primaryCtaHref = '/booking',
  secondaryCtaHref = '/inventory',
}: HeroProps) {
  /*  small "bounce-in" on mount  */
  const imgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    el.animate(
      [
        { transform: 'translateY(60px) scale(0.95)', opacity: 0 },
        { transform: 'translateY(0)      scale(1)',    opacity: 1 },
      ],
      { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
    );
  }, []);

  /* button styles from theme helpers  */
  const primaryButton = {
    background: themeConfig[themeName].buttonStyles.background(colors),
    color: themeConfig[themeName].buttonStyles.textColor(colors),
    border: themeConfig[themeName].buttonStyles.border?.(colors) ?? 'none',
    boxShadow: themeConfig[themeName].buttonStyles.boxShadow?.(colors),
    borderRadius: themeConfig[themeName].buttonStyles.borderRadius ?? '9999px',
    transition: themeConfig[themeName].buttonStyles.transition ?? 'all .25s ease',
  };

  const primaryHover = {
    background: themeConfig[themeName].buttonStyles.hoverBackground(colors),
    color:
      themeConfig[themeName].buttonStyles.hoverTextColor?.(colors) ??
      getContrastColor(themeConfig[themeName].buttonStyles.hoverBackground(colors)),
    border: themeConfig[themeName].buttonStyles.hoverBorder?.(colors) ?? primaryButton.border,
    boxShadow:
      themeConfig[themeName].buttonStyles.hoverBoxShadow?.(colors) ?? primaryButton.boxShadow,
    transform: 'scale(1.08)',
  };

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

  /* section colours from theme */
  const sectionBg =
    themeConfig[themeName].heroBackground?.(colors) ||
    `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
  const titleColor =
    themeConfig[themeName].heroTitleColor?.(colors) || getContrastColor(colors.primary);
  const textColor =
    themeConfig[themeName].heroTextColor?.(colors) || getContrastColor(colors.secondary);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: sectionBg, color: textColor }}
    >
      {/* subtle decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
           style={{ background: `${colors.accent}30` }}/>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
           style={{ background: `${colors.secondary}30` }}/>

      <div className="container mx-auto px-4 py-24 lg:py-32 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* copy block */}
        <div className="space-y-8 text-center md:text-left">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight"
            style={{ color: titleColor }}
          >
            {title}
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl max-w-xl mx-auto md:mx-0 opacity-95 font-light">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start pt-2">
            <Button
              asChild
              size="lg"
              className="font-bold"
              style={primaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, primaryHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, primaryButton)
              }
            >
              <Link href={primaryCtaHref} className="flex items-center gap-2">
                Book Now <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="font-bold"
              style={secondaryButton}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, secondaryHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, secondaryButton)
              }
            >
              <Link href={secondaryCtaHref}>View Inflatables</Link>
            </Button>
          </div>
        </div>

        {/* image block */}
        <div
          ref={imgRef}
          className="mx-auto md:mx-0 w-full max-w-lg p-4 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
          style={themeConfig[themeName].imageStyles(colors)}
        >
          <img
            src={imageUrl}
            alt="Kids enjoying a bounce house"
            className="w-full h-72 md:h-[430px] object-cover"
            style={{ borderRadius: themeConfig[themeName].imageStyles(colors).borderRadius }}
          />
        </div>
      </div>
    </section>
  );
}
