"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { utcToLocal } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, Send, User, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Quote {
  id: string;
  status: string;
  amountTotal: number;
  amountSubtotal: number;
  amountTax: number;
  createdAt: string;
  expiresAt: string;
  pdfUrl: string;
  customer: {
    name: string;
    email: string;
  };
  booking: {
    id: string;
    eventDate: string; // ISO from DB
    eventDateString?: string; // normalized date-only from API
    eventTimeZone: string;
    startTime: string;
    endTime: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    specialInstructions?: string;
  };
}

interface Invoice {
  id: string;
  status: string;
  amountTotal?: number; // provided by API normalization
  amountDue: number;
  amountPaid: number;
  createdAt: string;
  dueAt?: string;
  hostedInvoiceUrl: string;
  pdfUrl: string;
  customer: {
    name: string;
    email: string;
  };
  booking: {
    id: string;
    eventDate: string; // ISO from DB
    eventDateString?: string; // normalized date-only from API
    eventTimeZone: string;
    startTime: string;
    endTime: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
  };
}

export default function InvoicesAndQuotes() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isQuoteDetailOpen, setIsQuoteDetailOpen] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [quotesRes, invoicesRes] = await Promise.all([
          fetch(`/api/businesses/${businessId}/quotes`),
          fetch(`/api/businesses/${businessId}/invoices`),
        ]);

        if (!quotesRes.ok || !invoicesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [quotesData, invoicesData] = await Promise.all([
          quotesRes.json(),
          invoicesRes.json(),
        ]);

        setQuotes(quotesData);
        setInvoices(invoicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: "bg-gray-100 text-gray-800",
      open: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      expired: "bg-orange-100 text-orange-800",
      paid: "bg-green-100 text-green-800",
      void: "bg-red-100 text-red-800",
      uncollectible: "bg-orange-100 text-orange-800",
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (isoOrDateOnly: string) => {
    // If already YYYY-MM-DD, avoid timezone shift
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDateOnly)) {
      const [y, m, d] = isoOrDateOnly.split('-').map(Number);
      return format(new Date(Date.UTC(y, m - 1, d)), "MMM d, yyyy");
    }
    return format(new Date(isoOrDateOnly), "MMM d, yyyy");
  };

  const formatTime = (utcIsoString: string, tz: string) => utcToLocal(new Date(utcIsoString), tz, 'h:mm a');

  const handleSendInvoice = async (quote: Quote) => {
    if (isSendingInvoice) return;
    setIsSendingInvoice(true);

    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings/${quote.booking.id}/send-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invoice');
      }

      toast({
        title: "Invoice Sent",
        description: `Invoice has been sent to ${quote.customer.email}`,
      });

      // Refresh the data
      const [quotesRes, invoicesRes] = await Promise.all([
        fetch(`/api/businesses/${businessId}/quotes`),
        fetch(`/api/businesses/${businessId}/invoices`),
      ]);

      if (quotesRes.ok && invoicesRes.ok) {
        const [quotesData, invoicesData] = await Promise.all([
          quotesRes.json(),
          invoicesRes.json(),
        ]);
        setQuotes(quotesData);
        setInvoices(invoicesData);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invoice",
        variant: "destructive",
      });
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const openQuoteDetail = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsQuoteDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quotes & Invoices</CardTitle>
          <CardDescription>Manage your quotes and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
            </TabsList>

            <TabsContent value="quotes">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{quote.customer.name}</span>
                          <span className="text-sm text-gray-500">{quote.customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{utcToLocal(new Date(quote.booking.startTime), quote.booking.eventTimeZone, 'MMM d, yyyy')}</span>
                          <span className="text-sm text-gray-500">
                            {formatTime(quote.booking.startTime, quote.booking.eventTimeZone)} - {formatTime(quote.booking.endTime, quote.booking.eventTimeZone)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(quote.amountTotal)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(quote.expiresAt)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openQuoteDetail(quote)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(quote.pdfUrl, "_blank")}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {quote.status === 'OPEN' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSendInvoice(quote)}
                            disabled={isSendingInvoice}
                            title="Send Invoice"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="invoices">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{invoice.customer.name}</span>
                          <span className="text-sm text-gray-500">{invoice.customer.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{utcToLocal(new Date(invoice.booking.startTime), invoice.booking.eventTimeZone, 'MMM d, yyyy')}</span>
                          <span className="text-sm text-gray-500">
                            {formatTime(invoice.booking.startTime, invoice.booking.eventTimeZone)} - {formatTime(invoice.booking.endTime, invoice.booking.eventTimeZone)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(Number(invoice.amountTotal ?? (invoice.amountPaid + invoice.amountDue)))}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(invoice.createdAt)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(invoice.hostedInvoiceUrl, "_blank")}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(invoice.pdfUrl, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quote Detail Dialog */}
      <Dialog open={isQuoteDetailOpen} onOpenChange={setIsQuoteDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
            <DialogDescription>
              Detailed information about this quote
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Name</span>
                    <p className="font-medium">{selectedQuote.customer.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium">{selectedQuote.customer.email}</p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" />
                  Event Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Date</span>
                    <p className="font-medium">{utcToLocal(new Date(selectedQuote.booking.startTime), selectedQuote.booking.eventTimeZone, 'MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Time</span>
                    <p className="font-medium">
                      {formatTime(selectedQuote.booking.startTime, selectedQuote.booking.eventTimeZone)} - {formatTime(selectedQuote.booking.endTime, selectedQuote.booking.eventTimeZone)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Location</span>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedQuote.booking.eventAddress}, {selectedQuote.booking.eventCity}, {selectedQuote.booking.eventState} {selectedQuote.booking.eventZipCode}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Participants</span>
                    <p className="font-medium">{selectedQuote.booking.participantCount}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge className={getStatusColor(selectedQuote.status)}>
                      {selectedQuote.status}
                    </Badge>
                  </div>
                </div>
                {selectedQuote.booking.specialInstructions && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-500">Special Instructions</span>
                    <p className="text-sm">{selectedQuote.booking.specialInstructions}</p>
                  </div>
                )}
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedQuote.amountSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(selectedQuote.amountTax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(selectedQuote.amountTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedQuote.pdfUrl, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedQuote.status === 'OPEN' && (
                  <Button
                    onClick={() => handleSendInvoice(selectedQuote)}
                    disabled={isSendingInvoice}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSendingInvoice ? "Sending..." : "Send Invoice"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
