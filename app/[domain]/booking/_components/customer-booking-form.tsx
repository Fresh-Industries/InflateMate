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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ThemeColors } from "../../_themes/types";
import { getContrastColor } from "@/app/[domain]/_themes/utils";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";

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

// Booking metadata type - Export this type
export type BookingMetadata = {
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

interface NewBookingFormProps {
  businessId: string;
  themeName: string;
  colors: ThemeColors;
}

export function NewBookingForm({ businessId, themeName, colors }: NewBookingFormProps) {
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
  
  // Get the current theme definition
  const theme = themeConfig[themeName] || themeConfig.modern;
  const bookingStyles = theme.bookingStyles;
  const buttonStyles = theme.buttonStyles;
  const secondaryButtonStyles = theme.secondaryButtonStyles;

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

  const handleNext = () => {
    if (currentStep === 1 && !validateEventDetails()) return;
    if (currentStep === 2) { 
      // Basic validation before proceeding 
      if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone || !newBooking.eventAddress || !newBooking.eventCity || !newBooking.eventState || !newBooking.eventZipCode) {
          toast({ title: "Missing Information", description: "Please fill out all address and contact fields.", variant: "destructive" });
          return; 
      }
    } 
    // Check for step 3 removed from here - handled by button logic inside step 3 rendering
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
    if (!termsAccepted) {
      toast({
        title: "Terms and Conditions",
        description: "You must accept the terms and conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

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

  // Apply theme styles dynamically
  const formStyle = {
    backgroundColor: bookingStyles.formBackground(colors),
    border: bookingStyles.formBorder(colors),
    boxShadow: bookingStyles.formShadow(colors),
    color: bookingStyles.formTextColor(colors),
  };
  
  const inputStyle = {
    backgroundColor: bookingStyles.input.background(colors),
    border: `1px solid ${bookingStyles.input.border(colors)}`,
    color: bookingStyles.formTextColor(colors),
    '::placeholder': {
      color: bookingStyles.input.placeholderColor(colors),
    },
  };

  const focusInputStyle = {
    borderColor: bookingStyles.input.focusBorder(colors),
    boxShadow: `0 0 0 2px ${bookingStyles.input.focusBorder(colors)}30`
  };

  const labelStyle: React.CSSProperties = {
    color: bookingStyles.input.labelColor(colors),
    display: 'block',
    marginBottom: '0.375rem',
  };

  const summaryCardStyle = {
    backgroundColor: bookingStyles.summaryCard.background(colors),
    border: bookingStyles.summaryCard.border(colors),
    boxShadow: bookingStyles.summaryCard.shadow(colors),
  };
  
  const summaryHeaderStyle = {
    backgroundColor: bookingStyles.summaryCard.headerBackground(colors),
  };

  const summaryRowStyle = (isAlternate: boolean) => ({
    backgroundColor: bookingStyles.summaryCard.rowBackground(colors, isAlternate),
  });

  // --- Button Style Objects ---
  const primaryButtonStyle: React.CSSProperties = {
    backgroundColor: buttonStyles.background(colors),
    color: buttonStyles.textColor(colors),
    border: buttonStyles.border ? buttonStyles.border(colors) : undefined,
    boxShadow: buttonStyles.boxShadow ? buttonStyles.boxShadow(colors) : undefined,
    borderRadius: buttonStyles.borderRadius,
    transition: buttonStyles.transition,
    // Add other properties as needed
  };

  const primaryButtonHoverStyle: React.CSSProperties = {
    backgroundColor: buttonStyles.hoverBackground(colors),
    color: buttonStyles.hoverTextColor ? buttonStyles.hoverTextColor(colors) : buttonStyles.textColor(colors),
    border: buttonStyles.hoverBorder ? buttonStyles.hoverBorder(colors) : (buttonStyles.border ? buttonStyles.border(colors) : undefined),
    boxShadow: buttonStyles.hoverBoxShadow ? buttonStyles.hoverBoxShadow(colors) : (buttonStyles.boxShadow ? buttonStyles.boxShadow(colors) : undefined),
  };

  const secondaryButtonStyle: React.CSSProperties = secondaryButtonStyles ? {
    backgroundColor: secondaryButtonStyles.background(colors),
    color: secondaryButtonStyles.textColor(colors),
    border: secondaryButtonStyles.border ? secondaryButtonStyles.border(colors) : undefined,
    boxShadow: secondaryButtonStyles.boxShadow ? secondaryButtonStyles.boxShadow(colors) : undefined,
    borderRadius: secondaryButtonStyles.borderRadius,
    transition: secondaryButtonStyles.transition,
  } : {}; // Provide empty object if secondary styles are not defined

  const secondaryButtonHoverStyle: React.CSSProperties = secondaryButtonStyles ? {
    backgroundColor: secondaryButtonStyles.hoverBackground ? secondaryButtonStyles.hoverBackground(colors) : secondaryButtonStyles.background(colors),
    color: secondaryButtonStyles.hoverTextColor ? secondaryButtonStyles.hoverTextColor(colors) : secondaryButtonStyles.textColor(colors),
    border: secondaryButtonStyles.hoverBorder ? secondaryButtonStyles.hoverBorder(colors) : (secondaryButtonStyles.border ? secondaryButtonStyles.border(colors) : undefined),
    boxShadow: secondaryButtonStyles.hoverBoxShadow ? secondaryButtonStyles.hoverBoxShadow(colors) : (secondaryButtonStyles.boxShadow ? secondaryButtonStyles.boxShadow(colors) : undefined),
  } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-semibold mb-6" style={{color: bookingStyles.formTextColor(colors)}}>Make a Reservation</h2>
      </div>
    <div style={formStyle} className="p-6 rounded-lg">
      
      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                style={{
                  backgroundColor: bookingStyles.stepBackground(colors, currentStep === step.number),
                  border: bookingStyles.stepBorder(colors, currentStep === step.number),
                  color: bookingStyles.stepIconColor(colors, currentStep === step.number),
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <p
                style={{ color: bookingStyles.stepTextColor(colors, currentStep === step.number) }}
                className={`text-sm font-medium ${
                  currentStep === step.number ? 'font-semibold' : 'text-gray-500'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <Separator
                style={{ borderColor: colors.secondary + '40' }}
                className="flex-1 mx-4 h-0.5"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Event Details */}
      {currentStep === 1 && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{color: bookingStyles.formTextColor(colors)}}>Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="eventDate" style={labelStyle}>Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newBooking.eventDate}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, eventDate: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div>
              <Label htmlFor="startTime" style={labelStyle}>Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={newBooking.startTime}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, startTime: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div>
              <Label htmlFor="endTime" style={labelStyle}>End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={newBooking.endTime}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, endTime: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          </div>
          <Button 
            onClick={searchAvailability} 
            disabled={isSearchingAvailability} 
            style={primaryButtonStyle} 
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButtonStyle)}
            className="mb-4"
          >
            {isSearchingAvailability ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Check Availability
          </Button>

          {isSearchingAvailability && <p className="text-center my-4">Searching...</p>}
          
          {hasSearched && !isSearchingAvailability && (
             <div className="mt-6">
              <h4 className="text-md font-semibold mb-3" style={{color: bookingStyles.formTextColor(colors)}}>Select an Item:</h4>
              {availableInventory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableInventory.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const cardItemStyle = {
                    backgroundColor: isSelected ? bookingStyles.availabilityCard.selectedBackground(colors) : bookingStyles.availabilityCard.background(colors),
                    border: bookingStyles.availabilityCard.border(colors, isSelected),
                    boxShadow: bookingStyles.availabilityCard.shadow(colors),
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  };
                   const cardItemHoverStyle = {
                     boxShadow: bookingStyles.availabilityCard.hoverShadow(colors),
                     transform: isSelected ? 'scale(1.03)' : 'scale(1.02)',
                   };

                  return (
                    <Card
                      key={item.id}
                      onClick={() => selectInventoryItem(item)}
                      style={cardItemStyle}
                       onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardItemHoverStyle)}
                       onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardItemStyle)}
                      className={`cursor-pointer overflow-hidden`}
                    >
                       <CardHeader className="p-0 relative">
                        <div style={{ backgroundColor: bookingStyles.availabilityCard.imageContainer(colors) }} className="aspect-video w-full overflow-hidden">
                           <img 
                              src={item.primaryImage || '/placeholder.svg'} 
                              alt={item.name} 
                              className="object-cover w-full h-full" 
                              style={theme.imageStyles(colors)}
                           />
                        </div>
                          <div 
                            style={{ 
                                backgroundColor: bookingStyles.availabilityCard.priceTag.background(colors),
                                color: bookingStyles.availabilityCard.priceTag.color(colors) 
                            }} 
                            className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-semibold"
                           >
                              ${item.price.toFixed(2)}
                          </div>
                       </CardHeader>
                       <CardContent className="p-4">
                          <CardTitle className="text-lg mb-1" style={{color: bookingStyles.formTextColor(colors)}}>{item.name}</CardTitle>
                          <CardDescription className="text-sm mb-3" style={{color: bookingStyles.formTextColor(colors) + 'aa'}}>
                              {item.description?.substring(0, 60)}{item.description && item.description.length > 60 ? '...' : ''}
                          </CardDescription>
                          <div 
                              style={{
                                backgroundColor: bookingStyles.availabilityCard.specContainer.background(colors), 
                                border: bookingStyles.availabilityCard.specContainer.border(colors)
                              }} 
                              className="flex justify-around text-xs p-2 rounded-md"
                            >
                                <span style={{color: bookingStyles.formTextColor(colors)}}>Type: {item.type}</span>
                                <span style={{color: bookingStyles.formTextColor(colors)}}>Size: {item.dimensions}</span>
                                <span style={{color: bookingStyles.formTextColor(colors)}}>Cap: {item.capacity}</span>
                          </div>
                       </CardContent>
                    </Card>
                  );
                })}
              </div>
              ) : (
                 <p className="text-center text-gray-500">No items available for the selected date and time. Please try adjusting your search.</p>
              )}
             </div>
          )}

           <div className="mt-6 flex justify-end">
             <Button 
                onClick={handleNext} 
                disabled={!newBooking.bounceHouseId} 
                style={primaryButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButtonStyle)}
             >
               Next <ChevronRight className="ml-2 h-4 w-4" />
             </Button>
           </div>
        </div>
      )}

      {/* Step 2: Customer Info */}
      {currentStep === 2 && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{color: bookingStyles.formTextColor(colors)}}>Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 mb-4">
            <div>
              <Label htmlFor="customerName" style={labelStyle}>Full Name</Label>
              <Input
                id="customerName"
                value={newBooking.customerName}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, customerName: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" style={labelStyle}>Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={newBooking.customerEmail}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, customerEmail: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" style={labelStyle}>Phone Number</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={newBooking.customerPhone}
                onChange={(e) =>
                  setNewBooking({ ...newBooking, customerPhone: e.target.value })
                }
                required
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
             <div>
               <Label htmlFor="eventType" style={labelStyle}>Event Type</Label>
               <Select
                 value={newBooking.eventType}
                 onValueChange={(value) => setNewBooking({ ...newBooking, eventType: value })}
               >
                 <SelectTrigger 
                    style={inputStyle} 
                    onFocus={(e) => Object.assign(e.target.style, focusInputStyle)} 
                    onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                 >
                   <SelectValue placeholder="Select event type" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="BIRTHDAY">Birthday Party</SelectItem>
                   <SelectItem value="CORPORATE">Corporate Event</SelectItem>
                   <SelectItem value="SCHOOL">School Function</SelectItem>
                   <SelectItem value="CHURCH">Church Event</SelectItem>
                   <SelectItem value="COMMUNITY">Community Festival</SelectItem>
                   <SelectItem value="PRIVATE">Private Party</SelectItem>
                   <SelectItem value="OTHER">Other</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="eventAddress" style={labelStyle}>Event Street Address</Label>
            <Input
              id="eventAddress"
              value={newBooking.eventAddress}
              onChange={(e) =>
                setNewBooking({ ...newBooking, eventAddress: e.target.value })
              }
              required
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5 mb-4">
             <div>
               <Label htmlFor="eventCity" style={labelStyle}>City</Label>
               <Input
                 id="eventCity"
                 value={newBooking.eventCity}
                 onChange={(e) => setNewBooking({ ...newBooking, eventCity: e.target.value })}
                 required
                 style={inputStyle}
                 onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                 onBlur={(e) => Object.assign(e.target.style, inputStyle)}
               />
             </div>
             <div>
               <Label htmlFor="eventState" style={labelStyle}>State</Label>
               <Input
                 id="eventState"
                 value={newBooking.eventState}
                 onChange={(e) => setNewBooking({ ...newBooking, eventState: e.target.value })}
                 required
                 style={inputStyle}
                 onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                 onBlur={(e) => Object.assign(e.target.style, inputStyle)}
               />
             </div>
             <div>
               <Label htmlFor="eventZipCode" style={labelStyle}>Zip Code</Label>
               <Input
                 id="eventZipCode"
                 value={newBooking.eventZipCode}
                 onChange={(e) => setNewBooking({ ...newBooking, eventZipCode: e.target.value })}
                 required
                 style={inputStyle}
                 onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                 onBlur={(e) => Object.assign(e.target.style, inputStyle)}
               />
             </div>
           </div>
          <div className="mb-4">
            <Label htmlFor="specialInstructions" style={labelStyle}>Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={newBooking.specialInstructions}
              onChange={(e) =>
                setNewBooking({
                  ...newBooking,
                  specialInstructions: e.target.value,
                })
              }
              placeholder="Any specific requests or details about the setup location?"
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
          <div className="mb-6 mt-4 flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={termsAccepted} 
              onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))}
              className="border-gray-400 data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="terms" style={labelStyle} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I accept the <Link href="/terms" target="_blank" className="underline" style={{color: colors.primary[500]}}>terms and conditions</Link>.
            </Label>
          </div>
          <div className="flex justify-between mt-6">
            <Button 
                onClick={handleBack} 
                variant="outline" 
                style={secondaryButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButtonStyle)}
             >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button 
                onClick={handleNext} 
                style={primaryButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButtonStyle)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Pay */}
      {currentStep === 3 && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{color: bookingStyles.formTextColor(colors)}}>Review & Pay</h3>
          
          {/* Booking Summary Card */}
          <Card style={summaryCardStyle} className="mb-6 overflow-hidden">
            <CardHeader style={summaryHeaderStyle} className="p-4">
              <CardTitle style={{color: getContrastColor(summaryHeaderStyle.backgroundColor)}} className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div style={summaryRowStyle(false)} className="px-4 py-3 border-b border-gray-200">
                  <p><strong>Item:</strong> {selectedItem?.name}</p>
               </div>
               <div style={summaryRowStyle(true)} className="px-4 py-3 border-b border-gray-200">
                  <p><strong>Date:</strong> {format(createUTCDate(newBooking.eventDate), 'PPP')}</p>
               </div>
               <div style={summaryRowStyle(false)} className="px-4 py-3 border-b border-gray-200">
                  <p><strong>Time:</strong> {newBooking.startTime} - {newBooking.endTime}</p>
               </div>
               <div style={summaryRowStyle(true)} className="px-4 py-3 border-b border-gray-200">
                  <p><strong>Address:</strong> {newBooking.eventAddress}, {newBooking.eventCity}, {newBooking.eventState} {newBooking.eventZipCode}</p>
               </div>
               <div style={summaryRowStyle(false)} className="px-4 py-3 border-b border-gray-200 font-semibold">
                  <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
               </div>
                {applyTax && taxRate > 0 && (
                 <div style={summaryRowStyle(true)} className="px-4 py-3 border-b border-gray-200 font-semibold">
                   <p>Tax ({taxRate}%): ${calculateTaxAmount().toFixed(2)}</p>
                 </div>
               )}
               <div style={summaryRowStyle(false)} className="px-4 py-3 font-bold text-lg">
                  <p>Total: ${calculateTotal().toFixed(2)}</p>
               </div>
            </CardContent>
          </Card>

          {/* Payment Form - Rendered only when clientSecret is available and business has Stripe ID */}
          {clientSecret && pendingBookingData && businessData?.stripeAccountId ? (
            <Elements
              stripe={getStripeInstance(businessData.stripeAccountId)}
              options={{ clientSecret }} 
            >
              <PaymentForm
                bookingData={pendingBookingData} 
                clientSecret={clientSecret} 
                onPaymentSuccess={handlePaymentSuccess}
                themeName={themeName} 
                colors={colors}
              />
            </Elements>
          ) : (
             // Show loading or trigger submission button if clientSecret isn't ready yet
             <div className="text-center space-y-4">
                 {isSubmitting ? (
                    <div className="flex justify-center items-center flex-col">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mb-2" />
                        <span>Processing request...</span>
                    </div>
                 ) : (
                    <Button 
                        onClick={handleSubmit} // Button to initiate the submission process
                        style={primaryButtonStyle}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHoverStyle)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButtonStyle)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                 )}
                 {!isSubmitting && <p className="text-xs text-gray-500">Click to prepare secure payment.</p>}
             </div>
          )}

          {/* Only show Back button here now */}
          <div className="flex justify-start mt-6"> {/* Changed to justify-start */}
            <Button 
                onClick={handleBack} 
                variant="outline" 
                style={secondaryButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, secondaryButtonHoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, secondaryButtonStyle)}
             >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}