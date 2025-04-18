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
import { 
  Loader2, ArrowLeft, Calendar, MapPin, User,
  Info, Clock, CalendarRange, CheckCircle 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Booking {
  id: string;
  bounceHouseId: string;
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

const EVENT_TYPES = [
  "Birthday Party",
  "Corporate Event",
  "School Event",
  "Community Event",
  "Church Event",
  "Festival",
  "Family Gathering",
  "Other"
];

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
        const formattedBooking = { ...bookingData };
        
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
        const errorData = await response.json() as { error?: string };
        console.error("Availability check failed:", errorData);
        return { available: false, error: errorData.error || "Failed to check availability" };
      }
      
      const data = await response.json();
      console.log("Availability response:", data);
      
      // Check if the bounce house is in the available inventory
      const isAvailable = data.availableInventory.some(
        (item: { id: string }) => item.id === bounceHouseId
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
        setIsCheckingAvailability(true);
        const availabilityResult = await checkAvailability(formData.eventDate, bounceHouseId);
        setIsCheckingAvailability(false);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const submissionData: Record<string, any> = {
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
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="text-center py-8 space-y-4">
              <div className="bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Info className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-medium">Failed to load booking details</h3>
              <p className="text-muted-foreground mb-4">There was a problem retrieving this booking&apos;s information.</p>
              <Button onClick={() => router.push(`/dashboard/${businessId}/bookings`)}>
                Return to Bookings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format time for display
  const formatTimeForDisplay = (time: string | undefined) => {
    if (!time) return '';
    
    // If it's already in HH:MM format, just return it
    if (time.length === 5 && time.includes(':')) return time;
    
    // If it's in HH:MM:SS format, truncate the seconds
    if (time.length === 8 && time.split(':').length === 3) {
      return time.substring(0, 5);
    }
    
    // Try to parse it as a date if it's in ISO format
    if (time.includes('T')) {
      try {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      } catch (e) {
        console.error("Error parsing time:", e);
      }
    }
    
    return time;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Bookings
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-700 text-xs font-medium">Active Booking</span>
          </div>
        </div>
      </div>
      
      <Card className="border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg pb-3">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Edit Booking
                <span className="text-sm font-normal text-muted-foreground">#{formData.id.substring(0, 8)}</span>
              </CardTitle>
              <CardDescription className="font-medium text-primary">
                {formData.bounceHouse?.name || "Bounce House"}
              </CardDescription>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <CalendarRange className="h-4 w-4 text-primary" />
                <span>
                  {formData.eventDate ? format(new Date(formData.eventDate), 'MMMM d, yyyy') : 'Date not set'}
                </span>
              </div>
              {formData.startTime && (
                <div className="flex items-center gap-1 ml-0 md:ml-4">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {formatTimeForDisplay(formData.startTime)} - {formatTimeForDisplay(formData.endTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="details" className="flex items-center gap-1.5">
                <Info className="h-4 w-4" />
                <span>Event Details</span>
              </TabsTrigger>
              <TabsTrigger value="customer" className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>Customer</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              {/* Hidden field for bounceHouseId */}
              <input 
                type="hidden" 
                name="bounceHouseId" 
                value={formData?.bounceHouse?.id || formData?.bounceHouseId || ''} 
              />
              
              <TabsContent value="details" className="space-y-6">
                {/* Notice at the top */}
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-700 mb-6">
                  <div className="flex gap-2">
                    <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">24-Hour Rental Period</p>
                      <p className="text-sm">All bookings are for a full day (24-hour rental) to ensure proper delivery, setup, and cleaning.</p>
                    </div>
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate" className="text-sm font-medium">Event Date</Label>
                      <div className="relative">
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData?.eventDate || ''}
                          onChange={(e) => handleChange("eventDate", e.target.value)}
                          required
                          className="pl-10"
                        />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select 
                        value={formData?.eventType || ''}
                        onValueChange={(value) => handleChange("eventType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {EVENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="participantCount">Number of Participants</Label>
                        <Input
                          id="participantCount"
                          type="number"
                          min={1}
                          value={formData?.participantCount || ''}
                          onChange={(e) => handleChange("participantCount", parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="participantAge">Age Range</Label>
                        <Input
                          id="participantAge"
                          value={formData?.participantAge || ''}
                          onChange={(e) => handleChange("participantAge", e.target.value)}
                          placeholder="e.g., 5-12 years"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Delivery Time</Label>
                        <div className="relative">
                          <Input
                            id="startTime"
                            type="time"
                            value={formatTimeForDisplay(formData?.startTime)}
                            onChange={(e) => handleChange("startTime", e.target.value)}
                            required
                            className="pl-10"
                          />
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">24-hour rental starts at delivery</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Pickup Time</Label>
                        <div className="relative">
                          <Input
                            id="endTime"
                            type="time"
                            value={formatTimeForDisplay(formData?.endTime)}
                            onChange={(e) => handleChange("endTime", e.target.value)}
                            required
                            className="pl-10"
                          />
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">Next day pickup</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <div className="relative">
                        <Input
                          id="totalAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData?.totalAmount || ''}
                          onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                          required
                          className="pl-10"
                        />
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        id="specialInstructions"
                        value={formData?.specialInstructions || ''}
                        onChange={(e) => handleChange("specialInstructions", e.target.value)}
                        placeholder="Any special requests or setup instructions"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="customer" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData?.customer?.name || formData.customerName || ''}
                      onChange={(e) => handleChange('customerName', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={formData?.customer?.phone || formData.customerPhone || ''}
                      onChange={(e) => handleChange('customerPhone', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="customerEmail">Email Address</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData?.customer?.email || formData.customerEmail || ''}
                      onChange={(e) => handleChange('customerEmail', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventAddress">Street Address</Label>
                    <Input
                      id="eventAddress"
                      type="text"
                      value={formData?.eventAddress || ''}
                      onChange={(e) => handleChange("eventAddress", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventCity">City</Label>
                      <Input
                        id="eventCity"
                        type="text"
                        value={formData?.eventCity || ''}
                        onChange={(e) => handleChange("eventCity", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eventState">State</Label>
                      <Input
                        id="eventState"
                        type="text"
                        value={formData?.eventState || ''}
                        onChange={(e) => handleChange("eventState", e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eventZipCode">ZIP Code</Label>
                      <Input
                        id="eventZipCode"
                        type="text"
                        value={formData?.eventZipCode || ''}
                        onChange={(e) => handleChange("eventZipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Actions - always visible */}
              <div className="flex justify-end gap-4 pt-8 mt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isCheckingAvailability}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isCheckingAvailability ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
