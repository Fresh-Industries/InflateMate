'use client';

import { useState, useEffect } from "react";
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price: number;
  dimensions: string;
  capacity: number;
  imageUrl?: string | null;
  status: string;
}

interface InventoryDisplayProps {
  businessId: string;
  siteConfig?: any;
}

export default function InventoryDisplay({ businessId, siteConfig }: InventoryDisplayProps) {
  const router = useRouter();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [view, setView] = useState("grid");

  // Colors from site config
  const colors = siteConfig?.colors || {
    primary: "#3b82f6", // Default blue
    secondary: "#6b7280", // Default gray
    accent: "#f59e0b", // Default amber
    background: "#f9fafb", // Default gray-50
  };

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/businesses/${businessId}/inventory`);
        const data = await res.json();
        setInventoryItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [businessId]);

  useEffect(() => {
    // Apply filters
    let results = inventoryItems;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by type
    if (typeFilter !== "all") {
      results = results.filter(item => item.type === typeFilter);
    }
    
    setFilteredItems(results);
  }, [searchTerm, typeFilter, inventoryItems]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value);
  };

  const handleBookNow = (itemId: string) => {
    router.push(`/${businessId}/booking?item=${itemId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 rounded-md text-center">
        <p className="text-yellow-700 mb-2">No inventory items available at this time.</p>
        <p className="text-sm text-yellow-600">Please try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search inventory..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="w-40">
            <Select value={typeFilter} onValueChange={handleTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BOUNCE_HOUSE">Bounce House</SelectItem>
                <SelectItem value="INFLATABLE">Inflatable</SelectItem>
                <SelectItem value="GAME">Game</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="grid" value={view} onValueChange={setView} className="w-[160px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <Separator />
      
      {/* Grid View */}
      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">{item.type.replace('_', ' ')}</span>
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2"
                  style={{ 
                    backgroundColor: item.status === 'AVAILABLE' ? '#10b981' : '#6b7280'
                  }}
                >
                  {item.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-gray-500 mb-2">{item.dimensions}</p>
                {item.description && (
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">${item.price.toFixed(2)}</span>
                  <Badge variant="outline">Capacity: {item.capacity}</Badge>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => handleBookNow(item.id)}
                  disabled={item.status !== 'AVAILABLE'}
                >
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </TabsContent>
      
      {/* List View */}
      <TabsContent value="list" className="mt-0">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">{item.type.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Badge 
                      style={{ 
                        backgroundColor: item.status === 'AVAILABLE' ? '#10b981' : '#6b7280'
                      }}
                    >
                      {item.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{item.dimensions}</p>
                  
                  {item.description && (
                    <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="font-medium text-lg">${item.price.toFixed(2)}</span>
                      <Badge variant="outline" className="ml-2">Capacity: {item.capacity}</Badge>
                    </div>
                    
                    <Button 
                      style={{ backgroundColor: colors.primary }}
                      onClick={() => handleBookNow(item.id)}
                      disabled={item.status !== 'AVAILABLE'}
                    >
                      Book Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </div>
  );
} 