"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the shape of our data based on the API response
// This matches the `select` statement in the GET route
export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null; // Phone might be null or empty string based on route logic
  createdAt: string; // Dates usually come as strings
};

// Helper to format date strings (moved here from columns.tsx)
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export default function LeadsPage({ params }: { params: { businessId: string } }) {
  const [data, setData] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Use the GET route defined in app/api/businesses/[businessId]/customers/leads/route.ts
        const response = await fetch(`/api/businesses/${params.businessId}/customers/leads`);
        if (!response.ok) {
          throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        const result = await response.json();
        setData(result || []); // The API returns the array directly
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.businessId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
        <p className="text-muted-foreground">
          View and manage leads captured from your sales funnels.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Captured Leads</CardTitle>
          <CardDescription>
            A list of potential customers interested in your services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              <p>Error loading leads: {error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData()}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date Captured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium capitalize">{lead.name}</TableCell>
                        <TableCell className="lowercase">{lead.email}</TableCell>
                        <TableCell>
                          {lead.phone ? lead.phone : <span className="text-muted-foreground italic">Not provided</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(lead.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(lead.email)}
                              >
                                Copy Email
                              </DropdownMenuItem>
                              {lead.phone && (
                                <DropdownMenuItem
                                  onClick={() => navigator.clipboard.writeText(lead.phone!)}
                                >
                                  Copy Phone
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem disabled>Convert to Customer (TBD)</DropdownMenuItem>
                              <DropdownMenuItem disabled className="text-destructive">
                                Delete Lead (TBD)
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No leads found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 