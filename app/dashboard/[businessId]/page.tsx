'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Package, CalendarCheck, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format, startOfToday, endOfToday, addDays, isWithinInterval } from "date-fns";

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  bounceHouse: {
    name: string;
  };
}

interface BounceHouse {
  id: string;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'RETIRED';
}

interface BusinessData {
  id: string;
  bounceHouses: BounceHouse[];
  customers: Array<{ id: string }>;
}

interface DashboardData {
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  totalCustomers: number;
  availableUnits: number;
  maintenanceUnits: number;
  todayBookings: Booking[];
  upcomingBookings: Booking[];
  recentActivity: Array<{
    type: 'BOOKING' | 'PAYMENT' | 'MAINTENANCE';
    title: string;
    subtitle: string;
    timestamp: string;
  }>;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const businessId = params.businessId as string;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!businessId) {
        console.error('No business ID found');
        toast({
          title: "Error",
          description: "No business ID found",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch business data
        const businessResponse = await fetch(`/api/businesses/${businessId}`);
        let businessData;
        
        try {
          businessData = await businessResponse.json();
        } catch (e) {
          console.error('Failed to parse business response:', e);
          throw new Error('Invalid response from server');
        }

        if (!businessResponse.ok) {
          throw new Error(businessData.error || 'Failed to fetch business data');
        }

        // Fetch bookings
        const bookingsResponse = await fetch(`/api/businesses/${businessId}/bookings`);
        let bookingsData;
        
        try {
          bookingsData = await bookingsResponse.json();
        } catch (e) {
          console.error('Failed to parse bookings response:', e);
          throw new Error('Invalid response from server');
        }

        if (!bookingsResponse.ok) {
          throw new Error(bookingsData.error || 'Failed to fetch bookings');
        }

        // Check if bookingsData is an array, if not, use an empty array
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : 
                             (bookingsData.data && Array.isArray(bookingsData.data)) ? bookingsData.data : [];

        // Filter bookings by date
        const today = new Date();
        const todayStart = startOfToday();
        const todayEnd = endOfToday();
        const nextWeekEnd = addDays(today, 7);

        // Get today's bookings
        const todayBookings = bookingsArray.filter((booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          return isWithinInterval(bookingDate, { start: todayStart, end: todayEnd }) && 
                 booking.status !== 'CANCELLED';
        });

        // Get upcoming bookings (next 7 days, excluding today)
        const upcomingBookings = bookingsArray.filter((booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          return bookingDate > todayEnd && 
                 bookingDate <= nextWeekEnd && 
                 booking.status !== 'CANCELLED';
        });

        // Calculate monthly revenue (current month)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const monthlyRevenue = bookingsArray.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (bookingDate.getMonth() === currentMonth && 
              bookingDate.getFullYear() === currentYear && 
              booking.status !== 'CANCELLED') {
            return acc + (booking.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate dashboard metrics
        const activeBookings = bookingsArray.filter((b: Booking) => b.status === 'CONFIRMED').length;
        const pendingBookings = bookingsArray.filter((b: Booking) => b.status === 'PENDING').length;

        // Get available and maintenance units
        const availableUnits = businessData.inventory?.filter((bh: BounceHouse) => bh.status === 'AVAILABLE').length || 0;
        const maintenanceUnits = businessData.inventory?.filter((bh: BounceHouse) => bh.status === 'MAINTENANCE').length || 0;

        setData({
          totalRevenue: monthlyRevenue,
          activeBookings,
          pendingBookings,
          totalCustomers: businessData.customers?.length || 0,
          availableUnits,
          maintenanceUnits,
          todayBookings,
          upcomingBookings,
          recentActivity: [] // You can populate this from bookings/payments history
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch dashboard data",
          variant: "destructive",
        });
        
        // If unauthorized, redirect to auth page
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          window.location.href = '/sign-in';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [businessId, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Failed to load dashboard data</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeBookings || 0} </div>
            <p className="text-xs text-muted-foreground">
              {data.pendingBookings || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.availableUnits || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data.maintenanceUnits || 0} need maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Today's Bookings</CardTitle>
            <CardDescription>Scheduled for today</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
          >
            <span>View</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <div className="text-3xl font-bold">{data.todayBookings.length}</div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Bookings */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
          >
            <span>View</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <div className="text-3xl font-bold">{data.upcomingBookings.length}</div>
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>This month</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
          >
            <span>Details</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <DollarSign className="h-10 w-10 text-muted-foreground" />
            <div className="text-3xl font-bold">{formatCurrency(data.totalRevenue)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 