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
  
  // Base styles for links using theme
  const linkStyle: React.CSSProperties = {
    color: footerStyles.linkColor(colors),
    transition: 'color 0.3s ease' // Add transition for hover effect
  };

  // Styles for the footer container
  const footerContainerStyle: React.CSSProperties = {
    backgroundColor: footerStyles.background(colors),
    color: footerStyles.textColor(colors), // Apply base text color
    borderColor: footerStyles.borderColor(colors),
  };

  // Style for headings in the footer
  const headingStyle: React.CSSProperties = {
    color: footerStyles.textColor(colors), // Use footer text color for headings too
  };

  // Style for regular text in the footer
  const textStyle: React.CSSProperties = {
    color: footerStyles.textColor(colors),
  };

  // Style for the copyright section
  const copyrightStyle: React.CSSProperties = {
    borderColor: footerStyles.borderColor(colors),
    color: footerStyles.textColor(colors),
  };

  return (
    <footer
      className="mt-auto border-t"
      style={footerContainerStyle}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={headingStyle}>{business.name}</h3>
            <p className="text-sm" style={textStyle}>
              {business.description || 'Providing the best rental experience.'}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={headingStyle}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/${domainPrefix}/inventory`}
                  className="text-sm footer-link transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = footerStyles.linkHoverColor(colors)}
                  onMouseLeave={(e) => e.currentTarget.style.color = footerStyles.linkColor(colors)}
                >
                  Rentals
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/about`}
                  className="text-sm footer-link transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = footerStyles.linkHoverColor(colors)}
                  onMouseLeave={(e) => e.currentTarget.style.color = footerStyles.linkColor(colors)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/contact`}
                  className="text-sm footer-link transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = footerStyles.linkHoverColor(colors)}
                  onMouseLeave={(e) => e.currentTarget.style.color = footerStyles.linkColor(colors)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/booking`}
                  className="text-sm footer-link transition-colors duration-300"
                  style={linkStyle}
                  onMouseEnter={(e) => e.currentTarget.style.color = footerStyles.linkHoverColor(colors)}
                  onMouseLeave={(e) => e.currentTarget.style.color = footerStyles.linkColor(colors)}
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Placeholder for extra content (e.g., Social Icons) */}
          <div>
            {/* Example: Add social links here, styling them according to the theme */}
          </div>
        </div>
        
        <div
          className="border-t pt-6 text-center text-sm"
          style={copyrightStyle}
        >
          &copy; {currentYear} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
