'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import RefundModal from './RefundModal';
import PaymentDetails from './PaymentDetails';

// Type for payment
interface Payment {
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
}

// Type for pagination
interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Badge variant type
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | "success";

interface PaymentsListProps {
  businessId: string;
}

export default function PaymentsList({ businessId }: PaymentsListProps) {
  // State for payments
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  // Add these state variables in the PaymentsList component right after the refundModalOpen state
  const [paymentDetailsOpen, setPaymentDetailsOpen] = useState(false);
  const [stripePaymentIdToView, setStripePaymentIdToView] = useState<string | null>(null);
  const [businessHasStripeAccount, setBusinessHasStripeAccount] = useState(false);
  const [businessStripeAccountId, setBusinessStripeAccountId] = useState<string | null>(null);
  

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
        toast.error(data.error || "Failed to load payments");
      }
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  // Add this useEffect to check if the business has a Stripe account, right after the fetchPayments useEffect
  useEffect(() => {
    const checkBusinessStripeAccount = async () => {
      try {
        const response = await fetch(`/api/businesses/${businessId}`);
        const business = await response.json();
        
        if (business && business.stripeAccountId) {
          setBusinessHasStripeAccount(true);
          setBusinessStripeAccountId(business.stripeAccountId);
        }
      } catch {
        console.error("Error checking business Stripe account:");
      }
    };
    
    checkBusinessStripeAccount();
  }, [businessId]);

  // Add this function to handle viewing Stripe payment details, right after handleDateSelection
  const handleViewPaymentDetails = (payment: Payment) => {
    if (!payment.stripePaymentId) {
      toast.error("This payment doesn't have a Stripe payment ID");
      return;
    }
    
    setStripePaymentIdToView(payment.stripePaymentId);
    setPaymentDetailsOpen(true);
  };

  return (
    <>
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
      
      <Card className="mt-6">
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
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{payment.booking?.customer?.name}</div>
                      <div className="text-sm text-muted-foreground">{payment.booking?.customer?.email}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Math.abs(Number(payment.amount)))}
                    </TableCell>
                    <TableCell>
                      <PaymentTypeBadge type={payment.type} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
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
                            setRefundModalOpen(true);
                          }}
                        >
                          Refund
                        </Button>
                      )}
                      {payment.stripePaymentId && businessHasStripeAccount && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPaymentDetails(payment)}
                        >
                          View Details
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
      
      {/* Refund Modal */}
      <RefundModal
        open={refundModalOpen}
        onOpenChange={setRefundModalOpen}
        payment={selectedPayment}
        businessId={businessId}
        onRefundProcessed={() => {
          fetchPayments(pagination.page);
        }}
      />
      
      {/* Stripe Payment Details Modal */}
      <PaymentDetails
        businessId={businessId}
        stripeAccountId={businessStripeAccountId}
        paymentId={stripePaymentIdToView}
        isOpen={paymentDetailsOpen}
        onClose={() => setPaymentDetailsOpen(false)}
      />
    </>
  );
} 