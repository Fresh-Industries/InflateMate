'use client';

import React from 'react';
import Link from 'next/link';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { ThemeDefinition, ThemeColors } from '../_themes/themeConfig';

interface FooterProps {
  business: BusinessWithSiteConfig;
  theme: ThemeDefinition;
  colors: ThemeColors;
}

export default function Footer({ business, theme, colors }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const domainPrefix = business.customDomain || business.id;

  const footerStyles = theme.footerStyles;
  const linkStyle = { color: footerStyles.linkColor(colors) };
  const linkHoverStyle = { '--link-hover-color': footerStyles.linkHoverColor(colors) } as React.CSSProperties;

  return (
    <footer
      className="mt-auto border-t"
      style={{
        backgroundColor: footerStyles.background(colors),
        borderColor: footerStyles.borderColor(colors),
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: footerStyles.textColor(colors) }}>{business.name}</h3>
            <p className="text-sm" style={{ color: footerStyles.textColor(colors) }}>
              {business.description || 'Providing the best rental experience.'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: footerStyles.textColor(colors) }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${domainPrefix}/inventory`}
                  className="text-sm hover:text-[var(--link-hover-color)] transition-colors"
                  style={{ ...linkStyle, ...linkHoverStyle }}>
                  Rentals
                </Link>
              </li>
              <li>
                <Link href={`/${domainPrefix}/about`}
                  className="text-sm hover:text-[var(--link-hover-color)] transition-colors"
                  style={{ ...linkStyle, ...linkHoverStyle }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${domainPrefix}/contact`}
                  className="text-sm hover:text-[var(--link-hover-color)] transition-colors"
                  style={{ ...linkStyle, ...linkHoverStyle }}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${domainPrefix}/booking`}
                  className="text-sm hover:text-[var(--link-hover-color)] transition-colors"
                  style={{ ...linkStyle, ...linkHoverStyle }}>
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Placeholder for extra content */}
          <div>
            {/* Future social links or newsletter sign-up */}
          </div>
        </div>
        
        <div
          className="border-t pt-6 text-center text-sm"
          style={{
            borderColor: footerStyles.borderColor(colors),
            color: footerStyles.textColor(colors),
          }}
        >
          &copy; {currentYear} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
