"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { NewBookingState } from '@/types/booking';
import { Button } from "@/components/ui/button";
import { themeConfig } from "@/app/[domain]/_themes/themeConfig";
import { ThemeColors } from "@/app/[domain]/_themes/types";
import { User, Mail, Phone, Home, Users, Calendar, MessageCircle } from "lucide-react";

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
  themeName?: keyof typeof themeConfig;
  colors?: ThemeColors;
}

export function CustomerDetailsStep({
  newBooking,
  setNewBooking,
  onContinue,
  themeName = "modern",
  colors,
}: CustomerDetailsStepProps) {
  const theme = themeConfig[themeName] ?? themeConfig.modern;

  // minimal, neutral fall‑back if a palette or style slice is missing
  const fallbackColors: ThemeColors = {
    primary: { 100: "#a5b4fc", 500: "#4f46e5", 900: "#312e81" },
    secondary: { 100: "#99f6e4", 500: "#06b6d4", 900: "#134e4a" },
    accent: { 100: "#fdba74", 500: "#f97316", 900: "#7c2d12" },
    background: { 100: "#ffffff", 500: "#f3f4f6", 900: "#111827" },
    text: { 100: "#ffffff", 500: "#6b7280", 900: "#111827" },
  };
  const c = colors ?? fallbackColors; // shorthand used below

  /* ----------------------------------------------------------------- */
  /*                          THEME STYLING                            */
  /* ----------------------------------------------------------------- */
  
  // Section styles - use bookingStyles from theme
  const sectionStyle = {
    background: theme.bookingStyles.formBackground(c),
    color: theme.bookingStyles.formTextColor(c),
    borderRadius: theme.cardStyles.borderRadius ?? "12px",
    boxShadow: theme.bookingStyles.formShadow(c),
    border: theme.bookingStyles.formBorder(c),
    animation: theme.animations?.elementEntrance || 'none',
  };
  
  // Input styles
  const inputStyle = {
    background: theme.bookingStyles.input.background(c),
    border: `1px solid ${theme.bookingStyles.input.border(c)}`,
    borderRadius: "6px",
  };
  
  const labelStyle = {
    color: theme.bookingStyles.input.labelColor(c),
    fontWeight: 'medium',
  };
  
  // Heading styles
  const headingStyle = {
    color: c.primary[900],
    fontWeight: 'bold',
  };
  
  const subtitleStyle = {
    color: c.text[500]
  };

  // Button styles
  const primaryButton = {
    backgroundColor: theme.buttonStyles.background(c),
    color: theme.buttonStyles.textColor(c),
    border: theme.buttonStyles.border?.(c) ?? "none",
    boxShadow: theme.buttonStyles.boxShadow?.(c),
    borderRadius: theme.buttonStyles.borderRadius ?? "9999px",
    transition: theme.buttonStyles.transition ?? "all 0.2s ease",
    ...(theme.buttonStyles.customStyles?.(c) ?? {}),
  };
  
  const primaryButtonHover = {
    backgroundColor: theme.buttonStyles.hoverBackground(c),
    color: theme.buttonStyles.hoverTextColor?.(c) ?? c.text[100],
    border: theme.buttonStyles.hoverBorder?.(c) ?? primaryButton.border,
    boxShadow: theme.buttonStyles.hoverBoxShadow?.(c) ?? primaryButton.boxShadow,
  };

  return (
    <section className="space-y-6 p-6 sm:p-8 rounded-lg" style={sectionStyle}>
      {/* SECTION TITLE */}
      <div className="mb-6 relative">
        <h2 
          className="text-2xl mb-2"
          style={headingStyle}
        >
          Customer Details
        </h2>
        <p 
          className="text-sm opacity-80"
          style={subtitleStyle}
        >
          Please provide your contact information and event details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customerName" className="flex items-center gap-1.5" style={labelStyle}>
            <User className="h-4 w-4" /> Full Name
          </Label>
          <Input
            id="customerName"
            value={newBooking.customerName}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerName: e.target.value,
              }))
            }
            placeholder="Customer name"
            required
            style={inputStyle}
          />
        </div>
        {/* Customer Email */}
        <div className="space-y-2">
          <Label htmlFor="customerEmail" className="flex items-center gap-1.5" style={labelStyle}>
            <Mail className="h-4 w-4" /> Email
          </Label>
          <Input
            id="customerEmail"
            type="email"
            value={newBooking.customerEmail}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerEmail: e.target.value,
              }))
            }
            placeholder="customer@example.com"
            required
            style={inputStyle}
          />
        </div>
        {/* Customer Phone */}
        <div className="space-y-2">
          <Label htmlFor="customerPhone" className="flex items-center gap-1.5" style={labelStyle}>
            <Phone className="h-4 w-4" /> Phone
          </Label>
          <Input
            id="customerPhone"
            type="tel"
            value={newBooking.customerPhone}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                customerPhone: e.target.value,
              }))
            }
            placeholder="(123) 456-7890"
            required
            style={inputStyle}
          />
        </div>
      </div>

      {/* Event Address */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventAddress" className="flex items-center gap-1.5" style={labelStyle}>
            <Home className="h-4 w-4" /> Event Address
          </Label>
          <Input
            id="eventAddress"
            value={newBooking.eventAddress}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                eventAddress: e.target.value,
              }))
            }
            placeholder="123 Main St"
            required
            style={inputStyle}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="eventCity" style={labelStyle}>City</Label>
            <Input
              id="eventCity"
              value={newBooking.eventCity}
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventCity: e.target.value,
                }))
              }
              placeholder="City"
              required
              style={inputStyle}
            />
          </div>
          {/* State */}
          <div className="space-y-2">
            <Label htmlFor="eventState" style={labelStyle}>State</Label>
            <Input
              id="eventState"
              value={newBooking.eventState}
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventState: e.target.value,
                }))
              }
              placeholder="State"
              required
              style={inputStyle}
            />
          </div>
          {/* Zip Code */}
          <div className="space-y-2">
            <Label htmlFor="eventZipCode" style={labelStyle}>Zip Code</Label>
            <Input
              id="eventZipCode"
              value={newBooking.eventZipCode}
              onChange={(e) =>
                setNewBooking((prevBooking) => ({
                  ...prevBooking,
                  eventZipCode: e.target.value,
                }))
              }
              placeholder="12345"
              required
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="participantCount" className="flex items-center gap-1.5" style={labelStyle}>
            <Users className="h-4 w-4" /> Number of Participants
          </Label>
          <Input
            id="participantCount"
            type="number"
            min={1}
            value={newBooking.participantCount}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                participantCount: parseInt(e.target.value) || 1,
              }))
            }
            required
            style={inputStyle}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="participantAge" className="flex items-center gap-1.5" style={labelStyle}>
            <Calendar className="h-4 w-4" /> Age Range
          </Label>
          <Input
            id="participantAge"
            value={newBooking.participantAge}
            onChange={(e) =>
              setNewBooking((prevBooking) => ({
                ...prevBooking,
                participantAge: e.target.value,
              }))
            }
            placeholder="e.g., 5-12 years"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <Label htmlFor="specialInstructions" className="flex items-center gap-1.5" style={labelStyle}>
          <MessageCircle className="h-4 w-4" /> Special Instructions
        </Label>
        <Textarea
          id="specialInstructions"
          value={newBooking.specialInstructions}
          onChange={(e) =>
            setNewBooking((prevBooking) => ({
              ...prevBooking,
              specialInstructions: e.target.value,
            }))
          }
          placeholder="Any special requests or setup instructions"
          rows={3}
          style={inputStyle}
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <Button
          type="button"
          className="w-full max-w-md py-3 px-6 text-base"
          style={primaryButton}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, primaryButtonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, primaryButton)}
          onClick={onContinue}
        >
          Continue to Next Step
        </Button>
      </div>
    </section>
  );
}
