'use client';

import React from 'react';
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '../../_themes/types';

interface BusinessLite {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  serviceArea?: string[] | null;
}

interface Props {
  themeName: keyof typeof themeConfig;
  colors: ThemeColors;
  business: BusinessLite;
}

export default function ContactSection({ themeName, colors, business }: Props) {
  const theme = themeConfig[themeName];
  const sectionAnimation = theme.animations?.sectionTransition || "fadeIn 0.3s ease";
  const elementAnimation = theme.animations?.elementEntrance || "popIn 0.3s ease-out";

  /* ------- helpers ------- */
  const cardBase = theme.cardStyles;
  const cardStyle: React.CSSProperties = {
    background: theme.contactStyles?.cardBackground?.(colors) || cardBase.background(colors),
    border: theme.contactStyles?.cardBorder?.(colors) || cardBase.border(colors),
    boxShadow: theme.contactStyles?.cardBoxShadow?.(colors) || cardBase.boxShadow(colors),
    borderRadius: cardBase.borderRadius ?? '16px',
    color: cardBase.textColor(colors),
    animation: elementAnimation,
  };

  /* section background + subtle dots */
  const sectionBG: React.CSSProperties = {
    background: theme.contactStyles?.background(colors) ?? '#f3f4f6',
    backgroundImage: `radial-gradient(circle at 10% 10%, ${colors.primary}0A, transparent 50%),
                      radial-gradient(circle at 90% 90%, ${colors.accent}0A, transparent 50%)`
  };

  /* contact title / icon helpers */
  const titleColor = theme.contactStyles?.titleColor(colors) ?? colors.primary;

  const iconBG = (type: 'primary' | 'accent' | 'secondary') =>
    theme.contactStyles?.iconBackground(colors, type) ?? `${colors.primary}20`;

  const pillRadius =
    (theme.buttonStyles.borderRadius ?? '12px') === '0px' ? '0px' : '9999px';

  const tagBG = (i: number) =>
    theme.contactStyles?.serviceAreaTagBackground(colors, i) ??
    [`${colors.primary}15`, `${colors.accent}15`, `${colors.secondary}15`][i % 3];

  const tagColor = (i: number) =>
    theme.contactStyles?.serviceAreaTagColor(colors, i) ??
    [colors.primary, colors.accent, colors.secondary][i % 3];

  /* ------- render ------- */
  return (
    <section className={`py-20 relative overflow-hidden ${themeName}-theme contact-section`} style={{
      ...sectionBG,
      animation: sectionAnimation
    }}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ------------ CONTACT CARD ------------ */}
          <div className="p-8 shadow-lg" style={cardStyle}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: titleColor as string }}>
              Contact&nbsp;Us
            </h2>

            <div className="space-y-6 text-lg">
              {business.phone && (
                <ContactRow
                  label="Phone"
                  value={business.phone}
                  bg={iconBG('primary')}
                />
              )}

              {business.email && (
                <ContactRow
                  label="Email"
                  value={business.email}
                  bg={iconBG('accent')}
                />
              )}

              {business.address && (
                <ContactRow
                  label="Address"
                  value={`${business.address}, ${business.city ?? ''} ${business.state ?? ''} ${business.zipCode ?? ''}`}
                  bg={iconBG('secondary')}
                />
              )}
            </div>
          </div>

          {/* ------------ SERVICE-AREA CARD ------------ */}
          <div className="p-8 shadow-lg" style={cardStyle}>
            <h2 className="text-3xl font-bold mb-8" style={{ color: titleColor as string }}>
              Service&nbsp;Areas
            </h2>

            <p className="mb-6 text-lg" style={{ color: theme.contactStyles?.textColor(colors) ?? '#6b7280' }}>
              We proudly serve the following areas and surrounding communities:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.isArray(business.serviceArea) && business.serviceArea.length ? (
                business.serviceArea.map((area, i) => {
                  const city = area.split(',')[0].trim();
                  return (
                    <div
                      key={area}
                      className="px-4 py-3 text-center font-medium shadow-sm hover:shadow-md transition-transform duration-300 hover:-translate-y-1"
                      style={{
                        background: tagBG(i) as string,
                        color: tagColor(i) as string,
                        borderRadius: pillRadius
                      }}
                    >
                      {city}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  No service areas defined yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* decorative blobs */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full opacity-20"
           style={{ background: `radial-gradient(circle, ${colors.primary}1A, transparent 70%)` }} />
      <div className="absolute -top-20 -left-20  w-96 h-96 rounded-full opacity-20"
           style={{ background: `radial-gradient(circle, ${colors.accent}1A, transparent 70%)` }} />
    </section>
  );
}

/* — small sub-component for each row — */
function ContactRow({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mt-1 shadow-md"
        style={{ background: bg }}
      >
        <span className="text-xl">{label === 'Phone' ? '📞' : label === 'Email' ? '✉️' : '📍'}</span>
      </div>
      <div>
        <p className="font-bold">{label}:</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
