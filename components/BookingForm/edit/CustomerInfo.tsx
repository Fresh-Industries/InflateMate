"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoProps {
  customerData: {
    name: string;
    email: string;
    phone: string;
    specialInstructions: string | null;
    // Event location fields
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    // Participant fields
    participantCount: number;
    participantAge: string;
  };
  setCustomerData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    specialInstructions: string | null;
    // Event location fields
    eventAddress: string;
    eventCity: string;
    eventState: string;
    eventZipCode: string;
    // Participant fields
    participantCount: number;
    participantAge: string;
  }>>;
}

export function CustomerInfo({ customerData, setCustomerData }: CustomerInfoProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={customerData.name || ""}
            onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
            placeholder="Customer name"
            required
          />
        </div>
        
        {/* Customer Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={customerData.email || ""}
            onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
            placeholder="customer@example.com"
            required
          />
        </div>
        
        {/* Customer Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            value={customerData.phone || ""}
            onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
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
            value={customerData.eventAddress || ""}
            onChange={(e) => setCustomerData({ ...customerData, eventAddress: e.target.value })}
            placeholder="123 Main St"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="eventCity">City</Label>
            <Input
              id="eventCity"
              value={customerData.eventCity || ""}
              onChange={(e) => setCustomerData({ ...customerData, eventCity: e.target.value })}
              placeholder="City"
            />
          </div>
          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="eventState">State</Label>
            <Input
              id="eventState"
              value={customerData.eventState || ""}
              onChange={(e) => setCustomerData({ ...customerData, eventState: e.target.value })}
              placeholder="State"
            />
          </div>
          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="eventZipCode">Zip Code</Label>
            <Input
              id="eventZipCode"
              value={customerData.eventZipCode || ""}
              onChange={(e) => setCustomerData({ ...customerData, eventZipCode: e.target.value })}
              placeholder="12345"
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
            value={customerData.participantCount || 1}
            onChange={(e) => setCustomerData({ 
              ...customerData, 
              participantCount: parseInt(e.target.value) || 1 
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="participantAge">Age Range</Label>
          <Input
            id="participantAge"
            value={customerData.participantAge || ""}
            onChange={(e) => setCustomerData({ ...customerData, participantAge: e.target.value })}
            placeholder="e.g., 5-12 years"
          />
        </div>
      </div>
      
      {/* Special Instructions */}
      <div className="space-y-2">
        <Label htmlFor="special-instructions">Special Instructions</Label>
        <Textarea 
          id="special-instructions" 
          className="min-h-32"
          value={customerData.specialInstructions || ""}
          onChange={(e) => setCustomerData({ ...customerData, specialInstructions: e.target.value })}
          placeholder="Any special requests or setup instructions"
        />
      </div>
    </div>
  );
}
