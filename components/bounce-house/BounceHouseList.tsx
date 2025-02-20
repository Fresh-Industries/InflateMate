'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BounceHouseListProps {
  bounceHouses: any[];
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

export function BounceHouseList({ bounceHouses, businessId }: BounceHouseListProps) {
  const router = useRouter();

  const handleEdit = (bounceHouseId: string) => {
    router.push(`/dashboard/${businessId}/inventory/${bounceHouseId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bounceHouses.map((bounceHouse) => (
        <Card key={bounceHouse.id} className="relative group">
          {bounceHouse.primaryImage && (
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img
                src={bounceHouse.primaryImage}
                alt={bounceHouse.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => handleEdit(bounceHouse.id)}
                >
                  <Edit className="h-4 w-4" />
                  Edit Details
                </Button>
              </div>
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{bounceHouse.name}</CardTitle>
                <Badge
                  className={`mt-2 ${
                    statusColors[bounceHouse.status as keyof typeof statusColors]
                  }`}
                >
                  {statusLabels[bounceHouse.status as keyof typeof statusLabels]}
                </Badge>
              </div>
              {!bounceHouse.primaryImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(bounceHouse.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bounceHouse.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-muted-foreground">
                    {formatCurrency(bounceHouse.price)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Capacity</p>
                  <p className="text-muted-foreground">
                    {bounceHouse.capacity} people
                  </p>
                </div>
                <div>
                  <p className="font-medium">Dimensions</p>
                  <p className="text-muted-foreground">{bounceHouse.dimensions}</p>
                </div>
                <div>
                  <p className="font-medium">Age Range</p>
                  <p className="text-muted-foreground">{bounceHouse.ageRange}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 