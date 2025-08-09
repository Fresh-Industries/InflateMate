// app/businesses/[businessId]/payments/_components/PaymentAnalytics.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CalendarIcon, DollarSign, Hash, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import colors from 'tailwindcss/colors';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  statusCounts: Record<string, number>;
  typeData: Record<string, { count: number; amount: number }>;
  monthlyData: Array<{
    month: string;
    year: number;
    revenue: number;
    refunds: number;
    netRevenue: number;
    transactionCount: number;
  }>;
}

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

const periods = [
  { value: 'day',   label: 'Today' },
  { value: 'week',  label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year',  label: 'Last Year' },
  { value: 'all',   label: 'All Time' },
  { value: 'custom',label: 'Custom Range' },
];

export default function PaymentAnalytics({ businessId }: { businessId: string }) {
  const [analytics, setAnalytics] = useState<Analytics>(defaultAnalytics);
  const [timeframe, setTimeframe] = useState<'day'|'week'|'month'|'year'|'all'|'custom'>('month');
  const [range, setRange] = useState<DateRange>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    let url = `/api/businesses/${businessId}/payments/analytics?period=${timeframe}`;
    if (timeframe === 'custom') {
      if (range?.from && range.to) {
        url += `&startDate=${startOfDay(range.from).toISOString()}`;
        url += `&endDate=${endOfDay(range.to).toISOString()}`;
      } else {
        toast.error('Please pick both dates');
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error((await res.json()).error || res.statusText);
      const data: Analytics = await res.json();
      data.summary.totalRefunds = Math.abs(data.summary.totalRefunds);
      setAnalytics(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [timeframe, range]);

  // Card definitions
  const cards = [
    {
      title: 'Total Revenue',
      value: analytics.summary.totalRevenue,
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      label: `Bookings: ${analytics.summary.totalBookings}`,
      color: 'blue',
      format: (v: number) => formatCurrency(v),
    },
    {
      title: 'Net Revenue',
      value: analytics.summary.netRevenue,
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      label: `Refunds: ${formatCurrency(analytics.summary.totalRefunds)}`,
      color: 'purple',
      format: (v: number) => formatCurrency(v),
    },
    {
      title: 'Transactions',
      value: analytics.summary.totalCompletedTransactions,
      icon: <Hash className="h-5 w-5 text-blue-500" />,
      label: `Refunded: ${analytics.summary.totalRefundedTransactions}`,
      color: 'blue',
      format: (v: number) => v.toLocaleString(),
    },
    {
      title: 'Avg. Payment',
      value: analytics.summary.totalCompletedTransactions
        ? analytics.summary.totalRevenue / analytics.summary.totalCompletedTransactions
        : 0,
      icon: <DollarSign className="h-5 w-5 text-purple-600" />,
      label: '',
      color: 'purple',
      format: (v: number) => formatCurrency(v),
    },
  ];

  const statusData = [
    { name: 'Completed', value: analytics.statusCounts.COMPLETED, color: colors.blue[500] },
    { name: 'Pending',   value: analytics.statusCounts.PENDING,   color: colors.purple[600] },
    { name: 'Failed',    value: analytics.statusCounts.FAILED,    color: colors.blue[500] },
    { name: 'Refunded',  value: analytics.statusCounts.REFUNDED,  color: colors.purple[600] },
  ];

  return (
    <div className="space-y-8 p-8 bg-[#fafbff] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Payment Analytics
          </h1>
          <p className="text-base text-muted-foreground mt-1">
            Select a period to view your payment metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={timeframe} onValueChange={v => { setTimeframe(v as 'day'|'week'|'month'|'year'|'all'|'custom'); if (v !== 'custom') setRange(undefined); }}>
            <SelectTrigger className="w-[150px] h-10 bg-white shadow-sm border-gray-200 hover:bg-gray-50">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {timeframe === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 px-4 bg-white shadow-sm border-gray-200 hover:bg-gray-50">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                  {range?.from 
                    ? range.to 
                      ? `${format(range.from,'LLL dd')}–${format(range.to,'LLL dd')}` 
                      : format(range.from,'LLL dd') 
                    : 'Select dates'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Stats cards */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white rounded-xl shadow-sm border-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Card key={i} className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{c.title}</CardTitle>
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  c.color === 'blue' ? 'bg-blue-50' : 'bg-purple-50' 
                )}>
                  {c.icon && <c.icon.type {...c.icon.props} className={cn(
                    "h-5 w-5",
                    c.color === 'blue' ? 'text-blue-500' : 'text-purple-600'
                  )} />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1a1f36]">{c.format(c.value)}</div>
                {c.label && <p className="text-sm text-gray-500 mt-1">{c.label}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Revenue & Transactions trend */}
      <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4">
          <div>
            <CardTitle className="text-xl font-semibold text-[#1a1f36]">Revenue & Volume Trend</CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Over the selected period
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={analytics.monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.5} />
              <XAxis 
                dataKey={d => `${d.month} ${d.year}`} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="left" 
                tickFormatter={v => `$${Math.round(v/1000)}k`} 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                        {payload.map((pld, idx) => {
                          const nameStr = typeof pld.name === 'string' ? pld.name : ''; 
                          const isRevenue = nameStr.toLowerCase().includes('revenue');
                          return (
                            <p key={idx} style={{ color: pld.color }} className="text-sm">
                              {pld.name}: {isRevenue ? formatCurrency(pld.value as number) : pld.value}
                            </p>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }} 
                cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: "4 4" }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ paddingBottom: '20px' }}
                formatter={(value) => (
                  <span className="text-sm text-gray-600 ml-1">{value}</span>
                )}
              />
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={'#6366f1'} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={'#6366f1'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Total Revenue"
                stroke={'#6366f1'}
                strokeWidth={2.5}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 6, fill: 'white', stroke: '#6366f1', strokeWidth: 2 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="netRevenue"
                name="Net Revenue"
                stroke={'#a855f7'}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, fill: 'white', stroke: '#a855f7', strokeWidth: 2 }}
              />
              <Bar
                yAxisId="right"
                dataKey="transactionCount"
                name="Transactions"
                barSize={12}
                fill={'#a855f7'}
                radius={[4,4,0,0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status distribution */}
      <Card className="bg-white rounded-xl shadow-sm border-none hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center pb-2">
          <PieIcon className="text-gray-600 mr-2 h-5 w-5" />
          <CardTitle className="text-xl font-semibold text-[#1a1f36]">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
                   const RADIAN = Math.PI / 180;
                   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                   const x = cx + (radius + 15) * Math.cos(-midAngle * RADIAN);
                   const y = cy + (radius + 15) * Math.sin(-midAngle * RADIAN);
                   return (
                     <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                       {`${name} (${(percent * 100).toFixed(0)}%)`}
                     </text>
                   );
                 }}
              >
                {statusData.map((entry, idx) => (
                  <Cell 
                    key={idx} 
                    fill={[
                      '#6366f1',
                      '#f59e0b',
                      '#ef4444',
                      '#a855f7'
                    ][idx % 4]} 
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-1">{payload[0].name}</p>
                        <p className="text-lg font-bold text-[#1a1f36]">{payload[0].value} Transactions</p>
                      </div>
                    );
                  }
                  return null;
                }}
                 cursor={{ fill: 'transparent' }}
              />
              <Legend 
                verticalAlign="middle"
                align="right"
                layout="vertical"
                iconType="circle" 
                iconSize={8}
                 wrapperStyle={{ paddingLeft: '20px' }}
                formatter={(value, entry) => (
                  <span className="text-sm text-gray-600 ml-2">{value} ({entry.payload?.value})</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
