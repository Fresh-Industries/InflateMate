'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';

// Define the structure of the waiver data based on the API response
interface Waiver {
  id: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
  documentUrl: string;
  createdAt: string; // Assuming ISO string format from API
  updatedAt: string; // Assuming ISO string format from API
  customer: {
    name: string;
    email: string;
  };
  booking: {
    eventDate: string; // Assuming ISO string format from API
  };
}

export default function DocumentsPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const [waivers, setWaivers] = useState<Waiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) return;

    const fetchWaivers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/businesses/${businessId}/waivers`);
        if (!response.ok) {
          throw new Error('Failed to fetch waivers');
        }
        const data = await response.json();
        setWaivers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaivers();
  }, [businessId]);

  const getStatusBadgeVariant = (status: Waiver['status']) => {
    switch (status) {
      case 'SIGNED':
        return 'success';
      case 'PENDING':
        return 'secondary';
      case 'REJECTED':
      case 'EXPIRED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Waiver Documents</CardTitle>
        <CardDescription>
          Manage and view signed waiver documents for your bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : waivers.length === 0 ? (
          <p className="text-center text-muted-foreground">No waivers found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Event Date</TableHead>
                <TableHead className="hidden md:table-cell">Signed/Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waivers.map((waiver) => (
                <TableRow key={waiver.id}>
                  <TableCell className="font-medium">{waiver.customer.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{waiver.customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(waiver.status)}>
                      {waiver.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(waiver.booking.eventDate), 'PP')}
                  </TableCell>
                   <TableCell className="hidden md:table-cell">
                    {format(new Date(waiver.status === 'SIGNED' ? waiver.updatedAt : waiver.createdAt), 'PPpp')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={waiver.documentUrl} target="_blank" rel="noopener noreferrer">
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
