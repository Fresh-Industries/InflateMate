'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  Users, 
  Package, 
  CalendarCheck, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { format, startOfToday, endOfToday, addDays, isWithinInterval, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'WEATHER_HOLD';
  totalAmount: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  customer: {
    name: string;
  };
  inventoryItems: Array<{
    inventory: {
      name: string;
    }
  }>;
}

interface Inventory {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'RETIRED';
  type: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  bookingCount: number;
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
  recentBookings: Booking[];
  monthlyRevenue: number;
  lastMonthRevenue: number;
  topInventory: Array<{name: string, bookings: number}>;
  bookingsByStatus: Array<{name: string, value: number}>;
  dailyRevenue: Array<{date: string, amount: number}>;
  topCustomers: Customer[];
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const businessId = params.businessId as string;
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

        // Fetch customers
        const customersResponse = await fetch(`/api/businesses/${businessId}/customers`);
        let customersData;
        
        try {
          customersData = await customersResponse.json();
        } catch (e) {
          console.error('Failed to parse customers response:', e);
          throw new Error('Invalid response from server');
        }

        if (!customersResponse.ok) {
          throw new Error(customersData.error || 'Failed to fetch customers');
        }

        // Check if customersData is an array, if not, use an empty array
        const customersArray = Array.isArray(customersData) ? customersData : 
                              (customersData.data && Array.isArray(customersData.data)) ? customersData.data : [];

        // Filter bookings by date
        const today = new Date();
        const todayStart = startOfToday();
        const todayEnd = endOfToday();
        const nextWeekEnd = addDays(today, 7);
        const currentMonthStart = startOfMonth(today);
        const currentMonthEnd = endOfMonth(today);
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));

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

        // Get recent bookings (last 10)
        const recentBookings = [...bookingsArray]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        // Calculate monthly revenue (current month)
        const monthlyRevenue = bookingsArray.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (isWithinInterval(bookingDate, { start: currentMonthStart, end: currentMonthEnd }) && 
              booking.status !== 'CANCELLED') {
            return acc + (booking.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate last month's revenue
        const lastMonthRevenue = bookingsArray.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (isWithinInterval(bookingDate, { start: lastMonthStart, end: lastMonthEnd }) && 
              booking.status !== 'CANCELLED') {
            return acc + (booking.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate daily revenue for the past 30 days
        const last30Days = eachDayOfInterval({
          start: subMonths(today, 1),
          end: today
        });

        const dailyRevenue = last30Days.map(day => {
          const dayRevenue = bookingsArray.reduce((acc: number, booking: Booking) => {
            const bookingDate = new Date(booking.eventDate);
            if (isSameDay(bookingDate, day) && booking.status !== 'CANCELLED') {
              return acc + (booking.totalAmount || 0);
            }
            return acc;
          }, 0);

          return {
            date: format(day, 'MMM dd'),
            amount: dayRevenue
          };
        });

        // Calculate bookings by status
        const bookingsByStatus = [
          { name: 'Confirmed', value: bookingsArray.filter((b: Booking) => b.status === 'CONFIRMED').length },
          { name: 'Pending', value: bookingsArray.filter((b: Booking) => b.status === 'PENDING').length },
          { name: 'Completed', value: bookingsArray.filter((b: Booking) => b.status === 'COMPLETED').length },
          { name: 'Cancelled', value: bookingsArray.filter((b: Booking) => b.status === 'CANCELLED').length },
          { name: 'No Show', value: bookingsArray.filter((b: Booking) => b.status === 'NO_SHOW').length },
          { name: 'Weather Hold', value: bookingsArray.filter((b: Booking) => b.status === 'WEATHER_HOLD').length }
        ].filter(item => item.value > 0);

        // Calculate top inventory items by booking count
        const inventoryBookingCounts: Record<string, { name: string, bookings: number }> = {};
        
        bookingsArray.forEach((booking: Booking) => {
          if (booking.inventoryItems && booking.status !== 'CANCELLED') {
            booking.inventoryItems.forEach(item => {
              const name = item.inventory.name;
              if (!inventoryBookingCounts[name]) {
                inventoryBookingCounts[name] = { name, bookings: 0 };
              }
              inventoryBookingCounts[name].bookings += 1;
            });
          }
        });
        
        const topInventory = Object.values(inventoryBookingCounts)
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 5);

        // Get top customers by total spent
        const topCustomers = [...customersArray]
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5);

        // Calculate dashboard metrics
        const activeBookings = bookingsArray.filter((b: Booking) => b.status === 'CONFIRMED').length;
        const pendingBookings = bookingsArray.filter((b: Booking) => b.status === 'PENDING').length;

        // Get available and maintenance units
        const availableUnits = businessData.inventory?.filter((item: Inventory) => item.status === 'AVAILABLE').length || 0;
        const maintenanceUnits = businessData.inventory?.filter((item: Inventory) => item.status === 'MAINTENANCE').length || 0;

        setData({
          totalRevenue: monthlyRevenue,
          activeBookings,
          pendingBookings,
          totalCustomers: customersArray.length || 0,
          availableUnits,
          maintenanceUnits,
          todayBookings,
          upcomingBookings,
          recentBookings,
          monthlyRevenue,
          lastMonthRevenue,
          topInventory,
          bookingsByStatus,
          dailyRevenue,
          topCustomers
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
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return <div>Failed to load dashboard data</div>;
  }

  // Calculate revenue change percentage
  const revenueChangePercent = data.lastMonthRevenue === 0 
    ? 100 
    : Math.round(((data.monthlyRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100);
  
  const isRevenueUp = revenueChangePercent >= 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{formatCurrency(data.monthlyRevenue)}</div>
              {revenueChangePercent !== 0 && (
                <div className={`ml-2 flex items-center text-xs ${isRevenueUp ? 'text-green-500' : 'text-red-500'}`}>
                  {isRevenueUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(revenueChangePercent)}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              vs. last month ({formatCurrency(data.lastMonthRevenue)})
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
              Lifetime customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.availableUnits || 0}</div>
            <p className="text-xs text-muted-foreground">
              {data.maintenanceUnits || 0} in maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Trends</CardTitle>
            <Tabs defaultValue="week" className="w-[200px]" onValueChange={(value) => setTimeframe(value as 'week' | 'month')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            {timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'} revenue
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeframe === 'week' ? data.dailyRevenue.slice(-7) : data.dailyRevenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <RechartsTooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Status and Top Inventory */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Booking Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Distribution of bookings by status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Top Inventory</CardTitle>
            <CardDescription>Most booked items</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.topInventory}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <RechartsTooltip />
                <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings and Upcoming Bookings */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Today&apos;s Bookings</CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.todayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No bookings scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.todayBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{booking.customer?.name || 'Customer'}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.inventoryItems?.[0]?.inventory?.name || 'Item'}
                      </p>
                    </div>
                  </div>
                ))}
                {data.todayBookings.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
                  >
                    View {data.todayBookings.length - 3} more
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
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
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming bookings in the next 7 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{booking.customer?.name || 'Customer'}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(booking.eventDate), 'EEE, MMM d')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.inventoryItems?.[0]?.inventory?.name || 'Item'}
                      </p>
                    </div>
                  </div>
                ))}
                {data.upcomingBookings.length > 3 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
                  >
                    View {data.upcomingBookings.length - 3} more
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>By total spent</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => router.push(`/dashboard/${businessId}/customers`)}
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {data.topCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Users className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No customer data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.topCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(customer.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.bookingCount} bookings
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 