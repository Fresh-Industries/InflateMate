'use client';

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRealtimeBookings, RealtimeBooking, RealtimeWaiver } from "@/hooks/useRealtimeBookings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startOfDay } from "date-fns";
import { toast } from "sonner";
import { BookingsViewControls } from "./bookings-view-controls";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Eye, MapPin, Phone, Mail, Users, Calendar as CalendarIcon, Info, X, Pencil as PencilIcon, CheckCircle, ShieldCheck, Package, Cloud, Clock, List, CalendarDays } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { dateOnlyUTC, utcToLocal } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BookingsCalendarView } from './bookings-calendar-view';
// import RealtimeDebugger from '../../../_components/RealtimeDebugger';

interface BookingItem {
  id: string;
  quantity: number;
  price: number;
  inventoryId: string;
  bookingId: string;
}

interface Waiver {
  id: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
  docuSealDocumentId?: string;
  bookingId: string;
}



interface Booking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'HOLD';
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  depositAmount?: number;
  depositPaid?: boolean;
  eventType: string;
  participantCount: number;
  participantAge?: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  inventoryItems: BookingItem[];
  waivers: Waiver[];
  hasSignedWaiver: boolean;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  eventTimeZone: string;
  specialInstructions?: string;
  refundAmount?: number;
  refundReason?: string;
  isCompleted?: boolean;
}

interface BounceHouse {
  id: string;
  name: string;
}

interface BookingsListProps {
  businessId: string;
  initialData: {
    bookings: Booking[];
    bounceHouses: BounceHouse[];
  };
}

