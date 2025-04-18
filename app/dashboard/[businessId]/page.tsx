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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'WEATHER_HOLD';
  totalAmount: number;
  eventDate: string;
  startTime: string;
  endTime: string;
  customerId: string;
  createdAt?: string;
  customer?: {
    id: string;
    name: string;
  };
  bookingItems?: Array<{
    inventoryId: string;
    inventory?: {
      name: string;
    };
    quantity: number;
    price: number;
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

const chartColors = {
  primary: '#6366f1',
  secondary: '#22c55e',
  tertiary: '#f59e0b',
  quaternary: '#ec4899',
  background: '#f8fafc',
  text: '#64748b',
  grid: '#e2e8f0',
  gradient: ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0)']
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const businessId = params.businessId as string;
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');

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
        const businessData = await businessResponse.json();

        if (!businessResponse.ok) {
          throw new Error(businessData.error || 'Failed to fetch business data');
        }

        // Fetch bookings and inventory
        const [bookingsResponse, inventoryResponse] = await Promise.all([
          fetch(`/api/businesses/${businessId}/bookings?expand=customer,bookingItems`),
          fetch(`/api/businesses/${businessId}/inventory`)
        ]);

        const [bookingsData, inventoryData] = await Promise.all([
          bookingsResponse.json(),
          inventoryResponse.json()
        ]);

        if (!bookingsResponse.ok) {
          throw new Error(bookingsData.error || 'Failed to fetch bookings');
        }

        if (!inventoryResponse.ok) {
          throw new Error(inventoryData.error || 'Failed to fetch inventory');
        }

        // Fetch customers for all bookings in one request
        const customersResponse = await fetch(`/api/businesses/${businessId}/customers`);
        const customersData = await customersResponse.json();

        if (!customersResponse.ok) {
          throw new Error(customersData.error || 'Failed to fetch customers');
        }

        // Create inventory map for quick lookup
        const inventoryMap = new Map(
          inventoryData.map((item: Inventory) => [item.id, item])
        );

        // Check if bookingsData is an array
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : 
                            (bookingsData.data && Array.isArray(bookingsData.data)) ? bookingsData.data : [];

        // Add customer data to bookings
        const bookingsWithCustomers = bookingsArray.map((booking: Booking) => ({
          ...booking,
          customer: booking.customer || { name: 'Anonymous' },
          bookingItems: booking.bookingItems?.map(item => ({
            ...item,
            inventory: item.inventoryId ? inventoryMap.get(item.inventoryId) || { name: 'Unknown Item' } : { name: 'Unknown Item' }
          })) || []
        }));

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
        const todayBookings = bookingsWithCustomers.filter((booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          return isWithinInterval(bookingDate, { start: todayStart, end: todayEnd }) && 
                 booking.status !== 'CANCELLED';
        });

        // Get upcoming bookings (next 7 days, excluding today)
        const upcomingBookings = bookingsWithCustomers.filter((booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          return bookingDate > todayEnd && 
                 bookingDate <= nextWeekEnd && 
                 booking.status !== 'CANCELLED';
        });

        // Get recent bookings (last 10)
        const recentBookings = [...bookingsWithCustomers]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        // Calculate monthly revenue (current month)
        const monthlyRevenue = bookingsWithCustomers.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (isWithinInterval(bookingDate, { start: currentMonthStart, end: currentMonthEnd }) && 
              booking.status !== 'CANCELLED') {
            return acc + (booking.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate last month's revenue
        const lastMonthRevenue = bookingsWithCustomers.reduce((acc: number, booking: Booking) => {
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
          const dayRevenue = bookingsWithCustomers.reduce((acc: number, booking: Booking) => {
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
          { name: 'Confirmed', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'CONFIRMED').length },
          { name: 'Pending', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'PENDING').length },
          { name: 'Completed', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'COMPLETED').length },
          { name: 'Cancelled', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'CANCELLED').length },
          { name: 'No Show', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'NO_SHOW').length },
          { name: 'Weather Hold', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'WEATHER_HOLD').length }
        ].filter(item => item.value > 0);

        // Calculate top inventory items by booking count
        const inventoryBookingCounts: Record<string, { name: string, bookings: number }> = {};
        
        console.log('Bookings data:', bookingsWithCustomers);
        
        bookingsWithCustomers.forEach((booking: Booking) => {
          console.log('Processing booking:', booking.id, 'Booking items:', booking.bookingItems?.[0]);
          if (booking.bookingItems && booking.status !== 'CANCELLED') {
            booking.bookingItems.forEach((item: { inventory?: { name: string } }) => {
              console.log('Processing item:', item);
              const name = item.inventory?.name || 'Unknown Item';
              if (!inventoryBookingCounts[name]) {
                inventoryBookingCounts[name] = { name, bookings: 0 };
              }
              inventoryBookingCounts[name].bookings += 1;
            });
          }
        });
        
        console.log('Final inventory counts:', inventoryBookingCounts);
        
        const topInventory = Object.values(inventoryBookingCounts)
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 5);

        console.log('Top inventory:', topInventory);

        // Get top customers by total spent
        const topCustomers = [...customersData]
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5);

        // Calculate dashboard metrics
        const activeBookings = bookingsWithCustomers.filter((b: Booking) => b.status === 'CONFIRMED').length;
        const pendingBookings = bookingsWithCustomers.filter((b: Booking) => b.status === 'PENDING').length;

        // Get available and maintenance units
        const availableUnits = businessData.inventory?.filter((item: Inventory) => item.status === 'AVAILABLE').length || 0;
        const maintenanceUnits = businessData.inventory?.filter((item: Inventory) => item.status === 'MAINTENANCE').length || 0;

        setData({
          totalRevenue: monthlyRevenue,
          activeBookings,
          pendingBookings,
          totalCustomers: customersData.length || 0,
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Overview</h1>
          <p className="text-base text-muted-foreground mt-1">
            Get a quick glance at your business performance and key metrics.
          </p>
        </div>
        {/* Date button as direct child of flex container */}
        <Button variant="outline" className="bg-white shadow-sm border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {format(new Date(), 'MMM dd, yyyy')}
        </Button>
      </div>
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
    <div className="p-8 bg-[#fafbff] min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Overview</h1>
          <p className="text-base text-muted-foreground mt-1">
            Get a quick glance at your business performance and key metrics.
          </p>
        </div>
        {/* Date button as direct child of flex container */}
        <Button variant="outline" className="bg-white shadow-sm border-gray-200 hover:bg-gray-50 w-full sm:w-auto">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {format(new Date(), 'MMM dd, yyyy')}
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 mt-8">
        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-[#1a1f36]">{formatCurrency(data.monthlyRevenue)}</div>
              {revenueChangePercent !== 0 && (
                <div className={cn(
                  "ml-2 flex items-center text-xs px-2 py-1 rounded-full",
                  isRevenueUp ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                )}>
                  {isRevenueUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(revenueChangePercent)}%
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              vs. last month ({formatCurrency(data.lastMonthRevenue)})
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Bookings</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1a1f36]">{data.activeBookings || 0}</div>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2" />
              <p className="text-sm text-gray-500">
                {data.pendingBookings || 0} pending approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1a1f36]">{data.totalCustomers || 0}</div>
            <p className="text-sm text-gray-500 mt-1">
              Lifetime customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inventory Status</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
              <Package className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1a1f36]">{data.availableUnits || 0}</div>
            <p className="text-sm text-gray-500 mt-1">
              {data.maintenanceUnits || 0} in maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-full bg-white rounded-xl shadow-sm border-none mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-[#1a1f36]">Revenue Trends</CardTitle>
              <CardDescription className="text-gray-500">
                {timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'} revenue
              </CardDescription>
            </div>
            <Tabs 
              defaultValue="week" 
              className="w-[200px]"
              onValueChange={(value) => setTimeframe(value as 'week' | 'month')}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="week"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary"
                >
                  Month
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timeframe === 'week' ? data.dailyRevenue.slice(-7) : data.dailyRevenue}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.2}/>
                  <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={chartColors.grid} 
                vertical={false}
                opacity={0.3}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 12, dy: 10 }}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: chartColors.text, fontSize: 12 }}
                tickMargin={10}
              />
              <RechartsTooltip
                cursor={{ stroke: chartColors.primary, strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }) => {
                  if (active && payload?.[0]?.value !== undefined) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={chartColors.primary}
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: 'white',
                  stroke: chartColors.primary,
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Booking Status Chart */}
        <Card className="bg-white rounded-xl shadow-sm border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#1a1f36]">Booking Status</CardTitle>
            <CardDescription className="text-gray-500">Distribution of bookings</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={data.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.bookingsByStatus.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[
                        '#6366f1',
                        '#22c55e',
                        '#f59e0b',
                        '#ec4899',
                        '#8b5cf6',
                        '#06b6d4'
                      ][index % 6]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                          <p className="text-sm text-gray-600">{payload[0].name}</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {payload[0].value} bookings
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Inventory */}
        <Card className="bg-white rounded-xl shadow-sm border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#1a1f36]">Top Inventory</CardTitle>
            <CardDescription className="text-gray-500">Most booked items</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topInventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Package className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No inventory data available</p>
                <p className="text-sm text-gray-400">Start adding items to track their performance</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.topInventory.map((item, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          index === 0 ? "bg-blue-100 text-blue-600" :
                          index === 1 ? "bg-purple-100 text-purple-600" :
                          index === 2 ? "bg-pink-100 text-pink-600" :
                          index === 3 ? "bg-orange-100 text-orange-600" :
                          "bg-green-100 text-green-600"
                        )}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          index === 0 ? "bg-blue-50 text-blue-700" :
                          index === 1 ? "bg-purple-50 text-purple-700" :
                          index === 2 ? "bg-pink-50 text-pink-700" :
                          index === 3 ? "bg-orange-50 text-orange-700" :
                          "bg-green-50 text-green-700"
                        )}>
                          #{index + 1} Most Booked
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          index === 0 ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                          index === 1 ? "bg-gradient-to-r from-purple-500 to-purple-600" :
                          index === 2 ? "bg-gradient-to-r from-pink-500 to-pink-600" :
                          index === 3 ? "bg-gradient-to-r from-orange-500 to-orange-600" :
                          "bg-gradient-to-r from-green-500 to-green-600"
                        )}
                        style={{ 
                          width: `${(item.bookings / Math.max(...data.topInventory.map(i => i.bookings))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {data.topInventory.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
              >
                View All Inventory
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings and Upcoming Bookings */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Bookings */}
        <Card className="bg-white rounded-xl shadow-sm border-none">
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
                        {booking.bookingItems?.[0]?.inventory?.name || 'Item'}
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
        <Card className="bg-white rounded-xl shadow-sm border-none">
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
                      <p className="font-medium text-[#1a1f36]">{booking.customer?.name || 'Anonymous'}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(booking.eventDate), 'EEE, MMM d')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1a1f36]">{formatCurrency(booking.totalAmount)}</p>
                      <p className="text-xs text-gray-500">
                        {booking.bookingItems?.[0]?.inventory?.name || 'Item'}
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
      <Card className="bg-white rounded-xl shadow-sm border-none">
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