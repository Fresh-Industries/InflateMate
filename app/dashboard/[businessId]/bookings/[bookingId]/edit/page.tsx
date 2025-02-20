'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Booking {
  id: string;
  bounceHouseId: string;
  packageId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  participantCount: number;
  participantAge: string;
  specialInstructions: string;
  totalAmount: number;
}

export default function EditBookingPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const bookingId = params.bookingId as string;
  

  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Booking | null>(null);

  // Fetch booking details
  const { data: booking, isLoading, isError } = useQuery<Booking>({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}`);
      if (!res.ok) throw new Error('Failed to fetch booking details');
      return res.json();
    },
  });

  // Prefill form data when booking is fetched
  useEffect(() => {
    if (booking) {
      setFormData({
        ...booking,
        // Format dates and times for input fields
        eventDate: format(new Date(booking.eventDate), 'yyyy-MM-dd'),
        startTime: format(new Date(booking.startTime), 'HH:mm'),
        endTime: format(new Date(booking.endTime), 'HH:mm'),
      });
    }
  }, [booking]);

  // Mutation to update the booking
  const updateMutation = useMutation<unknown, Error, Booking>({
    mutationFn: async (updatedData: Booking) => {
      const res = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update booking");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      toast({
        title: "Success",
        description: "Booking updated successfully!",
      });
      router.push(`/dashboard/${businessId}/bookings/${bookingId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  const handleChange = (field: keyof Booking, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive py-8">
        Failed to load booking details.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={formData?.eventDate || ''}
                  onChange={(e) => handleChange("eventDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData?.startTime || ''}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData?.endTime || ''}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Event Type</Label>
                <Input
                  type="text"
                  value={formData?.eventType || ''}
                  onChange={(e) => handleChange("eventType", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input
                  type="number"
                  value={formData?.totalAmount || ''}
                  onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Event Address</Label>
              <Input
                type="text"
                value={formData?.eventAddress || ''}
                onChange={(e) => handleChange("eventAddress", e.target.value)}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    type="text"
                    value={formData?.eventCity || ''}
                    onChange={(e) => handleChange("eventCity", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    type="text"
                    value={formData?.eventState || ''}
                    onChange={(e) => handleChange("eventState", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    type="text"
                    value={formData?.eventZipCode || ''}
                    onChange={(e) => handleChange("eventZipCode", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <Label className="block">Customer Information</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    value={formData?.customer.name || ''}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData?.customer.email || ''}
                    onChange={(e) => handleChange("customerEmail", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    value={formData?.customer.phone || ''}
                    onChange={(e) => handleChange("customerPhone", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={formData?.specialInstructions || ''}
                onChange={(e) => handleChange("specialInstructions", e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
