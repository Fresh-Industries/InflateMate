'use client';

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { BookingsViewControls } from "./bookings-view-controls";
import { Calendar } from "@/components/ui/calendar";
import { Card as CalendarCard, CardContent as CalendarCardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Edit, Eye, MapPin, Phone, Mail, Users, Calendar as CalendarIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  

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
    setBookingToCancel(bookingId);
    setIsCancelDialogOpen(true);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: string) => {
    // TODO: Implement status update
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
  };

  const confirmCancellation = () => {
    // TODO: Implement cancellation
    console.log(`Cancelling booking ${bookingToCancel}`);
    setIsCancelDialogOpen(false);
  };



  const BookingDetails = ({ booking }: { booking: Booking }) => (
    <div className="space-y-6">
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

      <div className="grid gap-4">
        <div className="flex items-start gap-4">
          <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <div className="font-medium">Event Date & Time</div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(booking.eventDate), "PPP")}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(booking.startTime), "p")} - {format(new Date(booking.endTime), "p")}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
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

        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
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

        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
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

  return (
    <div className="space-y-6">
      
      <Tabs defaultValue="list" className="space-y-4">
        <BookingsViewControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <TabsContent value="list" className="space-y-4">
          {filteredBookings.map((booking: Booking) => (
            <Card key={booking.id}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {booking.bounceHouse.name}
                    </h3>
                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {format(new Date(booking.eventDate), "PPP")} •{" "}
                    {format(new Date(booking.startTime), "p")} -{" "}
                    {format(new Date(booking.endTime), "p")}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div>
                      <span className="font-medium">Customer:</span>{" "}
                      {booking.customer.name}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {booking.customer.phone}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> $
                      {booking.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {booking.eventAddress}, {booking.eventCity},{" "}
                    {booking.eventState} {booking.eventZipCode}
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.status !== "CANCELLED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={false}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/dashboard/${businessId}/bookings/${booking.id}/edit`);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarCard>
            <CardHeader>
              <CardTitle>Booking Calendar</CardTitle>
              <CardDescription>View and manage bookings in calendar format</CardDescription>
            </CardHeader>
            <CalendarCardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">
                  Bookings for {selectedDate && format(selectedDate, "PPP")}
                </h3>
                {filteredBookings
                  .filter(
                    (booking: Booking) =>
                      format(new Date(booking.eventDate), "yyyy-MM-dd") ===
                      format(selectedDate!, "yyyy-MM-dd")
                  )
                  .map((booking: Booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <div className="font-medium">
                          {booking.bounceHouse.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(booking.startTime), "p")} -{" "}
                          {format(new Date(booking.endTime), "p")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                        {booking.status !== "CANCELLED" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() =>
                              handleUpdateBookingStatus(booking.id, "CANCELLED")
                            }
                            disabled={false}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            router.push(`/dashboard/${businessId}/bookings/${booking.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CalendarCardContent>
          </CalendarCard>
        </TabsContent>
      </Tabs>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setBookingToCancel(null);
              }}
            >
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancellation}
              disabled={false}
            >
              Yes, Cancel Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View complete booking information
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            {selectedBooking && <BookingDetails booking={selectedBooking} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
} 