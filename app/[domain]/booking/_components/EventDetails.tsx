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
import { Loader2, Search, Minus, Plus, Calendar, Clock, Tag, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaginationControls } from "./PagnationControls";
import {
  NewBookingState,
  ReservationPayload,
  SelectedItem,
  InventoryItem,
} from "@/types/booking";
import { useAvailability } from "@/hooks/useAvailability";
import { useBookingSubmission } from "@/hooks/useBookingSubmission";
import { useBusinessDetails } from "@/hooks/useBusinessDetails";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { ThemeColors } from "@/app/[domain]/_themes/types";
import clsx from "clsx";

/*
 * =====================================================================
 *                            CONFIG & TYPES
 * =====================================================================
 */
const ITEMS_PER_PAGE = 4;

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
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
}

// Interface for existing bookings
interface ExistingBooking {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

/*
 * =====================================================================
 *                               COMPONENT
 * =====================================================================
 */
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
  themeName = "modern",
  colors,
}: EventDetailsStepProps) {
  const theme = themeConfig[themeName] ?? themeConfig.modern;

  // minimal, neutral fall‑back if a palette or style slice is missing
  const fallbackColors: ThemeColors = {
    primary: { 100: "#a5b4fc", 500: "#4f46e5", 900: "#312e81" },
    secondary: { 100: "#99f6e4", 500: "#06b6d4", 900: "#134e4a" },
    accent: { 100: "#fdba74", 500: "#f97316", 900: "#7c2d12" },
    background: { 100: "#ffffff", 500: "#f3f4f6", 900: "#111827" },
    text: { 100: "#ffffff", 500: "#6b7280", 900: "#111827" },
  };
  const c = colors ?? fallbackColors; // shorthand used below

  /* ----------------------------------------------------------------- */
  /*                          THEME STYLING                            */
  /* ----------------------------------------------------------------- */
  
  // Card styles
  const cardStyle = {
    background: theme.cardStyles.background(c),
    border: theme.cardStyles.border(c),
    boxShadow: theme.cardStyles.boxShadow(c),
    color: theme.cardStyles.textColor(c),
    borderRadius: theme.cardStyles.borderRadius ?? "12px",
  };
  
  // Button styles
  const primaryButton = {
    backgroundColor: theme.buttonStyles.background(c),
    color: theme.buttonStyles.textColor(c),
    border: theme.buttonStyles.border?.(c) ?? "none",
    boxShadow: theme.buttonStyles.boxShadow?.(c),
    borderRadius: theme.buttonStyles.borderRadius ?? "9999px",
    transition: theme.buttonStyles.transition ?? "all 0.2s ease",
    ...(theme.buttonStyles.customStyles?.(c) ?? {}),
  };
  
  const primaryButtonHover = {
    backgroundColor: theme.buttonStyles.hoverBackground(c),
    color: theme.buttonStyles.hoverTextColor?.(c) ?? c.text[100],
    border: theme.buttonStyles.hoverBorder?.(c) ?? primaryButton.border,
    boxShadow: theme.buttonStyles.hoverBoxShadow?.(c) ?? primaryButton.boxShadow,
  };
  
  // Section styles - use bookingStyles from theme
  const sectionStyle = {
    background: theme.bookingStyles.formBackground(c),
    color: theme.bookingStyles.formTextColor(c),
    borderRadius: cardStyle.borderRadius,
    boxShadow: theme.bookingStyles.formShadow(c),
    border: theme.bookingStyles.formBorder(c),
    animation: theme.animations?.elementEntrance || 'none',
  };
  
  // Input styles
  const inputStyle = {
    background: theme.bookingStyles.input.background(c),
    border: theme.bookingStyles.input.border(c),
    borderRadius: "6px",
  };
  
  const labelStyle = {
    color: theme.bookingStyles.input.labelColor(c)
  };
  
  // Standard neutral styles for consistency
  const headingStyle = {
    color: c.primary[900],
    fontWeight: 'bold',
  };
  
  const subtitleStyle = {
    color: c.text[500]
  };
  
  const formContainerStyle = {
    background: 'transparent',
    borderRadius: '12px',
  };
  
  const resultsContainerStyle = {
    background: 'transparent',
    borderRadius: '12px',
  };
  
  const resultsHeadingStyle = {
    color: c.primary[500],
    fontWeight: 'bold',
  };
  
  const priceTagStyle = {
    background: c.primary[500],
    color: '#ffffff',
    borderRadius: '9999px',
  };
  
  const productNameStyle = {
    fontWeight: 'bold',
  };
  
  const specsContainerStyle = {
    background: c.background[500] + '30',
    borderRadius: '6px',
  };
  
  const selectedFooterStyle = {
    borderTop: `1px solid ${c.primary[100]}`,
    paddingTop: '16px',
    marginTop: '8px',
  };
  
  const controlButtonStyle = {
    backgroundColor: 'transparent',
    color: c.text[900],
    border: `1px solid ${c.primary[100]}`,
    borderRadius: theme.buttonStyles.borderRadius ?? "9999px",
  };
  
  const removeButtonStyle = {
    backgroundColor: c.accent[500],
    color: '#ffffff',
    borderRadius: theme.buttonStyles.borderRadius ?? "9999px",
  };
  
  const imageContainerStyle = {
    borderBottom: 'none',
  };
  
  const continueSectionStyle = {
    borderTop: `1px solid ${c.primary[100]}`,
  };

  /* ----------------------------------------------------------------- */
  /*                             LOCAL STATE                           */
  /* ----------------------------------------------------------------- */
  const [filters, setFilters] = React.useState(() => ({
    date: newBooking.eventDate,
    startTime: newBooking.startTime,
    endTime: newBooking.endTime,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }));

  // New state for existing bookings and blocked times
  const [blockedTimes, setBlockedTimes] = React.useState<{ start: string; end: string }[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = React.useState(false);

  // Get business details for notice window validation and buffer settings
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
              const bookingStart = new Date(booking.startTime);
              const bookingEnd = new Date(booking.endTime);
              
              // Apply buffer times to create exclusion zones
              const bufferBeforeMs = (businessData.bufferBeforeHours ?? 0) * 60 * 60 * 1000;
              const bufferAfterMs = (businessData.bufferAfterHours ?? 0) * 60 * 60 * 1000;
              
              // Always block the actual delivery and pickup times (even with 0 buffer)
              const deliveryTime = `${bookingStart.getHours().toString().padStart(2, '0')}:${bookingStart.getMinutes().toString().padStart(2, '0')}`;
              const pickupTime = `${bookingEnd.getHours().toString().padStart(2, '0')}:${bookingEnd.getMinutes().toString().padStart(2, '0')}`;
              
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
              
              // Additionally apply buffer periods around delivery/pickup if buffers > 0
              if (bufferBeforeMs > 0) {
                const deliveryBufferStart = new Date(bookingStart.getTime() - bufferBeforeMs);
                const deliveryBufferEnd = new Date(bookingStart.getTime() + bufferBeforeMs);
                
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
                const pickupBufferStart = new Date(bookingEnd.getTime() - bufferAfterMs);
                const pickupBufferEnd = new Date(bookingEnd.getTime() + bufferAfterMs);
                
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

          console.log('businessData', businessData);
          
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
      const requestedStart = new Date(`${newBooking.eventDate}T${newBooking.startTime}:00`);
      const hoursDiff = (requestedStart.getTime() - now.getTime()) / (1000 * 60 * 60);

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
    onUnavailableItemsFound: (unavailable) => {
      unavailable.forEach(({ item }) => {
        const currentQty = selectedItems.get(item.id)?.quantity ?? 0;
        if (currentQty === 0) return;
        const stillAvailable = availableInventory.find((i) => i.id === item.id);
        if (stillAvailable) {
          updateQuantity(item, stillAvailable.quantity - currentQty);
        } else {
          selectInventoryItem(item, 0);
        }
      });
    },
  });

  React.useEffect(() => {
    updateCurrentSelectedItems(selectedItems);
  }, [selectedItems, updateCurrentSelectedItems]);

  const { handleReserveItems } = useBookingSubmission({
    businessId,
    onReservationSuccess: setHoldId,
  });

  const startTimeOptions = generateTimeOptions(false);
  const endTimeOptions = generateTimeOptions(true);

  return (
    <section
      className="space-y-8 relative p-6 sm:p-8 rounded-lg"
      style={sectionStyle}
    >
      {/* SECTION TITLE */}
      <div className="mb-6 relative">
        <h2 
          className="text-2xl mb-2"
          style={headingStyle}
        >
          Book Your Event
        </h2>
        <p 
          className="text-sm opacity-80"
          style={subtitleStyle}
        >
          Start by selecting your event details and checking equipment availability.
        </p>
      </div>

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
      
      {/* DATE / TIME / TYPE FORM */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-lg"
        style={formContainerStyle}
      >
        {/* DATE */}
        <div className="space-y-1.5 relative">
          <Label 
            htmlFor="eventDate"
            className="flex items-center gap-1.5"
            style={labelStyle}
          >
            <Calendar className="h-4 w-4" /> Event Date
          </Label>
          <Input
            id="eventDate"
            type="date"
            value={newBooking.eventDate}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) =>
              setNewBooking((prev) => ({ ...prev, eventDate: e.target.value }))
            }
            required
            style={inputStyle}
          />
        </div>
        
        {/* START TIME */}
        <div className="space-y-1.5">
          <Label 
            htmlFor="startTime" 
            className="flex items-center gap-1.5"
            style={labelStyle}
          >
            <Clock className="h-4 w-4" /> Delivery / Setup
          </Label>
          <Select
            value={newBooking.startTime}
            onValueChange={(value) =>
              setNewBooking((prev) => ({ ...prev, startTime: value }))
            }
          >
            <SelectTrigger 
              id="startTime"
              style={inputStyle}
            >
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
          <p className="text-xs opacity-60">
            Standard delivery time: 9:00 AM {isLoadingBookings && "(Loading conflicts...)"}
          </p>
        </div>
        
        {/* END TIME */}
        <div className="space-y-1.5">
          <Label 
            htmlFor="endTime" 
            className="flex items-center gap-1.5"
            style={labelStyle}
          >
            <Clock className="h-4 w-4" /> Pickup
          </Label>
          <Select
            value={newBooking.endTime}
            onValueChange={(value) =>
              setNewBooking((prev) => ({ ...prev, endTime: value }))
            }
          >
            <SelectTrigger 
              id="endTime"
              style={inputStyle}
            >
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
          <p className="text-xs opacity-60">Standard pickup time: 5:00 PM next day</p>
        </div>
        
        {/* TYPE */}
        <div className="space-y-1.5">
          <Label 
            htmlFor="eventType" 
            className="flex items-center gap-1.5"
            style={labelStyle}
          >
            <Tag className="h-4 w-4" /> Event Type
          </Label>
          <Select
            value={newBooking.eventType}
            onValueChange={(v) =>
              setNewBooking((p) => ({ ...p, eventType: v }))
            }
          >
            <SelectTrigger 
              id="eventType"
              style={inputStyle}
            >
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              {[
                "BIRTHDAY",
                "CORPORATE",
                "SCHOOL",
                "FESTIVAL",
                "FAMILY",
                "OTHER",
              ].map((v) => (
                <SelectItem key={v} value={v}>
                  {v.charAt(0) + v.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <div className="flex justify-center my-8">
        <Button
          className="py-3 px-6 text-base"
          style={primaryButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButton)}
          disabled={
            isSearchingAvailability ||
            isLoadingBusiness ||
            !newBooking.eventDate ||
            !newBooking.startTime ||
            !newBooking.endTime ||
            !getNoticeWindowStatus.isValid
          }
          onClick={() => searchAvailability(false)}
        >
          {isSearchingAvailability ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" /> Check Availability
            </>
          )}
        </Button>
      </div>

      {/* INVENTORY GRID */}
      {hasSearched && (
        <div 
          className="mt-8 p-6 rounded-lg"
          style={resultsContainerStyle}
        >
          <h3 
            className="text-xl flex items-center gap-2 mb-6"
            style={resultsHeadingStyle}
          >
            <Search className="h-5 w-5" />
            {totalAvailableItems > 0 ? (
              `Available Items (${totalAvailableItems})`
            ) : "No items available for that time"}
          </h3>

          {totalAvailableItems > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableInventory
                .map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const qty = selectedItems.get(item.id)?.quantity ?? 0;
                  const unavailable = recentlyUnavailableItemIds.has(item.id);
                  return (
                    <Card
                      key={item.id}
                      className={clsx(
                        "transition-all duration-300 relative overflow-hidden",
                        unavailable && "animate-pulse !bg-red-50",
                        isSelected && "ring-2 ring-offset-2 ring-primary",
                      )}
                      style={cardStyle}
                    >
                      {/* PRICE TAG */}
                      <div 
                        className="absolute top-3 right-3 z-10 px-3 py-1 text-sm font-bold"
                        style={priceTagStyle}
                      >
                        ${item.price.toFixed(2)}
                      </div>

                      {/* IMAGE */}
                      <div 
                        className="relative aspect-video w-full overflow-hidden"
                        style={imageContainerStyle}
                      >
                        {item.primaryImage ? (
                          <img
                            src={item.primaryImage}
                            alt={item.name}
                            className="object-cover w-full h-full transition-transform duration-500"
                            style={{
                              transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: c.primary[100] }}
                          >
                            <span className="text-sm opacity-70">No image available</span>
                          </div>
                        )}
                      </div>

                      {/* INFO */}
                      <CardContent className="p-4 space-y-3">
                        <header className="flex items-center justify-between">
                          <h4 
                            className="font-bold text-lg"
                            style={productNameStyle}
                          >
                            {item.name}
                          </h4>
                        </header>
                        <p className="text-sm opacity-80 line-clamp-2">
                          {item.description ?? "No description provided."}
                        </p>
                        <div 
                          className="text-xs grid grid-cols-2 gap-2 p-2 mt-2"
                          style={specsContainerStyle}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: c.primary[500] }}></span>
                            Capacity: {item.capacity}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ background: c.accent[500] }}></span>
                            Age: {item.ageRange}
                          </span>
                        </div>
                      </CardContent>

                      {/* FOOTER – ADD / QUANTITY CONTROLS */}
                      <CardFooter 
                        className="p-4 pt-0"
                        style={isSelected ? selectedFooterStyle : undefined}
                      >
                        {isSelected ? (
                          <div className="flex items-center gap-2 w-full">
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={qty <= 1}
                              onClick={() => updateQuantity(item, -1)}
                              style={controlButtonStyle}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{qty}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={qty >= item.quantity}
                              onClick={() => updateQuantity(item, 1)}
                              style={controlButtonStyle}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              className="flex-1"
                              onClick={() => selectInventoryItem(item, 0)}
                              style={removeButtonStyle}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full"
                            variant="outline"
                            disabled={item.quantity < 1 || isSearchingAvailability}
                            onClick={() => selectInventoryItem(item, 1)}
                            style={primaryButton}
                          >
                            {item.quantity ? "Add to booking" : "Out of stock"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
            </div>
          )}

          {totalAvailableItems > ITEMS_PER_PAGE && (
            <PaginationControls
              total={totalAvailableItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}

          {/* CONTINUE BUTTON */}
          {totalAvailableItems > 0 && selectedItems.size > 0 && (
            <div 
              className="flex justify-center mt-8 pt-6"
              style={continueSectionStyle}
            >
              <Button
                className="w-full max-w-md py-3 px-6 text-base"
                disabled={
                  selectedItems.size === 0 ||
                  !newBooking.eventDate ||
                  !newBooking.startTime ||
                  !newBooking.endTime ||
                  !!holdId
                }
                style={primaryButton}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButton)}
                onClick={async () => {
                  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
                  const payload: ReservationPayload = {
                    eventDate: newBooking.eventDate,
                    startTime: newBooking.startTime,
                    endTime: newBooking.endTime,
                    eventTimeZone: tz,
                    selectedItems: Array.from(selectedItems.values()).map(
                      ({ item, quantity }) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity,
                        stripeProductId: item.stripeProductId,
                      }),
                    ),
                  };
                  const success = await handleReserveItems(payload);
                  if (success) {
                    onContinue();
                  }
                  // If not successful, handleReserveItems will show error message
                  // and we don't proceed to next step
                }}
              >
                Continue to Next Step
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
