// Header.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BusinessWithSiteConfig, SiteConfig } from '@/lib/business/domain-utils';
import { Menu, X, Home, Package, Info, Phone, ChevronRight } from 'lucide-react';
import { ThemeColors, ThemeDefinition } from '@/app/[domain]/_themes/themeConfig';
import { getContrastColor } from '@/app/[domain]/_themes/themeConfig';

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

  const isActive = (path: string): boolean => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  // Compute link style based on active state and theme.
  const computeLinkStyle = (active: boolean): React.CSSProperties => {
    const linkStyles = theme.linkStyles;
    if (!linkStyles) return {}; // Return empty if linkStyles are not defined

    const activeBg = linkStyles.active(colors);
    const activeTextColor = getContrastColor(activeBg);
    const defaultBg = linkStyles.background(colors);
    const defaultTextColor = linkStyles.textColor(colors);
    const defaultBorder = linkStyles.border(colors);
    const defaultShadow = linkStyles.shadow(colors);
    const hoverBorder = linkStyles.hoverBorder(colors);
    const hoverShadow = linkStyles.hoverShadow(colors);

    if (active) {
      return {
        background: activeBg,
        color: activeTextColor,
        border: hoverBorder, // Use hover state for border/shadow when active for consistency?
        boxShadow: hoverShadow,
        transition: linkStyles.transition,
        borderRadius: linkStyles.borderRadius
      };
    } else {
      return {
        background: defaultBg,
        color: defaultTextColor,
        border: defaultBorder,
        boxShadow: defaultShadow,
        transition: linkStyles.transition,
        borderRadius: linkStyles.borderRadius
      };
    }
  };

  // Compute hover styles separately for applying via CSS or pseudo-classes if needed
  // Or rely on transition property + direct style application for hover effect
  const getLinkHoverStyles = (): React.CSSProperties => {
    const linkStyles = theme.linkStyles;
    if (!linkStyles) return {};
    return {
      background: linkStyles.hoverBackground(colors),
      color: linkStyles.hoverTextColor(colors),
      border: linkStyles.hoverBorder(colors),
      boxShadow: linkStyles.hoverShadow(colors),
    };
  };

  // Styles for the primary action button (Book Now)
  const secondaryButtonStyle: React.CSSProperties = {
    background: theme.secondaryButtonStyles?.background(colors) || theme.buttonStyles.background(colors),
    color: theme.secondaryButtonStyles?.textColor(colors) || theme.buttonStyles.textColor(colors),
    border: theme.secondaryButtonStyles?.border?.(colors) || theme.buttonStyles.border?.(colors) || 'none',
    boxShadow: theme.secondaryButtonStyles?.shadow?.(colors) || theme.buttonStyles.shadow?.(colors) || 'none',
    transition: theme.secondaryButtonStyles?.transition || theme.buttonStyles.transition || 'transform 0.3s ease',
    borderRadius: theme.secondaryButtonStyles?.borderRadius || theme.buttonStyles.borderRadius || '12px'
  };

  const headerStyle: React.CSSProperties = {
    background: theme.headerBg(colors, scrolled),
    boxShadow: theme.boxShadow(colors, scrolled),
    paddingTop: scrolled ? '0.5rem' : '0.75rem',
    paddingBottom: scrolled ? '0.5rem' : '0.75rem',
    ...theme.extraBorderStyle(colors) // Includes borderBottom, etc.
  };

  const logoStyle: React.CSSProperties = theme.imageStyles ? { ...theme.imageStyles(colors), height: '5rem', width: 'auto', objectFit: 'contain' } : { height: '5rem', width: 'auto', objectFit: 'contain' };
  const logoInitialStyle: React.CSSProperties = {
     background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
     borderRadius: theme.imageStyles ? theme.imageStyles(colors).borderRadius : '9999px', // Match image style rounding
     color: getContrastColor(colors.primary) // Ensure text contrast
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={headerStyle}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center group">
            {business.logo ? (
              <div
                className="relative overflow-hidden mr-2 transition-transform duration-300 group-hover:scale-105"
                // Apply imageStyles directly if they include rounding/border/shadow
                style={theme.imageStyles ? theme.imageStyles(colors) : { borderRadius: '9999px'}} // Default to round if no theme style
              >
                <img
                  src={business.logo}
                  alt={`${business.name} Logo`}
                  style={logoStyle} // Control size and fit here
                  className="block" // Ensure img is block for proper styling application
                />
              </div>
            ) : (
              <div
                className="h-12 w-12 flex items-center justify-center font-bold shadow-sm transition-transform duration-300 group-hover:scale-105 mr-2"
                style={logoInitialStyle} // Use computed style for initial
              >
                {business.name.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-xl hidden sm:inline" style={{ color: theme.headerTextColor(colors) }}>
              {business.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-3">
            {[ // Dynamically build nav items based on available business info
              { path: '/', label: 'Home', icon: <Home /> },
              { path: '/inventory', label: 'Inventory', icon: <Package /> },
              ...(siteConfig?.about?.description || business.description ? [{ path: '/about', label: 'About', icon: <Info /> }] : []),
              ...(business.phone || business.email || business.address ? [{ path: '/contact', label: 'Contact', icon: <Phone /> }] : [])
            ].map((item) => {
              const active = isActive(item.path);
              const style = computeLinkStyle(active);
              const hoverStyle = getLinkHoverStyles(); // We might need to apply this via CSS :hover
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="nav-link flex items-center px-3 py-1.5 text-sm font-medium transition-all duration-300"
                  style={style}
                  // Example of inline hover (less ideal than CSS classes)
                  onMouseEnter={(e) => {
                    const target = e.currentTarget as HTMLAnchorElement;
                    Object.assign(target.style, hoverStyle);
                  }}
                  onMouseLeave={(e) => {
                     const target = e.currentTarget as HTMLAnchorElement;
                     Object.assign(target.style, style); // Revert to base style
                  }}
                >
                  {React.cloneElement(item.icon, { className: "h-4 w-4 mr-1.5" })}
                  {item.label}
                </Link>
              );
            })}
            {/* Book Now button using secondary styles */}
            <Link
              href="/booking"
              className="nav-link flex items-center px-5 py-2.5 text-sm font-bold uppercase transition-transform duration-300 hover:scale-105"
              style={secondaryButtonStyle}
            >
              Book Now
              <ChevronRight className="h-4 w-4 ml-1 -mr-1" />
            </Link>
          </nav>

          {/* Mobile Menu Toggle - Styling should adapt to theme */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: theme.headerTextColor(colors),
                background: 'transparent', // Ensure button itself is transparent
              }}
              // Add hover effect based on theme?
              onMouseEnter={(e) => e.currentTarget.style.background = `${colors.primary}15`}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} 
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel - Styling should adapt to theme */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden pb-4 pt-2 animate-in slide-in-from-top-5 duration-300"
            style={{ backgroundColor: theme.headerBg(colors, true) }} // Use scrolled bg for contrast
          >
            {[ // Use same dynamic logic for mobile nav items
              { path: '/', label: 'Home', icon: <Home /> },
              { path: '/inventory', label: 'Inventory', icon: <Package /> },
              ...(siteConfig?.about?.description || business.description ? [{ path: '/about', label: 'About', icon: <Info /> }] : []),
              ...(business.phone || business.email || business.address ? [{ path: '/contact', label: 'Contact', icon: <Phone /> }] : [])
            ].map((item) => {
              const active = isActive(item.path);
              const style = computeLinkStyle(active);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="nav-link flex items-center w-full px-4 py-3 mt-1 text-base font-medium transition-all duration-300"
                  style={style}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {React.cloneElement(item.icon, { className: "h-5 w-5 mr-3" })}
                  {item.label}
                </Link>
              );
            })}
            {/* Mobile Book Now button */}
            <Link
              href="/booking"
              className="nav-link block w-full mt-4 text-center text-sm font-bold uppercase px-4 py-3 transition-transform hover:scale-105"
              style={secondaryButtonStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Book Now
              <ChevronRight className="h-4 w-4 inline ml-1" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

