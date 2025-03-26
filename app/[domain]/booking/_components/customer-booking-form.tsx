"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Elements } from "@stripe/react-stripe-js";
import { getStripeInstance } from "@/lib/stripe-client";
import { PaymentForm } from "./payment-form";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  CreditCard,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// Inventory item type
type InventoryItem = {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price: number;
  dimensions: string;
  capacity: number;
  ageRange: string;
  primaryImage: string | null;
};

// Business type definition
type Business = {
  id: string;
  name: string;
  stripeAccountId?: string;  // Original field name in database
  stripeConnectedAccountId?: string;  // Field name expected by frontend components
  // Add other business fields as needed
  defaultTaxRate?: number;
  applyTaxToBookings?: boolean;
};

// Booking metadata type
type BookingMetadata = {
  bounceHouseId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  eventType: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZipCode: string;
  participantCount: string;
  participantAge: string;
  specialInstructions: string;
  totalAmount: string;
  subtotalAmount: string;
  taxAmount: string;
  taxRate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessId: string;
  bookingId?: string;
};

export function NewBookingForm({ businessId }: { businessId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [pendingBookingData, setPendingBookingData] = useState<BookingMetadata | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableInventory, setAvailableInventory] = useState<InventoryItem[]>([]);
  const [isSearchingAvailability, setIsSearchingAvailability] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [applyTax, setApplyTax] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [newBooking, setNewBooking] = useState({
    bounceHouseId: "",
    packageId: null,
    addOnIds: [],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    startTime: "09:00",
    endTime: "17:00",
    eventType: "OTHER",
    eventAddress: "",
    eventCity: "",
    eventState: "",
    eventZipCode: "",
    participantCount: 1,
    participantAge: "",
    specialInstructions: "",
  });

  // Debug logging for important state changes
  useEffect(() => {
    if (clientSecret) {
      console.log("clientSecret set:", clientSecret.substring(0, 10) + "...");
    }
  }, [clientSecret]);

  useEffect(() => {
    if (businessData) {
      console.log("businessData updated:", {
        id: businessData.id,
        hasStripeAccount: !!businessData.stripeConnectedAccountId,
      });
    }
  }, [businessData]);

  useEffect(() => {
    if (pendingBookingData) {
      console.log("pendingBookingData set:", {
        customerEmail: pendingBookingData.customerEmail,
        bounceHouseId: pendingBookingData.bounceHouseId,
      });
    }
  }, [pendingBookingData]);

  // For debugging payment form display conditions
  useEffect(() => {
    console.log("Payment form display conditions:", {
      showPaymentForm,
      hasClientSecret: !!clientSecret,
      hasPendingBookingData: !!pendingBookingData,
      allConditionsMet: showPaymentForm && !!clientSecret && !!pendingBookingData,
    });
  }, [showPaymentForm, clientSecret, pendingBookingData]);

  // Steps for progress indicator
  const steps = [
    { number: 1, title: "Event Details", icon: Calendar },
    { number: 2, title: "Customer Info", icon: User },
    { number: 3, title: "Review & Pay", icon: CreditCard },
  ];

  // Fetch business data including tax settings
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch(`/api/businesses/${businessId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch business data");
        }
        const data = await response.json();
        setBusinessData(data);
        setTaxRate(data.defaultTaxRate || 0);
        setApplyTax(data.applyTaxToBookings || false);
      } catch (error) {
        console.error("Error fetching business data:", error);
      }
    };
    
    fetchBusinessData();
  }, [businessId]);

  // Search for available inventory
  const searchAvailability = async () => {
    if (!newBooking.eventDate) {
      toast({ 
        title: "Missing Information", 
        description: "Please select a date first", 
        variant: "destructive" 
      });
      return;
    }

    setIsSearchingAvailability(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({
        date: newBooking.eventDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime
      });
      
      const response = await fetch(`/api/businesses/${businessId}/availability?${params.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to search availability");
      }
      
      setAvailableInventory(data.availableInventory || []);
      
      if (data.availableInventory.length === 0) {
        toast({ 
          title: "No Availability", 
          description: "No inventory items are available for your selected date. Please try a different date.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to search availability", 
        variant: "destructive" 
      });
    } finally {
      setIsSearchingAvailability(false);
    }
  };

  // Select an inventory item
  const selectInventoryItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewBooking({
      ...newBooking,
      bounceHouseId: item.id
    });
  };

  // Validate steps before progressing
  const validateEventDetails = () => {
    if (!newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || !newBooking.bounceHouseId) {
      toast({ 
        title: "Error", 
        description: "Please complete all event details and select an inventory item.", 
        variant: "destructive" 
      });
      return false;
    }
    return true;
  };

  const validateCustomerInfo = () => {
    if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone) {
      toast({ title: "Error", description: "Please complete all customer details.", variant: "destructive" });
      return false;
    }
    if (!termsAccepted) {
      toast({ title: "Error", description: "Please accept the terms of service.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateEventDetails()) return;
    if (currentStep === 2 && !validateCustomerInfo()) return;
    if (currentStep === 3) {
      handleSubmit();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Calculate total with tax
  const calculateTotal = () => {
    if (!selectedItem) return 0;
    
    const subtotal = selectedItem.price;
    if (!applyTax || taxRate <= 0) return subtotal;
    
    const taxAmount = subtotal * (taxRate / 100);
    return subtotal + taxAmount;
  };
  
  // Calculate tax amount
  const calculateTaxAmount = () => {
    if (!selectedItem || !applyTax || taxRate <= 0) return 0;
    return selectedItem.price * (taxRate / 100);
  };
  
  // Calculate subtotal (pre-tax amount)
  const calculateSubtotal = () => {
    return selectedItem ? selectedItem.price : 0;
  };

  // Add a helper function to create a UTC date
  const createUTCDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ));
  };

  // Modify the handleSubmit function to use UTC dates
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("Starting submission...");

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();
      const total = calculateTotal();
      const amount = Math.round(total * 100); // convert to cents
      
      console.log("Amount:", amount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid total amount.");

      // Create a UTC date to avoid timezone issues
      const utcDate = createUTCDate(newBooking.eventDate);
      const formattedEventDate = utcDate.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      console.log("Original date:", newBooking.eventDate);
      console.log("UTC date:", utcDate.toISOString());
      console.log("Formatted date for booking:", formattedEventDate);
      
      const metadata: BookingMetadata = {
        bounceHouseId: newBooking.bounceHouseId,
        eventDate: formattedEventDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        eventType: newBooking.eventType,
        eventAddress: newBooking.eventAddress,
        eventCity: newBooking.eventCity,
        eventState: newBooking.eventState,
        eventZipCode: newBooking.eventZipCode,
        participantCount: String(newBooking.participantCount),
        participantAge: String(newBooking.participantAge || ""),
        specialInstructions: newBooking.specialInstructions,
        totalAmount: String(total),
        subtotalAmount: String(subtotal),
        taxAmount: String(taxAmount),
        taxRate: String(taxRate),
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
        businessId: businessId,
        bookingId: crypto.randomUUID(),
      };
      console.log("Metadata prepared with keys:", Object.keys(metadata));
      console.log("Critical metadata fields:", {
        bounceHouseId: metadata.bounceHouseId,
        businessId: metadata.businessId,
        bookingId: metadata.bookingId
      });

      console.log("Sending request to:", `/api/businesses/${businessId}/bookings`);
      
      // Fetch business data first
      console.log("Fetching business data...");
      const businessResponse = await fetch(`/api/businesses/${businessId}`);
      if (!businessResponse.ok) {
        throw new Error("Failed to fetch business data");
      }
      const businessData = await businessResponse.json();
      console.log("Business data fetched (full object):", JSON.stringify(businessData, null, 2));
      console.log("Business data type:", typeof businessData);
      
      // Check all properties available in the business data
      console.log("Business data keys:", Object.keys(businessData));
      
      // Try to find any Stripe-related fields regardless of case
      const allFields = Object.keys(businessData);
      const stripeFields = allFields.filter(key => key.toLowerCase().includes('stripe'));
      console.log("Stripe-related fields found:", stripeFields);
      
      // Direct check for the stripeConnectedAccountId with exact value
      console.log("stripeConnectedAccountId exists:", 'stripeConnectedAccountId' in businessData);
      console.log("stripeConnectedAccountId value:", businessData.stripeConnectedAccountId);
      
      // Ensure the businessData has the required info
      if (!businessData) {
        console.error("Business data is missing");
        throw new Error("Failed to load business data");
      }
      
      // Check for Stripe account ID in either field
      const hasStripeAccount = !!(businessData.stripeAccountId || businessData.stripeConnectedAccountId);
      if (!hasStripeAccount) {
        console.error("Business data missing Stripe account ID:", businessData);
        throw new Error("Stripe is not set up for this business");
      }
      
      // Set business data in state
      setBusinessData(businessData);

      // Create payment intent
      const paymentResponse = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerEmail: newBooking.customerEmail,
          metadata,
        }),
      });
      
      console.log("Response status:", paymentResponse.status);
      const paymentData = await paymentResponse.json();
      console.log("Payment data:", paymentData);
      
      if (!paymentResponse.ok) {
        console.error("Payment API error:", paymentData.error);
        throw new Error(paymentData.error || "Payment intent failed");
      }

      // Extract client secret from response - handle different response formats
      let clientSecret = null;
      
      // Log the structure of the payment data to help with debugging
      console.log("Payment data structure:", {
        hasClientSecret: 'clientSecret' in paymentData,
        hasData: 'data' in paymentData,
        topLevelKeys: Object.keys(paymentData)
      });
      
      // Try multiple possible locations for the client secret
      if (typeof paymentData.clientSecret === 'string') {
        clientSecret = paymentData.clientSecret;
      } else if (paymentData.data && typeof paymentData.data.clientSecret === 'string') {
        clientSecret = paymentData.data.clientSecret;
      } else if (paymentData.result && typeof paymentData.result.clientSecret === 'string') {
        clientSecret = paymentData.result.clientSecret;
      }
      
      if (!clientSecret) {
        console.error("Missing client secret in API response:", paymentData);
        throw new Error("Missing client secret in API response");
      }
      
      console.log("Client secret received with length:", clientSecret.length);
      
      // Set clientSecret and pendingBookingData
      setClientSecret(clientSecret);
      
      console.log("Setting state values...");
      setPendingBookingData(metadata);
      console.log("State should be updated now");
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Failed to process booking", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a function to handle successful payment
  const handlePaymentSuccess = async () => {
    // Refresh the page to show the new booking
    router.refresh();
    
    // Show success message
    toast({
      title: "Booking Confirmed",
      description: "Your booking has been successfully created",
    });
  };

  // Clear availability when date/time changes
  useEffect(() => {
    setAvailableInventory([]);
    setSelectedItem(null);
    setNewBooking(prev => ({ ...prev, bounceHouseId: "" }));
    setHasSearched(false);
  }, [newBooking.eventDate, newBooking.startTime, newBooking.endTime]);

  // Show loading or error states when needed
  if (showPaymentForm && isSubmitting) {
    return (
      <div className="space-y-4 text-center p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold">Preparing Payment...</h2>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (showPaymentForm && clientSecret && pendingBookingData) {
    // Make sure we have the business data with Stripe information
    if (!businessData) {
      return (
        <div className="space-y-4 text-center p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Loading Business Data...</h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            Back to Review
          </Button>
        </div>
      );
    }

    // Get Stripe account ID from either field
    const stripeAccountId = businessData.stripeAccountId || businessData.stripeConnectedAccountId;
    
    if (!stripeAccountId) {
      return (
        <div className="space-y-4 text-center p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Payment Setup Issue</h2>
          <p className="text-red-500">
            Stripe is not properly set up for this business. Please contact the business owner.
          </p>
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            Back to Review
          </Button>
        </div>
      );
    }

    console.log("Initializing Stripe with account ID:", stripeAccountId);
    console.log("Client secret:", clientSecret ? "Available" : "Missing");
    
    const stripePromise = getStripeInstance(stripeAccountId);
    
    if (!stripePromise) {
      return (
        <div className="space-y-4 text-center p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold">Stripe Configuration Error</h2>
          <p className="text-red-500">
            Unable to initialize Stripe. Please check your configuration.
          </p>
          <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
            Back to Review
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Payment</h2>
          <Button variant="outline" onClick={() => setShowPaymentForm(false)} disabled={isSubmitting}>
            Back to Review
          </Button>
        </div>
        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-semibold">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe", variables: { colorPrimary: "#0F172A" } },
          }}
        >
          <PaymentForm
            amount={calculateTotal()}
            bookingId={pendingBookingData.bookingId || ""}
            customerEmail={pendingBookingData.customerEmail}
            businessId={businessId}
            subtotal={calculateSubtotal()}
            taxAmount={calculateTaxAmount()}
            taxRate={taxRate}
            onSuccess={handlePaymentSuccess}
            onError={(error) => {
              toast({
                title: "Payment Failed",
                description: error,
                variant: "destructive",
              });
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="relative mb-12">
        <div className="flex justify-between items-center z-10 relative">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  currentStep >= step.number
                    ? "bg-primary text-primary-foreground border-primary shadow-lg"
                    : "border-gray-300 text-gray-300"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? "text-primary" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-6 left-0 w-full h-[2px] bg-gray-200 -z-10"></div>
        <div
          className="absolute top-6 left-0 h-[2px] bg-primary -z-10 transition-all"
          style={{ width: `${((currentStep - 1) * 100) / (steps.length - 1)}%` }}
        ></div>
      </div>

      {/* Step Content */}
      <div className="mt-8 space-y-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700 mb-4">
              <p className="font-medium">24-Hour Rental Period</p>
              <p className="text-sm">All bookings are for a full day (24-hour rental). This gives our team time to deliver, set up, and clean the equipment.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={newBooking.eventDate}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, eventDate: e.target.value })
                  }
                  min={format(new Date(), "yyyy-MM-dd")}
                  required
                />
                <p className="text-xs text-muted-foreground">Select the date of your event</p>
              </div>
              
              <div className="space-y-2">
                <Label>Delivery/Setup Time</Label>
                <Input
                  type="time"
                  value={newBooking.startTime}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, startTime: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">Standard delivery time: 9:00 AM</p>
              </div>
              
              <div className="space-y-2">
                <Label>Pickup Time</Label>
                <Input
                  type="time"
                  value={newBooking.endTime}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, endTime: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">Standard pickup time: 5:00 PM next day</p>
              </div>
              
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select
                  value={newBooking.eventType || undefined}
                  onValueChange={(value) =>
                    setNewBooking({ ...newBooking, eventType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BIRTHDAY">Birthday Party</SelectItem>
                    <SelectItem value="CORPORATE">Corporate Event</SelectItem>
                    <SelectItem value="SCHOOL">School Event</SelectItem>
                    <SelectItem value="FESTIVAL">Festival</SelectItem>
                    <SelectItem value="FAMILY">Family Gathering</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Check Availability */}
            <div className="flex justify-center my-6">
              <Button
                onClick={searchAvailability}
                disabled={
                  isSearchingAvailability ||
                  !newBooking.eventDate
                }
                className="w-full max-w-md"
              >
                {isSearchingAvailability ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Availability
                  </>
                )}
              </Button>
            </div>

            {/* Available Inventory */}
            {hasSearched && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  {availableInventory.length > 0
                    ? "Available Bounce Houses"
                    : "No bounce houses available for your selected time"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableInventory.map((item) => (
                    <Card
                      key={item.id}
                      className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                        selectedItem?.id === item.id
                          ? "border-primary"
                          : "border-gray-200"
                      }`}
                      onClick={() => selectInventoryItem(item)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-md">{item.name}</CardTitle>
                        <CardDescription>{item.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        {item.primaryImage && (
                          <div className="mb-2 relative h-40 w-full overflow-hidden rounded-md">
                            <img
                              src={item.primaryImage}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Size:</span> {item.dimensions}
                          </p>
                          <p>
                            <span className="font-medium">Capacity:</span> {item.capacity} people
                          </p>
                          <p>
                            <span className="font-medium">Age Range:</span> {item.ageRange}
                          </p>
                          {item.description && <p className="line-clamp-2">{item.description}</p>}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
                        <Button
                          size="sm"
                          variant={selectedItem?.id === item.id ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectInventoryItem(item);
                          }}
                        >
                          {selectedItem?.id === item.id ? "Selected" : "Select"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={newBooking.customerName}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customerName: e.target.value })
                  }
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newBooking.customerEmail}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customerEmail: e.target.value })
                  }
                  placeholder="customer@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={newBooking.customerPhone}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, customerPhone: e.target.value })
                  }
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Event Address</Label>
                <Input
                  value={newBooking.eventAddress}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, eventAddress: e.target.value })
                  }
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={newBooking.eventCity}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, eventCity: e.target.value })
                    }
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={newBooking.eventState}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, eventState: e.target.value })
                    }
                    placeholder="State"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={newBooking.eventZipCode}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, eventZipCode: e.target.value })
                    }
                    placeholder="12345"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Participants</Label>
                <Input
                  type="number"
                  min={1}
                  value={newBooking.participantCount}
                  onChange={(e) =>
                    setNewBooking({
                      ...newBooking,
                      participantCount: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Age Range</Label>
                <Input
                  value={newBooking.participantAge}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, participantAge: e.target.value })
                  }
                  placeholder="e.g., 5-12 years"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                value={newBooking.specialInstructions}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, specialInstructions: e.target.value })
                }
                placeholder="Any special requests or setup instructions"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  aria-required="true"
                  className={!termsAccepted && "border-red-500"}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    By checking this box, you agree to receive communications from us and accept our{" "}
                    <Link href="/terms" className="text-primary hover:underline font-medium" target="_blank">
                      Terms of Service
                    </Link>
                    , including consent to receive emails and SMS notifications about your booking.
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {!termsAccepted && (
                    <p className="text-xs text-red-500">
                      You must accept the terms to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Booking</h3>
            {selectedItem && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Selected Bounce House</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    {selectedItem.primaryImage && (
                      <div className="h-32 w-32 min-w-[8rem] overflow-hidden rounded-md">
                        <img
                          src={selectedItem.primaryImage}
                          alt={selectedItem.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-md font-semibold">{selectedItem.name}</h4>
                      <p className="text-muted-foreground">{selectedItem.type}</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Size:</span> {selectedItem.dimensions}
                        </p>
                        <p>
                          <span className="font-medium">Capacity:</span> {selectedItem.capacity} people
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> ${selectedItem.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-medium">Date:</span> {newBooking.eventDate}
                    </p>
                    <p>
                      <span className="font-medium">Rental Period:</span> 24-Hour Rental
                    </p>
                    <p>
                      <span className="font-medium">Delivery/Setup:</span> {newBooking.startTime}
                    </p>
                    <p>
                      <span className="font-medium">Pickup:</span> {newBooking.endTime} (next day)
                    </p>
                    <p>
                      <span className="font-medium">Event Type:</span> {newBooking.eventType}
                    </p>
                    <p>
                      <span className="font-medium">Participants:</span> {newBooking.participantCount}
                    </p>
                    {newBooking.participantAge && (
                      <p>
                        <span className="font-medium">Age Range:</span> {newBooking.participantAge}
                      </p>
                    )}
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Location:</span> {newBooking.eventAddress}
                    </p>
                    <p>
                      <span className="font-medium">City:</span> {newBooking.eventCity}
                    </p>
                    <p>
                      <span className="font-medium">State:</span> {newBooking.eventState}
                    </p>
                    <p>
                      <span className="font-medium">Zip Code:</span> {newBooking.eventZipCode}
                    </p>
                  </div>
                </div>
                {newBooking.specialInstructions && (
                  <div className="mt-4">
                    <p className="font-medium">Special Instructions:</p>
                    <p>{newBooking.specialInstructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                {applyTax && taxRate > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax ({taxRate}%):</span>
                    <span>${calculateTaxAmount().toFixed(2)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <Button onClick={handleBack} variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === 3 ? (
            <>
              Proceed to Payment
              <CreditCard className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
