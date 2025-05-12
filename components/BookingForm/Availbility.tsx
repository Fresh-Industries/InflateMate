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
import {
  Loader2,
  Search,
  Minus,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaginationControls } from "./PagnationControls";
import { NewBookingState, ReservationPayload, SelectedItem, InventoryItem } from '@/types/booking';
import { useAvailability } from '@/hooks/useAvailability';
import { useBookingSubmission } from '@/hooks/useBookingSubmission';

// Assuming these types are defined in a shared file or will be moved there

const ITEMS_PER_PAGE = 4; // Keep this constant here or import from shared location

interface EventDetailsStepProps {
  businessId: string;
  newBooking: {
    eventDate: string;
    startTime: string;
    endTime: string;
    eventType: string;
  };
  setNewBooking: React.Dispatch<React.SetStateAction<NewBookingState>>;
  onContinue: () => void;
  selectedItems: Map<string, SelectedItem>;
  selectInventoryItem: (item: InventoryItem, quantity?: number) => void;
  updateQuantity: (item: InventoryItem, delta: number) => void;
  setHoldId: (holdId: string | null, expiresAt: string | null) => void;
  holdId: string | null;
}

export function EventDetailsStep({
  businessId,
  newBooking,
  setNewBooking,
  onContinue,
  selectedItems,
  selectInventoryItem,
  updateQuantity,
  setHoldId,
  holdId,
}: EventDetailsStepProps) {
  // Use hooks for state and logic
  const [filters, setFilters] = React.useState({
    date: newBooking.eventDate,
    startTime: newBooking.startTime,
    endTime: newBooking.endTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  React.useEffect(() => {
    setFilters({
      date: newBooking.eventDate,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [newBooking.eventDate, newBooking.startTime, newBooking.endTime]);

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
    filters,
    onUnavailableItemsFound: (unavailableItems) => {
      // Update selected items when they become unavailable
      unavailableItems.forEach(({ item }) => {
        const currentQuantity = selectedItems.get(item.id)?.quantity || 0;
        if (currentQuantity > 0) {
          // If the item is still available but with reduced quantity, update it
          const availableItem = availableInventory.find(i => i.id === item.id);
          if (availableItem && availableItem.quantity > 0) {
            updateQuantity(item, availableItem.quantity - currentQuantity);
          } else {
            // If the item is completely unavailable, remove it
            selectInventoryItem(item, 0);
          }
        }
      });
    },
  });

  // Keep the hook's internal selected items state in sync with parent
  React.useEffect(() => {
    updateCurrentSelectedItems(selectedItems);
  }, [selectedItems, updateCurrentSelectedItems]);

  const { handleReserveItems } = useBookingSubmission({
    businessId,
    onReservationSuccess: (holdId, expiresAt) => {
      setHoldId(holdId, expiresAt);
    },
    onSubmissionError: () => {
      // Optionally show a toast here
    },
  });

  // --- No validation logic here; parent handles validation before proceeding ---

  return (
    <div className="space-y-6">
      {/* Info Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 mb-4">
        <p className="font-medium">24-Hour Rental Period</p>
        <p className="text-sm">
          All bookings are for a full day (24-hour rental). This gives our team time to deliver,
          set up, and clean the equipment.
        </p>
      </div>

      {/* Event Details Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Date Input */}
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input
            id="eventDate"
            type="date"
            value={newBooking.eventDate} // Use prop
            onChange={(e) =>
              setNewBooking(prevBooking => ({ ...prevBooking, eventDate: e.target.value })) // Use functional update
            }
            min={format(new Date(), "yyyy-MM-dd")}
            required
          />
          <p className="text-xs text-muted-foreground">Select the date of your event</p>
        </div>

        {/* Delivery/Setup Time Input */}
        <div className="space-y-2">
          <Label htmlFor="startTime">Delivery/Setup Time</Label>
          <Input
            id="startTime"
            type="time"
            value={newBooking.startTime} // Use prop
            onChange={(e) =>
              setNewBooking(prevBooking => ({ ...prevBooking, startTime: e.target.value })) // Use functional update
            }
            required
          />
          <p className="text-xs text-muted-foreground">Standard delivery time: 9:00 AM</p>
        </div>

        {/* Pickup Time Input */}
        <div className="space-y-2">
          <Label htmlFor="pickupTime">Pickup Time</Label>
          <Input
            id="pickupTime"
            type="time"
            value={newBooking.endTime} // Use prop
            onChange={(e) =>
              setNewBooking(prevBooking => ({ ...prevBooking, endTime: e.target.value })) // Use functional update
            }
            required
          />
          <p className="text-xs text-muted-foreground">Standard pickup time: 5:00 PM next day</p>
        </div>

        {/* Event Type Select */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={newBooking.eventType || undefined} // Use prop
            onValueChange={(value) =>
              setNewBooking(prevBooking => ({ ...prevBooking, eventType: value })) // Use functional update
            }
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

      {/* Check Availability Button */}
      <div className="flex justify-center my-6">
        <Button
          onClick={() => searchAvailability(false)} // Calls local function
          disabled={
            isSearchingAvailability || // Local state
            !newBooking.eventDate || !newBooking.startTime || !newBooking.endTime // Check all required fields
          }
          className="w-full max-w-md"
          variant="outline"
        >
          {isSearchingAvailability ? ( // Local state
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Check Availability
            </>
          )}
        </Button>
      </div>

      {/* Available Inventory Display */}
      {hasSearched && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Search className="h-5 w-5" />
            {availableInventory.length > 0 // Local state
              ? `Available Items (${availableInventory.length} found)` // Added count for clarity
              : "No items available for your selected time"}
          </h3>

          {availableInventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableInventory // Local state
                .slice(
                  (currentPage - 1) * ITEMS_PER_PAGE,
                  currentPage * ITEMS_PER_PAGE,
                )
                .map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const quantity = selectedItems.get(item.id)?.quantity || 0;
                  const isRecentlyUnavailable = recentlyUnavailableItemIds.has(item.id);

                  return (
                    <Card
                      key={item.id}
                      className={`relative transition-all duration-300 ${
                        isRecentlyUnavailable ? 'animate-pulse bg-red-50' : ''
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
                           {/* Add description/dimensions if relevant */}
                           {item.dimensions && (
                             <div>
                                <span className="text-muted-foreground">Dimensions:</span>{" "}
                                <span className="font-medium">{item.dimensions}</span>
                             </div>
                           )}
                            {/* Show current stock if helpful */}
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
                              disabled={quantity >= (availableInventory.find(i => i.id === item.id)?.quantity ?? quantity)}
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
             // Optional: Message if search found items but none are currently available
             <div className="text-center text-muted-foreground mt-4">
                Check back later or try a different date/time.
             </div>
           )}


          {availableInventory.length > ITEMS_PER_PAGE && (
            <PaginationControls
              total={availableInventory.length} // Local state
              currentPage={currentPage} // Local state
              setCurrentPage={setCurrentPage} // Local setter
            />
          )}

          <div className="flex justify-center my-4">
            <Button
              onClick={async () => {
                const selectedItemsArray = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  quantity,
                  stripeProductId: item.stripeProductId,
                }));
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const reservationPayload: ReservationPayload = {
                  eventDate: newBooking.eventDate,
                  startTime: newBooking.startTime,
                  endTime: newBooking.endTime,
                  eventTimeZone: tz,
                  selectedItems: selectedItemsArray,
                };
                await handleReserveItems(reservationPayload);
                onContinue();
              }}
              disabled={selectedItems.size === 0 || !newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || !!holdId}
              variant="primary-gradient"
              className="w-full max-w-md"
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
