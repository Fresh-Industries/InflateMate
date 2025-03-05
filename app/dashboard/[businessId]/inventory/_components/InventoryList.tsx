'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Image } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  status: "AVAILABLE" | "MAINTENANCE" | "RETIRED";
  type: "BOUNCE_HOUSE" | "INFLATABLE" | "GAME" | "OTHER";
  description?: string;
  dimensions: string;
  capacity: number;
  price: number;
  setupTime: number;
  teardownTime: number;
  minimumSpace: string;
  weightLimit: number;
  ageRange: string;
  primaryImage?: string;
  images: string[];
  weatherRestrictions: string[];
  quantity: number;
  bookingCount?: number;
}

interface InventoryListProps {
  inventoryItems: InventoryItem[];
  businessId: string;
}

const statusColors = {
  AVAILABLE: "bg-green-500",
  MAINTENANCE: "bg-yellow-500",
  RETIRED: "bg-red-500",
};

const statusLabels = {
  AVAILABLE: "Available",
  MAINTENANCE: "Maintenance",
  RETIRED: "Retired",
};

const typeLabels = {
  BOUNCE_HOUSE: "Bounce House",
  INFLATABLE: "Inflatable",
  GAME: "Game",
  OTHER: "Other",
};

export function InventoryList({ inventoryItems, businessId }: InventoryListProps) {
  const router = useRouter();

  const handleEdit = (inventoryId: string) => {
    router.push(`/dashboard/${businessId}/inventory/${inventoryId}`);
  };

  // Function to get the first available image or primary image
  const getDisplayImage = (item: InventoryItem) => {
    if (item.primaryImage) {
      return item.primaryImage;
    }
    
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inventoryItems.map((item) => {
        const displayImage = getDisplayImage(item);
        
        return (
          <Card key={item.id} className="relative group">
            {displayImage ? (
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                  src={displayImage}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-muted flex items-center justify-center rounded-t-lg">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Image className="h-10 w-10 mb-2" />
                  <p>No image available</p>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{item.name}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      className={`${
                        statusColors[item.status as keyof typeof statusColors]
                      }`}
                    >
                      {statusLabels[item.status as keyof typeof statusLabels]}
                    </Badge>
                    <Badge variant="outline">
                      {typeLabels[item.type as keyof typeof typeLabels]}
                    </Badge>
                  </div>
                </div>
                {!displayImage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description || "No description available"}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-muted-foreground">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-muted-foreground">
                      {item.capacity} people
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Dimensions</p>
                    <p className="text-muted-foreground">{item.dimensions}</p>
                  </div>
                  <div>
                    <p className="font-medium">Quantity</p>
                    <p className="text-muted-foreground">{item.quantity || 1}</p>
                  </div>
                  <div>
                    <p className="font-medium">Bookings</p>
                    <p className="text-muted-foreground">{item.bookingCount || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 