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
  const domainPrefix = business.customDomain || business.id;
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
    : { color: colors.primary, transition: 'color 0.3s ease' };

  const hoverLink: React.CSSProperties = link
    ? {
        color:        link.hoverTextColor(colors),
        background:   link.hoverBackground(colors),
        border:       link.hoverBorder(colors),
        boxShadow:    link.hoverBoxShadow(colors)
      }
    : { color: colors.secondary };

  const containerStyle: React.CSSProperties = {
    background:  footer.background(colors),
    color:       footer.textColor(colors),
    borderColor: footer.border(colors)
  };

  /* ---------- helpers ---------- */
  const Hoverable = ({
    href,
    children
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      className="inline-block transition-all duration-300"
      style={baseLink}
      onMouseEnter={e => Object.assign(e.currentTarget.style, hoverLink)}
      onMouseLeave={e => Object.assign(e.currentTarget.style, baseLink)}
    >
      {children}
    </Link>
  );

  /* ---------- render ---------- */
  return (
    <footer className="mt-auto border-t" style={containerStyle}>
      <div className="container mx-auto px-4 py-10">
        {/* --- top grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* company blurb */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {business.name}
            </h3>
            <p className="text-sm">
              {business.description ?? 'Providing the best rental experience.'}
            </p>
          </div>

          {/* quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick&nbsp;Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Hoverable href={`/${domainPrefix}/inventory`}>Rentals</Hoverable></li>
              <li><Hoverable href={`/${domainPrefix}/about`}>About&nbsp;Us</Hoverable></li>
              <li><Hoverable href={`/${domainPrefix}/contact`}>Contact</Hoverable></li>
              <li><Hoverable href={`/${domainPrefix}/booking`}>Book&nbsp;Now</Hoverable></li>
            </ul>
          </div>

          {/* social icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow&nbsp;Us</h3>
            <div className="flex gap-4 text-2xl">
              {social.facebook  && <Hoverable href={social.facebook}>  <FaFacebook  /> </Hoverable>}
              {social.instagram && <Hoverable href={social.instagram}> <FaInstagram /> </Hoverable>}
              {social.twitter   && <Hoverable href={social.twitter}>   <FaTwitter   /> </Hoverable>}
              {social.tiktok    && <Hoverable href={social.tiktok}>    <FaTiktok    /> </Hoverable>}
            </div>
          </div>
        </div>

        {/* --- copyright bar --- */}
        <div
          className="border-t pt-6 text-center text-sm"
          style={{ borderColor: footer.border(colors) }}
        >
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
