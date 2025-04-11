'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';
import { Menu, X, Home, Package, Info, Phone, ChevronRight, PartyPopper } from 'lucide-react';
import { themeConfig, ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/themeConfig';
import ThemedButton from './ui/ThemeButton';
import { cn } from '@/lib/utils';

interface HeaderProps {
  business: BusinessWithSiteConfig;
  siteConfig: SiteConfig;
  colors: ThemeColors;
  theme: ThemeDefinition;
}

export default function Header({ business, siteConfig, colors, theme }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { path: '/inventory', label: 'Inventory', icon: <Package className="h-5 w-5" /> },
    ...((business.description || siteConfig?.about?.description)
      ? [{ path: '/about', label: 'About', icon: <Info className="h-5 w-5" /> }]
      : []),
    ...((business.phone || business.email || business.address)
      ? [{ path: '/contact', label: 'Contact', icon: <Phone className="h-5 w-5" /> }]
      : [])
  ];

  // Apply header theme functions:
  const headerBg = theme.headerBg(colors, scrolled);
  const boxShadow = theme.boxShadow(colors, scrolled);
  const extraBorderStyle = theme.extraBorderStyle(colors);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${boxShadow}`}
      style={{
        background: headerBg,
        backdropFilter: 'blur(10px)',
        paddingTop: scrolled ? '0.5rem' : '0.75rem',
        paddingBottom: scrolled ? '0.5rem' : '0.75rem',
        ...extraBorderStyle
      }}
    >
      <div className="container mx-auto px-4 relative">
        {/* Render theme-specific decorations */}
        {theme.renderDecorations(colors)}

        <div className="flex items-center justify-between h-14 relative">
          <Link href="/" className="flex items-center group">
            {business.logo ? (
              <div
                className={`relative overflow-hidden mr-2 transition-transform duration-300 group-hover:scale-105 ${
                  theme === themeConfig.bouncey ? "rounded-full" : "rounded-md"
                }`}
              >
                <img
                  src={business.logo}
                  alt={`${business.name} Logo`}
                  className="h-20 w-auto object-contain"
                />
              </div>
            ) : (
              <div
                className={`h-9 w-9 flex items-center justify-center font-bold shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                  theme === themeConfig.retro ? "rounded-lg" : "rounded-full"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                }}
              >
                <PartyPopper className="h-5 w-5 text-white" />
              </div>
            )}
            <span className="font-semibold text-gray-800 text-xl hidden sm:inline">
              {business.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const btnStyles = theme.buttonStyles;
              const linkClasses = cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center',
                active 
                  ? 'theme-aware-button'
                  : 'text-gray-600 hover:bg-gray-100'
              );
              const linkStyle = active
                ? {
                    '--btn-bg': btnStyles.background(colors),
                    '--btn-text-color': btnStyles.textColor(colors),
                    '--btn-hover-bg': btnStyles.hoverBackground(colors),
                    ...(btnStyles.border && { '--btn-border': btnStyles.border(colors) }),
                    ...(btnStyles.shadow && { '--btn-shadow': btnStyles.shadow(colors) }),
                    ...(btnStyles.hoverTextColor && { '--btn-hover-text-color': btnStyles.hoverTextColor(colors) }),
                    ...(btnStyles.hoverBorder && { '--btn-hover-border': btnStyles.hoverBorder(colors) }),
                    ...(btnStyles.hoverShadow && { '--btn-hover-shadow': btnStyles.hoverShadow(colors) }),
                    boxShadow: btnStyles.shadow ? 'var(--btn-shadow)' : '0 1px 4px rgba(0,0,0,0.08)'
                  } as React.CSSProperties
                : {};

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={linkClasses}
                  style={linkStyle}
                >
                  {React.cloneElement(item.icon, { className: "h-4 w-4 mr-1.5" })}
                  {item.label}
                </Link>
              );
            })}
            <ThemedButton
              asChild
              size="sm"
              theme={theme}
              colors={colors}
              className="ml-2"
            >
              <Link href="/booking" className="flex items-center text-sm">
                Book Now
                <ChevronRight className="h-4 w-4 ml-1 -mr-1" />
              </Link>
            </ThemedButton>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 animate-in slide-in-from-top-5 duration-300">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg my-1 ${
                  isActive(item.path) ? 'bg-gray-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className="mr-3 p-1.5 rounded-full"
                  style={{
                    backgroundColor: isActive(item.path)
                      ? colors.primary
                      : `${colors.primary}15`,
                    color: isActive(item.path) ? 'white' : colors.primary
                  }}
                >
                  {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                </div>
                <div className="flex-1">
                  <span className="font-medium text-sm text-gray-700">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Link>
            ))}
            <div className="px-2 pt-3 mt-2 border-t">
              <ThemedButton
                asChild
                theme={theme}
                colors={colors}
                className="w-full text-base py-2.5 h-auto"
              >
                <Link
                  href="/booking"
                  className="flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Now
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </ThemedButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
