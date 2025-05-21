'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/types';
import { getContrastColor } from '@/app/[domain]/_themes/utils';
import { layoutTokens } from '@/app/[domain]/_themes/layoutTokens';

interface HeaderProps {
  business: BusinessWithSiteConfig;
  colors: ThemeColors;
  theme: ThemeDefinition;
}

export default function Header({ business, colors, theme }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);   // track hovered path

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // Check initial scroll position
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav: { path: string; label: string }[] = [
    { path: '/',          label: 'Home'      },
    { path: '/inventory', label: 'Inventory' },
    { path: '/about',     label: 'About'     },
    { path: '/contact',   label: 'Contact'   },
  ];

  const isActive = (p: string) =>
    (p === '/' ? pathname === '/' : pathname.startsWith(p));

  /* ---- Helper: styles for normal links ---- */
  const linkBase = (active: boolean): React.CSSProperties => ({
    background: active
      ? theme.linkStyles?.active(colors)
      : theme.linkStyles?.background(colors),
    color: active
      ? theme.linkStyles?.hoverTextColor(colors) ?? getContrastColor(theme.linkStyles?.hoverBackground(colors) ?? colors.primary[500])
      : theme.linkStyles?.textColor(colors),
    border: theme.linkStyles?.border(colors),
    boxShadow: active 
      ? theme.linkStyles?.activeBoxShadow?.(colors) ?? theme.linkStyles?.boxShadow(colors)
      : theme.linkStyles?.boxShadow(colors),
    borderRadius: theme.linkStyles?.borderRadius ?? '9999px',
    padding: '0.65rem 1rem',
    fontWeight: 600,
    transition: theme.linkStyles?.transition ?? 'all .25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  });

  /* hover style from theme */
  const linkHover = (): React.CSSProperties => ({
    background: theme.linkStyles?.hoverBackground(colors),
    color: theme.linkStyles?.hoverTextColor(colors),
    border: theme.linkStyles?.hoverBorder(colors) ?? theme.linkStyles?.border(colors),
    boxShadow: theme.linkStyles?.hoverBoxShadow(colors) ?? theme.linkStyles?.boxShadow(colors),
    transform: 'scale(1.05)',
  });

  /* ---- CTA button ---- */
  const ctaBase: React.CSSProperties = {
    background: theme.buttonStyles.background(colors),
    color: theme.buttonStyles.textColor(colors),
    border: theme.buttonStyles.border?.(colors) ?? 'none',
    boxShadow: theme.buttonStyles.boxShadow?.(colors),
    padding: '0.7rem 1.4rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: '.9rem',
    borderRadius: theme.buttonStyles.borderRadius ?? '9999px',
    transition: theme.buttonStyles.transition ?? 'all .25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '.25rem',
  };

  const ctaHover: React.CSSProperties = {
    background: theme.buttonStyles.hoverBackground(colors),
    color: theme.buttonStyles.hoverTextColor?.(colors) ?? getContrastColor(theme.buttonStyles.hoverBackground(colors)),
    border: theme.buttonStyles.hoverBorder?.(colors) ?? ctaBase.border,
    boxShadow: theme.buttonStyles.hoverBoxShadow?.(colors) ?? ctaBase.boxShadow,
    transform: 'scale(1.08)',
  };

  /* logo sizing */
  const logoSize = scrolled ? layoutTokens.logoSizeScrolled : layoutTokens.logoSize;

  /* ---- Helper: styles for nav links (retro or default) ---- */
  const useRetroNav = !!theme.navItemStyles;
  const navLinkBase = (active: boolean): React.CSSProperties =>
    useRetroNav
      ? theme.navItemStyles![active ? 'active' : 'normal'](colors)
      : linkBase(active);
  const navLinkHover = (): React.CSSProperties =>
    useRetroNav
      ? theme.navItemStyles!.hover(colors)
      : linkHover();

  

  /* responsive container */
  return (
    <header
      className={`w-full ${scrolled ? 'scrolled' : ''} sticky top-0 z-50`}
      style={{
        background: theme.headerBg(colors, scrolled),
        boxShadow : theme.boxShadow(colors, scrolled),
        padding   : '0.65rem 0',
        ...(theme.extraBorderStyle ? theme.extraBorderStyle(colors) : {}),
      }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* ---- Logo ---- */}
        <Link href="/" className="flex items-center gap-3 group">
          {business.logo ? (
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              style={{ height: logoSize, objectFit: 'contain' }}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              style={{
                height: logoSize,
                width : logoSize,
                borderRadius: '9999px',
                background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
                color: getContrastColor(colors.primary[500]),
              }}
              className="flex items-center justify-center font-extrabold text-xl shadow-md transition-transform group-hover:scale-105"
            >
              {business.name[0]}
            </div>
          )}
          <span
            className="hidden sm:block font-bold text-lg"
            style={{ color: theme.headerTextColor(colors) }}
          >
            {business.name}
          </span>
        </Link>

        {/* ---- Desktop Nav ---- */}
        <nav className="hidden md:flex items-center gap-4">
          {nav.map(({ path, label }) => {
            const active = isActive(path);
            const hover = hovered === path;
            return (
              <Link
                key={path}
                href={path}
                style={{ ...(navLinkBase(active)), ...(hover ? navLinkHover() : {}) }}
                onMouseEnter={() => setHovered(path)}
                onMouseLeave={() => setHovered(null)}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/booking"
            style={{ ...ctaBase, ...(hovered === 'cta' ? ctaHover : {}) }}
            onMouseEnter={() => setHovered('cta')}
            onMouseLeave={() => setHovered(null)}
          >
            Book Now <ChevronRight className="h-4 w-4" />
          </Link>
        </nav>

        {/* ---- Mobile burger ---- */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 rounded-full transition-transform hover:scale-110"
          style={{ color: theme.headerTextColor(colors) }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ---- Mobile panel ---- */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col bg-white/90 backdrop-blur pt-24 px-8 space-y-6 animate-in fade-in slide-in-from-top-10"
          style={{ background: theme.headerBg(colors, true) }}
        >
          {nav.map(({ path, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                href={path}
                onClick={() => setMobileOpen(false)}
                style={navLinkBase(active)}
                className="text-lg hover:scale-105 transition-transform"
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/booking"
            onClick={() => setMobileOpen(false)}
            style={ctaBase}
            className="text-lg hover:scale-105 transition-transform"
          >
            Book Now <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </header>
  );
}
