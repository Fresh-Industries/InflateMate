'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Calendar, Clock, MapPin, User, Users, DollarSign, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  bounceHouse?: {
    id: string;
    name: string;
  };
}

export default function EditBookingPage() {
  const params = useParams();
  const businessId = params.businessId as string;
  const bookingId = params.bookingId as string;
  
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [formData, setFormData] = useState<Booking | null>(null);
  const [originalDate, setOriginalDate] = useState<string>('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch booking');
        }
        
        const bookingData = await response.json();
        console.log("Booking data:", bookingData);
        setDebugInfo(bookingData);
        
        // Ensure bounceHouseId is set
        if (!bookingData.bounceHouseId && bookingData.bounceHouse?.id) {
          console.log("Setting bounceHouseId from bounceHouse.id:", bookingData.bounceHouse.id);
          bookingData.bounceHouseId = bookingData.bounceHouse.id;
        } else if (!bookingData.bounceHouseId && bookingData.inventoryItems && bookingData.inventoryItems.length > 0) {
          console.log("Setting bounceHouseId from inventoryItems:", bookingData.inventoryItems[0].inventoryId);
          bookingData.bounceHouseId = bookingData.inventoryItems[0].inventoryId;
        }
        
        if (!bookingData.bounceHouseId) {
          console.error("WARNING: No bounceHouseId found in booking data!");
        } else {
          console.log("bounceHouseId set to:", bookingData.bounceHouseId);
        }
        
        // Format the date properly
        let formattedBooking = { ...bookingData };
        
        // Ensure eventDate is in YYYY-MM-DD format for the input
        if (bookingData.eventDate) {
          try {
            // Parse the date string to ensure we get the correct date regardless of time zone
            const dateStr = bookingData.eventDate;
            console.log("Original event date from API:", dateStr);
            
            // Handle ISO date string
            let date;
            if (typeof dateStr === 'string' && dateStr.includes('T')) {
              // This is an ISO date string, parse it directly
              date = new Date(dateStr);
            } else {
              // This might be just a date part, ensure we parse it correctly
              const parts = dateStr.split('-');
              if (parts.length === 3) {
                // Create a date at noon UTC to avoid time zone issues
                date = new Date(Date.UTC(
                  parseInt(parts[0]), // year
                  parseInt(parts[1]) - 1, // month (0-indexed)
                  parseInt(parts[2]), // day
                  12, 0, 0 // noon UTC
                ));
              } else {
                // Fallback to regular parsing
                date = new Date(dateStr);
              }
            }
            
            console.log("Parsed date object:", date);
            console.log("Date in ISO format:", date.toISOString());
            console.log("Local date string:", date.toLocaleDateString());
            
            // Format as YYYY-MM-DD for the input field
            formattedBooking.eventDate = format(date, 'yyyy-MM-dd');
            console.log("Formatted date for input:", formattedBooking.eventDate);
            
            setOriginalDate(formattedBooking.eventDate);
          } catch (error) {
            console.error("Error formatting date:", error);
          }
        }
        
        setFormData(formattedBooking);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setIsError(true);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch booking details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (businessId && bookingId) {
      fetchBooking();
    }
  }, [businessId, bookingId, toast]);

  // Check availability when date changes
  const checkAvailability = async (date: string, bounceHouseId: string) => {
    console.log(`Checking availability for date: ${date}, bounceHouseId: ${bounceHouseId}, bookingId: ${bookingId}`);
    
    // Ensure date is in YYYY-MM-DD format
    let formattedDate = date;
    if (date.includes('T')) {
      // If it's an ISO string, extract just the date part
      formattedDate = date.split('T')[0];
    }
    
    try {
      // Create URL with all required parameters
      const params = new URLSearchParams({
        date: formattedDate,
        startTime: "00:00", // Required by the API schema
        endTime: "23:59",   // Required by the API schema
        excludeBookingId: bookingId
      });
      
      const response = await fetch(
        `/api/businesses/${businessId}/availability?${params.toString()}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Availability check failed:", errorData);
        return { available: false, error: errorData.error || "Failed to check availability" };
      }
      
      const data = await response.json();
      console.log("Availability response:", data);
      
      // Check if the bounce house is in the available inventory
      const isAvailable = data.availableInventory.some(
        (item: any) => item.id === bounceHouseId
      );
      
      if (!isAvailable) {
        console.log(`Bounce house ${bounceHouseId} is not available on ${formattedDate}`);
        
        // Check if this is the same date as the original booking
        if (formattedDate === originalDate) {
          console.log("This is the original date, allowing edit despite availability check");
          return { available: true };
        }
        
        return { 
          available: false, 
          error: "This bounce house is not available on the selected date" 
        };
      }
      
      return { available: true };
    } catch (error) {
      console.error("Error checking availability:", error);
      return { available: false, error: "Failed to check availability" };
    }
  };

  const handleChange = (field: keyof Booking, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData) {
        toast({
          title: "Error",
          description: "No form data available. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Get the bounce house ID from the form data
      const bounceHouseId = formData.bounceHouse?.id || formData.bounceHouseId || 
        document.querySelector<HTMLInputElement>('input[name="bounceHouseId"]')?.value;
      
      if (!bounceHouseId) {
        console.error("No bounceHouseId found in form data:", formData);
        toast({
          title: "Error",
          description: "Missing bounce house information. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if date has changed from original
      if (formData.eventDate !== originalDate) {
        console.log("Date has changed, checking availability");
        const availabilityResult = await checkAvailability(formData.eventDate, bounceHouseId);
        if (!availabilityResult.available) {
          console.log("Availability check failed");
          toast({
            title: 'Error',
            description: availabilityResult.error,
            variant: 'destructive',
          });
          return;
        }
      }
      
      // Prepare submission data - create a new object instead of mutating formData
      const submissionData: any = {
        ...formData,
        bounceHouseId
      };
      
      // Explicitly add customer fields if they exist in the customer object
      if (formData.customer) {
        submissionData.customerName = formData.customer.name;
        submissionData.customerEmail = formData.customer.email;
        submissionData.customerPhone = formData.customer.phone;
      }
      
      // If customer fields are not in the customer object, use the direct fields
      if (!submissionData.customerName && formData.customerName) {
        submissionData.customerName = formData.customerName;
      }
      
      if (!submissionData.customerEmail && formData.customerEmail) {
        submissionData.customerEmail = formData.customerEmail;
      }
      
      if (!submissionData.customerPhone && formData.customerPhone) {
        submissionData.customerPhone = formData.customerPhone;
      }
      
      // Ensure eventDate is properly formatted
      if (submissionData.eventDate && !submissionData.eventDate.includes('T')) {
        try {
          // Parse the date string
          const dateParts = submissionData.eventDate.split('-');
          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
          const day = parseInt(dateParts[2]);
          
          // Create a date object at noon UTC to avoid timezone issues
          const date = new Date(Date.UTC(year, month, day, 12, 0, 0));
          
          // Format as YYYY-MM-DD
          submissionData.eventDate = date.toISOString().split('T')[0];
          console.log(`Formatted submission date: ${submissionData.eventDate}`);
        } catch (error) {
          console.error("Error formatting date:", error);
        }
      }
      
      // Log the final submission data for debugging
      console.log("Final submission data:", submissionData);
      
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update booking");
      }
      
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
      
      // Redirect back to bookings list
      router.push(`/dashboard/${businessId}/bookings`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-destructive py-8">
              <p className="mb-4">Failed to load booking details.</p>
              <Button onClick={() => router.push(`/dashboard/${businessId}/bookings`)}>
                Return to Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Booking</CardTitle>
          <CardDescription>
            {formData.bounceHouse?.name || "Bounce House"} - Booking #{formData.id.substring(0, 8)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rental Period Note */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 mb-4">
              <p className="font-medium">24-Hour Rental Period</p>
              <p className="text-sm">All bookings are for a full day (24-hour rental). This gives our team time to deliver, set up, and clean the equipment.</p>
            </div>
            
            {/* Hidden field for bounceHouseId */}
            <input 
              type="hidden" 
              name="bounceHouseId" 
              value={formData?.bounceHouse?.id || formData?.bounceHouseId || ''} 
            />
            
            {/* Event Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Event Details</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData?.eventDate || ''}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="startTime">Delivery Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData?.startTime ? formData.startTime.substring(0, 5) : ''}
                    onChange={(e) => handleChange("startTime", e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">24-hour rental starts at delivery</p>
                </div>
                <div>
                  <Label htmlFor="endTime">Pickup Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData?.endTime ? formData.endTime.substring(0, 5) : ''}
                    onChange={(e) => handleChange("endTime", e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Next day pickup</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    type="text"
                    value={formData?.eventType || ''}
                    onChange={(e) => handleChange("eventType", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="totalAmount">Total Amount ($)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    value={formData?.totalAmount || ''}
                    onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Event Location</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventAddress">Street Address</Label>
                  <Input
                    id="eventAddress"
                    type="text"
                    value={formData?.eventAddress || ''}
                    onChange={(e) => handleChange("eventAddress", e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="eventCity">City</Label>
                    <Input
                      id="eventCity"
                      type="text"
                      value={formData?.eventCity || ''}
                      onChange={(e) => handleChange("eventCity", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventState">State</Label>
                    <Input
                      id="eventState"
                      type="text"
                      value={formData?.eventState || ''}
                      onChange={(e) => handleChange("eventState", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventZipCode">ZIP Code</Label>
                    <Input
                      id="eventZipCode"
                      type="text"
                      value={formData?.eventZipCode || ''}
                      onChange={(e) => handleChange("eventZipCode", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />

            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Name</Label>
                  <Input
                    id="customerName"
                    value={formData?.customer?.name || formData.customerName || ''}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData?.customer?.email || formData.customerEmail || ''}
                    onChange={(e) => handleChange('customerEmail', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData?.customer?.phone || formData.customerPhone || ''}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Event Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Participants</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="participantCount">Number of Participants</Label>
                  <Input
                    id="participantCount"
                    type="number"
                    min={1}
                    value={formData?.participantCount || ''}
                    onChange={(e) => handleChange("participantCount", parseInt(e.target.value) || 0)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="participantAge">Age Range</Label>
                  <Input
                    id="participantAge"
                    value={formData?.participantAge || ''}
                    onChange={(e) => handleChange("participantAge", e.target.value)}
                    placeholder="e.g., 5-12 years"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Special Instructions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Special Instructions</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Additional Notes</Label>
                <Textarea
                  id="specialInstructions"
                  value={formData?.specialInstructions || ''}
                  onChange={(e) => handleChange("specialInstructions", e.target.value)}
                  placeholder="Any special requests or setup instructions"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Debug Info (only in development) */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
              <div className="mt-8 p-4 bg-gray-100 rounded-md">
                <details>
                  <summary className="cursor-pointer font-medium">Debug Information</summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-60">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isCheckingAvailability}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isCheckingAvailability ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Availability...
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
