'use client';

import React from 'react';
import { Star, Sparkles, Truck } from 'lucide-react';

// Simple component for trust badges
export default function TrustIndicatorsSection() {
  return (
    <section className="py-6 bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 py-2">
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 hover:scale-105 transition-transform duration-300">
            <div className="flex text-yellow-400">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
            </div>
            <span className="ml-1 font-medium">Trusted by 500+ Customers</span>
          </div>
          <div className="hidden md:block h-6 border-r border-gray-300"></div>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="font-medium">100% Clean Equipment</span>
          </div>
           <div className="hidden md:block h-6 border-r border-gray-300"></div>
          <div className="flex items-center gap-2 text-sm md:text-base text-gray-600 hover:scale-105 transition-transform duration-300">
            <Truck className="h-5 w-5 text-green-500" />
            <span className="font-medium">Delivery & Setup Available</span> 
          </div>
        </div>
      </div>
    </section>
  );
} 