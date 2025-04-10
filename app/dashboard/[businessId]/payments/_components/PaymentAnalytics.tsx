'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, TrendingUp, CalendarIcon, Hash, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from "@/components/ui/calendar";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts';
import colors from 'tailwindcss/colors';

// Analytics interface
interface Analytics {
  summary: {
    totalRevenue: number;
    totalRefunds: number;
    netRevenue: number;
    totalCompletedTransactions: number;
    totalRefundedTransactions: number;
    totalBookings: number;
    period: string;
    startDate?: string | null;
    endDate?: string | null;
  };
  statusCounts: {
    COMPLETED: number;
    PENDING: number;
    FAILED: number;
    REFUNDED: number;
  };
  typeData: {
    DEPOSIT: { count: number; amount: number };
    FULL_PAYMENT: { count: number; amount: number };
    REFUND: { count: number; amount: number };
  };
  monthlyData: Array<{
    month: string;
    year: number;
    revenue: number;
    refunds: number;
    netRevenue: number;
    transactionCount: number;
  }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug?: any; // Explicitly allow 'any' for debug field
}

// Updated Analytics interface
interface MonthlyDataInputItem {
  month: string;
  year: number;
  revenue: number;
  refunds: number;
  netRevenue: number;
  transactionCount: number;
}

// Default empty state matching the interface
const defaultAnalytics: Analytics = {
  summary: {
    totalRevenue: 0,
    totalRefunds: 0,
    netRevenue: 0,
    totalCompletedTransactions: 0,
    totalRefundedTransactions: 0,
    totalBookings: 0,
    period: 'month',
    startDate: null,
    endDate: null,
  },
  statusCounts: { COMPLETED: 0, PENDING: 0, FAILED: 0, REFUNDED: 0 },
  typeData: {
    DEPOSIT: { count: 0, amount: 0 },
    FULL_PAYMENT: { count: 0, amount: 0 },
    REFUND: { count: 0, amount: 0 },
  },
  monthlyData: [],
};

interface PaymentAnalyticsProps {
  businessId: string;
}

// Utility Functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatCompactNumber = (num: number) => {
   if (Math.abs(num) < 1000) {
     return num.toString();
   }
   return new Intl.NumberFormat('en-US', {
     notation: "compact",
     compactDisplay: "short"
   }).format(num);
 };

