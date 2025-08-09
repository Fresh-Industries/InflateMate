'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  Users, 
  Ruler, 
  Clock, 
  ChevronRight,
  ArrowUpDown,
  Tag,
  PartyPopper
  } from "lucide-react";
import { themeConfig } from '@/app/[domain]/_themes/themeConfig';
import { ThemeColors } from '@/app/[domain]/_themes/types';
import { getContrastColor } from '@/app/[domain]/_themes/utils';

// Inventory item type definition
interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  primaryImage: string | null;
  type: string;
  status: string;
  capacity?: number | null;
  dimensions?: string | null;
  setupTime?: number | null;
  teardownTime?: number | null;
  minimumSpace?: string | null;
  weightLimit?: number | null;
  ageRange?: string | null;
  weatherRestrictions?: string[] | null;
}

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

// Function to format inventory type for display
const formatInventoryType = (type: string) => {
  return type.replace('_', ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

// Function to get emoji for inventory type
const getTypeEmoji = (type: string) => {
  const typeMap: Record<string, string> = {
    'BOUNCE_HOUSE': '🏰',
    'WATER_SLIDE': '🌊',
    'GAME': '🎮',
    'OTHER': '🎉',
  };
  return typeMap[type] || '🎈';
};

// Field configuration for different inventory types
type FieldName = 'dimensions' | 'capacity' | 'setupTime' | 'teardownTime' | 'minimumSpace' | 'weightLimit' | 'ageRange' | 'weatherRestrictions';

const typeFieldConfig: Record<string, { required: FieldName[]; optional: FieldName[] }> = {
  BOUNCE_HOUSE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  WATER_SLIDE: {
    required: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange'],
    optional: ['weatherRestrictions']
  },
  GAME: {
    required: ['ageRange'],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime']
  },
  OTHER: {
    required: [],
    optional: ['dimensions', 'capacity', 'setupTime', 'teardownTime', 'minimumSpace', 'weightLimit', 'ageRange']
  }
};

// Helper functions to check field visibility
const shouldShowField = (fieldName: FieldName, inventoryType: string) => {
  const config = typeFieldConfig[inventoryType] || typeFieldConfig.OTHER;
  return config.required.includes(fieldName) || config.optional.includes(fieldName);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasValue = (value: any) => {
  return value !== null && value !== undefined && value !== '' && value !== 0;
};

// Client component for the inventory page with filtering functionality
interface InventoryClientProps {
  inventoryItems: InventoryItem[];
  themeName: string;
  colors: ThemeColors;
  businessDomain?: string | null;
  embedConfig?: EmbedConfig | null;
}

export default function InventoryClient({ 
  inventoryItems, 
  themeName,
  colors,

}: InventoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);
  
  // Get unique types from inventory items
  const types = Array.from(new Set(inventoryItems.map(item => item.type)));

  // Helper function to get the correct booking link
  // const getBookingLink = (itemId?: string) => {
  //   if (!businessDomain) return itemId ? `/booking?item=${itemId}` : '/booking';
    
  //   const pageRoute = embedConfig?.pageRoutes?.booking || '/booking';
  //   const itemParam = itemId ? `?item=${itemId}` : '';
  //   return `${businessDomain}${pageRoute}${itemParam}`;
  // };

  // // Helper function to get the correct product link
  // const getProductLink = (itemId?: string) => {
  //   if (!businessDomain) return `/inventory/${itemId}`;
    
  //   const pageRoute = embedConfig?.pageRoutes?.product || '/inventory';
  //   return `${businessDomain}${pageRoute}/${itemId}`;
  // };

  const handleItemClick = (itemId: string) => {
    // Send relative path info instead of full URL
    window.parent.postMessage({
      type: 'navigation',
      action: 'product-detail',
      path: `/services/${itemId}`,
      itemId: itemId
    }, '*');
  };

  const handleBookingClick = () => {
    // Send relative path info instead of full URL
    window.parent.postMessage({
      type: 'navigation', 
      action: 'booking',
      path: `/booking`,
    }, '*');
  };

  // Get theme configuration
  const theme = themeConfig[themeName] || themeConfig.modern;

  // Pre-compute styles based on theme
  const cardStyle = {
    background: theme.cardStyles.background(colors),
    border: theme.cardStyles.border(colors),
    boxShadow: theme.cardStyles.boxShadow(colors),
    color: theme.cardStyles.textColor(colors),
    borderRadius: theme.cardStyles.borderRadius || '16px',
  };

  const buttonStyle = {
    background: theme.buttonStyles.background(colors),
    color: theme.buttonStyles.textColor(colors),
    border: theme.buttonStyles.border?.(colors) || 'none',
    boxShadow: theme.buttonStyles.boxShadow?.(colors) || 'none',
    borderRadius: theme.buttonStyles.borderRadius || '12px',
    transition: theme.buttonStyles.transition || 'all 0.3s ease',
  };

  // Enhanced header style using theme's hero section styling
  const defaultHeaderBackground = `linear-gradient(135deg, ${colors.primary[500]}, ${colors.secondary[500]})`;
  const defaultHeaderColor = getContrastColor(colors.primary[500]);

  const headerStyle: React.CSSProperties = {
    borderRadius: cardStyle.borderRadius,
    boxShadow: theme.cardStyles.boxShadow(colors),
    border: theme.cardStyles.border(colors),
  };

  const themeProvidedBackground = theme.heroBackground
    ? theme.heroBackground(colors)
    : defaultHeaderBackground;

  if (typeof themeProvidedBackground === 'string') {
    headerStyle.background = themeProvidedBackground;
  } else if (themeProvidedBackground && typeof themeProvidedBackground === 'object') {
    Object.assign(headerStyle, themeProvidedBackground);
  }

  headerStyle.color = theme.heroTextColor
    ? theme.heroTextColor(colors)
    : defaultHeaderColor;

  // Enhanced input style using theme properties
  const inputStyle = {
    background: theme.cardStyles.background(colors),
    color: theme.cardStyles.textColor(colors),
    borderRadius: buttonStyle.borderRadius,
    border: `1px solid ${colors.primary}33`,
    boxShadow: 'none',
    transition: 'all 0.3s ease',
    "--tw-ring-color": `${colors.primary}33`,
  } as React.CSSProperties;

  // Filter container style
  const filterContainerStyle = {
    ...cardStyle,
    background: theme.cardStyles.background(colors),
    border: theme.cardStyles.border(colors),
    boxShadow: theme.cardStyles.boxShadow(colors),
  };

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...inventoryItems];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) || 
        (item.description && item.description.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (selectedType) {
      result = result.filter(item => item.type === selectedType);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    
    setFilteredItems(result);
  }, [inventoryItems, searchTerm, selectedType, sortOption]);
  
  // Group filtered items by type
  const itemsByType: Record<string, InventoryItem[]> = {};
  
  if (selectedType) {
    // If a type is selected, only show that type
    itemsByType[selectedType] = filteredItems;
  } else {
    // Otherwise group by type
    filteredItems.forEach(item => {
      const type = item.type || 'OTHER';
      if (!itemsByType[type]) {
        itemsByType[type] = [];
      }
      itemsByType[type].push(item);
    });
  }
  
  return (
    <div className="w-full overflow-x-hidden" style={{ background: colors.background[500] }}>
      <div className="w-full max-w-none mx-auto px-2 sm:px-3 lg:px-4 py-4 sm:py-6">
        {/* Page Header with Theme Background */}
        <div className="mb-6 sm:mb-8 relative overflow-hidden p-4 sm:p-6" style={headerStyle}>
          <div className="absolute top-0 right-0 opacity-10">
            <PartyPopper className="h-32 w-32 text-white transform rotate-12" />
          </div>
          <h1 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
            style={{ color: theme.heroTitleColor ? theme.heroTitleColor(colors) : getContrastColor(colors.primary[500]) }}
          >
            Our Awesome Inventory
          </h1>
          <p 
            className="text-sm sm:text-base lg:text-lg opacity-90 max-w-3xl"
            style={{ color: theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.primary[500]) }}
          >
            Browse our selection of premium inflatable rentals for your next event!
            Click on any item to view more details and book.
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-6 sm:mb-8" style={filterContainerStyle}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary[500] }} />
              </div>
              <input
                type="text"
                className="block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:outline-none"
                style={inputStyle}
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary[500] }} />
              </div>
              <select 
                className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:outline-none appearance-none"
                style={inputStyle}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Categories</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {getTypeEmoji(type)} {formatInventoryType(type)}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary[500] }} />
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary[500] }} />
              </div>
              <select 
                className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:outline-none appearance-none"
                style={inputStyle}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: colors.primary[500]  }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Inventory Grid */}
        {Object.entries(itemsByType).map(([type, items]) => (
          <div key={type} className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2" style={{ color: colors.primary[500] }}>
              {getTypeEmoji(type)} {formatInventoryType(type)}
              <span className="text-xs sm:text-sm font-normal ml-2" style={{ color: colors.secondary[500] }}>
                ({items.length} items)
              </span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item) => (
                <div key={item.id} style={cardStyle} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Item Image or Emoji */}
                  <div 
                    className="h-48 flex items-center justify-center overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}22, ${colors.secondary}22)`,
                      borderTopLeftRadius: cardStyle.borderRadius,
                      borderTopRightRadius: cardStyle.borderRadius,
                    }}
                  >
                    {item.primaryImage ? (
                      <img 
                        src={item.primaryImage} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ 
                          borderTopLeftRadius: cardStyle.borderRadius,
                          borderTopRightRadius: cardStyle.borderRadius,
                        }}
                      />
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                        {getTypeEmoji(item.type)}
                      </span>
                    )}
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-3 sm:p-4 lg:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.primary[500] }}>{item.name}</h3>
                    <p className="mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base" style={{ color: cardStyle.color }}>
                      {item.description || 'Perfect for any event or party!'}
                    </p>
                    
                    {/* Item Specs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                      {shouldShowField('capacity', item.type) && hasValue(item.capacity) && (
                        <div className="flex items-center gap-1.5" style={{ color: colors.secondary[500] }}>
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Up to {item.capacity}</span>
                        </div>
                      )}
                      {shouldShowField('dimensions', item.type) && hasValue(item.dimensions) && (
                        <div className="flex items-center gap-1.5" style={{ color: colors.secondary[500] }}>
                          <Ruler className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">{item.dimensions}</span>
                        </div>
                      )}
                      {shouldShowField('setupTime', item.type) && hasValue(item.setupTime) && (
                        <div className="flex items-center gap-1.5" style={{ color: colors.secondary[500] }}>
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">Setup: {item.setupTime}min</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5" style={{ color: colors.secondary[500] }}>
                        <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs sm:text-sm">{formatInventoryType(item.type)}</span>
                      </div>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="mt-4 sm:mt-6">
                      <div className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ color: colors.accent[500] }}>
                        ${item.price}/day
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          style={buttonStyle} 
                          className="flex-1 text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300"
                          onClick={() => handleBookingClick()}
                        >
                          Book Now
                        </Button>
                        <Button 
                          style={buttonStyle} 
                          className="flex-1 text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300"
                          onClick={() => handleItemClick(item.id)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-8 sm:py-12" style={cardStyle}>
            <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4" style={{ color: colors.primary[500] }} />
            <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.primary[500] }}>No items found</h3>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base" style={{ color: cardStyle.color }}>
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button 
              onClick={() => { setSearchTerm(''); setSelectedType(''); }}
              style={buttonStyle}
              className="text-sm sm:text-base font-bold hover:scale-105 transition-transform duration-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 