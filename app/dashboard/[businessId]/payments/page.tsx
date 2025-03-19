"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  DollarSign,
  RefreshCcw,
  TrendingUp,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Type definitions
type Payment = {
  id: string;
  amount: number;
  type: "DEPOSIT" | "FULL_PAYMENT" | "REFUND";
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  paidAt: string | null;
  stripePaymentId: string | null;
  booking: {
    id: string;
    eventDate: string;
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
};

// Update the Analytics interface to make startDate and endDate optional
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

// Badge variant type
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success";

export default function PaymentsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const { toast } = useToast();
  
  // State for payments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // State for analytics
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("month");
  
  // State for filters
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    startDate: "",
    endDate: "",
  });
  
  // State for refund modal
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState("");
  const [isFullRefund, setIsFullRefund] = useState(true);
  const [refundProcessing, setRefundProcessing] = useState(false);

  // Load payments
  const fetchPayments = async (page = 1) => {
    setIsLoading(true);
    try {
      let url = `/api/businesses/${businessId}/payments?page=${page}&limit=${pagination.limit}`;
      
      if (filters.status && filters.status !== 'all') url += `&status=${filters.status}`;
      if (filters.type && filters.type !== 'all') url += `&type=${filters.type}`;
      if (filters.startDate) url += `&startDate=${filters.startDate}`;
      if (filters.endDate) url += `&endDate=${filters.endDate}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setPayments(data.data);
        setPagination(data.pagination);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to load payments",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch analytics data
  const fetchAnalytics = async (period: string, startDate?: string, endDate?: string) => {
    setIsLoading(true);
    try {
      let url = `/api/businesses/${businessId}/payments/analytics?period=${period}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
  
      const response = await fetch(url);
      const data = await response.json(); // Called only once
  
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
  
  

  // Process a refund
  const processRefund = async () => {
    if (!selectedPayment) return;
    
    setRefundProcessing(true);
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/payments/${selectedPayment.id}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullRefund: isFullRefund,
            amount: isFullRefund ? undefined : refundAmount,
            reason: refundReason,
          }),
        }
      );
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: "Refund processed",
          description: `Successfully refunded $${(data.refundAmount).toFixed(2)}`,
        });
        setRefundModalOpen(false);
        fetchPayments(pagination.page);
        fetchAnalytics(analyticsPeriod, filters.startDate, filters.endDate);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process refund",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setRefundProcessing(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchPayments(1);
  };

  // Handle date selection
  const handleDateSelection = (date: Date | undefined, field: 'startDate' | 'endDate') => {
    if (date) {
      handleFilterChange(field, date.toISOString());
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
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
    fetchPayments();
    fetchAnalytics(analyticsPeriod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // When analytics period changes
  useEffect(() => {
    fetchAnalytics(analyticsPeriod, filters.startDate, filters.endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsPeriod]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payments</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">All Payments</TabsTrigger>
        </TabsList>
        
        {/* Analytics Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
                    <RefreshCcw className="h-4 w-4 text-muted-foreground" />
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
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => handleFilterChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={filters.type} 
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="DEPOSIT">Deposit</SelectItem>
                      <SelectItem value="FULL_PAYMENT">Full Payment</SelectItem>
                      <SelectItem value="REFUND">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.startDate ? (
                          formatDate(filters.startDate)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.startDate ? new Date(filters.startDate) : undefined}
                        onSelect={(date) => handleDateSelection(date, 'startDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.endDate ? (
                          formatDate(filters.endDate)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.endDate ? new Date(filters.endDate) : undefined}
                        onSelect={(date) => handleDateSelection(date, 'endDate')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <Button 
                className="mt-4"
                onClick={applyFilters}
              >
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>All Payments</CardTitle>
              <CardDescription>
                Showing {pagination.total ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total}` : '0'} payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No payments found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{payment.booking?.customer?.name}</div>
                          <div className="text-sm text-muted-foreground">{payment.booking?.customer?.email}</div>
                        </TableCell>
                        <TableCell>
                          <PaymentTypeBadge type={payment.type} />
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(Math.abs(Number(payment.amount)))}
                        </TableCell>
                        <TableCell>
                          {formatDate(payment.createdAt)}
                        </TableCell>
                        <TableCell>
                          {payment.status === "COMPLETED" && 
                           payment.type !== "REFUND" &&
                           payment.type !== "DEPOSIT" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setRefundAmount(Number(payment.amount));
                                setIsFullRefund(true);
                                setRefundReason("");
                                setRefundModalOpen(true);
                              }}
                            >
                              Refund
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPayments(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchPayments(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Refund Dialog */}
      <AlertDialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Refund</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to process a refund for payment #{selectedPayment?.id.substring(0, 8)}
              {" "}for{" "}
              {selectedPayment ? formatCurrency(Number(selectedPayment.amount)) : "$0.00"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Refund Type</label>
              <Select 
                value={isFullRefund ? "full" : "partial"}
                onValueChange={(value) => setIsFullRefund(value === "full")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select refund type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Refund</SelectItem>
                  <SelectItem value="partial">Partial Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!isFullRefund && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Refund Amount</label>
                <Input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  min={0}
                  max={selectedPayment ? Number(selectedPayment.amount) : 0}
                  step={0.01}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason (optional)</label>
              <Input
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Reason for refund"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={refundProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                processRefund();
              }}
              disabled={refundProcessing}
            >
              {refundProcessing ? "Processing..." : "Process Refund"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
