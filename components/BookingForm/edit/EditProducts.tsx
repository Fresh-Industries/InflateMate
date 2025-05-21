"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryItem, SelectedItem } from "@/types/booking";
import { searchInventoryAvailability } from "@/services/bookingService";
import { PackageOpen, Loader2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditProductsProps {
  businessId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  bookingId: string;
  selectedItems: Map<string, SelectedItem>;
  selectInventoryItem: (item: InventoryItem, quantity?: number) => void;
  updateQuantity: (item: InventoryItem, delta: number) => void;
}

export function EditProducts({
  businessId,
  eventDate,
  startTime,
  endTime,
  bookingId,
  selectedItems,
  selectInventoryItem,
  updateQuantity,
}: EditProductsProps) {
  // State for the add items dialog
  const [isSearching, setIsSearching] = useState(false);
  const [availableInventory, setAvailableInventory] = useState<InventoryItem[]>([]);
  const [showAddItemsDialog, setShowAddItemsDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available inventory when dialog opens
  const fetchAvailableInventory = async () => {
    if (!eventDate || !startTime || !endTime) {
      setError("Event date and time are required");
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const items = await searchInventoryAvailability(businessId, {
        date: eventDate,
        startTime,
        endTime,
        tz: timezone,
        excludeBookingId: bookingId
      });
      
      // Filter out items that are already in the booking
      const filteredItems = items.filter(item => 
        !Array.from(selectedItems.keys()).includes(item.id)
      );
      
      setAvailableInventory(filteredItems);
    } catch (err) {
      console.error("Error fetching available inventory:", err);
      setError("Failed to load available inventory. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Items Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Current Items</h3>
          <Button onClick={() => {
            setShowAddItemsDialog(true);
            fetchAvailableInventory();
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Items
          </Button>
        </div>
        
        {selectedItems.size === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <PackageOpen className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500 text-center">No items in this booking yet.</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => {
                setShowAddItemsDialog(true);
                fetchAvailableInventory();
              }}
            >
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {Array.from(selectedItems.values()).map(({ item, quantity }) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative w-full sm:w-48 h-48">
                    {item.primaryImage ? (
                      <Image
                        src={item.primaryImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <PackageOpen className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-grow p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="h-fit">
                        ${(item.price * quantity).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item, -1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <span className="font-medium w-8 text-center">{quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                        onClick={() => selectInventoryItem({ ...item, quantity: 0 }, 0)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Items Dialog */}
      <Dialog open={showAddItemsDialog} onOpenChange={setShowAddItemsDialog}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Items to Booking</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {isSearching ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                <span className="ml-2">Searching for available items...</span>
              </div>
            ) : availableInventory.length === 0 ? (
              <div className="text-center py-8">
                <p>No additional items available for the selected date and time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto p-1">
                {availableInventory.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative w-full sm:w-36 h-36">
                        {item.primaryImage ? (
                          <Image
                            src={item.primaryImage}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <PackageOpen className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <CardContent className="flex-grow p-4">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                          {item.description && (
                            <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-end mt-4">
                          <Select 
                            onValueChange={(value) => {
                              selectInventoryItem(item, parseInt(value));
                            }}
                            defaultValue="1"
                          >
                            <SelectTrigger className="w-20 mr-3">
                              <SelectValue placeholder="Qty" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(Math.min(10, item.quantity))].map((_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Button 
                            onClick={() => {
                              selectInventoryItem(item, 1);
                              setShowAddItemsDialog(false);
                            }}
                          >
                            Add to Booking
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowAddItemsDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
