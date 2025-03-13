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
  Star,
  PartyPopper
} from "lucide-react";
import Link from 'next/link';
import { InventoryItem } from './page';

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
export default function InventoryClient({ 
  inventoryItems, 
  domain, 
  primaryColor, 
  secondaryColor 
}: { 
  inventoryItems: InventoryItem[]; 
  domain: string; 
  primaryColor: string; 
  secondaryColor: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [filteredItems, setFilteredItems] = useState(inventoryItems);
  
  // Get unique types from inventory items
  const types = Array.from(new Set(inventoryItems.map(item => item.type)));
  
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header with Colorful Background */}
      <div className="mb-10 relative overflow-hidden rounded-xl p-8" 
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}dd, ${secondaryColor}dd)`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="absolute top-0 right-0 opacity-10">
          <PartyPopper className="h-32 w-32 text-white transform rotate-12" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-white">
          Our Awesome Inventory
        </h1>
        <p className="text-lg text-white text-opacity-90 max-w-3xl">
          Browse our selection of premium inflatable rentals for your next event!
          Click on any item to view more details and book.
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none"
              style={{ 
                "--tw-ring-color": `${primaryColor}80`
              } as React.CSSProperties}
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <select 
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none appearance-none"
              style={{ 
                "--tw-ring-color": `${primaryColor}80`
              } as React.CSSProperties}
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
              <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown className="h-5 w-5" style={{ color: primaryColor }} />
            </div>
            <select 
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:outline-none appearance-none"
              style={{ 
                "--tw-ring-color": `${primaryColor}80`
              } as React.CSSProperties}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Results Summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <p className="text-sm px-4 py-2 bg-gray-50 rounded-full inline-flex items-center" style={{ color: secondaryColor }}>
          <Tag className="h-4 w-4 mr-2" style={{ color: primaryColor }} />
          Showing {filteredItems.length} of {inventoryItems.length} items
          {selectedType && ` in ${formatInventoryType(selectedType)}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
        
        <Button 
          className="text-white px-6 py-2 h-auto rounded-full shadow-md transition-transform hover:scale-105"
          style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          }}
          asChild
        >
          <Link href={`/${domain}/booking`}>
            Book Now <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
      
      {/* No Results Message */}
      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
          <Package className="h-16 w-16 mx-auto mb-4" style={{ color: primaryColor }} />
          <h2 className="text-xl font-semibold mb-2">No items found</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-4">
            We couldn&apos;t find any items matching your search criteria.
          </p>
          <Button 
            variant="outline" 
            className="rounded-full"
            style={{ borderColor: primaryColor, color: primaryColor }}
            onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setSortOption('name-asc');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
      
      {/* Inventory Items by Type */}
      <div className="space-y-12">
        {Object.entries(itemsByType).map(([type, items]) => (
          items.length > 0 && (
            <div key={type} id={type.toLowerCase()} className="scroll-mt-24">
              {/* Only show type header if not filtering by type or there are multiple types */}
              {(!selectedType || Object.keys(itemsByType).length > 1) && (
                <div className="flex items-center mb-6 pb-2 border-b border-gray-100">
                  <span className="text-3xl mr-2">{getTypeEmoji(type)}</span>
                  <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                    {formatInventoryType(type)}
                  </h2>
                  <span className="ml-3 px-3 py-1 text-sm font-medium rounded-full" 
                    style={{ 
                      backgroundColor: `${primaryColor}15`,
                      color: primaryColor
                    }}
                  >
                    {items.length} items
                  </span>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <Link 
                    key={item.id} 
                    href={`/${domain}/inventory/${item.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 hover:border-blue-200"
                  >
                    <div className="relative h-56 overflow-hidden bg-gray-50">
                      {item.primaryImage ? (
                        <img 
                          src={item.primaryImage} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-16 w-16" style={{ color: `${primaryColor}40` }} />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span 
                          className="text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                          style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          }}
                        >
                          ${item.price.toFixed(2)}/day
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${primaryColor}15`,
                            color: primaryColor
                          }}
                        >
                          {getTypeEmoji(item.type)} {formatInventoryType(item.type)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {item.description || 'No description available.'}
                      </p>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Ruler className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: primaryColor }} />
                          <span className="truncate">{item.dimensions}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: primaryColor }} />
                          <span className="truncate">Max {item.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 flex-shrink-0" style={{ color: primaryColor }} />
                          <span className="truncate">{item.setupTime}min setup</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1" style={{ color: primaryColor }} />
                          <span className="text-sm text-gray-500">View details</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-full"
                          style={{ 
                            borderColor: primaryColor, 
                            color: primaryColor
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      
      {/* Empty State */}
      {inventoryItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center p-6 rounded-full mb-4" 
            style={{ backgroundColor: `${primaryColor}15` }}
          >
            <Package className="h-12 w-12" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-2xl font-bold mb-2">No inventory items available</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            We&apos;re currently updating our inventory. Please check back later for available inflatable rentals.
          </p>
          <Button 
            className="text-white px-6 py-2 h-auto rounded-full shadow-md"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            }}
            asChild
          >
            <Link href={`/${domain}/contact`}>
              Contact Us
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
} 