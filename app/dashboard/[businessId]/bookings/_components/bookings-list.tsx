'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { BookingsViewControls } from "./bookings-view-controls";
import { Calendar } from "@/components/ui/calendar";
import { Card as CalendarCard, CardContent as CalendarCardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Edit, Eye, MapPin, Phone, Mail, Users, Calendar as CalendarIcon, Info, User, CreditCard, X, ChevronRight, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const [fullRefund, setFullRefund] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  

  const filteredBookings = initialData.bookings.filter((booking) => {
    const searchMatch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || booking.status === statusFilter;
    return searchMatch && statusMatch;
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
    
    // Check if booking is within 24 hours
    const now = new Date();
    const eventDate = createUTCDate(booking.eventDate);
    const isWithin24HoursOfEvent = (eventDate.getTime() - now.getTime()) < (24 * 60 * 60 * 1000);
    
    setIsWithin24Hours(isWithin24HoursOfEvent);
    setFullRefund(false); // Reset to default
    setCancellationReason(""); // Reset reason
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: string) => {
    // TODO: Implement status update
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
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

  // Helper function to create a UTC date from ISO string
  const createUTCDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    ));
  };

  const BookingDetails = ({ booking }: { booking: Booking }) => {
    // Create UTC dates to avoid timezone issues
    const eventDate = createUTCDate(booking.eventDate);
    const startTime = createUTCDate(booking.startTime);
    const endTime = createUTCDate(booking.endTime);
    
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
                {format(eventDate, "PPP")}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">24-Hour Rental:</span> Delivery at {format(startTime, "p")} - Pickup at {format(endTime, "p")}
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
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <BookingsViewControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Upcoming Bookings</h2>
          
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-muted">
                  <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "Create your first booking to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => {
                // Create UTC dates to avoid timezone issues
                const eventDate = createUTCDate(booking.eventDate);
                
                return (
                  <Card key={booking.id} className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative sm:w-1/3 bg-muted">
                          <div className="absolute top-2 left-2">
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="h-full flex items-center justify-center p-4 sm:p-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {format(eventDate, "d")}
                              </div>
                              <div className="text-sm font-medium">
                                {format(eventDate, "MMM yyyy")}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                24-Hour Rental
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 sm:p-6 sm:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-semibold line-clamp-1">{booking.bounceHouse.name}</h3>
                              <div className="text-right">
                                <div className="font-semibold">${booking.totalAmount.toFixed(2)}</div>
                                {booking.subtotalAmount !== undefined && booking.taxAmount !== undefined && booking.taxRate !== undefined && (
                                  <div className="text-xs text-muted-foreground">
                                    Incl. tax: ${booking.taxAmount.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                <span className="line-clamp-1">{booking.customer.name}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                <span className="line-clamp-1">{booking.eventCity}, {booking.eventState}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                <span>{booking.participantCount} participants</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                <span className="line-clamp-1">{booking.eventType}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap justify-end gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setIsViewSheetOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/dashboard/${businessId}/bookings/${booking.id}/edit`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            {booking.status !== "CANCELLED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:block">
          <div className="lg:sticky lg:top-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Calendar View</CardTitle>
                    <CardDescription>Select a date to view bookings</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="lg:hidden" 
                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                  >
                    {isCalendarVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={`lg:block ${!isCalendarVisible ? 'hidden' : ''}`}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border mx-auto"
                />
                
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Bookings on {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}</h4>
                  {selectedDate && (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {initialData.bookings
                        .filter(booking => {
                          const bookingDate = createUTCDate(booking.eventDate);
                          return (
                            bookingDate.getDate() === selectedDate.getDate() &&
                            bookingDate.getMonth() === selectedDate.getMonth() &&
                            bookingDate.getFullYear() === selectedDate.getFullYear()
                          );
                        })
                        .map(booking => (
                          <div 
                            key={booking.id} 
                            className="p-2 text-sm rounded-md border cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsViewSheetOpen(true);
                            }}
                          >
                            <div className="font-medium">{booking.bounceHouse.name}</div>
                            <div className="text-muted-foreground">
                              24-Hour Rental
                            </div>
                          </div>
                        ))}
                      {initialData.bookings.filter(booking => {
                        const bookingDate = createUTCDate(booking.eventDate);
                        return (
                          bookingDate.getDate() === selectedDate.getDate() &&
                          bookingDate.getMonth() === selectedDate.getMonth() &&
                          bookingDate.getFullYear() === selectedDate.getFullYear()
                        );
                      }).length === 0 && (
                        <div className="text-muted-foreground text-sm">No bookings on this date</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Replace Dialog with Sheet for booking details */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          
          {selectedBooking && <BookingDetails booking={selectedBooking} />}
          
          <SheetFooter className="mt-6 flex justify-between sm:justify-between gap-2">
            {selectedBooking && selectedBooking.status !== "CANCELLED" && (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  setBookingToCancel(selectedBooking.id);
                  setIsCancelDialogOpen(true);
                  setIsViewSheetOpen(false);
                }}
              >
                Cancel Booking
              </Button>
            )}
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button variant="outline">Close</Button>
              </SheetClose>
              {selectedBooking && (
                <Button 
                  onClick={() => {
                    router.push(`/dashboard/${businessId}/bookings/${selectedBooking.id}/edit`);
                    setIsViewSheetOpen(false);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Enhanced cancellation dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              {isWithin24Hours 
                ? "This booking is within 24 hours of the event. A 10% cancellation fee will be applied unless you override with a full refund."
                : "Are you sure you want to cancel this booking? The customer will receive a full refund."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {isWithin24Hours && (
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="fullRefund" 
                  checked={fullRefund} 
                  onCheckedChange={(checked) => setFullRefund(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="fullRefund" className="text-sm font-medium">
                    Override with full refund (100%)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    By default, a 10% cancellation fee will be applied for late cancellations.
                  </p>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm">
                Cancellation Reason (optional)
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for cancellation"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="resize-none"
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
              {isCancelling ? "Processing..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 