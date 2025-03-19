'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, RefreshCw, TrendingUp, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Badge variant type
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success";

// Types for payments
interface Payment {
  id: string;
  amount: number;
  type: "DEPOSIT" | "FULL_PAYMENT" | "REFUND";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
}

// Analytics interface
interface Analytics {
  summary: {
    totalRevenue: number;
    totalRefunds: number;
    netRevenue: number;
    totalBookings: number;
    period: string;
    startDate?: string;
    endDate?: string;
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
  }>;
}

interface PaymentAnalyticsProps {
  businessId: string;
}

export default function PaymentAnalytics({ businessId }: PaymentAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });
  const { toast } = useToast();

  // Function to fetch analytics data
  const fetchAnalytics = async (period: string, startDate?: string, endDate?: string) => {
    setIsLoading(true);
    try {
      let url = `/api/businesses/${businessId}/payments/analytics?period=${period}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (!response.ok || !data || typeof data !== "object") {
        const errorMessage = (data && data.error) || "Failed to load analytics";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }
  
      console.log("Analytics response:", data);
  
      // Format the analytics data to ensure all properties are defined
      const formattedData: Analytics = {
        summary: {
          totalRevenue: data.summary?.totalRevenue || 0,
          totalRefunds: data.summary?.totalRefunds || 0,
          netRevenue: data.summary?.netRevenue || 0,
          totalBookings: data.summary?.totalBookings || 0,
          period: data.summary?.period || period,
          startDate: data.summary?.startDate || startDate || "",
          endDate: data.summary?.endDate || endDate || "",
        },
        statusCounts: data.statusCounts || {
          COMPLETED: 0,
          PENDING: 0,
          FAILED: 0,
          REFUNDED: 0,
        },
        typeData: data.typeData || {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 },
        },
        monthlyData: data.monthlyData || [],
      };
  
      setAnalytics(formattedData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics.",
        variant: "destructive",
      });
      // Set default empty analytics to prevent UI errors
      setAnalytics({
        summary: {
          totalRevenue: 0,
          totalRefunds: 0,
          netRevenue: 0,
          totalBookings: 0,
          period,
          startDate: startDate || "",
          endDate: endDate || "",
        },
        statusCounts: {
          COMPLETED: 0,
          PENDING: 0,
          FAILED: 0,
          REFUNDED: 0,
        },
        typeData: {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 },
        },
        monthlyData: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Payment status badge
  const PaymentStatusBadge = ({ status }: { status: Payment['status'] }) => {
    const variants: Record<Payment['status'], { variant: BadgeVariant, label: string }> = {
      COMPLETED: { variant: "success", label: "Completed" },
      PENDING: { variant: "secondary", label: "Pending" },
      FAILED: { variant: "destructive", label: "Failed" },
      REFUNDED: { variant: "outline", label: "Refunded" },
    };
    
    const { variant, label } = variants[status];
    
    return (
      <Badge variant={variant}>{label}</Badge>
    );
  };

  // Payment type badge
  const PaymentTypeBadge = ({ type }: { type: Payment['type'] }) => {
    const variants: Record<Payment['type'], { variant: "default" | "outline" | "secondary", label: string }> = {
      DEPOSIT: { variant: "secondary", label: "Deposit" },
      FULL_PAYMENT: { variant: "default", label: "Full Payment" },
      REFUND: { variant: "outline", label: "Refund" },
    };
    
    const { variant, label } = variants[type];
    
    return (
      <Badge variant={variant}>{label}</Badge>
    );
  };

  // Initial load
  useEffect(() => {
    fetchAnalytics(analyticsPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // When analytics period changes
  useEffect(() => {
    fetchAnalytics(analyticsPeriod, filters.startDate, filters.endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsPeriod]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Analytics</h2>
        <Select 
          value={analyticsPeriod} 
          onValueChange={(value) => setAnalyticsPeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.summary?.totalRevenue || 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Refunds
                </CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {formatCurrency(Math.abs(analytics?.summary?.totalRefunds || 0))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analytics?.summary?.netRevenue || 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.summary?.totalBookings || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Distribution of payments by status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(analytics?.statusCounts || {}).map(([status, count]) => (
                      <TableRow key={status}>
                        <TableCell>
                          <PaymentStatusBadge status={status as Payment['status']} />
                        </TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Types</CardTitle>
                <CardDescription>Distribution of payments by type</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(analytics?.typeData || {}).map(([type, data]) => (
                      <TableRow key={type}>
                        <TableCell>
                          <PaymentTypeBadge type={type as Payment['type']} />
                        </TableCell>
                        <TableCell className="text-right">{data.count}</TableCell>
                        <TableCell className="text-right">{formatCurrency(Math.abs(data.amount))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue trends over the past months</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Refunds</TableHead>
                    <TableHead className="text-right">Net Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics?.monthlyData?.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${month.month} ${month.year}`}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(month.revenue)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {formatCurrency(Math.abs(month.refunds))}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(month.netRevenue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 