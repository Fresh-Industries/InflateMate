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
  X,
  Minus,
  Plus,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import React from "react";

// Inventory item type
type InventoryItem = {
  id: string;
  name: string;
  type: string;
  stripeProductId: string;
  description: string | null;
  price: number;
  dimensions: string;
  capacity: number;
  ageRange: string;
  primaryImage: string | null;
  quantity: number;
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
  eventTimeZone: string;
};

type SelectedItem = {
  item: InventoryItem;
  quantity: number;
};

const ITEMS_PER_PAGE = 4;

// Pagination controls component
const PaginationControls = ({ total, currentPage, setCurrentPage }: { 
  total: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) => {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(i + 1)}
            className="w-8 h-8"
          >
            {i + 1}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
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
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map());
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [applyTax, setApplyTax] = useState(false);
  const sheetCloseRef = React.useRef<HTMLButtonElement>(null);
  // const [isInvoicing, setIsInvoicing] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  
  const [newBooking, setNewBooking] = useState({
    bounceHouseId: "",
    
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

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Steps for progress indicator
  const steps = [
    { number: 1, title: "Event Details", icon: Calendar },
    { number: 2, title: "Customer Info", icon: User },
    { number: 3, title: "Review & Pay", icon: CreditCard },
  ];


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
  }, []);

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
  const selectInventoryItem = (item: InventoryItem, quantity: number = 1) => {
    setSelectedItems(prev => {
      const newMap = new Map(prev);
      if (quantity <= 0) {
        newMap.delete(item.id);
      } else {
        newMap.set(item.id, { item, quantity });
      }
      return newMap;
    });
  };

  // Update quantity of selected item
  const updateQuantity = (item: InventoryItem, delta: number) => {
    const currentSelection = selectedItems.get(item.id);
    const newQuantity = (currentSelection?.quantity || 0) + delta;
    
    // Ensure quantity doesn't exceed inventory quantity and isn't negative
    if (newQuantity > 0 && newQuantity <= item.quantity) {
      selectInventoryItem(item, newQuantity);
    } else if (newQuantity <= 0) {
      selectInventoryItem(item, 0); // Remove item
    }
  };

  // Validate steps before progressing
  const validateEventDetails = () => {
    if (!newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || selectedItems.size === 0) {
      toast({ 
        title: "Error", 
        description: "Please complete all event details and select at least one item.", 
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
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateEventDetails()) return;
    if (currentStep === 2 && !validateCustomerInfo()) return;
    if (currentStep === 3) {
      handlePaymentProceed();
      return;
    }
    setCurrentStep((prev) => Math.min(3, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Calculate total with tax
  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach(({ item, quantity }) => {
      const subtotal = item.price;
      if (!applyTax || taxRate <= 0) {
        total += subtotal * quantity;
      } else {
        const taxAmount = subtotal * (taxRate / 100) * quantity;
        total += subtotal + taxAmount;
      }
    });
    return total;
  };
  
  // Calculate tax amount
  const calculateTaxAmount = () => {
    let taxAmount = 0;
    selectedItems.forEach(({ item, quantity }) => {
      if (!applyTax || taxRate <= 0) return;
      const subtotal = item.price;
      taxAmount += subtotal * (taxRate / 100) * quantity;
    });
    return taxAmount;
  };
  
  // Calculate subtotal (pre-tax amount)
  const calculateSubtotal = () => {
    let subtotal = 0;
    selectedItems.forEach(({ item, quantity }) => {
      subtotal += item.price * quantity;
    });
    return subtotal;
  };


  // Modify the handleSubmit function to use UTC dates
  const handlePaymentProceed = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTaxAmount();
      const total = calculateTotal();
      const amount = Math.round(total * 100); // convert to cents
      
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid total amount.");

      // Get browser timezone
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Create an array of selected items with their details
      const selectedItemsArray = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantity,
        stripeProductId: item.stripeProductId,
      }));
      
      const metadata: BookingMetadata = {
        bounceHouseId: selectedItemsArray.map(item => item.id).join(','),
        eventDate: newBooking.eventDate,
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
        eventTimeZone: tz,
      };
      

      console.log("Sending request to:", `/api/businesses/${businessId}/bookings`);
      
      // Fetch business data first
      console.log("Fetching business data...");
      const businessResponse = await fetch(`/api/businesses/${businessId}`);
      if (!businessResponse.ok) {
        throw new Error("Failed to fetch business data");
      }
      const businessData = await businessResponse.json();      
      
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
          metadata: {
            ...metadata,
            selectedItems: JSON.stringify(selectedItemsArray)
          },
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
      
      // Set clientSecret and pendingBookingData
      setClientSecret(clientSecret);

      setPendingBookingData(metadata);
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


  // const handleSendAsInvoice = async () => {
  //   if (isInvoicing) return;
  //   setIsInvoicing(true); // Set invoicing loading state

  //   try {
  //       const subtotal = calculateSubtotal();
  //       const taxAmount = calculateTaxAmount();
  //       const total = calculateTotal();

  //       const selectedItemsArray = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
  //         id: item.id,
  //         name: item.name,
  //         price: item.price,
  //         quantity: quantity,
  //         stripeProductId: item.stripeProductId,
  //       }));

  //       const bookingDetails = {
  //         ...newBooking, // Include all booking form data
  //         selectedItems: selectedItemsArray,
  //         subtotalAmount: subtotal,
  //         taxAmount: taxAmount,
  //         taxRate: taxRate,
  //         totalAmount: total,
  //         businessId: businessId,
  //         bookingId: crypto.randomUUID(), // Generate a booking ID client-side
  //         eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Include browser timezone
  //       };

  //       console.log("Sending request to create invoice:", `/api/businesses/${businessId}/invoices`);

  //       const response = await fetch(`/api/businesses/${businessId}/invoices`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(bookingDetails),
  //       });

  //       const data = await response.json();

  //       if (!response.ok) {
  //         console.error("Invoice API error:", data.error);
  //         throw new Error(data.error || "Failed to create invoice");
  //       }

  //       console.log("Invoice created successfully:", data.invoiceId);

  //       // Update UI and potentially redirect
  //       toast({
  //         title: "Invoice Sent",
  //         description: `Invoice for ${newBooking.customerName} has been sent. Booking ID: ${data.bookingId}`,
  //       });

  //       // Close the sheet
  //       if (sheetCloseRef.current) {
  //         sheetCloseRef.current.click();
  //       }

  //       // Redirect to the bookings list page and trigger a refresh
  //       router.push(`/dashboard/${businessId}/bookings`);


  //   } catch (error) {
  //       console.error("Invoicing error:", error);
  //       toast({
  //         title: "Error",
  //         description: error instanceof Error ? error.message : "Failed to send invoice",
  //         variant: "destructive",
  //       });
  //   } finally {
  //       setIsInvoicing(false); // Reset invoicing loading state
  //   }
  // };

  const handleSendAsQuote = async () => {
    // Prevent double submission or submitting while invoicing
    if (isProcessingQuote) return;


    // Optional: Re-validate steps 1 and 2 before sending
    if (!validateEventDetails() || !validateCustomerInfo()) {
         // Validation messages are shown by the validation functions
         return;
    }

    setIsProcessingQuote(true); // Set quote processing loading state

    try {
        const subtotal = calculateSubtotal();
        const taxAmount = calculateTaxAmount();
        const total = calculateTotal();

        console.log("Selected items:", selectedItems);

        const selectedItemsArray = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
            id: item.id, // Correctly access item ID
            name: item.name, // Correctly access item name
            price: item.price, // Correctly access item price
            quantity: quantity,
            stripeProductId: item.stripeProductId,
        }));

         if (selectedItemsArray.length === 0) {
             toast({
                 title: "Selection Needed",
                 description: "Please select at least one item for the quote.",
                 variant: "destructive",
             });
             return;
         }

        const quoteDetails = {
            ...newBooking, // Include all booking form data
            selectedItems: selectedItemsArray,
            subtotalAmount: subtotal,
            taxAmount: taxAmount,
            taxRate: taxRate,
            totalAmount: total,
            businessId: businessId,
            bookingId: crypto.randomUUID(), // Generate a *new* booking ID for this quote
            eventTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Include browser timezone
        };

        console.log("Sending request to create quote:", `/api/businesses/${businessId}/quotes`);

        const response = await fetch(`/api/businesses/${businessId}/quotes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quoteDetails),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Quote API error:", data.error);
             // Check if error is a validation error with details
            if (response.status === 400 && data.details) {
                // Optionally show specific Zod validation errors if needed
                 toast({
                     title: "Validation Error",
                     description: "Please check the form for errors.", // Or format data.details
                     variant: "destructive",
                 });
            } else if (response.status === 409 && data.field === 'bookingId') {
                 toast({
                     title: "Duplicate Quote Attempt",
                     description: data.error,
                     variant: "destructive",
                 });
            }
             else {
               toast({
                 title: "Error Sending Quote",
                 description: data.error || "Failed to create and send quote.",
                 variant: "destructive",
               });
            }
            throw new Error(data.error || "Failed to create quote");
        }

        console.log("Quote created and sent successfully:", data.stripeQuoteId);
        console.log("Hosted Quote URL:", data.hostedQuoteUrl);

        // Update UI and potentially redirect/close
        toast({
            title: "Quote Sent",
            description: `A quote has been sent to ${newBooking.customerEmail}.`,
        });

        // Close the sheet
        if (sheetCloseRef.current) {
            sheetCloseRef.current.click();
        }

        // Optional: Redirect to the bookings list or a quotes list page
        // router.push(`/dashboard/${businessId}/quotes`);
        router.refresh(); // Refresh the current view to show potential booking/quote

    } catch (error) {
        console.error("Quote processing error:", error);
        toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to send quote",
            variant: "destructive",
        });
    } finally {
        setIsProcessingQuote(false); // Reset quote processing loading state
    }
};

  // Add a function to handle successful payment
  const handlePaymentSuccess = async () => {
    // Close the sheet
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
    
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
    setSelectedItems(new Map());
    setNewBooking(prev => ({ ...prev, bounceHouseId: "" }));
    setHasSearched(false);
  }, [newBooking.eventDate, newBooking.startTime, newBooking.endTime]);

      // Show loading or error states when needed
      if (isSubmitting || isProcessingQuote) {
    return (
      <div className="space-y-4 text-center p-6 border rounded-lg">
        <h2 className="text-2xl font-semibold">{ isProcessingQuote ? "Preparing Quote..." : "Preparing Payment..."}</h2>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (showPaymentForm && clientSecret && pendingBookingData ) {
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
        {/* Hidden SheetClose button that we can programmatically click */}
        <SheetClose ref={sheetCloseRef} className="hidden" />
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
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground shadow-lg"
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
                variant="outline"
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
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {availableInventory.length > 0
                    ? "Available Bounce Houses"
                    : "No bounce houses available for your selected time"}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableInventory
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((item) => {
                      const isSelected = selectedItems.has(item.id);
                      const quantity = selectedItems.get(item.id)?.quantity || 0;
                      
                      return (
                        <Card
                          key={item.id}
                          className={`group overflow-hidden transition-all duration-300 ${
                            isSelected
                              ? "ring-2 ring-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
                              : "hover:border-primary/50 hover:shadow-md"
                          }`}
                        >
                          <div className="relative">
                            {item.primaryImage ? (
                              <div className="relative aspect-video w-full overflow-hidden">
                                <img
                                  src={item.primaryImage}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              </div>
                            ) : (
                              <div className="relative aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/10" />
                            )}
                            
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <h4 className="text-2xl font-bold tracking-tight mb-1">{item.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">${item.price.toFixed(2)}</span>
                                <span className="text-sm text-white/80">per day</span>
                              </div>
                            </div>
                          </div>

                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Capacity:</span>{" "}
                                <span className="font-medium">{item.capacity} people</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Age:</span>{" "}
                                <span className="font-medium">{item.ageRange}</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="p-4 pt-0">
                            {isSelected ? (
                              <div className="flex w-full items-center gap-2">
                                {item.quantity > 1 ? (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => updateQuantity(item, -1)}
                                      className="h-10 w-10"
                                      disabled={quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="w-12 text-center font-medium">
                                      {quantity}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => updateQuantity(item, 1)}
                                      className="h-10 w-10"
                                      disabled={quantity >= item.quantity}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </>
                                ) : null}
                                <Button
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => selectInventoryItem(item, 0)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <Button
                                className="w-full"
                                onClick={() => selectInventoryItem(item, 1)}
                                disabled={item.quantity < 1}
                                variant="outline"
                              >
                                {item.quantity > 0 ? "Add to Booking" : "Out of Stock"}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      );
                    })}
                </div>
                
                {availableInventory.length > ITEMS_PER_PAGE && (
                  <PaginationControls 
                    total={availableInventory.length} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
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
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Booking</h3>
            {selectedItems.size > 0 && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Selected Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from(selectedItems.values()).map(({ item, quantity }) => (
                    <div key={item.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start gap-4">
                        {item.primaryImage && (
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={item.primaryImage}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-muted-foreground">{item.type}</p>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Size:</span> {item.dimensions}
                            </div>
                            <div>
                              <span className="font-medium">Capacity:</span> {item.capacity} people
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span> {quantity}
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> ${(item.price * quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => selectInventoryItem(item, 0)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
       {/* Modify buttons to show 'Send as Invoice' on Step 3 */}
       <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <Button onClick={handleBack} variant="outline" disabled={isSubmitting || isProcessingQuote}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        ) : (
          <div /> // Empty div to maintain space
        )}

        {currentStep < 3 ? (
          <Button onClick={handleNext} disabled={isSubmitting || isProcessingQuote} variant="primary-gradient" className="ml-auto"> {/* Use ml-auto to push to the right if only one button */}
             Continue
             <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
           <div className="flex flex-col sm:flex-row gap-4 ml-auto w-full sm:w-auto"> {/* Container for both buttons */}
           <Button
                   onClick={handleSendAsQuote}
                   disabled={isSubmitting || isProcessingQuote}
                   variant="outline" // Or a different variant for quotes
                   className="w-full sm:w-auto"
               >
                   {isProcessingQuote ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Quote...
                      </>
                   ) : (
                      "Send as Quote"
                   )}
               </Button>
              
              <Button
                  onClick={handlePaymentProceed}
                  disabled={isSubmitting || isProcessingQuote}
                  variant="primary-gradient"
              >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                       Proceed to Payment
                       <CreditCard className="ml-2 h-4 w-4" />
                    </>
                  )}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
}