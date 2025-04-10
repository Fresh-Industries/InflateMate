'use client';

import React from 'react';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ContactAndServiceAreaSectionProps {
  business: BusinessWithSiteConfig;
  colors: { primary: string; accent: string; secondary: string };
}

export default function ContactAndServiceAreaSection({ 
  business, 
  colors 
}: ContactAndServiceAreaSectionProps) {
  const { primary: primaryColor, accent: accentColor, secondary: tertiaryColor } = colors;
  const serviceAreas: string[] = Array.isArray(business.serviceArea) ? business.serviceArea : [];

  const contactInfo = [
    { 
      icon: Phone, 
      label: 'Phone', 
      value: business.phone, 
      color: primaryColor, 
      bgColor: `${primaryColor}15` 
    },
    { 
      icon: Mail, 
      label: 'Email', 
      value: business.email, 
      color: accentColor, 
      bgColor: `${accentColor}15` 
    },
    { 
      icon: MapPin, 
      label: 'Address', 
      value: business.address ? `${business.address}, ${business.city || ''} ${business.state || ''} ${business.zipCode || ''}`.trim().replace(/, $/, '') : null, 
      color: tertiaryColor, 
      bgColor: `${tertiaryColor}15` 
    },
  ].filter(item => item.value); // Only include items with a value

  const getServiceAreaColor = (index: number) => {
    const areaColors = [primaryColor, accentColor, tertiaryColor];
    return areaColors[index % areaColors.length];
  };

  return (
    <section 
      className="py-16 md:py-20 bg-gray-50 relative overflow-hidden"
      style={{ 
        backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.04) 0%, transparent 50%), radial-gradient(circle at 90% 90%, rgba(249, 115, 22, 0.04) 0%, transparent 50%)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Contact Us
            </h2>
            <div className="space-y-5">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mt-1 flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-base">{item.label}:</p>
                    <p className="text-gray-600 text-base break-words">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Service Areas Card */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Service Areas
            </h2>
            <p className="text-gray-600 mb-5 text-base">
              We proudly serve the following areas:
            </p>
            {serviceAreas.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {serviceAreas.map((area, index) => {
                  const color = getServiceAreaColor(index);
                  return (
                    <div 
                      key={area} 
                      className="px-3 py-1.5 rounded-full text-sm font-medium shadow-xs"
                      style={{ 
                        backgroundColor: `${color}15`, 
                        color: color
                      }}
                    >
                      {area}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No service areas defined yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 