export default function BookingsList({ businessId, initialData }: BookingsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // In development, try to persist bookings across Fast Refresh
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(`bookings-${businessId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // Only use cached if it's recent (less than 5 minutes old)
          if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
            return parsed.bookings;
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }
    return initialData.bookings;
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const [fullRefund, setFullRefund] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("eventDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [eventType, setEventType] = useState<string>("");
  const [showPastBookings, setShowPastBookings] = useState(false);

  // Handle realtime waiver events
  const handleWaiverRealtimeEvent = useCallback((
    eventType: 'INSERT' | 'UPDATE' | 'DELETE',
    waiver: RealtimeWaiver
  ) => {
    console.log(`[Realtime] Waiver ${eventType} event for booking ${waiver.bookingId}:`, waiver);
    
    setBookings(prev =>
      prev.map(b => {
        if (b.id !== waiver.bookingId) return b;
        const existingWaivers = b.waivers ?? [];
        
        if (eventType === 'INSERT') {
          const newWaiver = {
            id: waiver.id,
            status: waiver.status,
            docuSealDocumentId: undefined,
            bookingId: waiver.bookingId,
          };
          return {
            ...b,
            waivers: [...existingWaivers, newWaiver],
            hasSignedWaiver: waiver.status === 'SIGNED' ? true : b.hasSignedWaiver,
          };
        }
        
        if (eventType === 'UPDATE') {
          const updatedWaivers = existingWaivers.map(w =>
            w.id === waiver.id
              ? { ...w, status: waiver.status as 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED' }
              : w
          );
          return {
            ...b,
            waivers: updatedWaivers,
            hasSignedWaiver: waiver.status === 'SIGNED' ? true : b.hasSignedWaiver,
          };
        }
        
        if (eventType === 'DELETE') {
          const filteredWaivers = existingWaivers.filter(w => w.id !== waiver.id);
          const stillSigned = filteredWaivers.some(w => w.status === 'SIGNED');
          return { ...b, waivers: filteredWaivers, hasSignedWaiver: stillSigned };
        }
        
        return b;
      })
    );
  }, []);

  // Handle realtime booking events
  const handleBookingRealtimeEvent = useCallback((
    eventType: 'INSERT' | 'UPDATE' | 'DELETE',
    booking: RealtimeBooking
  ) => {
    console.log(`[BookingList] Realtime ${eventType} event:`, { id: booking?.id, status: booking?.status, customerId: booking?.customerId });
    
    if (eventType === 'UPDATE' && booking) {
      fetch(`/api/businesses/${businessId}/bookings/${booking.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(fullBookingResponse => {
          const transformedBooking: Booking = {
            id: fullBookingResponse.booking.id,
            eventDate: fullBookingResponse.booking.eventDate,
            startTime: fullBookingResponse.booking.startTime,
            endTime: fullBookingResponse.booking.endTime,
            status: fullBookingResponse.booking.status,
            totalAmount: fullBookingResponse.booking.totalAmount,
            subtotalAmount: fullBookingResponse.booking.subtotalAmount,
            taxAmount: fullBookingResponse.booking.taxAmount,
            taxRate: fullBookingResponse.booking.taxRate,
            depositAmount: fullBookingResponse.booking.depositAmount,
            depositPaid: fullBookingResponse.booking.depositPaid,
            eventType: fullBookingResponse.booking.eventType,
            participantCount: fullBookingResponse.booking.participantCount,
            participantAge: fullBookingResponse.booking.participantAge,
            eventAddress: fullBookingResponse.booking.eventAddress,
            eventCity: fullBookingResponse.booking.eventCity,
            eventState: fullBookingResponse.booking.eventState,
            eventZipCode: fullBookingResponse.booking.eventZipCode,
            eventTimeZone: fullBookingResponse.booking.eventTimeZone,
            specialInstructions: fullBookingResponse.booking.specialInstructions,
            refundAmount: fullBookingResponse.booking.refundAmount,
            refundReason: fullBookingResponse.booking.refundReason,
            isCompleted: fullBookingResponse.booking.isCompleted,
            customer: fullBookingResponse.customer || { id: booking.customerId || '', name: '', email: '', phone: '' },
            inventoryItems: fullBookingResponse.inventoryItems || [],
            waivers: fullBookingResponse.waivers || [],
            hasSignedWaiver: fullBookingResponse.hasSignedWaiver || false,
          };
          
          setBookings(prev => 
            prev.map(b => (b.id === transformedBooking.id ? transformedBooking : b))
          );
        })
        .catch(err => {
          console.error(`Failed to fetch fresh booking data for ${booking.id}:`, err);
        });
      return;
    }
    
    if (eventType === 'INSERT' && booking?.id) {
      fetch(`/api/businesses/${businessId}/bookings/${booking.id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then(fullBookingResponse => {
          const transformedBooking: Booking = {
            id: fullBookingResponse.booking.id,
            eventDate: fullBookingResponse.booking.eventDate,
            startTime: fullBookingResponse.booking.startTime,
            endTime: fullBookingResponse.booking.endTime,
            status: fullBookingResponse.booking.status,
            totalAmount: fullBookingResponse.booking.totalAmount,
            subtotalAmount: fullBookingResponse.booking.subtotalAmount,
            taxAmount: fullBookingResponse.booking.taxAmount,
            taxRate: fullBookingResponse.booking.taxRate,
            depositAmount: fullBookingResponse.booking.depositAmount,
            depositPaid: fullBookingResponse.booking.depositPaid,
            eventType: fullBookingResponse.booking.eventType,
            participantCount: fullBookingResponse.booking.participantCount,
            participantAge: fullBookingResponse.booking.participantAge,
            eventAddress: fullBookingResponse.booking.eventAddress,
            eventCity: fullBookingResponse.booking.eventCity,
            eventState: fullBookingResponse.booking.eventState,
            eventZipCode: fullBookingResponse.booking.eventZipCode,
            eventTimeZone: fullBookingResponse.booking.eventTimeZone,
            specialInstructions: fullBookingResponse.booking.specialInstructions,
            refundAmount: fullBookingResponse.booking.refundAmount,
            refundReason: fullBookingResponse.booking.refundReason,
            isCompleted: fullBookingResponse.booking.isCompleted,
            customer: fullBookingResponse.customer || { id: booking.customerId || '', name: '', email: '', phone: '' },
            inventoryItems: fullBookingResponse.inventoryItems || [],
            waivers: fullBookingResponse.waivers || [],
            hasSignedWaiver: fullBookingResponse.hasSignedWaiver || false,
          };
          
          setBookings(prev => {
            if (prev.find(b => b.id === transformedBooking.id)) {
              return prev;
            }
            const newBookings = [transformedBooking, ...prev];
            
            // Cache in development to survive Fast Refresh
            if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
              sessionStorage.setItem(`bookings-${businessId}`, JSON.stringify({
                bookings: newBookings,
                timestamp: Date.now()
              }));
            }
            
            return newBookings;
          });
        })
        .catch(err => {
          console.error(`Failed to fetch new booking ${booking.id}:`, err);
        });
      return;
    }
    
    if (eventType === 'DELETE') {
      const deletedBookingId = booking?.id;
      if (deletedBookingId) {
        setBookings(prev => prev.filter(b => b.id !== deletedBookingId));
      }
    }
  }, [businessId]);

  // Use the centralized realtime hook - only when user is loaded and authenticated
  useRealtimeBookings({
    businessId: isLoaded && user ? businessId : null, // Only pass businessId when user is ready
    onBookingChange: useCallback((eventType: 'INSERT' | 'UPDATE' | 'DELETE', booking: RealtimeBooking) => {
      console.log(`[BookingList] useRealtimeBookings onBookingChange called:`, eventType, { id: booking?.id, status: booking?.status });
      handleBookingRealtimeEvent(eventType, booking);
    }, [handleBookingRealtimeEvent]),
    onWaiverChange: handleWaiverRealtimeEvent,
    enableNotifications: false // Notifications handled elsewhere
  });





  // Realtime subscriptions are now handled by useRealtimeBookings hook

  useEffect(() => {
    setBookings(initialData.bookings);
  }, [initialData.bookings]);

  useEffect(() => {
    const bookingIdFromQuery = searchParams.get('bookingId');
    if (bookingIdFromQuery && bookings.length > 0) {
      const bookingToView = bookings.find(b => b.id === bookingIdFromQuery);
      if (bookingToView) {
        handleSelectBooking(bookingToView);
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [searchParams, bookings]);

  const inventoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    initialData.bounceHouses.forEach(item => {
      map.set(item.id, item.name);
    });
    return map;
  }, [initialData.bounceHouses]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(undefined);
    setEventType("");
    setShowPastBookings(false);
    // Keep sort settings as they are
  };

  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      const bookingEventDate = startOfDay(new Date(booking.eventDate));
      const today = startOfDay(new Date());

      if (!showPastBookings && (bookingEventDate < today || booking.status === 'COMPLETED')) {
        if (statusFilter !== 'COMPLETED') {
          return false;
        }
      }
      
      const searchMatch = searchTerm
        ? booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.eventAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.inventoryItems.some(item => {
            const itemName = inventoryNameMap.get(item.inventoryId) || '';
            return itemName.toLowerCase().includes(searchTerm.toLowerCase());
          })
        : true;
      
      // For debugging: uncomment the line below to show ALL bookings regardless of status
      // const statusMatch = true;
      const statusMatch = statusFilter === "all" || booking.status === statusFilter;
      
      let dateMatch = true;
      if (dateRange?.from) {
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? startOfDay(dateRange.to) : fromDate;
        dateMatch = bookingEventDate >= fromDate && bookingEventDate <= toDate;
      }
      
      const eventTypeMatch = !eventType || booking.eventType === eventType;
      
      return searchMatch && statusMatch && dateMatch && eventTypeMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "eventDate") {
        comparison = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      } else if (sortField === "totalAmount") {
        comparison = a.totalAmount - b.totalAmount;
      } else if (sortField === "customerName") {
        comparison = a.customer.name.localeCompare(b.customer.name);
      }
      return sortDirection === "asc" ? comparison : comparison * -1;
    });

  const getStatusBadgeVariant = (status: Booking['status']) => {
    const baseClasses = "font-medium rounded-full px-2.5 py-0.5 text-xs inline-flex items-center gap-1.5";
    switch (status) {
      case "PENDING":
        return `${baseClasses} bg-yellow-50 text-yellow-700 border border-yellow-200`;
      case "CONFIRMED":
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      case "COMPLETED":
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200`;
      case "CANCELLED":
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      case "HOLD":
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };
  
  const handleCompleteBooking = async (bookingId: string) => {
    setIsCompleting(bookingId);
    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}/complete`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete booking');
      }

      const completedBooking = await response.json();
      console.log("Booking completed" , completedBooking.customer)

      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === bookingId ? { ...b, status: 'COMPLETED', isCompleted: true } : b
        )
      );

      toast.success(`Booking #${completedBooking.id} marked as completed.`);

    } catch (error) {
      console.error("Error completing booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to complete booking");
    } finally {
      setIsCompleting(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const now = new Date();
    const eventDate = dateOnlyUTC(booking.eventDate);
    const isWithin24HoursOfEvent = (eventDate.getTime() - now.getTime()) < (24 * 60 * 60 * 1000);
    
    setIsWithin24Hours(isWithin24HoursOfEvent);
    setFullRefund(false); 
    setCancellationReason(""); 
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const confirmCancellation = async () => {
    if (!bookingToCancel) return;
    
    try {
      setIsCancelling(true);
      
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingToCancel}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullRefund,
          reason: cancellationReason,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("Cancellation error:", result);
        throw new Error(result.error || 'Failed to cancel booking');
      }
      
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === bookingToCancel ? { ...b, status: 'CANCELLED' } : b
        )
      );
      
      toast.success(result.refundAmount > 0 
        ? `Booking cancelled. Refund of $${result.refundAmount.toFixed(2)} (${result.refundPercentage}%) processed.` 
        : "The booking has been cancelled.");
      
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const BookingDetails = ({ booking }: { booking: Booking }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Booking for {booking.customer?.name || "N/A"}</h3>
             <Badge className={`mt-1 ${getStatusBadgeVariant(booking.status)}`}>
              {booking.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">${booking.totalAmount.toFixed(2)}</div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Event Date & Time</div>
                <div className="text-sm text-muted-foreground">
                 {utcToLocal(new Date(booking.startTime), booking.eventTimeZone, 'MMM d, yyyy')} ({utcToLocal(new Date(booking.startTime), booking.eventTimeZone, "p")} - {utcToLocal(new Date(booking.endTime), booking.eventTimeZone, "p")})
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Event Location</div>
                <div className="text-sm text-muted-foreground">
                  {booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}
                </div>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Event Info</div>
                <div className="text-sm text-muted-foreground">
                  {booking.eventType || "N/A"} ({booking.participantCount} participants{booking.participantAge ? `, ~${booking.participantAge} yrs` : ''})
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Customer</div>
                <div className="text-sm text-muted-foreground">{booking.customer?.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {booking.customer?.email}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {booking.customer?.phone}</div>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Booked Items</div>
                {booking.inventoryItems.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {booking.inventoryItems.map(item => (
                      <li key={item.id}>
                        {inventoryNameMap.get(item.inventoryId) || item.inventoryId} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No items booked.</p>
                )}
              </div>
            </div>
             <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Waiver Status</div>
                <p className={`text-sm ${booking.hasSignedWaiver ? 'text-green-600' : 'text-orange-600'}`}>
                  {booking.hasSignedWaiver ? 'Signed' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {booking.specialInstructions && (
          <>
            <Separator />
            <div>
              <div className="font-medium">Special Instructions</div>
              <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                {booking.specialInstructions}
              </div>
            </div>
          </>
        )}
         {booking.status === "CANCELLED" && booking.refundReason && (
           <>
             <Separator />
             <div>
               <div className="font-medium text-destructive">Cancellation Reason</div>
               <div className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">
                 {booking.refundReason}
               </div>
             </div>
           </>
         )}
      </div>
    );
  };

  // Handler for selecting a booking (used by both list and calendar)
  const handleSelectBooking = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewSheetOpen(true);
  }, []);

  // Handler for calendar navigation
  const handleNavigate = (newDate: Date) => {
    setCurrentCalendarDate(newDate);
    // Optional: Fetch data for the new month/view if necessary
  };

  return (
    <div className="space-y-6">
      <BookingsViewControls 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        eventType={eventType}
        showPastBookings={showPastBookings}
        onShowPastBookingsChange={setShowPastBookings}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        onClearFilters={clearAllFilters}
      />

      {/* View Switcher - Hidden below md breakpoint */}
      <div className="flex justify-end mb-4">
        <ToggleGroup 
          type="single" 
          value={activeView} 
          onValueChange={(value) => { if (value) setActiveView(value as 'list' | 'calendar')}} 
          aria-label="View mode"
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-1"
        >
          <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 px-3 py-1.5">
            <List className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
          {/* Hide Calendar toggle on small screens */}
          <ToggleGroupItem 
            value="calendar" 
            aria-label="Calendar view" 
            className="hidden md:inline-flex data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 px-3 py-1.5"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Conditional Rendering based on activeView */}
      {/* Show List view always, or Calendar view only on md screens and up */}
      {activeView === 'list' || typeof window !== 'undefined' && window.innerWidth < 768 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Event Details</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAndSortedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8">
                      <div className="text-center">
                        <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          No bookings match your current filters.
                        </p>
                        <div className="mt-6">
                          <Button
                            onClick={clearAllFilters}
                            variant="outline"
                            className="bg-white hover:bg-gray-50"
                          >
                            Clear all filters
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedBookings.map((booking) => (
                    <tr 
                      key={booking.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {booking.customer?.name || `${booking.status} Booking`}
                          </span>
                          <span className="text-sm text-gray-500">
                            {booking.customer?.email || `ID: ${booking.id.substring(0, 8)}...`}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {utcToLocal(new Date(booking.startTime), booking.eventTimeZone, 'MMM d, yyyy')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {utcToLocal(new Date(booking.startTime), booking.eventTimeZone, 'h:mm a')} -
                            {utcToLocal(new Date(booking.endTime), booking.eventTimeZone, 'h:mm a')}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {booking.eventCity}, {booking.eventState}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          {booking.inventoryItems.map((item) => (
                            <span key={item.id} className="text-sm text-gray-900">
                              {inventoryNameMap.get(item.inventoryId) || item.inventoryId}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadgeVariant(booking.status)}>
                          {booking.status === 'HOLD' && <Cloud className="h-3 w-3" />}
                          {booking.status === 'COMPLETED' && <CheckCircle className="h-3 w-3" />}
                          {booking.status === 'CONFIRMED' && <ShieldCheck className="h-3 w-3" />}
                          {booking.status === 'PENDING' && <Clock className="h-3 w-3" />}
                          {booking.status === 'CANCELLED' && <X className="h-3 w-3" />}
                          {booking.status}
                        </Badge>
                        {!booking.hasSignedWaiver && booking.status !== 'CANCELLED' && (
                          <div className="mt-1">
                            <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700 bg-yellow-50">
                              Waiver Pending
                            </Badge>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-medium text-gray-900">
                          ${booking.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  onClick={() => handleSelectBooking(booking)}
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  onClick={() => router.push(`/dashboard/${businessId}/bookings/${booking.id}/edit`)}
                                >
                                  <PencilIcon className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Booking</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {booking.status === 'CONFIRMED' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-green-100"
                                    onClick={() => handleCompleteBooking(booking.id)}
                                    disabled={isCompleting === booking.id}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Completed</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-100"
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Cancel Booking</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Render Calendar View - Hidden below md breakpoint implicitly by the toggle button being hidden
        // We could add an explicit hidden class here too for robustness if needed: className="hidden md:block"
        <BookingsCalendarView 
          bookings={filteredAndSortedBookings}
          onSelectBooking={(booking) => handleSelectBooking(booking as Booking)}
          currentDate={currentCalendarDate}
          onNavigateChange={handleNavigate}
        />
      )}

      {/* Booking Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-6 border-b">
            <SheetTitle className="text-2xl font-bold text-gray-900">Booking Details</SheetTitle>
          </SheetHeader>
          {selectedBooking && <BookingDetails booking={selectedBooking} />}
        </SheetContent>
      </Sheet>


      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Cancel Booking</DialogTitle>
            <DialogDescription className="text-gray-500">
              {isWithin24Hours ? (
                "This booking is within 24 hours. A 10% cancellation fee will apply unless marked as full refund."
              ) : (
                "Are you sure you want to cancel this booking?"
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isWithin24Hours && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fullRefund"
                  checked={fullRefund}
                  onCheckedChange={(checked) => setFullRefund(checked as boolean)}
                />
                <Label htmlFor="fullRefund" className="text-sm text-gray-700">
                  Process full refund (override cancellation fee)
                </Label>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm text-gray-700">
                Cancellation Reason
              </Label>
              <Textarea
                id="reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter the reason for cancellation..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="bg-white hover:bg-gray-50"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 