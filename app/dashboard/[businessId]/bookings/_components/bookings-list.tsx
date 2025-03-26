'use client';

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { BookingsViewControls } from "./bookings-view-controls";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Eye, MapPin, Phone, Mail, Users, Calendar as CalendarIcon, Info, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createLocalDate } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface BounceHouse {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  bounceHouseId: string;
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
  bounceHouse: {
    id: string;
    name: string;
  };
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  specialInstructions?: string;
  refundAmount?: number;
  refundReason?: string;
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
  
  // New state for enhanced filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("eventDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [eventType, setEventType] = useState<string>("");

  // Clear all filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateRange(undefined);
    setEventType("");
    // Keep sort settings as they are
  };

  const filteredBookings = initialData.bookings
    .filter((booking) => {
      // Text search filter
      const searchMatch = 
        booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.eventAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bounceHouse.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = statusFilter === "all" || booking.status === statusFilter;
      
      // Date range filter
      let dateMatch = true;
      if (dateRange?.from) {
        const bookingDate = new Date(booking.eventDate);
        dateMatch = bookingDate >= dateRange.from && 
                    (!dateRange.to || bookingDate <= dateRange.to);
      }
      
      // Event type filter
      const eventTypeMatch = !eventType || booking.eventType === eventType;
      
      return searchMatch && statusMatch && dateMatch && eventTypeMatch;
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === "eventDate") {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return sortDirection === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      } else if (sortField === "totalAmount") {
        return sortDirection === "asc" 
          ? a.totalAmount - b.totalAmount 
          : b.totalAmount - a.totalAmount;
      } else if (sortField === "customerName") {
        return sortDirection === "asc" 
          ? a.customer.name.localeCompare(b.customer.name) 
          : b.customer.name.localeCompare(a.customer.name);
      }
      return 0;
    });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = initialData.bookings.find(b => b.id === bookingId);
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
      
      // Update the booking in the UI
      const updatedBookings = initialData.bookings.map(booking => 
        booking.id === bookingToCancel 
          ? { ...booking, status: 'CANCELLED' } 
          : booking
      );
      
      initialData.bookings = updatedBookings;
      
      // Show success message
      toast({
        title: "Booking Cancelled",
        description: result.refundAmount > 0 
          ? `Refund of $${result.refundAmount.toFixed(2)} (${result.refundPercentage}%) has been processed.` 
          : "The booking has been cancelled.",
        variant: "default",
      });
      
      // Close the dialog
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
      
      // Refresh the page to get updated data
      router.refresh();
      
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{booking.bounceHouse.name}</h3>
            <Badge variant={getStatusBadgeVariant(booking.status)} className="mt-2">
              {booking.status}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">${booking.totalAmount.toFixed(2)}</div>
            {booking.depositAmount && (
              <div className="text-sm text-muted-foreground">
                Deposit: ${booking.depositAmount.toFixed(2)}
                {booking.depositPaid ? " (Paid)" : " (Pending)"}
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Event Date</div>
              <div className="text-sm text-muted-foreground">
                {format(booking.eventDate, "PPP")}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">24-Hour Rental:</span> Delivery at {format(booking.startTime, "p")} - Pickup at {format(booking.endTime, "p")}
              </div>
            </div>
          </div>

          {booking.status === "CANCELLED" && (
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium text-destructive">Cancellation Information</div>
                <div className="text-sm text-muted-foreground">
                  This booking has been cancelled.
                </div>
                {booking.refundAmount && (
                  <div className="text-sm text-muted-foreground">
                    Refund amount: ${booking.refundAmount.toFixed(2)}
                  </div>
                )}
                {booking.refundReason && (
                  <div className="text-sm text-muted-foreground">
                    Reason: {booking.refundReason}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Event Details</div>
              <div className="text-sm text-muted-foreground">
                {booking.eventType || "Not specified"}
              </div>
              <div className="text-sm text-muted-foreground">
                {booking.participantCount} participants
                {booking.participantAge && ` • Average age: ${booking.participantAge}`}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Event Location</div>
              <div className="text-sm text-muted-foreground">
                {booking.eventAddress}
              </div>
              <div className="text-sm text-muted-foreground">
                {booking.eventCity}, {booking.eventState} {booking.eventZipCode}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Customer Information</div>
              <div className="text-sm text-muted-foreground">
                {booking.customer.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {booking.customer.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {booking.customer.phone}
              </div>
            </div>
          </div>

          {booking.specialInstructions && (
            <>
              <Separator />
              <div>
                <div className="font-medium">Special Instructions</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {booking.specialInstructions}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add the enhanced filters component */}
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
        onClearFilters={clearAllFilters}
      />

      {filteredBookings.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              <CalendarIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No bookings found</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {searchTerm || statusFilter !== "all" || dateRange?.from || eventType
                ? "Try adjusting your filters to see more results."
                : "Start by creating your first booking."}
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button>Create New Booking</Button>
              </SheetTrigger>
              <SheetContent className="lg:max-w-xl overflow-y-auto">
                {/* Reuse the NewBookingForm component here */}
              </SheetContent>
            </Sheet>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold">{booking.customer.name}</CardTitle>
                        <div className="flex items-center mt-1 space-x-1 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium">Rental Details</h4>
                        <p className="text-sm mt-1">{booking.bounceHouse.name}</p>
                        <div className="flex items-center mt-2">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-sm">{booking.participantCount} participants</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Event Location</h4>
                        <div className="flex items-start mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{booking.eventAddress}, {booking.eventCity}, {booking.eventState} {booking.eventZipCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t md:border-t-0 md:border-l bg-muted/50 p-6 flex flex-col justify-between gap-4 w-full md:w-48">
                    <div>
                      <h4 className="text-sm font-medium">Total Amount</h4>
                      <p className="text-xl font-bold">${booking.totalAmount.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsViewSheetOpen(true);
                        }}
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-between"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        <span>View</span>
                      </Button>
                      {booking.status !== "CANCELLED" && (
                        <Button 
                          onClick={() => handleCancelBooking(booking.id)}
                          size="sm" 
                          variant="outline" 
                          className="w-full justify-between text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          <span>Cancel</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* View Booking Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          
          {selectedBooking && (
            <div className="mt-6">
              <BookingDetails booking={selectedBooking} />
            </div>
          )}
          
          <SheetFooter className="mt-8">
            <Button variant="outline" onClick={() => setIsViewSheetOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              {isWithin24Hours 
                ? "This booking is within 24 hours of the event. Cancellation may affect refund policies."
                : "Are you sure you want to cancel this booking?"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="fullRefund" 
                checked={fullRefund} 
                onCheckedChange={(checked) => setFullRefund(checked as boolean)} 
              />
              <Label htmlFor="fullRefund">Process full refund</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation</Label>
              <Textarea 
                id="reason" 
                placeholder="Enter reason for cancellation" 
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCancelDialogOpen(false)} 
              disabled={isCancelling}
            >
              Keep Booking
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancellation} 
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <span className="mr-2">Cancelling...</span>
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 