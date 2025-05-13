"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { NewBookingState } from '@/types/booking';
import { Button } from "../ui/button";
// No need for useToast here if validation stays in parent
// No need for any other imports from the main form

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
  // No need for validateCustomerInfo prop, parent calls it
  onContinue: () => void;
}

export function CustomerDetailsStep({
  newBooking,
  setNewBooking,
  onContinue,
}: CustomerDetailsStepProps) {
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
          onClick={onContinue}
          variant="primary-gradient"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
