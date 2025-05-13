"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
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
import { Download, Eye } from "lucide-react";

interface Quote {
  id: string;
  status: string;
  amountTotal: number;
  createdAt: string;
  expiresAt: string;
  hostedQuoteUrl: string;
  pdfUrl: string;
}

interface Invoice {
  id: string;
  status: string;
  amountTotal: number;
  createdAt: string;
  hostedInvoiceUrl: string;
  pdfUrl: string;
}

export default function InvoicesAndQuotes() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  <TableHead>Date</TableHead>
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
                      {format(new Date(quote.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{formatCurrency(quote.amountTotal)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.expiresAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(quote.hostedQuoteUrl, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(quote.pdfUrl, "_blank")}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {format(new Date(invoice.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{formatCurrency(invoice.amountTotal)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
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
  );
}
