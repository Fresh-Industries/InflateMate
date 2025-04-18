'use client';

import React from 'react';
import Link from 'next/link';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { ThemeDefinition, ThemeColors } from '../_themes/themeConfig';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';

interface FooterProps {
  business: BusinessWithSiteConfig;
  theme: ThemeDefinition;
  colors: ThemeColors;
}

export default function Footer({ business, theme, colors }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const domainPrefix = business.customDomain || business.id;
  const socialLinks = business.socialMedia || {};
  console.log(socialLinks);

  const linkStyles = theme.linkStyles;
  
  // Base styles for links using theme linkStyles or fallback colors
  const baseLinkStyle: React.CSSProperties = linkStyles ? {
    color: linkStyles.textColor(colors),
    background: linkStyles.background(colors),
    border: linkStyles.border(colors),
    boxShadow: linkStyles.boxShadow(colors),
    borderRadius: linkStyles.borderRadius,
    padding: '0.25rem 0.5rem', // Add some padding if using background/border
    margin: '-0.25rem -0.5rem', // Adjust margin to compensate for padding
    transition: linkStyles.transition,
  } : {
    color: colors.primary, // Fallback to primary color
    transition: 'color 0.3s ease'
  };

  const hoverLinkStyle: React.CSSProperties = linkStyles ? {
    color: linkStyles.hoverTextColor(colors),
    background: linkStyles.hoverBackground(colors),
    border: linkStyles.hoverBorder(colors),
    boxShadow: linkStyles.hoverBoxShadow(colors),
  } : {
    color: colors.secondary, // Fallback to secondary color
  };

  // Styles for the footer container using base colors
  const footerContainerStyle: React.CSSProperties = {
    backgroundColor: theme.footerStyles?.background(colors),
    color: theme.footerStyles?.textColor(colors),
    borderColor: theme.footerStyles?.border(colors),
  };

  // Style for headings in the footer using primary color
  const headingStyle: React.CSSProperties = {
    color: theme.footerStyles?.textColor(colors), 
  };

  // Style for regular text in the footer (using container's default)
  const textStyle: React.CSSProperties = {
      color: theme.footerStyles?.textColor(colors),
  };

  // Style for the copyright section (same as container)
  const copyrightStyle: React.CSSProperties = {
    borderColor: theme.footerStyles?.border(colors), // Match container border
    color: theme.footerStyles?.textColor(colors), // Match container text color
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
                  className="text-sm footer-link transition-colors duration-300 inline-block" // Use inline-block for padding/margin
                  style={baseLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverLinkStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseLinkStyle)}
                >
                  Rentals
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/about`}
                  className="text-sm footer-link transition-colors duration-300 inline-block"
                  style={baseLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverLinkStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseLinkStyle)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/contact`}
                  className="text-sm footer-link transition-colors duration-300 inline-block"
                  style={baseLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverLinkStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseLinkStyle)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${domainPrefix}/booking`}
                  className="text-sm footer-link transition-colors duration-300 inline-block"
                  style={baseLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverLinkStyle)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, baseLinkStyle)}
                >
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Placeholder for extra content (e.g., Social Icons) */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={headingStyle}>Follow Us</h3>
            <div className="flex gap-5">
              {Object.entries(socialLinks).map(([key, value]) => (
                <Link
                  key={key}
                  href={value}
                  className="text-2xl footer-link transition-colors hover:scale-105 duration-300 inline-block"
                  style={baseLinkStyle}
                >
                  {key === 'facebook' && <FaFacebook />}
                  {key === 'instagram' && <FaInstagram />}
                  {key === 'twitter' && <FaTwitter />}
                  {key === 'tiktok' && <FaTiktok />}
                  
                </Link>
              ))}
            </div>
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
