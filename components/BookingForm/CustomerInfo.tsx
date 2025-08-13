"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { NewBookingState, SelectedItem } from '@/types/booking';
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { calculateTaxForFrontend } from "@/lib/stripe/frontend-tax-utils";

interface CustomerDetailsStepProps {
  // Pass the relevant parts of newBooking state for reading
  newBooking: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    participantCount: number;
    participantAge: string;
    specialInstructions: string;
  };
  // The setter must accept the full type from the parent's useState
  setNewBooking: React.Dispatch<React.SetStateAction<NewBookingState>>;
  // Props for tax calculation
  businessId: string;
  selectedItems: Map<string, SelectedItem>;
  appliedCoupon?: { code: string; amount: number } | null;
  // Callback for when tax is calculated
  onTaxCalculated: (taxData: {
    subtotal: number;
    taxAmount: number;
    taxRate: number;
    total: number;
    method: string;
  }) => void;
  onContinue: () => void;
}

export function CustomerDetailsStep({
  newBooking,
  setNewBooking,
  businessId,
  selectedItems,
  appliedCoupon,
  onTaxCalculated,
  onContinue,
}: CustomerDetailsStepProps) {
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);
  const { toast } = useToast();

  const validateCustomerInfo = () => {
    if (!newBooking.customerName || !newBooking.customerEmail || !newBooking.customerPhone) {
      toast({ 
        title: "Error", 
        description: "Please complete all customer details.", 
        variant: "destructive" 
      });
      return false;
    }
    if (!newBooking.eventAddress || !newBooking.eventCity || !newBooking.eventState || !newBooking.eventZipCode) {
      toast({ 
        title: "Error", 
        description: "Please complete all address details.", 
        variant: "destructive" 
      });
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateCustomerInfo()) return;
    
    setIsCalculatingTax(true);
    console.log('[CustomerInfo] Starting tax calculation...');

    try {
      // Prepare selected items for tax calculation
      const itemsPayload = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
        inventoryId: item.id,
        quantity: quantity,
        price: item.price,
      }));

      // Prepare customer address
      const customerAddress = {
        line1: newBooking.eventAddress,
        city: newBooking.eventCity,
        state: newBooking.eventState,
        postalCode: newBooking.eventZipCode,
        country: 'US'
      };

      // Calculate tax using Stripe Tax API
      const taxResult = await calculateTaxForFrontend(businessId, {
        selectedItems: itemsPayload,
        customerAddress,
        couponCode: appliedCoupon?.code || null,
      });

      console.log('[CustomerInfo] Tax calculation result:', taxResult);

      if (taxResult.success) {
        // Pass calculated tax data to parent
        onTaxCalculated({
          subtotal: taxResult.subtotalCents / 100,
          taxAmount: taxResult.taxCents / 100,
          taxRate: taxResult.taxRate,
          total: taxResult.totalCents / 100,
          method: 'stripe_tax_api'
        });

        toast({
          title: "Tax Calculated",
          description: `Tax rate: ${taxResult.taxRate.toFixed(2)}% (${taxResult.taxCents / 100 > 0 ? `$${(taxResult.taxCents / 100).toFixed(2)}` : 'No tax'})`,
        });
      } else {
        console.warn('[CustomerInfo] Tax calculation failed:', taxResult.error);
        // Use fallback - no tax
        const subtotal = itemsPayload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountedSubtotal = appliedCoupon ? Math.max(0, subtotal - appliedCoupon.amount) : subtotal;
        
        onTaxCalculated({
          subtotal: discountedSubtotal,
          taxAmount: 0,
          taxRate: 0,
          total: discountedSubtotal,
          method: 'fallback_no_tax'
        });

        toast({
          title: "Tax Calculation Unavailable",
          description: "Proceeding without tax calculation. Tax may be adjusted at payment.",
          variant: "default",
        });
      }

      // Proceed to next step
      onContinue();

    } catch (error) {
      console.error('[CustomerInfo] Error calculating tax:', error);
      toast({
        title: "Error",
        description: "Failed to calculate tax. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculatingTax(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customerName">Full Name</Label>
          <Input
            id="customerName"
            value={newBooking.customerName} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerName: e.target.value,
              })) // Use functional update
            }
            placeholder="Customer name"
            required
          />
        </div>
        {/* Customer Email */}
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={newBooking.customerEmail} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerEmail: e.target.value,
              })) // Use functional update
            }
            placeholder="customer@example.com"
            required
          />
        </div>
        {/* Customer Phone */}
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input
            id="customerPhone"
            type="tel"
            value={newBooking.customerPhone} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerPhone: e.target.value,
              })) // Use functional update
            }
            placeholder="(123) 456-7890"
            required
          />
        </div>
      </div>

      {/* Event Address */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventAddress">Event Address</Label>
          <Input
            id="eventAddress"
            value={newBooking.eventAddress} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                eventAddress: e.target.value,
              })) // Use functional update
            }
            placeholder="123 Main St"
            required
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="eventCity">City</Label>
            <Input
              id="eventCity"
              value={newBooking.eventCity} // Use prop
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventCity: e.target.value,
                })) // Use functional update
              }
              placeholder="City"
              required
            />
          </div>
          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="eventState">State</Label>
            <Input
              id="eventState"
              value={newBooking.eventState} // Use prop
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventState: e.target.value,
                })) // Use functional update
              }
              placeholder="State"
              required
            />
          </div>
          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="eventZipCode">Zip Code</Label>
            <Input
              id="eventZipCode"
              value={newBooking.eventZipCode} // Use prop
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventZipCode: e.target.value,
                })) // Use functional update
              }
              placeholder="12345"
              required
            />
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="participantCount">Number of Participants</Label>
          <Input
            id="participantCount"
            type="number"
            min={1}
            value={newBooking.participantCount} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                participantCount: parseInt(e.target.value) || 1, // Ensure it's a number
              })) // Use functional update
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="participantAge">Age Range</Label>
          <Input
            id="participantAge"
            value={newBooking.participantAge} // Use prop
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                participantAge: e.target.value,
              })) // Use functional update
            }
            placeholder="e.g., 5-12 years"
          />
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Special Instructions</Label>
        <Textarea
          id="specialInstructions"
          value={newBooking.specialInstructions} // Use prop
          onChange={(e) =>
            setNewBooking((prevBooking) => ({
              ...prevBooking,
              specialInstructions: e.target.value,
            })) // Use functional update
          }
          placeholder="Any special requests or setup instructions"
          rows={3}
        />
      </div>
      <div className="flex justify-center mt-8">
        <Button
          type="button"
          className="w-full max-w-md"
          onClick={handleContinue}
          variant="primary-gradient"
          disabled={isCalculatingTax}
        >
          {isCalculatingTax ? "Calculating Tax..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
