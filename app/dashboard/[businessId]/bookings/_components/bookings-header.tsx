import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar, DollarSign } from "lucide-react";
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
    <div className="space-y-6 p-6 bg-[#fafbff]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bookings
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Manage your bounce house bookings and reservations
          </p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 gap-2 rounded-xl h-12 w-full sm:w-auto">
              <CalendarPlus className="h-5 w-5" /> 
              <span>New Booking</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto p-0">
            <SheetHeader className="p-6 pb-2 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-2xl font-bold text-gray-800">Create New Booking</SheetTitle>
                <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-white/80 transition-colors">
                  
                </SheetClose>
              </div>
              <SheetDescription className="text-gray-600">
                Enter the booking details below
              </SheetDescription>
            </SheetHeader>
            <div className="px-6 pb-6 pt-2">
              <NewBookingForm businessId={businessId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Bookings</CardTitle>
            <CardDescription className="text-gray-400">Scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{todaysBookings}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Bookings</CardTitle>
            <CardDescription className="text-gray-400">Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{upcomingBookings}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <CardDescription className="text-gray-400">This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  ${monthlyRevenue._sum.totalAmount?.toFixed(2) ?? "0.00"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 