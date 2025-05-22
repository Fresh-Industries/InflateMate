"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookingFullDetails, InventoryItem } from "@/types/booking";
import { CustomerInfo } from "@/components/BookingForm/edit/CustomerInfo";
import { EditProducts } from "@/components/BookingForm/edit/EditProducts";
import { EditSummaryCard } from "@/components/BookingForm/edit/EditSummaryCard";
import { useSelectedItems } from '@/hooks/useSelectedItems';
import { useCoupon } from '@/hooks/useCoupon';
import { useBookingCalculations } from '@/hooks/useBookingCalculations';
import { useBusinessDetails } from '@/hooks/useBusinessDetails';
import { formatDateToYYYYMMDD, formatTimeToHHMM, utcToLocal, localToUTC } from "@/lib/utils";
import { Elements } from "@stripe/react-stripe-js";
import { getStripeInstance } from "@/lib/stripe-client";
import { PaymentForm } from "@/components/BookingForm/PaymentForm";
import { Loader2, Send, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EditBookingFormProps {
  businessId: string;
  bookingDetails: BookingFullDetails;
}

export function EditBookingForm({ businessId, bookingDetails }: EditBookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");
  
  // Loading state variables with more descriptive names
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Additional state to track form validity
  const [isFormValid, setIsFormValid] = useState(true);
  
  // States for refund functionality
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);
  const [fullRefund, setFullRefund] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  
  // Initialize selected items from booking details
  const { 
    selectedItems, 
    selectInventoryItem, 
    updateQuantity,
    clearSelection
  } = useSelectedItems();

  // Customer data state with explicit types
  const [customerData, setCustomerData] = useState<{
    name: string;
    email: string;
    phone: string;
    specialInstructions: string | null;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge: string;
  }>({
    name: bookingDetails.customer?.name || "",
    email: bookingDetails.customer?.email || "",
    phone: bookingDetails.customer?.phone || "",
    specialInstructions: bookingDetails.booking?.specialInstructions || null,
    eventAddress: bookingDetails.booking?.eventAddress || "",
    eventCity: bookingDetails.booking?.eventCity || "",
    eventState: bookingDetails.booking?.eventState || "",
    eventZipCode: bookingDetails.booking?.eventZipCode || "",
    participantCount: bookingDetails.booking?.participantCount || 1,
    participantAge: bookingDetails.booking?.participantAge?.toString() || "",
  });

  // Business data and calculations
  const { taxRate, applyTax, businessData } = useBusinessDetails(businessId);
  const [couponCode, setCouponCode] = useState("");
  
  // Add expiration timer state
  const [isExpired, setIsExpired] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Add state to track added/changed items
  const [hasAddedItems, setHasAddedItems] = useState(false);
  const [addedItemsTotal, setAddedItemsTotal] = useState(0);
  
  // Conditional flags for UI states - defined after all state variables
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isReadOnly = !(bookingDetails.booking?.status === "HOLD" || bookingDetails.booking?.status === "PENDING") || isExpired;
  const canSaveChanges = bookingDetails.booking?.status === "PENDING" && !isExpired;
  
  // A confirmed booking is not "read only" in the same way a HOLD/PENDING is after expiry
  // A confirmed booking is also not "expired" in the traditional sense
  const isConfirmed = bookingDetails.booking?.status === "CONFIRMED";
  const isHoldOrPending = bookingDetails.booking?.status === "HOLD" || bookingDetails.booking?.status === "PENDING";
  const isCurrentlyExpired = isHoldOrPending && isExpired; // Only HOLD/PENDING can expire
  
  // Determine if the form is generally editable (not fully expired/read-only)
  const isEditable = !isCurrentlyExpired;
  
  // Can save draft changes if editable and not confirmed (confirmed saves need different handling)
  const canSaveDraft = isHoldOrPending && isEditable;

  // Add form validation check
  useEffect(() => {
    // Basic validation - ensure customer data is populated
    const isCustomerValid = customerData.name.trim() !== '' && 
                          customerData.email.trim() !== '' && 
                          customerData.phone.trim() !== '';
    
    // Ensure there are items selected
    const hasItems = selectedItems.size > 0;
    
    setIsFormValid(isCustomerValid && hasItems);
  }, [customerData, selectedItems]);

  // Initialize items when booking details change
  useEffect(() => {
    // Clear any existing selection first
    clearSelection();
    
    // Check if booking items exist
    if (!bookingDetails?.bookingItems || bookingDetails.bookingItems.length === 0) {
      console.log("No booking items found to initialize");
      return;
    }
    
    console.log("Initializing items from booking details:", bookingDetails.bookingItems.length);
    
    // Convert booking items to the format needed by useSelectedItems
    bookingDetails.bookingItems.forEach(item => {
      if (!item.inventory) {
        console.log("Skipping item without inventory:", item.id);
        return;
      }
      
      const inventoryItem: InventoryItem = {
        id: item.inventory.id,
        name: item.inventory.name || "Unknown Item",
        description: item.inventory.description || "",
        primaryImage: item.inventory.primaryImage || "",
        // Use price from the booking item first, fallback to inventory price
        price: item.price || 0,
        // Required properties per InventoryItem interface
        type: "",
        stripeProductId: "",
        dimensions: "",
        capacity: 0,
        ageRange: "",
        // This should reflect the total available stock
        quantity: item.quantity || 1
      };
      
      console.log("Adding item to selection:", inventoryItem.name, item.quantity);
      selectInventoryItem(inventoryItem, item.quantity);
    });
  }, [bookingDetails, selectInventoryItem, clearSelection]);

  // Add timer effect to handle expiration
  useEffect(() => {
    // Check if booking has an expiration time
    if (!bookingDetails?.booking?.expiresAt) {
      console.log("No expiration date found for booking");
      return;
    }
    
    const expirationTime = new Date(bookingDetails.booking.expiresAt);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expirationTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Expired");
        // Only mark as expired if it was a HOLD or PENDING booking
        if (bookingDetails.booking?.status === "HOLD" || bookingDetails.booking?.status === "PENDING") {
          setIsExpired(true);
        }
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      let timeLeftString = '';
      if (days > 0) timeLeftString += `${days}d `;
      if (hours > 0 || days > 0) timeLeftString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeLeftString += `${minutes}m `;
      timeLeftString += `${seconds}s`;

      setTimeLeft(timeLeftString.trim());
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [bookingDetails?.booking?.expiresAt, bookingDetails?.booking?.status]);

  const itemsForCalculation = React.useMemo(() => 
    Array.from(selectedItems.values()), [selectedItems]);

  // Get coupon functionality
  const {
    appliedCoupon,
    couponError,
    isApplyingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
  } = useCoupon({ 
    businessId, 
    amountBeforeTax: itemsForCalculation.reduce(
      (sum, { item, quantity }) => sum + (item.price * quantity), 0
    )
  });

  // Initialize couponCode from appliedCoupon if available
  useEffect(() => {
    if (appliedCoupon?.code) {
      setCouponCode(appliedCoupon.code);
    }
  }, [appliedCoupon]);

  const { rawSubtotal, taxAmount, total } = useBookingCalculations({
    selectedItems: new Map(itemsForCalculation.map(({ item, quantity }) => [item.id, { item, quantity }])),
    taxRate: taxRate || 0,
    applyTax: !!applyTax,
    appliedCoupon,
  });

  // Function to apply coupon with code
  const handleApplyCouponWithCode = () => {
    if (couponCode) {
      // Update couponCode in the hook and then call handleApplyCoupon with no arguments
      setCouponCode(couponCode);
      handleApplyCoupon();
    }
  };

  // Add function to compare current items with original items
  const detectItemChanges = useCallback(() => {
    if (!isConfirmed || !bookingDetails.bookingItems || bookingDetails.bookingItems.length === 0) {
      return;
    }
    
    // Create a map of original items for quick lookup
    const originalItems = new Map<string, { quantity: number, price: number }>();
    bookingDetails.bookingItems.forEach(item => {
      if (item.inventory) {
        originalItems.set(item.inventory.id, { 
          quantity: item.quantity, 
          price: item.price
        });
      }
    });
    
    let hasNewItems = false;
    let newItemsTotal = 0;
    
    // Check for added or increased quantity items
    Array.from(selectedItems.values()).forEach(({ item, quantity }) => {
      const original = originalItems.get(item.id);
      
      if (!original) {
        // This is a completely new item
        hasNewItems = true;
        newItemsTotal += item.price * quantity;
      } else if (quantity > original.quantity) {
        // Item quantity has increased
        hasNewItems = true;
        newItemsTotal += item.price * (quantity - original.quantity);
      }
    });
    
    setHasAddedItems(hasNewItems);
    setAddedItemsTotal(newItemsTotal);
  }, [isConfirmed, bookingDetails.bookingItems, selectedItems]);
  
  // Run the detection whenever selected items change
  useEffect(() => {
    detectItemChanges();
  }, [selectedItems, detectItemChanges]);

  // Helper function to prepare the update payload for API calls
  const prepareUpdatePayload = (intent?: string) => {
    if (selectedItems.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item",
        variant: "destructive",
      });
      return null;
    }

    // Calculate start and end time in UTC for each item
    // Use startTime for the event date to maintain consistency
    const startTime = bookingDetails.booking?.startTime;
    const eventDate = startTime 
      ? typeof startTime === 'string'
        ? new Date(startTime)
        : startTime
      : new Date();
    
    // Format the date to YYYY-MM-DD
    const bookingDate = formatDateToYYYYMMDD(eventDate.toISOString());
    
    // Handle time strings, ensuring we convert Date objects to strings if needed
    const startTimeObj = bookingDetails.booking?.startTime;
    const startTimeStr = typeof startTimeObj === 'string' 
      ? formatTimeToHHMM(startTimeObj) 
      : formatTimeToHHMM(new Date(startTimeObj).toISOString());
    
    const endTimeObj = bookingDetails.booking?.endTime;
    const endTimeStr = typeof endTimeObj === 'string' 
      ? formatTimeToHHMM(endTimeObj) 
      : formatTimeToHHMM(new Date(endTimeObj).toISOString());
    
    // Get timezone from booking details or use browser default
    const timezone = bookingDetails.booking?.eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Create the date strings for UTC conversion
    // Use localToUTC for proper timezone conversion instead of string concatenation
    const startUTC = localToUTC(bookingDate, startTimeStr, timezone);
    const endUTC = localToUTC(bookingDate, endTimeStr, timezone);

    const updatedBookingData = {
      // Customer information
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      specialInstructions: customerData.specialInstructions,
      
      // Event location fields
      eventAddress: customerData.eventAddress,
      eventCity: customerData.eventCity,
      eventState: customerData.eventState,
      eventZipCode: customerData.eventZipCode,
      
      // Participant fields
      participantCount: customerData.participantCount,
      participantAge: customerData.participantAge ? parseInt(customerData.participantAge) : undefined,
      
      // Format date and times correctly for API validation
      eventDate: bookingDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      eventTimeZone: timezone,
      
      // Inventory items - include startUTC and endUTC for each item
      items: Array.from(selectedItems.values()).map(({ item, quantity }) => ({
        inventoryId: item.id,
        quantity,
        price: item.price,
        status: "PENDING",
        startUTC,
        endUTC,
      })),
      
      // Amounts for validation
      subtotalAmount: rawSubtotal,
      taxAmount: taxAmount,
      totalAmount: total,
      
      // Coupon
      couponCode: appliedCoupon?.code,
      
      // Optional intent for prepare_for_quote or prepare_for_payment
      ...(intent ? { intent } : {})
    };
    
    return updatedBookingData;
  };

  // Add delete booking handler
  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking?.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete booking');
      }

      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      
      router.push(`/dashboard/${businessId}/bookings`);
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete booking',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Add refund booking handler
  const handleRefundClick = () => {
    // Check if booking is within 24 hours
    const now = new Date();
    const eventDate = new Date(bookingDetails.booking?.eventDate || new Date());
    const isWithin24HoursOfEvent = (eventDate.getTime() - now.getTime()) < (24 * 60 * 60 * 1000);
    
    setIsWithin24Hours(isWithin24HoursOfEvent);
    setFullRefund(false);
    setRefundReason("");
    setIsRefundDialogOpen(true);
  };

  // Add confirm refund handler
  const confirmRefund = async () => {
    if (!bookingDetails.booking?.id) return;
    
    setIsProcessingRefund(true);
    
    try {
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullRefund,
          reason: refundReason,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("Refund error:", result);
        throw new Error(result.error || 'Failed to process refund');
      }
      
      toast({
        title: "Booking Cancelled and Refunded",
        description: result.refundAmount > 0 
          ? `Refund of $${result.refundAmount.toFixed(2)} (${result.refundPercentage}%) processed.` 
          : "The booking has been cancelled.",
        variant: "default",
      });
      
      setIsRefundDialogOpen(false);
      
      // Navigate back to bookings list
      router.push(`/dashboard/${businessId}/bookings`);
      
    } catch (error) {
      console.error("Error processing refund:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setIsProcessingRefund(false);
    }
  };

  // Handler for saving draft changes
  const handleSaveDraft = async () => {
    if (isSavingDraft || isExpired || (!canSaveChanges && !isConfirmed)) return;
    
    // Check if booking ID exists
    if (!bookingDetails.booking?.id) {
      toast({
        title: "Error",
        description: "Could not find booking ID",
        variant: "destructive",
      });
      return;
    }

    // Validate form before proceeding
    if (!isFormValid) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields and select at least one item",
        variant: "destructive",
      });
      return;
    }
    
    setIsSavingDraft(true);
    
    try {
      let updatedBookingData;
      
      // For CONFIRMED bookings, create a simplified payload without items
      if (isConfirmed && !hasAddedItems) {
        // For CONFIRMED bookings, include only customer info without items
        updatedBookingData = {
          // Customer information
          customerName: customerData.name,
          customerEmail: customerData.email,
          customerPhone: customerData.phone,
          specialInstructions: customerData.specialInstructions,
          
          // Event location fields
          eventAddress: customerData.eventAddress,
          eventCity: customerData.eventCity,
          eventState: customerData.eventState,
          eventZipCode: customerData.eventZipCode,
          
          // Participant fields
          participantCount: customerData.participantCount,
          participantAge: customerData.participantAge ? parseInt(customerData.participantAge) : undefined,
          
          // Format date and times correctly for API validation
          eventDate: formatDateToYYYYMMDD(new Date(bookingDetails.booking.eventDate).toISOString()),
          startTime: formatTimeToHHMM(new Date(bookingDetails.booking.startTime).toISOString()),
          endTime: formatTimeToHHMM(new Date(bookingDetails.booking.endTime).toISOString()),
          eventTimeZone: bookingDetails.booking.eventTimeZone,
          
          // Add a special intent to indicate this is just updating customer info
          intent: "update_customer_info_only"
        };
        
        console.log("Sending payload for CONFIRMED booking (customer info only):", updatedBookingData);
      } else {
        // For HOLD/PENDING bookings or when adding items to CONFIRMED, use the full payload with items
        updatedBookingData = prepareUpdatePayload();
        if (!updatedBookingData) {
          setIsSavingDraft(false);
          return;
        }
      }
      
      // Call API to update booking
      const response = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookingData),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update booking");
      }
      
      toast({
        title: "Success",
        description: "Booking changes saved successfully",
        variant: "default",
      });
      
      // Refresh instead of navigate to stay on the same page
      router.refresh();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Handler for updating and sending quote
  const handleUpdateAndSendQuote = async () => {
    if (isProcessingQuote || isProcessingPayment || isExpired) return;
    
    if (!bookingDetails.booking?.id) {
      toast({
        title: "Error",
        description: "Booking ID not found",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form before proceeding
    if (!isFormValid) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields and select at least one item",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingQuote(true);
    
    try {
      // First update the booking with intent to prepare for quote
      const updatedBookingData = prepareUpdatePayload("prepare_for_quote");
      if (!updatedBookingData) {
        setIsProcessingQuote(false);
        return;
      }
      
      // Update the booking first
      const updateResponse = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookingData),
      });
      
      const updateData = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(updateData.error || "Failed to update booking for quote");
      }
      
      // After successful booking update, create and send the quote
      const quoteDetails = {
        bookingId: bookingDetails.booking.id,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        selectedItems: Array.from(selectedItems.values()).map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          stripeProductId: item.stripeProductId,
        })),
        eventDate: updatedBookingData.eventDate,
        startTime: updatedBookingData.startTime,
        endTime: updatedBookingData.endTime,
        eventTimeZone: updatedBookingData.eventTimeZone,
        eventType: bookingDetails.booking.eventType || 'OTHER',
        eventAddress: customerData.eventAddress,
        eventCity: customerData.eventCity,
        eventState: customerData.eventState,
        eventZipCode: customerData.eventZipCode,
        participantCount: customerData.participantCount || 1,
        participantAge: customerData.participantAge || "",
        specialInstructions: customerData.specialInstructions || '',
        subtotalAmount: rawSubtotal,
        taxAmount: taxAmount,
        taxRate: taxRate || 0,
        totalAmount: total,
      };
      
      const quoteResponse = await fetch(`/api/businesses/${businessId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quoteDetails),
      });
      
      const quoteData = await quoteResponse.json();
      if (!quoteResponse.ok) {
        throw new Error(quoteData.error || "Failed to create and send quote");
      }
      
      toast({
        title: "Quote Sent",
        description: `The quote has been sent to ${customerData.email}`,
        variant: "default",
      });
      
      // Navigate back to bookings list
      router.push(`/dashboard/${businessId}/bookings`);
    } catch (error) {
      console.error("Error creating quote:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send quote",
        variant: "destructive",
      });
    } finally {
      setIsProcessingQuote(false);
    }
  };

  // Handler for updating and proceeding to payment
  const handleUpdateAndProceedToPayment = async () => {
    if (isProcessingQuote || isProcessingPayment || isExpired) return;
    
    if (!bookingDetails.booking?.id) {
      toast({
        title: "Error",
        description: "Booking ID not found",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // First update the booking with intent to prepare for payment
      const updatedBookingData = prepareUpdatePayload("prepare_for_payment");
      if (!updatedBookingData) {
        setIsProcessingPayment(false);
        return;
      }
      
      // Log the data being sent to help debug
      console.log("Sending booking update data:", JSON.stringify(updatedBookingData));
      
      // Update the booking first
      const updateResponse = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBookingData),
      });
      
      let updateData;
      try {
        updateData = await updateResponse.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid response from server");
      }
      
      if (!updateResponse.ok) {
        console.error("Update error details:", updateData);
        throw new Error(updateData.error || "Failed to update booking for payment");
      }
      
      console.log("Booking updated successfully:", updateData);

      // Get the same timezone and formatted date/time values
      const bookingDate = formatDateToYYYYMMDD(new Date(bookingDetails.booking.eventDate).toISOString());
      const startTimeStr = formatTimeToHHMM(new Date(bookingDetails.booking.startTime).toISOString());
      const endTimeStr = formatTimeToHHMM(new Date(bookingDetails.booking.endTime).toISOString());
      const timezone = bookingDetails.booking.eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Create the same UTC dates
      const startUTC = localToUTC(bookingDate, startTimeStr, timezone);
      const endUTC = localToUTC(bookingDate, endTimeStr, timezone);
      
      // Prepare data for booking finalization and payment intent
      const amountCents = Math.round(total * 100);
      
      // Then create the payment intent
      const paymentPayload = {
        holdId: bookingDetails.booking.id,
        customerEmail: customerData.email,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        eventDate: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        eventAddress: customerData.eventAddress,
        eventCity: customerData.eventCity,
        eventState: customerData.eventState,
        eventZipCode: customerData.eventZipCode,
        eventTimeZone: timezone,
        eventType: bookingDetails.booking.eventType,
        participantCount: customerData.participantCount,
        participantAge: customerData.participantAge ? parseInt(customerData.participantAge) : undefined,
        specialInstructions: customerData.specialInstructions,
        subtotalAmount: rawSubtotal,
        taxAmount: taxAmount,
        taxRate: taxRate || 0,
        totalAmount: total,
        amountCents: amountCents,
        couponCode: appliedCoupon?.code,
        items: Array.from(selectedItems.values()).map(({ item, quantity }) => ({
          inventoryId: item.id,
          quantity,
          price: item.price,
          status: "PENDING",
          startUTC,
          endUTC,
        })),
      };
      
      const paymentResponse = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });
      
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Failed to create payment intent");
      }
      
      const paymentClientSecret = paymentData.clientSecret;
      const paymentBookingId = paymentData.bookingId;
      console.log('Received bookingId:', paymentBookingId);
      
      if (!paymentClientSecret) throw new Error("Missing client secret from server");
      
      setClientSecret(paymentClientSecret);
      setPaymentBookingId(paymentBookingId);
      setShowPaymentForm(true);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to proceed to payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Payment success handler
  const handlePaymentSuccess = async () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    
    toast({
      title: "Payment Successful",
      description: hasAddedItems ? 
        "Your booking has been updated with the additional items" : 
        "Your booking has been confirmed",
      variant: "default",
    });
    
    router.push(`/dashboard/${businessId}/bookings`);
  };

  // Payment error handler
  const handlePaymentError = (errorMessage: string) => {
    toast({
      title: "Payment Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Keep the form open so user can try again
    setIsProcessingPayment(false);
  };

  // Add a new function to prepare the difference payment payload
  const prepareDifferencePayload = () => {
    if (selectedItems.size === 0 || !hasAddedItems) {
      toast({
        title: "Error",
        description: "No new items to process payment for",
        variant: "destructive",
      });
      return null;
    }
    
    // Calculate start and end time in UTC for each item
    // Use startTime for the event date to maintain consistency
    const startTime = bookingDetails.booking?.startTime;
    const eventDate = startTime 
      ? typeof startTime === 'string'
        ? new Date(startTime)
        : startTime
      : new Date();
    
    // Format the date to YYYY-MM-DD
    const bookingDate = formatDateToYYYYMMDD(eventDate.toISOString());
    
    // Handle time strings, ensuring we convert Date objects to strings if needed
    const startTimeObj = bookingDetails.booking?.startTime;
    const startTimeStr = typeof startTimeObj === 'string' 
      ? formatTimeToHHMM(startTimeObj) 
      : formatTimeToHHMM(new Date(startTimeObj).toISOString());
    
    const endTimeObj = bookingDetails.booking?.endTime;
    const endTimeStr = typeof endTimeObj === 'string' 
      ? formatTimeToHHMM(endTimeObj) 
      : formatTimeToHHMM(new Date(endTimeObj).toISOString());
    
    // Get timezone from booking details or use browser default
    const timezone = bookingDetails.booking?.eventTimeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Create the date strings for UTC conversion
    const startUTC = localToUTC(bookingDate, startTimeStr, timezone);
    const endUTC = localToUTC(bookingDate, endTimeStr, timezone);
    
    // Create a map of original items for comparison
    const originalItems = new Map<string, { quantity: number }>();
    bookingDetails.bookingItems.forEach(item => {
      if (item.inventory) {
        originalItems.set(item.inventory.id, { quantity: item.quantity });
      }
    });
    
    // Filter only new or increased quantity items
    const addedItems = Array.from(selectedItems.values())
      .filter(({ item, quantity }) => {
        const original = originalItems.get(item.id);
        return !original || quantity > original.quantity;
      })
      .map(({ item, quantity }) => {
        const original = originalItems.get(item.id);
        const additionalQuantity = original ? quantity - original.quantity : quantity;
        
        return {
          inventoryId: item.id,
          quantity: additionalQuantity,
          price: item.price,
          status: "PENDING_PAYMENT_ADDITION", // Special status for additions
          startUTC,
          endUTC,
        };
      });
    
    const updatedBookingData = {
      // Customer information
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      specialInstructions: customerData.specialInstructions,
      
      // Event location fields
      eventAddress: customerData.eventAddress,
      eventCity: customerData.eventCity,
      eventState: customerData.eventState,
      eventZipCode: customerData.eventZipCode,
      
      // Participant fields
      participantCount: customerData.participantCount,
      participantAge: customerData.participantAge ? parseInt(customerData.participantAge) : undefined,
      
      // Format date and times correctly for API validation
      eventDate: bookingDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      eventTimeZone: timezone,
      
      // Only include the NEW or ADDITIONAL items
      items: addedItems,
      
      // Amounts for validation - just for the difference
      subtotalAmount: addedItemsTotal,
      taxAmount: (taxRate || 0) * addedItemsTotal / 100,
      totalAmount: addedItemsTotal + ((taxRate || 0) * addedItemsTotal / 100),
      
      // Coupon - we don't apply coupons to additions to confirmed bookings
      couponCode: null,
      
      // Special intent for difference payment
      intent: "prepare_for_payment_difference"
    };
    
    return updatedBookingData;
  };
  
  // Handler for paying for additional items on confirmed bookings
  const handlePayForAddedItems = async () => {
    if (isProcessingPayment || !isConfirmed || !hasAddedItems) return;
    
    if (!bookingDetails.booking?.id) {
      toast({
        title: "Error",
        description: "Booking ID not found",
        variant: "destructive",
      });
      return;
    }

    // Validate customer data before proceeding
    if (!customerData.name || !customerData.email || !customerData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required customer information",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Prepare the payload with only the difference items
      const differencePayload = prepareDifferencePayload();
      if (!differencePayload) {
        setIsProcessingPayment(false);
        return;
      }
      
      // Log the data being sent to help debug
      console.log("Sending difference payment data:", JSON.stringify(differencePayload));
      
      // Call the API to update booking with the difference items
      const updateResponse = await fetch(`/api/businesses/${businessId}/bookings/${bookingDetails.booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(differencePayload),
      });
      
      let updateData;
      try {
        updateData = await updateResponse.json();
      } catch (e) {
        console.error("Failed to parse response:", e);
        throw new Error("Invalid response from server");
      }
      
      if (!updateResponse.ok) {
        console.error("Update error details:", updateData);
        throw new Error(updateData.error || "Failed to process additional items payment");
      }
      
      console.log("Difference payment initiated successfully:", updateData);
      
      // Get the client secret for the payment
      const paymentClientSecret = updateData.clientSecret;
      if (!paymentClientSecret) throw new Error("Missing client secret from server");
      
      toast({
        title: "Payment Ready",
        description: "Please complete payment for the added items",
        variant: "default",
      });
      
      setClientSecret(paymentClientSecret);
      setShowPaymentForm(true);
      
    } catch (error) {
      console.error("Error processing difference payment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment for added items",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Add the state for bookingId at the top of the component
  const [paymentBookingId, setPaymentBookingId] = useState<string | null>(null);

  // Conditional rendering based on expiration
  if (isExpired) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Booking has expired</h3>
              <div className="mt-2 text-red-700">
                <p>This booking reservation has expired and can no longer be edited.</p>
                <p className="mt-1">You can delete this expired booking or create a new one.</p>
              </div>
              <div className="mt-4 flex">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/${businessId}/bookings`)}
                >
                  Return to bookings
                </Button>
                <Button
                  className="ml-3"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete expired booking
                </Button>
                <Button
                  className="ml-3"
                  onClick={() => router.push(`/dashboard/${businessId}/bookings/create`)}
                >
                  Create new booking
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete this expired booking? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Booking"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render the payment form if we have a client secret
  if (showPaymentForm && clientSecret) {
    const stripeInstance = getStripeInstance(
      businessData?.stripeAccountId || businessData?.stripeConnectedAccountId
    );
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {hasAddedItems ? "Pay for Additional Items" : "Complete Payment"}
          </h2>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowPaymentForm(false);
              setClientSecret(null);
            }}
          >
            Cancel Payment
          </Button>
        </div>
        
        <Card className="p-6">
          <Elements
            stripe={stripeInstance}
            options={{
              clientSecret,
              appearance: { theme: "stripe", variables: { colorPrimary: "#0F172A" } },
            }}
          >
            <PaymentForm
              amount={hasAddedItems ? addedItemsTotal + ((taxRate || 0) * addedItemsTotal / 100) : total}
              customerEmail={customerData.email}
              businessId={businessId}
              subtotal={hasAddedItems ? addedItemsTotal : rawSubtotal}
              taxAmount={hasAddedItems ? ((taxRate || 0) * addedItemsTotal / 100) : taxAmount}
              taxRate={taxRate || 0}
              bookingId={paymentBookingId || undefined}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </Card>
      </div>
    );
  }

  // Original return with expiration timer
  return (
    <div className="space-y-6">
      {/* Header - Single header with all controls in one line */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Booking</h2>
        <div className="flex gap-2">
          {/* Show Refund button for CONFIRMED bookings, Delete button for others */}
          {isConfirmed ? (
            <Button 
              variant="destructive"
              onClick={handleRefundClick}
            >
              Refund Booking
            </Button>
          ) : (
            <Button 
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Booking
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          {/* Show Save Changes button only for HOLD/PENDING */}
          {canSaveDraft && (
            <Button 
              onClick={handleSaveDraft} 
              disabled={isSavingDraft || isProcessingQuote || isProcessingPayment}
            >
              {isSavingDraft ? "Saving..." : "Save Changes"}
            </Button>
          )}
          {/* Add a placeholder for Confirmed booking actions */}
          {isConfirmed && (
            <Button 
              onClick={handleSaveDraft} 
              disabled={isSavingDraft || isProcessingQuote || isProcessingPayment}
            >
              Save Changes (Confirmed)
            </Button>
          )}
        </div>
      </div>
      
      {/* Single Expiration Timer */}
      {timeLeft && !isExpired && (
        <div className="p-3 text-center font-bold bg-yellow-100 text-amber-800 rounded-md border border-yellow-200">
          Time Left to Edit: {timeLeft}
        </div>
      )}
      
      {/* Booking Info Card - Fix date handling with utcToLocal function */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Event Date</h3>
              <p className="font-semibold">
                {bookingDetails.booking?.startTime && bookingDetails.booking?.eventTimeZone
                  ? utcToLocal(
                      typeof bookingDetails.booking.startTime === 'string' 
                        ? new Date(bookingDetails.booking.startTime) 
                        : bookingDetails.booking.startTime,
                      bookingDetails.booking.eventTimeZone, 
                      'MMM d, yyyy'
                    )
                  : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Event Time</h3>
              <p className="font-semibold">
                {bookingDetails.booking?.startTime && bookingDetails.booking?.endTime && bookingDetails.booking?.eventTimeZone
                  ? `${utcToLocal(
                      typeof bookingDetails.booking.startTime === 'string' 
                        ? new Date(bookingDetails.booking.startTime) 
                        : bookingDetails.booking.startTime,
                      bookingDetails.booking.eventTimeZone, 
                      'h:mm a'
                    )} - 
                     ${utcToLocal(
                      typeof bookingDetails.booking.endTime === 'string' 
                        ? new Date(bookingDetails.booking.endTime) 
                        : bookingDetails.booking.endTime,
                      bookingDetails.booking.eventTimeZone, 
                      'h:mm a'
                    )}`
                  : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Status</h3>
              <p className="font-semibold capitalize">
                {bookingDetails.booking?.status 
                  ? bookingDetails.booking.status.toLowerCase() 
                  : "Unknown"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete Booking"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Refund Confirmation Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Cancel and Refund Booking</DialogTitle>
            <DialogDescription className="text-gray-500">
              {isWithin24Hours ? (
                "This booking is within 24 hours of the event. A 10% cancellation fee will apply unless marked as full refund."
              ) : (
                "Are you sure you want to cancel this booking? Customer will receive a full refund."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {isWithin24Hours && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fullRefund"
                  checked={fullRefund}
                  onCheckedChange={(checked) => setFullRefund(checked as boolean)}
                />
                <Label htmlFor="fullRefund" className="text-sm text-gray-700">
                  Process full refund (override cancellation fee)
                </Label>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm text-gray-700">
                Cancellation Reason
              </Label>
              <Textarea
                id="reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter the reason for cancellation..."
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
              className="bg-white hover:bg-gray-50"
            >
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRefund}
              disabled={isProcessingRefund}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessingRefund ? "Processing..." : "Cancel & Refund"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="customer">Customer Info</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items" className="space-y-4">
          <EditProducts
            businessId={businessId}
            eventDate={bookingDetails.booking?.eventDate 
              ? formatDateToYYYYMMDD(typeof bookingDetails.booking.eventDate === 'string' 
                  ? bookingDetails.booking.eventDate 
                  : new Date(bookingDetails.booking.eventDate).toISOString())
              : formatDateToYYYYMMDD(new Date().toISOString())}
            startTime={bookingDetails.booking?.startTime 
              ? formatTimeToHHMM(typeof bookingDetails.booking.startTime === 'string'
                  ? bookingDetails.booking.startTime
                  : new Date(bookingDetails.booking.startTime).toISOString())
              : "09:00"}
            endTime={bookingDetails.booking?.endTime 
              ? formatTimeToHHMM(typeof bookingDetails.booking.endTime === 'string'
                  ? bookingDetails.booking.endTime
                  : new Date(bookingDetails.booking.endTime).toISOString())
              : "17:00"}
            bookingId={bookingDetails.booking?.id || ""}
            selectedItems={selectedItems}
            selectInventoryItem={selectInventoryItem}
            updateQuantity={updateQuantity}
          />
        </TabsContent>
        
        <TabsContent value="customer" className="space-y-4">
          <CustomerInfo
            customerData={customerData}
            setCustomerData={setCustomerData}
          />
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          <EditSummaryCard
            bookingDetails={bookingDetails}
            selectedItems={selectedItems}
            customerData={customerData}
            subtotal={rawSubtotal}
            taxAmount={taxAmount}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            couponError={couponError}
            isApplyingCoupon={isApplyingCoupon}
            handleApplyCoupon={handleApplyCouponWithCode}
            handleRemoveCoupon={handleRemoveCoupon}
          />
        </TabsContent>
      </Tabs>
      
      {/* Persistent Action Buttons - Always visible outside tabs */}
      <div className="mt-8 border-t pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* HOLD or PENDING booking buttons */}
          {isHoldOrPending && !isCurrentlyExpired && (
            <>
              <Button
                onClick={handleUpdateAndSendQuote}
                disabled={isProcessingQuote || isProcessingPayment || selectedItems.size === 0 || !isFormValid}
                variant="outline"
                className="w-full"
              >
                {isProcessingQuote ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Quote...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Update & Send Quote
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleUpdateAndProceedToPayment}
                disabled={isProcessingQuote || isProcessingPayment || selectedItems.size === 0 || total <= 0 || !isFormValid}
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Update & Proceed to Payment
                  </>
                )}
              </Button>
            </>
          )}
          
          {/* CONFIRMED booking buttons */}
          {isConfirmed && (
            <div className="w-full flex flex-col sm:flex-row gap-4">
              {/* Show either Save Changes or Pay for Added Items */}
              {hasAddedItems ? (
                <Button
                  onClick={handlePayForAddedItems}
                  disabled={isProcessingPayment || !hasAddedItems || !isFormValid}
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay for Added Items (${(addedItemsTotal + ((taxRate || 0) * addedItemsTotal / 100)).toFixed(2)})
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || isProcessingQuote || isProcessingPayment || !isFormValid}
                  variant="default"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSavingDraft ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Show details about available actions */}
        <p className="text-sm text-gray-500 text-center mt-4">
          {isConfirmed && hasAddedItems 
            ? "You're adding new items to a confirmed booking. Payment is required for the added items only."
            : isConfirmed
              ? "You can update customer information for this confirmed booking."
              : "These action buttons are always available regardless of which tab you're on."}
        </p>
      </div>
    </div>
  );
} 
