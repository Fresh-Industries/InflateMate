'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, isPast, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { BookingsViewControls } from "./bookings-view-controls";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Eye, MapPin, Phone, Mail, Users, Calendar as CalendarIcon, Info, X, Pencil as PencilIcon, CheckCircle, ShieldCheck, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createLocalDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InventoryItem {
  id: string;
  name: string;
}

interface BookingItem {
  id: string;
  quantity: number;
  price: number;
  inventory: InventoryItem;
}

interface Waiver {
  id: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
  openSignDocumentId?: string;
}

interface Booking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW' | 'WEATHER_HOLD';
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
  const { toast } = useToast();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialData.bookings);
  const [statusFilter, setStatusFilter] = useState("CONFIRMED");
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

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("eventDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [eventType, setEventType] = useState<string>("");
  const [showPastBookings, setShowPastBookings] = useState(false);

  useEffect(() => {
    setBookings(initialData.bookings);
  }, [initialData.bookings]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("CONFIRMED");
    setDateRange(undefined);
    setEventType("");
    setShowPastBookings(false);
    // Keep sort settings as they are
  };

  const filteredAndSortedBookings = bookings
    .filter((booking) => {
      const bookingEventDate = startOfDay(new Date(booking.eventDate));

      if (!showPastBookings && (isPast(bookingEventDate) || booking.status === 'COMPLETED')) {
        if (statusFilter !== 'COMPLETED') {
          return false;
        }
      }
      
      const searchMatch = searchTerm
        ? booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.eventAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.inventoryItems.some(item => item.inventory.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      
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
    switch (status) {
      case "PENDING":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
      case "NO_SHOW":
      case "WEATHER_HOLD":
        return "destructive";
      default:
        return "outline";
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

      toast({
        title: "Booking Completed",
        description: `Booking #${completedBooking.id}  marked as completed.`,
      });

    } catch (error) {
      console.error("Error completing booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete booking",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const now = new Date();
    const eventDate = createLocalDate(booking.eventDate);
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
      
      toast({
        title: "Booking Cancelled",
        description: result.refundAmount > 0 
          ? `Refund of $${result.refundAmount.toFixed(2)} (${result.refundPercentage}%) processed.` 
          : "The booking has been cancelled.",
        variant: "default",
      });
      
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
      
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const BookingDetails = ({ booking }: { booking: Booking }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Booking for {booking.customer.name}</h3>
             <Badge variant={getStatusBadgeVariant(booking.status)} className="mt-1">
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
                  {format(new Date(booking.eventDate), "PPP")} ({format(new Date(booking.startTime), "p")} - {format(new Date(booking.endTime), "p")})
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
                <div className="text-sm text-muted-foreground">{booking.customer.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3"/> {booking.customer.email}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3"/> {booking.customer.phone}</div>
              </div>
            </div>
             <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Booked Items</div>
                {booking.inventoryItems.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {booking.inventoryItems.map(item => (
                      <li key={item.id}>{item.inventory.name} (x{item.quantity})</li>
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

  return (
    <TooltipProvider>
    <div className="space-y-6">
      <BookingsViewControls 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
        eventType={eventType}
        onEventTypeChange={setEventType}
        showPastBookings={showPastBookings}
        onShowPastBookingsChange={setShowPastBookings}
        onClearFilters={clearAllFilters}
      />

      {filteredAndSortedBookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <CalendarIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No bookings match your filters</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Try adjusting your search or filter settings, or {showPastBookings ? 'hide past bookings' : 'show past bookings'}.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedBookings.length} {filteredAndSortedBookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
          
          <motion.div layout className="grid grid-cols-1 gap-4">
            <AnimatePresence initial={false}>
            {filteredAndSortedBookings.map((booking) => (
              <motion.div
                key={booking.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.3 }}
              >
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <CardTitle className="text-lg font-semibold leading-tight">{booking.customer.name}</CardTitle>
                        <div className="flex items-center mt-1 space-x-1 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                          <span>{format(new Date(booking.eventDate), "eee, MMM d")} • {format(new Date(booking.startTime), "p")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant={booking.hasSignedWaiver ? 'success' : 'secondary'} 
                              className="cursor-default"
                             >
                              <ShieldCheck className={`h-3.5 w-3.5 ${booking.hasSignedWaiver ? '' : 'text-orange-500'}`} />
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Waiver {booking.hasSignedWaiver ? 'Signed' : 'Pending'}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-start">
                        <Package className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div>
                          <span className="font-medium">Items:</span> 
                          <span className="text-muted-foreground ml-1">
                            {booking.inventoryItems.map(item => item.inventory.name).join(', ') || 'N/A'}
                          </span>
                        </div>
                      </div>
                       <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                         <span className="text-muted-foreground truncate" title={`${booking.eventAddress}, ${booking.eventCity}`}>
                            {booking.eventAddress}, {booking.eventCity}
                          </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t md:border-t-0 md:border-l bg-muted/50 p-4 flex flex-row md:flex-col justify-between md:justify-between items-center md:items-stretch gap-2 md:w-48">
                    <div className="text-left md:text-left">
                      <h4 className="text-xs font-medium text-muted-foreground">Total</h4>
                      <p className="text-lg font-bold">${booking.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 shrink-0">
                      <Button 
                        onClick={() => { setSelectedBooking(booking); setIsViewSheetOpen(true); }}
                        size="sm" 
                        variant="outline"
                        className="flex-1 md:w-full"
                      >
                        <Eye className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline">View</span>
                      </Button>
                      
                      {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                        <>
                          <Button 
                            onClick={() => router.push(`/dashboard/${businessId}/bookings/${booking.id}/edit`)}
                            size="sm" 
                            variant="outline"
                             className="flex-1 md:w-full"
                          >
                            <PencilIcon className="h-4 w-4 md:mr-2" />
                             <span className="hidden md:inline">Edit</span>
                          </Button>
                          
                          <Button 
                            onClick={() => handleCompleteBooking(booking.id)}
                            size="sm" 
                            variant="outline" 
                            className="flex-1 md:w-full bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800"
                            disabled={isCompleting === booking.id}
                          >
                            {isCompleting === booking.id ? (
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                            ) : (
                              <CheckCircle className="h-4 w-4 md:mr-2" />
                            )}
                            <span className="hidden md:inline">Complete</span>
                          </Button>

                          <Button 
                            onClick={() => handleCancelBooking(booking.id)}
                            size="sm" 
                            variant="outline" 
                            className="flex-1 md:w-full text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Cancel</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          
          {selectedBooking && (
            <div className="mt-6">
              <BookingDetails booking={selectedBooking} />
            </div>
          )}
          
          <SheetFooter className="mt-8 sticky bottom-0 bg-background py-4 border-t">
            <div className="flex w-full justify-between gap-4">
              <Button variant="outline" onClick={() => setIsViewSheetOpen(false)}>Close</Button>
              {selectedBooking && selectedBooking.status !== "CANCELLED" && selectedBooking.status !== "COMPLETED" && (
                 <div className="flex gap-2">
                   <Button 
                      onClick={() => {
                        router.push(`/dashboard/${businessId}/bookings/${selectedBooking.id}/edit`);
                        setIsViewSheetOpen(false);
                      }}
                      variant="outline"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" /> Edit
                    </Button>
                     <Button 
                       onClick={() => handleCompleteBooking(selectedBooking.id)}
                       disabled={isCompleting === selectedBooking.id}
                       className="bg-green-600 hover:bg-green-700"
                     >
                       {isCompleting === selectedBooking.id ? (
                         <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                       ) : (
                         <CheckCircle className="h-4 w-4 mr-2" />
                       )}
                       Mark as Complete
                     </Button>
                 </div>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              {isWithin24Hours 
                ? "This booking is within 24 hours. Cancellation may affect refund policies." 
                : "Confirm cancellation?"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="fullRefund" checked={fullRefund} onCheckedChange={(checked) => setFullRefund(checked as boolean)} />
              <Label htmlFor="fullRefund">Process full refund</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation (optional)</Label>
              <Textarea id="reason" placeholder="Enter reason..." value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={isCancelling}>Keep Booking</Button>
            <Button variant="destructive" onClick={confirmCancellation} disabled={isCancelling}>
              {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
} 