export default function PaymentAnalytics({ businessId }: PaymentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const fetchAnalytics = async (period: string, range?: DateRange) => {
    setIsLoading(true);
    let url = `/api/businesses/${businessId}/payments/analytics?period=${period}`;
    
    if (period === 'custom' && range?.from && range?.to) {
      const startDate = startOfDay(range.from).toISOString();
      const endDate = endOfDay(range.to).toISOString();
      url += `&startDate=${startDate}&endDate=${endDate}`;
    } else if (period === 'custom' && !(range?.from && range?.to)) {
       toast({ title: "Custom Range", description: "Please select both a start and end date.", variant: "default"});
       setIsLoading(false);
       setAnalytics(null);
       return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData?.error || `Failed to load analytics (${response.status})`;
          throw new Error(errorMessage);
      }
      
      const data = await response.json();
      if (!data || typeof data !== "object") {
         throw new Error("Received invalid analytics data format.");
      }

      console.log("Analytics response:", data);

      const formattedData: Analytics = {
        summary: {
          totalRevenue: data.summary?.totalRevenue || 0,
          totalRefunds: data.summary?.totalRefunds || 0,
          netRevenue: data.summary?.netRevenue || 0,
          totalCompletedTransactions: data.summary?.totalCompletedTransactions || 0,
          totalRefundedTransactions: data.summary?.totalRefundedTransactions || 0,
          totalBookings: data.summary?.totalBookings || 0,
          period: data.summary?.period || period,
          startDate: data.summary?.startDate || (range?.from ? range.from.toISOString() : null),
          endDate: data.summary?.endDate || (range?.to ? range.to.toISOString() : null),
        },
        statusCounts: data.statusCounts || { COMPLETED: 0, PENDING: 0, FAILED: 0, REFUNDED: 0 },
        typeData: data.typeData || {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 },
        },
        monthlyData: data.monthlyData?.map((d: MonthlyDataInputItem) => ({
           month: d.month || 'N/A',
           year: d.year || 0,
           revenue: d.revenue || 0,
           refunds: Math.abs(d.refunds || 0),
           netRevenue: d.netRevenue || 0,
           transactionCount: d.transactionCount || 0,
         })) || [],
        debug: data.debug,
      };

      setAnalytics(formattedData);
    } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "An unknown error occurred while fetching analytics.";
       console.error("Error fetching analytics:", message);
       toast({ title: "Error", description: message, variant: "destructive" });
       setAnalytics(defaultAnalytics);
    } finally {
      setIsLoading(false);
    }
  };

  const avgPaymentValue = analytics && analytics.summary.totalCompletedTransactions > 0
    ? analytics.summary.totalRevenue / analytics.summary.totalCompletedTransactions
    : 0;

  const refundRate = analytics && analytics.summary.totalCompletedTransactions > 0
    ? (analytics.summary.totalRefundedTransactions / analytics.summary.totalCompletedTransactions) * 100
    : 0;

  const chartData = analytics?.monthlyData.map(item => ({
    name: `${item.month} ${item.year}`,
    "Total Revenue": item.revenue,
    "Net Revenue": item.netRevenue,
    "Transactions": item.transactionCount,
  })) || [];

  useEffect(() => {
    fetchAnalytics(analyticsPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  useEffect(() => {
    if (analyticsPeriod !== 'custom' || (dateRange?.from && dateRange?.to)) {
      fetchAnalytics(analyticsPeriod, dateRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsPeriod, dateRange]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2.5 shadow-sm">
          <p className="mb-1.5 text-sm font-medium">{label}</p>
          {payload.map((entry) => (
            <div key={`item-${entry.name}`} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                  <span className="mr-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="ml-4 font-medium">
                  {entry.dataKey === 'Transactions' ? formatCompactNumber(entry.value ?? 0) : formatCurrency(entry.value ?? 0)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
         {[...Array(4)].map((_, i) => (
           <Card key={i}>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <Skeleton className="h-4 w-2/3" />
               <Skeleton className="h-4 w-4" />
             </CardHeader>
             <CardContent>
               <Skeleton className="h-7 w-1/2 mb-1" />
               <Skeleton className="h-3 w-1/3" />
             </CardContent>
           </Card>
         ))}
       </div>

       <Card>
          <CardHeader>
             <Skeleton className="h-5 w-1/4 mb-1" />
             <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="h-[400px] w-full">
             <Skeleton className="h-full w-full" />
          </CardContent>
       </Card>

        <Card>
           <CardHeader>
              <Skeleton className="h-5 w-1/3" />
           </CardHeader>
           <CardContent className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                   <Skeleton className="h-4 w-3/4 mb-1" />
                   <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
           </CardContent>
        </Card>
    </div>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Payment Analytics</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Select
            value={analyticsPeriod}
            onValueChange={(value) => {
              setAnalyticsPeriod(value);
              if (value !== 'custom') {
                setDateRange(undefined);
              }
            }}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {analyticsPeriod === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[260px] h-9 justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {analytics ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.summary.totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.summary.netRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Transactions</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCompactNumber(analytics.summary.totalCompletedTransactions)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Payment Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(avgPaymentValue)}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue & Volume Trend</CardTitle>
              <CardDescription>
                  Revenue and transaction volume over the selected period.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pr-4 pb-4">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                     dataKey="name" 
                     stroke="#888888" 
                     fontSize={12} 
                     tickLine={false} 
                     axisLine={false} 
                  />
                  <YAxis 
                     yAxisId="left" 
                     stroke="#888888" 
                     fontSize={12} 
                     tickLine={false} 
                     axisLine={false} 
                     tickFormatter={(value) => `$${formatCompactNumber(value)}`} 
                     label={{ value: 'Revenue (USD)', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle', fontSize: '12px', fill: colors.gray[500]}, offset: -2 }} 
                  />
                  <YAxis 
                     yAxisId="right" 
                     orientation="right" 
                     stroke="#888888" 
                     fontSize={12} 
                     tickLine={false} 
                     axisLine={false} 
                     tickFormatter={(value) => formatCompactNumber(value)} 
                     label={{ value: 'Transactions', angle: 90, position: 'insideRight', style: {textAnchor: 'middle', fontSize: '12px', fill: colors.gray[500]}, offset: 10 }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: colors.gray[100], radius: 4 }}/>
                  <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                  <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.blue[500]} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={colors.blue[500]} stopOpacity={0}/>
                      </linearGradient>
                  </defs>
                  <Area 
                     yAxisId="left" 
                     type="monotone" 
                     dataKey="Total Revenue" 
                     stroke={colors.blue[600]} 
                     fillOpacity={1} 
                     fill="url(#colorRevenue)" 
                     strokeWidth={2}
                     dot={false}
                  />
                  <Line 
                     yAxisId="left" 
                     type="monotone" 
                     dataKey="Net Revenue" 
                     stroke={colors.green[600]} 
                     strokeWidth={2}
                     dot={false}
                   />
                  <Bar 
                     yAxisId="right" 
                     dataKey="Transactions" 
                     fill={colors.amber[400]} 
                     radius={[4, 4, 0, 0]} 
                     barSize={15}
                   />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
              <CardHeader>
                 <CardTitle className="text-base font-semibold">Refund Analysis</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                 <div>
                    <p className="text-muted-foreground mb-1">Total Refund Amount</p>
                    <p className="font-semibold text-destructive text-lg">{formatCurrency(Math.abs(analytics.summary.totalRefunds))}</p>
                 </div>
                 <div>
                    <p className="text-muted-foreground mb-1">Refund Transactions</p>
                    <p className="font-semibold text-lg">{formatCompactNumber(analytics.summary.totalRefundedTransactions)}</p>
                 </div>
                 <div>
                    <p className="text-muted-foreground mb-1">Refund Rate</p>
                    <p className="font-semibold text-lg">{refundRate.toFixed(2)}%</p>
                 </div>
              </CardContent>
           </Card>

        </div>
      ) : ( 
         <div className="text-center text-muted-foreground py-16">
            <Info className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No Analytics Data Available</h3>
            <p className="text-sm">
               There is no payment data for the selected period {analyticsPeriod === 'custom' && !(dateRange?.from && dateRange?.to) ? "(Please select a start and end date)" : ""}.
            </p>
         </div>
      )}
    </div>
  );
} 