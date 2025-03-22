import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar, ChevronRight, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NewBookingForm } from "./new-booking-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BookingsHeaderProps {
  businessId: string;
}

export function BookingsHeader({ businessId }: BookingsHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your bounce house bookings and reservations
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="gap-2">
              <CalendarPlus className="h-5 w-5" /> 
              <span>New Booking</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-0">
            <SheetHeader className="p-6 pb-2">
              <div className="flex justify-between items-center">
                <SheetTitle>Create New Booking</SheetTitle>
                <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted">
                  <X className="h-4 w-4" />
                </SheetClose>
              </div>
              <SheetDescription>
                Enter the booking details below
              </SheetDescription>
            </SheetHeader>
            <div className="px-6 pb-6 pt-2">
              <NewBookingForm businessId={businessId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Bookings</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">0</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-bold">0</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">$0.00</span>
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>Details</span>
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 