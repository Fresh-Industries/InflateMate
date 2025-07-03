'use client';

import { Star, Package, Users, Ruler } from "lucide-react";

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

interface Inventory {
  id: string;
  name: string;
  description: string | null;
  price: number;
  primaryImage: string | null;
  dimensions?: string;
  capacity?: number;
}

interface RelatedProductsProps {
  relatedProducts: Inventory[];
  businessDomain?: string | null;
  embedConfig?: EmbedConfig | null;
  primaryColor: string;
  secondaryColor: string;
}

export function RelatedProducts({ 
  relatedProducts, 
  businessDomain, 
  embedConfig, 
  primaryColor, 
  secondaryColor 
}: RelatedProductsProps) {
  // Helper function to get the correct product link
  const getProductLink = (itemId: string) => {
    if (!businessDomain) return `./${itemId}`;
    
    const pageRoute = embedConfig?.pageRoutes?.product || '/inventory';
    return `${businessDomain}${pageRoute}/${itemId}`;
  };

  const handleProductClick = (itemId: string) => {
    const url = getProductLink(itemId);
    window.top!.location.href = url;
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12">
      <div className="flex items-center mb-4 sm:mb-6">
        <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" style={{ color: primaryColor }} />
        <h2 className="text-xl sm:text-2xl font-semibold">Related Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {relatedProducts.map((item: Inventory) => (
          <div
            key={item.id} 
            onClick={() => handleProductClick(item.id)}
            className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-32 sm:h-48 overflow-hidden">
              {item.primaryImage ? (
                <img 
                  src={item.primaryImage} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <span 
                  className="text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  ${item.price.toFixed(2)}/day
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <h3 
                className="font-semibold text-sm sm:text-lg transition-colors group-hover:text-blue-600"
                style={{ color: secondaryColor }}
              >
                {item.name}
              </h3>
              <p className="text-gray-600 mt-1 line-clamp-2 text-xs sm:text-sm">
                {item.description || 'No description available.'}
              </p>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Max {item.capacity}</span>
                </div>
                <div className="flex items-center">
                  <Ruler className="h-3 w-3 mr-1" />
                  <span>{item.dimensions}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 