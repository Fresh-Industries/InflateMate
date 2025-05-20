"use client";

import React, { useState, useEffect } from "react";
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
import { formatDateToYYYYMMDD, formatTimeToHHMM, utcToLocal } from "@/lib/utils";

interface EditBookingFormProps {
  businessId: string;
  bookingDetails: BookingFullDetails;
}

export function EditBookingForm({ businessId, bookingDetails }: EditBookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("items");
  const [isSaving, setIsSaving] = useState(false);
  
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
  const { taxRate, applyTax } = useBusinessDetails(businessId);
  const [couponCode, setCouponCode] = useState("");
  
  // Add expiration timer state
  const [isExpired, setIsExpired] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        price: item.price || 0,
        // Required properties per InventoryItem interface
        type: "",
        stripeProductId: "",
        dimensions: "",
        capacity: 0,
        ageRange: "",
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
        setIsExpired(true);
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
  }, [bookingDetails?.booking?.expiresAt]);

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

  // Modify the handleSaveChanges function to include all customer data fields
  const handleSaveChanges = async () => {
    if (isSaving || isExpired) return;
    
    // Check if booking ID exists
    if (!bookingDetails.booking?.id) {
      toast({
        title: "Error",
        description: "Could not find booking ID",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare data for update
      const updatedBookingData = {
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        specialInstructions: customerData.specialInstructions,
        // Add event location fields
        eventAddress: customerData.eventAddress,
        eventCity: customerData.eventCity,
        eventState: customerData.eventState,
        eventZipCode: customerData.eventZipCode,
        // Add participant fields
        participantCount: customerData.participantCount,
        participantAge: customerData.participantAge ? parseInt(customerData.participantAge) : undefined,
        // Add inventory items
        items: Array.from(selectedItems.values()).map(({ item, quantity }) => ({
          inventoryId: item.id,
          quantity,
          price: item.price,
        })),
        couponCode: appliedCoupon?.code
      };
      
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
        description: "Booking updated successfully",
      });
      
      // Navigate back to bookings list
      router.push(`/dashboard/${businessId}/bookings`);
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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

  // Original return with expiration timer
  return (
    <div className="space-y-6">
      {/* Header - Single header with all controls in one line */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Booking</h2>
        <div className="flex gap-2">
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Booking
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
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
                {bookingDetails.booking?.eventDate && bookingDetails.booking?.eventTimeZone
                  ? utcToLocal(new Date(bookingDetails.booking.eventDate), bookingDetails.booking.eventTimeZone, 'MMM d, yyyy')
                  : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500">Event Time</h3>
              <p className="font-semibold">
                {bookingDetails.booking?.startTime && bookingDetails.booking?.endTime && bookingDetails.booking?.eventTimeZone
                  ? `${utcToLocal(new Date(bookingDetails.booking.startTime), bookingDetails.booking.eventTimeZone, 'h:mm a')} - 
                     ${utcToLocal(new Date(bookingDetails.booking.endTime), bookingDetails.booking.eventTimeZone, 'h:mm a')}`
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
              ? formatDateToYYYYMMDD(new Date(bookingDetails.booking.eventDate).toISOString())
              : formatDateToYYYYMMDD(new Date().toISOString())}
            startTime={bookingDetails.booking?.startTime 
              ? formatTimeToHHMM(new Date(bookingDetails.booking.startTime).toISOString())
              : "09:00"}
            endTime={bookingDetails.booking?.endTime 
              ? formatTimeToHHMM(new Date(bookingDetails.booking.endTime).toISOString())
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
    </div>
  );
} 