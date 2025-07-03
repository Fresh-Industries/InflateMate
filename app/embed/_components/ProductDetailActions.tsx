'use client';

import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";

interface EmbedConfig {
  pageRoutes?: {
    booking?: string;
    inventory?: string;
    product?: string;
  };
  showPrices?: boolean;
  showDescriptions?: boolean;
  redirectUrl?: string;
  successMessage?: string;
}

interface ProductDetailActionsProps {
  productId: string;
  businessDomain?: string | null;
  embedConfig?: EmbedConfig | null;
  primaryColor: string;
}

export function ProductDetailActions({ 
  productId, 
  businessDomain, 
  embedConfig, 
  primaryColor 
}: ProductDetailActionsProps) {
  // Helper function to get the correct booking link
  const getBookingLink = (itemId: string) => {
    if (!businessDomain) return `../booking?item=${itemId}`;
    
    const pageRoute = embedConfig?.pageRoutes?.booking || '/booking';
    return `${businessDomain}${pageRoute}?item=${itemId}`;
  };

  // Helper function to get the correct inventory link
  const getInventoryLink = () => {
    if (!businessDomain) return '../inventory';
    
    const pageRoute = embedConfig?.pageRoutes?.inventory || '/inventory';
    return `${businessDomain}${pageRoute}`;
  };

  const handleBackClick = () => {
    const url = getInventoryLink();
    window.top!.location.href = url;
  };

  const handleBookingClick = () => {
    const url = getBookingLink(productId);
    window.top!.location.href = url;
  };

  return (
    <>
      {/* Back Button */}
      <div className="mb-4 sm:mb-6">
        <button 
          onClick={handleBackClick}
          className="inline-flex items-center text-sm hover:text-blue-600 transition-colors"
          style={{ color: primaryColor }}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </button>
      </div>

      {/* Book This Item Button */}
      <div className="pt-4 sm:pt-6 border-t">
        <Button 
          size="lg" 
          className="w-full text-white text-sm sm:text-base" 
          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          onClick={handleBookingClick}
        >
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Book This Item
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2">
          Secure your reservation now. Dates fill up quickly!
        </p>
      </div>
    </>
  );
} 