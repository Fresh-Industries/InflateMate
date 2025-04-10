'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { BusinessWithSiteConfig } from '@/lib/business/domain-utils';

// Define simplified InventoryItem type for props
interface InventoryItem {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  primaryImage?: string | null;
  type: string; 
}

interface PopularRentalsSectionProps {
  business: BusinessWithSiteConfig;
  inventoryItems: InventoryItem[];
  colors: { primary: string; accent: string; secondary: string };
}

const typeEmojis: Record<string, string> = {
  'BOUNCE_HOUSE': '🏰',
  'INFLATABLE': '🌊',
  'GAME': '🎮',
  'OTHER': '🎉',
};

export default function PopularRentalsSection({ 
  business,
  inventoryItems,
  colors
}: PopularRentalsSectionProps) {
  const { primary: primaryColor, accent: accentColor } = colors;

  return (
    <section 
      className="py-16 md:py-20 relative overflow-hidden bg-gray-50"
      style={{ 
        backgroundImage: 'radial-gradient(circle at 20% 90%, rgba(79, 70, 229, 0.04) 0%, transparent 50%), radial-gradient(circle at 80% 40%, rgba(249, 115, 22, 0.04) 0%, transparent 50%)'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <h2 
          className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16"
          style={{ color: primaryColor }}
        >
          Our Popular Rentals
        </h2>
        
        {inventoryItems.length === 0 ? (
          <div className="text-center py-10 bg-white bg-opacity-80 rounded-xl shadow-md max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6 text-lg">No featured rentals available right now.</p>
            <Button 
              asChild
              size="lg"
              className="text-lg font-bold hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: primaryColor,
                color: '#ffffff'
              }}
            >
              <Link href={`/${business.customDomain || business.id}/booking`} className="flex items-center gap-2">
                Contact Us to Book <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {inventoryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 group flex flex-col">
                <div 
                  className="relative h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden"
                >
                  {item.primaryImage ? (
                    <Image 
                      src={item.primaryImage} 
                      alt={item.name} 
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-500 ease-in-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{typeEmojis[item.type] || '🎉'}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm flex-grow line-clamp-3">
                    {item.description || `Perfect for any event or party!`}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span 
                      className="text-xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      ${item.price}<span className="text-sm font-normal text-gray-500">/day</span>
                    </span>
                    <Button 
                      asChild
                      size="sm"
                      className="font-semibold hover:scale-105 transition-transform duration-300"
                      style={{ 
                        backgroundColor: accentColor,
                        color: '#ffffff'
                      }}
                    >
                      <Link href={`/${business.customDomain || business.id}/booking?itemId=${item.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button 
            asChild
            size="lg"
            variant="outline"
            className="text-lg font-bold hover:scale-105 transition-transform duration-300 shadow-sm border-primary text-primary hover:bg-primary/5"
            style={{ color: primaryColor, borderColor: primaryColor }}
          >
            <Link href={`/${business.customDomain || business.id}/inventory`} className="flex items-center gap-2">
              View All Rentals <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 