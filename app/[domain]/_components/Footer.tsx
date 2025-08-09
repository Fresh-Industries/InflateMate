'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '../_themes/types';

interface Props {
  themeName: keyof typeof themeConfig;
  colors:   ThemeColors;
  business: Pick<
    BusinessWithSiteConfig,
    | 'id'
    | 'customDomain'
    | 'name'
    | 'description'
    | 'socialMedia'
  >;
}

export default function Footer({ themeName, colors, business }: Props) {
  const theme = themeConfig[themeName];
  const link = theme.linkStyles;
  const footer = theme.footerStyles!;
  const social = business.socialMedia ?? {};

  /* ---------- computed styles ---------- */
  const baseLink: React.CSSProperties = link
    ? {
        color:         link.textColor(colors),
        background:    link.background(colors),
        border:        link.border(colors),
        boxShadow:     link.boxShadow(colors),
        borderRadius:  link.borderRadius,
        transition:    link.transition,
        padding:       '0.25rem 0.5rem',
        margin:        '-0.25rem -0.5rem'
      }
    : { color: colors.primary[500], transition: 'color 0.3s ease' };

  const hoverLink: React.CSSProperties = link
    ? {
        color:        link.hoverTextColor(colors),
        background:   link.hoverBackground(colors),
        border:       link.hoverBorder(colors),
        boxShadow:    link.hoverBoxShadow(colors)
      }
    : { color: colors.secondary[500] };

  // Footer theme-specific styles
  const containerStyle: React.CSSProperties = {
    background:  footer.background(colors),
    color:       footer.textColor(colors),
    borderColor: footer.border?.(colors) || 'transparent',
    borderTopWidth: '3px',
    borderTopStyle: 'solid',
    boxShadow:    footer.boxShadow?.(colors) || 'none',
    position: 'relative'
  };

  // Add background pattern if specified in theme
  if (footer.pattern) {
    containerStyle.backgroundImage = footer.pattern(colors);
  }

  // Section title styles
  const sectionTitleStyle: React.CSSProperties = footer.sectionTitleStyles ? 
    { ...footer.sectionTitleStyles(colors) as React.CSSProperties } : 
    { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' };

  /* ---------- helpers ---------- */
  const Hoverable = ({
    href,
    children,
    className = "",
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    // Use theme-specific link styles if available
    const footerLinkStyles = footer.linkStyles?.normal ? 
      { ...footer.linkStyles.normal(colors) as React.CSSProperties } : 
      baseLink;
    
    const footerLinkHoverStyles = footer.linkStyles?.hover ? 
      { ...footer.linkStyles.hover(colors) as React.CSSProperties } : 
      hoverLink;

    return (
      <Link
        href={href}
        className={`inline-block transition-all duration-300 ${className}`}
        style={footerLinkStyles}
        onMouseEnter={e => Object.assign(e.currentTarget.style, footerLinkHoverStyles)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, footerLinkStyles)}
      >
        {children}
      </Link>
    );
  };

  /* ---------- render ---------- */
  return (
    <footer className={`mt-auto ${themeName}-theme-footer`} style={containerStyle}>
      <div className="container mx-auto px-4 py-10">
        {/* --- top grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* company blurb */}
          <div>
            <h3 className="text-xl font-bold mb-3" style={sectionTitleStyle}>
              {business.name}
            </h3>
            <p className="text-md">
              {business.description ?? 'Providing the best rental experience.'}
            </p>
          </div>

          {/* quick links */}
          <div>
            <h3 className="text-xl font-bold mb-3" style={sectionTitleStyle}>Quick&nbsp;Links</h3>
            <ul className="space-y-2 text-md font-semibold">
              <li><Hoverable href={`/inventory`}>Rentals</Hoverable></li>
              <li><Hoverable href={`/about`}>About&nbsp;Us</Hoverable></li>
              <li><Hoverable href={`/contact`}>Contact</Hoverable></li>
              <li><Hoverable href={`/booking`}>Book&nbsp;Now</Hoverable></li>
            </ul>
          </div>

          {/* social icons */}
          <div>
            <h3 className="text-xl font-bold mb-3" style={sectionTitleStyle}>Follow&nbsp;Us</h3>
            <div className="flex gap-4 text-2xl">
              {social.facebook  && <Hoverable href={social.facebook} className="social-icon">  <FaFacebook  /> </Hoverable>}
              {social.instagram && <Hoverable href={social.instagram} className="social-icon"> <FaInstagram /> </Hoverable>}
              {social.twitter   && <Hoverable href={social.twitter} className="social-icon">   <FaTwitter   /> </Hoverable>}
              {social.tiktok    && <Hoverable href={social.tiktok} className="social-icon">    <FaTiktok    /> </Hoverable>}
            </div>
          </div>
        </div>

        {/* --- copyright bar --- */}
        <div
          className="border-t pt-6 text-center text-sm"
          style={{ borderColor: footer.border?.(colors) || 'rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}
        >
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </div>
      </div>

      {/* Accent elements for retro theme */}
      {footer.accentElements && (
        <style jsx global>{`
          .${themeName}-theme-footer::before {
            content: "";
            position: absolute;
            top: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: ${colors.accent[500]};
            z-index: 1;
          }
          
          .${themeName}-theme-footer .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            transition: all 0.2s ease;
          }
          
          .retro-theme-footer .social-icon {
            background-color: ${colors.primary[500]};
            border: 2px solid ${colors.accent[500]};
            box-shadow: 3px 3px 0 ${colors.primary[900]};
          }
          
          .retro-theme-footer .social-icon:hover {
            transform: translateY(-3px);
            box-shadow: 3px 6px 0 ${colors.primary[900]};
          }
        `}</style>
      )}
    </footer>
  );
}
