'use client';

import React from 'react';
import Link from 'next/link';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';

interface FooterProps {
  business: BusinessWithSiteConfig;
  colors: { primary: string };
}

export default function Footer({ business, colors }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const domainPrefix = business.customDomain || business.id;

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Business Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">{business.name}</h3>
            <p className="text-sm text-gray-600">
              {business.description || 'Providing the best rental experience.'}
            </p>
            {/* Add address/phone if desired */}
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href={`/${domainPrefix}/inventory`} className="text-sm text-gray-600 hover:text-primary transition-colors" style={{ '--hover-color': colors.primary } as React.CSSProperties}>Rentals</Link></li>
              <li><Link href={`/${domainPrefix}/about`} className="text-sm text-gray-600 hover:text-primary transition-colors" style={{ '--hover-color': colors.primary } as React.CSSProperties}>About Us</Link></li>
              <li><Link href={`/${domainPrefix}/contact`} className="text-sm text-gray-600 hover:text-primary transition-colors" style={{ '--hover-color': colors.primary } as React.CSSProperties}>Contact</Link></li>
               <li><Link href={`/${domainPrefix}/booking`} className="text-sm text-gray-600 hover:text-primary transition-colors" style={{ '--hover-color': colors.primary } as React.CSSProperties}>Book Now</Link></li>
              {/* Add other links like FAQ, Policies etc. */}
            </ul>
          </div>
          
          {/* Maybe Social Links or Newsletter? */}
          <div>
            {/* Placeholder for future content */}
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
          &copy; {currentYear} {business.name}. All rights reserved. 
          {/* Optional: Link to main platform? */}
        </div>
      </div>
    </footer>
  );
} 