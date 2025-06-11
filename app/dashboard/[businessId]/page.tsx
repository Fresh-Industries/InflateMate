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
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'HOLD';
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
  inventoryItems?: Array<{
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



const pieChartColors = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4'
];

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
          fetch(`/api/businesses/${businessId}/bookings`),
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
          inventoryItems: booking.inventoryItems?.map(item => ({
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
                 booking.status !== 'CANCELLED' && booking.status !== 'HOLD';
        });

        // Get upcoming bookings (next 7 days, excluding today)
        const upcomingBookings = bookingsWithCustomers.filter((booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          return bookingDate > todayEnd && 
                 bookingDate <= nextWeekEnd && 
                 booking.status !== 'CANCELLED' && booking.status !== 'HOLD';
        });

        // Get recent bookings (last 10)
        const recentBookings = [...bookingsWithCustomers]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        // Calculate monthly revenue (current month)
        const monthlyRevenue = bookingsWithCustomers.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (isWithinInterval(bookingDate, { start: currentMonthStart, end: currentMonthEnd }) && 
              booking.status !== 'CANCELLED' && booking.status !== 'HOLD') {
            return acc + (booking.totalAmount || 0);
          }
          return acc;
        }, 0);

        // Calculate last month's revenue
        const lastMonthRevenue = bookingsWithCustomers.reduce((acc: number, booking: Booking) => {
          const bookingDate = new Date(booking.eventDate);
          if (isWithinInterval(bookingDate, { start: lastMonthStart, end: lastMonthEnd }) && 
              booking.status !== 'CANCELLED' && booking.status !== 'HOLD') {
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
            if (isSameDay(bookingDate, day) && booking.status !== 'CANCELLED' && booking.status !== 'HOLD') {
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
          { name: 'Hold', value: bookingsWithCustomers.filter((b: Booking) => b.status === 'HOLD').length }
        ].filter(item => item.value > 0);

        // Calculate top inventory items by booking count
        const inventoryBookingCounts: Record<string, { name: string, bookings: number }> = {};
        
        console.log('Bookings data:', bookingsWithCustomers);
        
        bookingsWithCustomers.forEach((booking: Booking) => {
          console.log('Processing booking:', booking.id, 'Booking items:', booking.inventoryItems?.[0]);
          if (booking.inventoryItems && booking.status !== 'CANCELLED' && booking.status !== 'HOLD') {
            booking.inventoryItems.forEach((item: { inventory?: { name: string } }) => {
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
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Overview</h1>
            <p className="text-base text-muted-foreground mt-1">
              Get a quick glance at your business performance and key metrics.
            </p>
          </div>
          <Button variant="outline" className="bg-white shadow-sm border-border hover:bg-muted/50 w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {format(new Date(), 'MMM dd, yyyy')}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden border-none shadow-md animate-pulse">
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
        <Card className="overflow-hidden border-none shadow-md">
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
    <div className="p-6 md:p-8  min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Overview
          </h1>
          <p className="text-base text-muted-foreground mt-1 max-w-2xl">
            Get a quick glance at your business performance and key metrics for InflateMate.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="bg-card shadow-sm border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 w-full sm:w-auto group"
          >
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            {format(new Date(), 'MMM dd, yyyy')}
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8 mt-6 md:mt-8">
        <Card className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold text-foreground">{formatCurrency(data.monthlyRevenue)}</div>
              {revenueChangePercent !== 0 && (
                <div className={cn(
                  "ml-2 flex items-center text-xs px-2 py-1 rounded-full transition-transform group-hover:scale-105",
                  isRevenueUp ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                )}>
                  {isRevenueUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(revenueChangePercent)}%
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              vs. last month ({formatCurrency(data.lastMonthRevenue)})
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.activeBookings || 0}</div>
            <div className="flex items-center mt-1">
              <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2" />
              <p className="text-sm text-muted-foreground">
                {data.pendingBookings || 0} pending approval
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.totalCustomers || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Lifetime customers
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-none relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Status</CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{data.availableUnits || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.maintenanceUnits || 0} in maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-full bg-card rounded-xl overflow-hidden shadow-md border-none mb-6 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Revenue Trends</CardTitle>
              <CardDescription className="text-muted-foreground">
                {timeframe === 'week' ? 'Last 7 days' : 'Last 30 days'} revenue
              </CardDescription>
            </div>
            <Tabs 
              defaultValue="week" 
              className="w-[200px]"
              onValueChange={(value) => setTimeframe(value as 'week' | 'month')}
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/30 p-1 rounded-lg">
                <TabsTrigger 
                  value="week"
                  className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-medium"
                >
                  Week
                </TabsTrigger>
                <TabsTrigger 
                  value="month"
                  className="rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-medium"
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
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                vertical={false}
                opacity={0.3}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, dy: 10 }}
                tickMargin={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickMargin={10}
              />
              <RechartsTooltip
                cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={({ active, payload, label }) => {
                  if (active && payload?.[0]?.value !== undefined) {
                    return (
                      <div className="bg-card p-3 rounded-lg shadow-lg border border-border/50">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-lg font-semibold text-foreground">
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
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: 'white',
                  stroke: "hsl(var(--primary))",
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Booking Status Chart */}
        <Card className="bg-card rounded-xl overflow-hidden shadow-md border-none hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Booking Status</CardTitle>
            <CardDescription className="text-muted-foreground">Distribution of bookings</CardDescription>
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
                      fill={pieChartColors[index % pieChartColors.length]}
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
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card p-3 rounded-lg shadow-lg border border-border/50">
                          <p className="text-sm text-muted-foreground">{payload[0].name}</p>
                          <p className="text-lg font-semibold text-foreground">
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
        <Card className="bg-card rounded-xl overflow-hidden shadow-md border-none hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Top Inventory</CardTitle>
            <CardDescription className="text-muted-foreground">Most booked items</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topInventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-center">
                <Package className="h-12 w-12 text-muted mb-3" />
                <p className="text-muted-foreground font-medium">No inventory data available</p>
                <p className="text-sm text-muted-foreground/70">Start adding items to track their performance</p>
              </div>
            ) : (
              <div className="space-y-5">
                {data.topInventory.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                          index === 0 ? "bg-primary/20 text-primary" :
                          index === 1 ? "bg-accent/20 text-accent" :
                          index === 2 ? "bg-pink-100 text-pink-600" :
                          index === 3 ? "bg-orange-100 text-orange-600" :
                          "bg-green-100 text-green-600"
                        )}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.bookings} bookings</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 group-hover:shadow-sm",
                          index === 0 ? "bg-primary/10 text-primary group-hover:bg-primary/20" :
                          index === 1 ? "bg-accent/10 text-accent group-hover:bg-accent/20" :
                          index === 2 ? "bg-pink-50 text-pink-700 group-hover:bg-pink-100" :
                          index === 3 ? "bg-orange-50 text-orange-700 group-hover:bg-orange-100" :
                          "bg-green-50 text-green-700 group-hover:bg-green-100"
                        )}>
                          #{index + 1} Most Booked
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500 ease-out origin-left",
                          index === 0 ? "bg-gradient-to-r from-primary/80 to-primary" :
                          index === 1 ? "bg-gradient-to-r from-accent/80 to-accent" :
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
                className="w-full mt-6 text-primary hover:text-primary hover:bg-primary/10 transition-all font-medium"
                onClick={() => router.push(`/dashboard/${businessId}/inventory`)}
              >
                View All Inventory
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings and Upcoming Bookings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's Bookings */}
        <Card className="bg-card rounded-xl overflow-hidden shadow-md border-none hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Today&apos;s Bookings</CardTitle>
              <CardDescription className="text-muted-foreground">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 hover:bg-primary/10 hover:text-primary transition-all"
              onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.todayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/5 rounded-lg border border-dashed border-muted">
                <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">No bookings scheduled for today</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Your schedule is clear</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.todayBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b border-border/40 pb-3 group hover:bg-muted/5 p-2 rounded-md transition-colors">
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{booking.customer?.name || 'Customer'}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(booking.totalAmount)}</p>
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
                    className="w-full text-primary hover:bg-primary/10 hover:text-primary font-medium"
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
        <Card className="bg-card rounded-xl overflow-hidden shadow-md border-none hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Upcoming Bookings</CardTitle>
              <CardDescription className="text-muted-foreground">Next 7 days</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 hover:bg-primary/10 hover:text-primary transition-all"
              onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
            >
              <span>View All</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {data.upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/5 rounded-lg border border-dashed border-muted">
                <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-muted-foreground font-medium">No upcoming bookings</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Your week ahead is clear</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.upcomingBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between border-b border-border/40 pb-3 group hover:bg-muted/5 p-2 rounded-md transition-colors">
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{booking.customer?.name || 'Anonymous'}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(booking.eventDate), 'EEE, MMM d')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(booking.totalAmount)}</p>
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
                    className="w-full text-primary hover:bg-primary/10 hover:text-primary font-medium"
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
      <Card className="bg-card rounded-xl overflow-hidden shadow-md border-none hover:shadow-lg transition-all duration-300 mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Top Customers</CardTitle>
            <CardDescription className="text-muted-foreground">By total spent</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => router.push(`/dashboard/${businessId}/customers`)}
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {data.topCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/5 rounded-lg border border-dashed border-muted">
              <Users className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground font-medium">No customer data available</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Start adding customers to see top spenders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between border-b border-border/40 pb-3 group hover:bg-muted/5 p-2 rounded-md transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-medium",
                      index === 0 ? "bg-gradient-to-br from-primary to-accent" :
                      index === 1 ? "bg-gradient-to-br from-accent to-purple-500" :
                      "bg-gradient-to-br from-muted-foreground to-muted"
                    )}>
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{formatCurrency(customer.totalSpent)}</p>
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
