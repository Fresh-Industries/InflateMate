import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar } from "lucide-react";
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
import { prisma } from "@/lib/prisma";

interface BookingsHeaderProps {
  businessId: string;
}

export async function BookingsHeader({ businessId }: BookingsHeaderProps) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0,0,0,0));
  const endOfDay = new Date(today.setHours(23,59,59,999));

  const todaysBookings = await prisma.booking.count({
    where: {
      businessId,
      eventDate: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const upcomingBookings = await prisma.booking.count({
    where: {
      businessId,
      eventDate: {
        gte: new Date(),
        lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      status: 'CONFIRMED',
    },
  });

  const monthlyRevenue = await prisma.booking.aggregate({
    where: {
      businessId,
      eventDate: {
        gte: new Date(today.getFullYear(), today.getMonth()),
        lt: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      },
      status: 'CONFIRMED',
    },
    _sum: {
      totalAmount: true,
    },
  });

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
                <span className="text-2xl font-bold">{todaysBookings}</span>
              </div>
              
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
                <span className="text-2xl font-bold">{upcomingBookings}</span>
              </div>
              
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
              <span className="text-2xl font-bold">
                ${monthlyRevenue._sum.totalAmount?.toFixed(2) ?? "0.00"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 