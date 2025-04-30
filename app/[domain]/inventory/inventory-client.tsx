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
import Link from 'next/link';
import { InventoryItem } from './page';
import { ThemeColors, themeConfig, getContrastColor } from '@/app/[domain]/_themes/themeConfig';

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
    'INFLATABLE': '🌊',
    'GAME': '🎮',
    'OTHER': '🎉',
  };
  return typeMap[type] || '🎈';
};

// Client component for the inventory page with filtering functionality
interface InventoryClientProps {
  inventoryItems: InventoryItem[];
  themeName: string;
  colors: ThemeColors;
}

export default function InventoryClient({ 
  inventoryItems, 
  themeName,
  colors
}: InventoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);
  
  // Get unique types from inventory items
  const types = Array.from(new Set(inventoryItems.map(item => item.type)));

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
  const headerStyle = {
    background: theme.heroBackground ? theme.heroBackground(colors) : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
    color: theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.primary),
    borderRadius: cardStyle.borderRadius,
    boxShadow: theme.cardStyles.boxShadow(colors),
    border: theme.cardStyles.border(colors),
  };

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
    <div className="min-h-screen w-full" style={{ background: colors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header with Theme Background */}
        <div className="mb-10 relative overflow-hidden p-8" style={headerStyle}>
          <div className="absolute top-0 right-0 opacity-10">
            <PartyPopper className="h-32 w-32 text-white transform rotate-12" />
          </div>
          <h1 
            className="text-4xl font-bold mb-3"
            style={{ color: theme.heroTitleColor ? theme.heroTitleColor(colors) : getContrastColor(colors.primary) }}
          >
            Our Awesome Inventory
          </h1>
          <p 
            className="text-lg opacity-90 max-w-3xl"
            style={{ color: theme.heroTextColor ? theme.heroTextColor(colors) : getContrastColor(colors.primary) }}
          >
            Browse our selection of premium inflatable rentals for your next event!
            Click on any item to view more details and book.
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="mb-8" style={filterContainerStyle}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 focus:ring-2 focus:outline-none"
                style={inputStyle}
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Type Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 focus:ring-2 focus:outline-none appearance-none"
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
            </div>
            
            {/* Sort Options */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ArrowUpDown className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
              <select 
                className="block w-full pl-10 pr-3 py-3 focus:ring-2 focus:outline-none appearance-none"
                style={inputStyle}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronRight className="h-5 w-5" style={{ color: colors.primary }} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Inventory Grid */}
        {Object.entries(itemsByType).map(([type, items]) => (
          <div key={type} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: colors.primary }}>
              {getTypeEmoji(type)} {formatInventoryType(type)}
              <span className="text-sm font-normal ml-2" style={{ color: colors.secondary }}>
                ({items.length} items)
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>{item.name}</h3>
                    <p className="mb-4 line-clamp-2" style={{ color: cardStyle.color }}>
                      {item.description || 'Perfect for any event or party!'}
                    </p>
                    
                    {/* Item Specs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-1.5" style={{ color: colors.secondary }}>
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Up to {item.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: colors.secondary }}>
                        <Ruler className="h-4 w-4" />
                        <span className="text-sm">{item.dimensions}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: colors.secondary }}>
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Setup: {item.setupTime}min</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: colors.secondary }}>
                        <Package className="h-4 w-4" />
                        <span className="text-sm">{formatInventoryType(item.type)}</span>
                      </div>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-2xl font-bold" style={{ color: colors.accent }}>
                        ${item.price}/day
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild style={buttonStyle} className="font-bold hover:scale-105 transition-transform duration-300">
                          <Link href={`/booking`}>
                            Book Now
                        </Link>
                      </Button>
                      <Button asChild style={buttonStyle} className="font-bold hover:scale-105 transition-transform duration-300">
                        <Link href={`/inventory/${item.id}`}>
                          Details
                        </Link>
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
          <div className="text-center py-12" style={cardStyle}>
            <Package className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>No items found</h3>
            <p className="mb-6" style={{ color: cardStyle.color }}>
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <Button 
              onClick={() => { setSearchTerm(''); setSelectedType(''); }}
              style={buttonStyle}
              className="font-bold hover:scale-105 transition-transform duration-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 