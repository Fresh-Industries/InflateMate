'use client';

import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Image as ImageIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

// Define badge variants based on status
const getStatusBadgeVariant = (
  status: InventoryItem["status"]
): "default" | "destructive" | "secondary" => {
  switch (status) {
    case "AVAILABLE":
      return "default";
    case "MAINTENANCE":
      return "destructive";
    case "RETIRED":
      return "secondary";
    default:
      return "default";
  }
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

  // Function to get all available images, prioritizing primaryImage
  const getAllImages = (item: InventoryItem): string[] => {
    const allImages = item.images ? [...item.images] : [];
    if (item.primaryImage && !allImages.includes(item.primaryImage)) {
      allImages.unshift(item.primaryImage);
    }
    return allImages;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {inventoryItems.map((item) => {
        const allItemImages = getAllImages(item);
        const hasMultipleImages = allItemImages.length > 1;
        const statusVariant = getStatusBadgeVariant(item.status);

        return (
          <Card
            key={item.id}
            className="group overflow-hidden rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
          >
            {/* Image Section */}
            <div className="relative aspect-video overflow-hidden w-full bg-muted/50">
              {allItemImages.length > 0 ? (
                hasMultipleImages ? (
                  // Carousel for multiple images
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                    {allItemImages.map((imgSrc, index) => (
                      <CarouselItem key={index}>
                        <div className="w-full h-full">
                          <img
                            src={imgSrc}
                            alt={`${item.name} - Image ${index + 1}`}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious
      
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/70 hover:bg-background/90 border-none h-8 w-8"
                      
                    />
                    <CarouselNext
                     
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/70 hover:bg-background/90 border-none h-8 w-8"
                      
                    />
                  </Carousel>
                ) : (
                  // Single image
                  <img
                    src={allItemImages[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => handleEdit(item.id)}
                  />
                )
              ) : (
                // Placeholder if no image available
                <div
                  className="h-full w-full flex items-center justify-center rounded-t-lg"
                  onClick={() => handleEdit(item.id)}
                >
                  <div className="flex flex-col items-center text-muted-foreground/70">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div
              className="p-4 flex flex-col flex-grow"
              onClick={() => handleEdit(item.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg font-semibold line-clamp-1 mr-2">
                  {item.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(item.id);
                  }}
                  aria-label={`Edit ${item.name}`}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={statusVariant}>
                  {statusLabels[item.status as keyof typeof statusLabels]}
                </Badge>
                <Badge variant="outline">
                  {typeLabels[item.type as keyof typeof typeLabels]}
                </Badge>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2 border-t border-border/50">
                <div>
                  <p className="text-muted-foreground text-xs">Price</p>
                  <p className="font-medium">{formatCurrency(item.price)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Capacity</p>
                  <p className="font-medium">{item.capacity} ppl</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Quantity</p>
                  <p className="font-medium">{item.quantity || 1}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bookings</p>
                  <p className="font-medium">{item.bookingCount || 0}</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
