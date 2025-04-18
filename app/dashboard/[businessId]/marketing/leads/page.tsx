"use client";

import { useState, useEffect, use } from 'react';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

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

export default function LeadsPage(props: { params: Promise<{ businessId: string }> }) {
  const params = use(props.params);
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
             <Link href={`/dashboard/${params.businessId}/marketing`} passHref>
               <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Marketing</span>
                </Button>
             </Link>
             <div>
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leads</h1>
               <p className="text-base text-gray-500 mt-1">
                 View and manage leads captured from your sales funnels.
               </p>
             </div>
          </div>
        </div>

        <Card className="rounded-xl border border-gray-100 bg-white shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="text-lg font-semibold text-gray-800">Captured Leads</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              A list of potential customers interested in your services.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="text-center py-16 px-6">
                <p className="text-red-600 font-medium">Error loading leads: {error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">Name</TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</TableHead>
                      <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Captured</TableHead>
                      <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {data && data.length > 0 ? (
                      data.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{lead.name}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 lowercase">{lead.email}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lead.phone ? lead.phone : <span className="italic text-gray-400">Not provided</span>}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(lead.createdAt)}</TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-gray-700 uppercase">Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => navigator.clipboard.writeText(lead.email)}
                                >
                                  Copy Email
                                </DropdownMenuItem>
                                {lead.phone && (
                                  <DropdownMenuItem
                                    className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => navigator.clipboard.writeText(lead.phone!)}
                                  >
                                    Copy Phone
                                  </DropdownMenuItem>
                                )}
                                
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="px-6 py-16 text-center text-sm text-gray-500">
                          No leads found. Looks like a great time to start a new campaign!
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
    </div>
  );
} 