'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Package, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  recentActivity: Array<{
    type: 'BOOKING' | 'PAYMENT' | 'MAINTENANCE';
    title: string;
    subtitle: string;
    timestamp: string;
  }>;
  upcomingBookings: Array<{
    id: string;
    bounceHouse: { name: string };
    eventDate: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: string;
  }>;
}

export default function DashboardPage() {
  const params = useParams();
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
          console.log(businessData);
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
          console.log(bookingsData);
        } catch (e) {
          console.error('Failed to parse bookings response:', e);
          throw new Error('Invalid response from server');
        }

        if (!bookingsResponse.ok) {
          throw new Error(bookingsData.error || 'Failed to fetch bookings');
        }

        console.log("booking data" ,bookingsData.data);
        console.log("business data" ,businessData);

        // Check if bookingsData is an array, if not, use an empty array
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];

        // Calculate dashboard metrics
        const activeBookings = bookingsArray.filter((b) => b.status === 'CONFIRMED').length;
        const pendingBookings = bookingsArray.filter((b) => b.status === 'PENDING').length;
        const totalRevenue = bookingsArray.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

        // Get available and maintenance units
        const availableUnits = businessData.inventory.filter((bh) => bh.status === 'AVAILABLE').length;
        const maintenanceUnits = businessData.inventory.filter((bh) => bh.status === 'MAINTENANCE').length;

        setData({
          totalRevenue,
          activeBookings,
          pendingBookings,
          totalCustomers: businessData.customers?.length || 0,
          availableUnits,
          maintenanceUnits,
          recentActivity: [], // You can populate this from bookings/payments history
          upcomingBookings: bookingsArray.slice(0, 3) // Take first 3 upcoming bookings
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
              From all bookings
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

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.upcomingBookings.length > 0 ? (
                data.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-100 p-2">
                      <CalendarCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Booking</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.eventDate).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <CalendarCheck className="mr-2 h-4 w-4" />
              Create New Booking
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Update Inventory
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.upcomingBookings.length > 0 ? (
              data.upcomingBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-medium">{booking.bounceHouse?.name || 'Unknown Bounce House'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.eventDate).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                    <p className="text-sm text-green-600">{booking.status}</p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming bookings</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 