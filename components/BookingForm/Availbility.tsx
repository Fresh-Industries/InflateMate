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
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PaginationControls } from "./PagnationControls";
import { NewBookingState, ReservationPayload, SelectedItem, InventoryItem } from '@/types/booking';
import { useAvailability } from '@/hooks/useAvailability';
import { useBookingSubmission } from '@/hooks/useBookingSubmission';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toZonedTime } from "date-fns-tz";
import { localToUTC } from "@/lib/utils";

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

// Interface for existing bookings
interface ExistingBooking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
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

  // New state for existing bookings and blocked times
  const [blockedTimes, setBlockedTimes] = React.useState<{ start: string; end: string }[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = React.useState(false);

  // Get business details for notice window validation
  const { businessData, isLoadingBusiness } = useBusinessDetails(businessId);

  React.useEffect(() => {
    setFilters({
      date: newBooking.eventDate,
      startTime: newBooking.startTime,
      endTime: newBooking.endTime,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [newBooking.eventDate, newBooking.startTime, newBooking.endTime]);

  // Fetch existing bookings when date changes
  React.useEffect(() => {
    if (!newBooking.eventDate || !businessData) return;
    
    const fetchExistingBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const response = await fetch(`/api/businesses/${businessId}/bookings/for-date?date=${newBooking.eventDate}`);
        if (response.ok) {
          const bookings = await response.json();
          
          // Calculate blocked time ranges based on existing bookings + buffer
          const blocked: { start: string; end: string }[] = [];
          
          bookings.forEach((booking: ExistingBooking) => {
            if (booking.status === 'CONFIRMED' || booking.status === 'PENDING' || booking.status === 'HOLD') {
              // Convert UTC timestamps to business timezone for proper time extraction
              const businessTz = businessData.timeZone || 'America/Chicago';
              
              // Use date-fns-tz to convert UTC to business timezone
              const bookingStartLocal = toZonedTime(new Date(booking.startTime), businessTz);
              const bookingEndLocal = toZonedTime(new Date(booking.endTime), businessTz);
              
              // Apply buffer times to create exclusion zones
              const bufferBeforeMs = (businessData.bufferBeforeHours ?? 0) * 60 * 60 * 1000;
              const bufferAfterMs = (businessData.bufferAfterHours ?? 0) * 60 * 60 * 1000;
              
              // Always block the actual delivery and pickup times (even with 0 buffer)
              const deliveryTime = `${bookingStartLocal.getHours().toString().padStart(2, '0')}:${bookingStartLocal.getMinutes().toString().padStart(2, '0')}`;
              const pickupTime = `${bookingEndLocal.getHours().toString().padStart(2, '0')}:${bookingEndLocal.getMinutes().toString().padStart(2, '0')}`;
              
              // Block delivery time
              blocked.push({
                start: deliveryTime,
                end: deliveryTime
              });
              
              // Block pickup time (if different from delivery)
              if (pickupTime !== deliveryTime) {
                blocked.push({
                  start: pickupTime,
                  end: pickupTime
                });
              }
              
              // Apply buffer periods around delivery/pickup if buffers > 0
              // Buffer should prevent new bookings from overlapping with existing ones
              if (bufferBeforeMs > 0) {
                const deliveryBufferStart = new Date(bookingStartLocal.getTime() - bufferBeforeMs);
                const deliveryBufferEnd = new Date(bookingStartLocal.getTime() + bufferBeforeMs);
                
                const bufferStartHours = deliveryBufferStart.getHours().toString().padStart(2, '0');
                const bufferStartMinutes = deliveryBufferStart.getMinutes().toString().padStart(2, '0');
                const bufferEndHours = deliveryBufferEnd.getHours().toString().padStart(2, '0');
                const bufferEndMinutes = deliveryBufferEnd.getMinutes().toString().padStart(2, '0');
                
                blocked.push({
                  start: `${bufferStartHours}:${bufferStartMinutes}`,
                  end: `${bufferEndHours}:${bufferEndMinutes}`
                });
              }
              
              if (bufferAfterMs > 0) {
                const pickupBufferStart = new Date(bookingEndLocal.getTime() - bufferAfterMs);
                const pickupBufferEnd = new Date(bookingEndLocal.getTime() + bufferAfterMs);
                
                const bufferStartHours = pickupBufferStart.getHours().toString().padStart(2, '0');
                const bufferStartMinutes = pickupBufferStart.getMinutes().toString().padStart(2, '0');
                const bufferEndHours = pickupBufferEnd.getHours().toString().padStart(2, '0');
                const bufferEndMinutes = pickupBufferEnd.getMinutes().toString().padStart(2, '0');
                
                blocked.push({
                  start: `${bufferStartHours}:${bufferStartMinutes}`,
                  end: `${bufferEndHours}:${bufferEndMinutes}`
                });
              }
            }
          });
          
          setBlockedTimes(blocked);
          
          // Debug: Log the blocked ranges
          console.log('Blocked time ranges:', blocked);
          console.log('Business buffer settings:', {
            bufferBeforeHours: businessData.bufferBeforeHours ?? 0,
            bufferAfterHours: businessData.bufferAfterHours ?? 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch existing bookings:', error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchExistingBookings();
  }, [newBooking.eventDate, businessId, businessData]);

  // Calculate notice window validation
  const getNoticeWindowStatus = React.useMemo(() => {
    if (!newBooking.eventDate || !newBooking.startTime || !businessData) {
      return { isValid: true, message: '' };
    }

    try {
      const now = new Date();
      const businessTz = businessData.timeZone || 'America/Chicago';
      
      // Convert the requested start time to UTC using the business timezone
      const requestedStartUTC = localToUTC(newBooking.eventDate, newBooking.startTime, businessTz);
      const hoursDiff = (requestedStartUTC.getTime() - now.getTime()) / (1000 * 60 * 60);

      const minNoticeHours = businessData.minNoticeHours || 24;
      const maxNoticeHours = businessData.maxNoticeHours || 2160; // 90 days

      if (hoursDiff < minNoticeHours) {
        return {
          isValid: false,
          message: `Must be booked at least ${minNoticeHours} hours in advance (${Math.ceil(minNoticeHours / 24)} days)`
        };
      }

      if (hoursDiff > maxNoticeHours) {
        const maxDays = Math.floor(maxNoticeHours / 24);
        return {
          isValid: false,
          message: `Cannot be booked more than ${maxDays} days in advance`
        };
      }

      return { isValid: true, message: '' };
    } catch (error) {
      console.error('Error calculating notice window:', error);
      return { isValid: true, message: '' };
    }
  }, [newBooking.eventDate, newBooking.startTime, businessData]);

  // Check if a time conflicts with existing bookings
  const isTimeConflicted = React.useCallback((time: string) => {
    const conflicts = blockedTimes.filter(blocked => {
      // Convert time strings to minutes since midnight for easier comparison
      const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const timeMinutes = timeToMinutes(time);
      const blockedStartMinutes = timeToMinutes(blocked.start);
      const blockedEndMinutes = timeToMinutes(blocked.end);
      
      // Simply check if the time falls within the blocked range
      // For both start and end times, they cannot be scheduled during blocked periods
      const isConflicted = timeMinutes >= blockedStartMinutes && timeMinutes <= blockedEndMinutes;
      
      if (isConflicted) {
        console.log(`Time ${time} conflicts with blocked range ${blocked.start} - ${blocked.end}`);
      }
      
      return isConflicted;
    });
    
    return conflicts.length > 0;
  }, [blockedTimes]);

  // Generate time options with conflict checking
  const generateTimeOptions = React.useCallback((isEndTime = false) => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Convert to 12-hour format for display
        let displayHour = hour;
        let ampm = 'AM';
        
        if (hour === 0) {
          displayHour = 12;
        } else if (hour === 12) {
          ampm = 'PM';
        } else if (hour > 12) {
          displayHour = hour - 12;
          ampm = 'PM';
        }
        
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        
        const isConflicted = isTimeConflicted(time24);
        
        // For end time, also ensure it's after start time
        let isDisabled = isConflicted;
        if (isEndTime && newBooking.startTime) {
          isDisabled = isDisabled || time24 <= newBooking.startTime;
        }
        
        options.push({
          value: time24, // Keep 24-hour format for internal use
          label: displayTime, // Show 12-hour format to user
          disabled: isDisabled,
          conflicted: isConflicted
        });
      }
    }
    return options;
  }, [isTimeConflicted, newBooking.startTime]);

  const {
    availableInventory,
    totalAvailableItems,
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

  const startTimeOptions = generateTimeOptions(false);
  const endTimeOptions = generateTimeOptions(true);

  return (
    <div className="space-y-6">

      {/* Notice Window Warning */}
      {!getNoticeWindowStatus.isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {getNoticeWindowStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Buffer Time Info */}
      {businessData && ((businessData.bufferBeforeHours ?? 0) > 0 || (businessData.bufferAfterHours ?? 0) > 0) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Buffer times apply: {businessData.bufferBeforeHours ?? 0}h before and {businessData.bufferAfterHours ?? 0}h after each booking.
            Some time slots may be blocked due to existing bookings.
          </AlertDescription>
        </Alert>
      )}

      {/* Event Details Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Date Input */}
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event Date</Label>
          <Input
            id="eventDate"
            type="date"
            value={newBooking.eventDate}
            onChange={(e) =>
              setNewBooking(prevBooking => ({ ...prevBooking, eventDate: e.target.value }))
            }
            min={format(new Date(), "yyyy-MM-dd")}
            required
          />
          <p className="text-xs text-muted-foreground">Select the date of your event</p>
        </div>

        {/* Delivery/Setup Time Input */}
        <div className="space-y-2">
          <Label htmlFor="startTime">Delivery/Setup Time</Label>
          <Select
            value={newBooking.startTime}
            onValueChange={(value) =>
              setNewBooking(prevBooking => ({ ...prevBooking, startTime: value }))
            }
          >
            <SelectTrigger id="startTime">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {startTimeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={option.conflicted ? "text-red-500 line-through" : ""}
                >
                  {option.label} {option.conflicted ? "(Blocked)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Standard delivery time: 9:00 AM {isLoadingBookings && "(Loading conflicts...)"}
          </p>
        </div>

        {/* Pickup Time Input */}
        <div className="space-y-2">
          <Label htmlFor="pickupTime">Pickup Time</Label>
          <Select
            value={newBooking.endTime}
            onValueChange={(value) =>
              setNewBooking(prevBooking => ({ ...prevBooking, endTime: value }))
            }
          >
            <SelectTrigger id="pickupTime">
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {endTimeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={option.conflicted ? "text-red-500 line-through" : ""}
                >
                  {option.label} {option.conflicted ? "(Blocked)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Standard pickup time: 5:00 PM next day</p>
        </div>

        {/* Event Type Select */}
        <div className="space-y-2">
          <Label htmlFor="eventType">Event Type</Label>
          <Select
            value={newBooking.eventType || undefined}
            onValueChange={(value) =>
              setNewBooking(prevBooking => ({ ...prevBooking, eventType: value }))
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
          onClick={() => searchAvailability(false)}
          disabled={
            isSearchingAvailability ||
            isLoadingBusiness ||
            !newBooking.eventDate || 
            !newBooking.startTime || 
            !newBooking.endTime ||
            !getNoticeWindowStatus.isValid
          }
          className="w-full max-w-md"
          variant="outline"
        >
          {isSearchingAvailability ? (
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
            {totalAvailableItems > 0
              ? `Available Items (${totalAvailableItems} found)`
              : "No items available for your selected time"}
          </h3>

          {totalAvailableItems > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableInventory
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
             <div className="text-center text-muted-foreground mt-4">
                Check back later or try a different date/time.
             </div>
           )}

          {totalAvailableItems > ITEMS_PER_PAGE && (
            <PaginationControls
              total={totalAvailableItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
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
                const success = await handleReserveItems(reservationPayload);
                if (success) {
                  onContinue();
                }
                // If not successful, handleReserveItems will show error message
                // and we don't proceed to next step
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
