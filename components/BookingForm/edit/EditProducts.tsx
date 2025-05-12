"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2, Search, Minus, Plus, PlusCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaginationControls } from "@/components/BookingForm/PagnationControls";
import {
  NewBookingState,
  SelectedItem,
  InventoryItem,
  AvailabilitySearchFilters,
} from "@/types/booking";
import { useAvailability } from "@/hooks/useAvailability";
import { formatDateToYYYYMMDD, formatTimeToHHMM } from "@/lib/utils";

const ITEMS_PER_PAGE = 4;

interface EventDetailsStepProps {
  businessId: string;
  newBooking: NewBookingState;
  setNewBooking: (field: keyof NewBookingState, value: string | number) => void;
  selectedItems: Map<string, SelectedItem>;
  eventDate: string;
  startTime: string;
  endTime: string;
  selectInventoryItem: (item: InventoryItem, quantity?: number) => void;
  updateQuantity: (item: InventoryItem, delta: number) => void;
  bookingId: string;
  onContinue: () => void;
}

export function EventDetailsStep({
  businessId,
  newBooking,
  setNewBooking,
  eventDate,
  startTime,
  endTime,
  selectedItems,
  selectInventoryItem,
  updateQuantity,
  onContinue,
}: EventDetailsStepProps) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // --- Fix: Always use formatted values for API ---
  const [filters, setFilters] = React.useState({
    date: formatDateToYYYYMMDD(eventDate),
    startTime: formatTimeToHHMM(startTime),
    endTime: formatTimeToHHMM(endTime),
    tz: timezone,
  });

  React.useEffect(() => {
    setFilters({
      date: formatDateToYYYYMMDD(eventDate),
      startTime: formatTimeToHHMM(startTime),
      endTime: formatTimeToHHMM(endTime),
      tz: timezone,
    });
  }, [eventDate, startTime, endTime, timezone]);

  // --- Collapsible state for "Add Item" ---
  const [showAvailability, setShowAvailability] = React.useState(false);

  const {
    availableInventory,
    isSearchingAvailability,
    hasSearched,
    currentPage,
    setCurrentPage,
    searchAvailability,
    updateCurrentSelectedItems,
    recentlyUnavailableItemIds,
  } = useAvailability({
    businessId,
    filters: filters as AvailabilitySearchFilters,
    onUnavailableItemsFound: (unavailableItems) => {
      unavailableItems.forEach(({ item }) => {
        const currentQuantity = selectedItems.get(item.id)?.quantity || 0;
        if (currentQuantity > 0) {
          const availableItem = availableInventory.find((i) => i.id === item.id);
          if (availableItem && availableItem.quantity > 0) {
            updateQuantity(item, availableItem.quantity - currentQuantity);
          } else {
            selectInventoryItem(item, 0);
          }
        }
      });
    },
  });

  React.useEffect(() => {
    updateCurrentSelectedItems(selectedItems);
  }, [selectedItems, updateCurrentSelectedItems]);

  // --- UI ---

  return (
    <div className="space-y-8">
      {/* Section: Current Items */}
      <div>
        <h2 className="text-xl font-bold mb-2">Items in this Booking</h2>
        {selectedItems.size === 0 ? (
          <div className="text-gray-500 italic">No items selected.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from(selectedItems.values()).map(({ item, quantity }) => (
              <Card key={item.id} className="relative">
                <div className="flex items-center gap-4 p-4">
                  {item.primaryImage && (
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      Quantity: <span className="font-bold">{quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} per day
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item, -1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item, 1)}
                      disabled={quantity >= (item.quantity ?? quantity)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => selectInventoryItem(item, 0)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => setShowAvailability((v) => !v)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {showAvailability ? "Hide Available Items" : "Add Item"}
          </Button>
        </div>
      </div>

      {/* Section: Event Details */}
      <div>
        <h2 className="text-xl font-bold mb-2">Event Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setNewBooking("eventDate", e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startTime">Delivery/Setup Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setNewBooking("startTime", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pickupTime">Pickup Time</Label>
            <Input
              id="pickupTime"
              type="time"
              value={endTime}
              onChange={(e) => setNewBooking("endTime", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type</Label>
            <Select
              value={newBooking.eventType || undefined}
              onValueChange={(value) => setNewBooking("eventType", value)}
            >
              <SelectTrigger id="eventType">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BIRTHDAY">Birthday Party</SelectItem>
                <SelectItem value="CORPORATE">Corporate Event</SelectItem>
                <SelectItem value="SCHOOL">School Event</SelectItem>
                <SelectItem value="FESTIVAL">Festival</SelectItem>
                <SelectItem value="FAMILY">Family Gathering</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Section: Add Item (Availability) */}
      {showAvailability && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold">Add More Items</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => searchAvailability(false)}
              disabled={
                isSearchingAvailability ||
                !eventDate ||
                !startTime ||
                !endTime
              }
            >
              {isSearchingAvailability ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Availability
                </>
              )}
            </Button>
          </div>
          {hasSearched && (
            <div>
              {availableInventory.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableInventory
                    .slice(
                      (currentPage - 1) * ITEMS_PER_PAGE,
                      currentPage * ITEMS_PER_PAGE
                    )
                    .map((item) => {
                      const isSelected = selectedItems.has(item.id);
                      const quantity = selectedItems.get(item.id)?.quantity || 0;
                      const isRecentlyUnavailable = recentlyUnavailableItemIds.has(item.id);

                      return (
                        <Card
                          key={item.id}
                          className={`relative transition-all duration-300 ${
                            isRecentlyUnavailable ? "animate-pulse bg-red-50" : ""
                          }`}
                        >
                          <div className="relative">
                            {item.primaryImage ? (
                              <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                  src={item.primaryImage}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              </div>
                            ) : (
                              <div className="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/10" />
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h4 className="text-2xl font-bold tracking-tight mb-1">{item.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                                <span className="text-sm text-white/80">per day</span>
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Capacity:</span>{" "}
                                <span className="font-medium">{item.capacity} people</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Age:</span>{" "}
                                <span className="font-medium">{item.ageRange}</span>
                              </div>
                              {item.dimensions && (
                                <div>
                                  <span className="text-muted-foreground">Dimensions:</span>{" "}
                                  <span className="font-medium">{item.dimensions}</span>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">In Stock:</span>{" "}
                                <span className="font-medium">{item.quantity}</span>
                              </div>
                            </div>
                            {item.description && (
                              <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </div>
                            )}
                          </CardContent>

                          <CardFooter className="p-4 pt-0">
                            {isSelected && selectedItems.size > 0 ? (
                              <div className="flex w-full items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item, -1)}
                                  className="h-10 w-10"
                                  disabled={quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <div className="w-12 text-center font-medium">
                                  {quantity}
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item, 1)}
                                  className="h-10 w-10"
                                  disabled={
                                    quantity >=
                                    (availableInventory.find((i) => i.id === item.id)?.quantity ??
                                      quantity)
                                  }
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => selectInventoryItem(item, 0)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Button
                                className="w-full"
                                onClick={() => selectInventoryItem(item, 1)}
                                disabled={item.quantity < 1 || isSearchingAvailability}
                                variant="outline"
                              >
                                {item.quantity > 0 ? "Add to Booking" : "Out of Stock"}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground mt-4">
                  Check back later or try a different date/time.
                </div>
              )}

              {availableInventory.length > ITEMS_PER_PAGE && (
                <PaginationControls
                  total={availableInventory.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Save/Continue */}
      <div className="flex justify-end mt-8">
        <Button onClick={onContinue} className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
