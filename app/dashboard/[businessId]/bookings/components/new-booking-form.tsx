'use client';

import { useState } from "react";
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
import { stripePromise } from "@/lib/stripe-client";
import { PaymentForm } from "./payment-form";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  CreditCard,
} from "lucide-react";

export function NewBookingForm({ businessId }: { businessId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [newBooking, setNewBooking] = useState({
    bounceHouseId: "",
    packageId: null,
    addOnIds: [],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    eventType: "OTHER",
    eventAddress: "",
    eventCity: "",
    eventState: "",
    eventZipCode: "",
    participantCount: 1,
    participantAge: "",
    specialInstructions: "",
  });

  // Steps for progress indicator
  const steps = [
    { number: 1, title: "Event Details", icon: Calendar },
    { number: 2, title: "Customer Info", icon: User },
    { number: 3, title: "Review & Pay", icon: CreditCard },
  ];

  // Validate steps before progressing
  const validateEventDetails = () => {
    if (!newBooking.eventDate || !newBooking.startTime || !newBooking.endTime || !newBooking.bounceHouseId) {
      toast({ title: "Error", description: "Please complete all event details.", variant: "destructive" });
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
      handleSubmit();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Submit booking: first collect payment details, then create booking after successful payment
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const amount = calculateTotal();
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid total amount.");

      const metadata = {
        bounceHouseId: newBooking.bounceHouseId,
        eventDate: newBooking.eventDate,
        startTime: newBooking.startTime,
        endTime: newBooking.endTime,
        eventType: newBooking.eventType,
        eventAddress: newBooking.eventAddress,
        eventCity: newBooking.eventCity,
        eventState: newBooking.eventState,
        eventZipCode: newBooking.eventZipCode,
        participantCount: newBooking.participantCount,
        participantAge: newBooking.participantAge,
        specialInstructions: newBooking.specialInstructions,
        totalAmount: amount,
        customerName: newBooking.customerName,
        customerEmail: newBooking.customerEmail,
        customerPhone: newBooking.customerPhone,
      };

      const paymentResponse = await fetch(`/api/businesses/${businessId}/payments/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          customerEmail: newBooking.customerEmail,
          metadata,
        }),
      });
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentData.error || "Payment intent failed");

      setPendingBookingData({ ...metadata });
      setClientSecret(paymentData.clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to process booking", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the total amount from selected options
  const calculateTotal = () => {
    let total = 0;
    // (Assume bounce house, package, and add-on prices are fetched and used here)
    // For demo, add dummy amounts
    total += 100; // bounce house price
    total += 50;  // package price (if any)
    total += 20;  // add-ons
    return total;
  };

  // Render payment form if needed
  if (showPaymentForm && clientSecret && pendingBookingData) {
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
        <Elements stripe={stripePromise} options={{
          clientSecret,
          appearance: { theme: 'stripe', variables: { colorPrimary: '#0F172A' } },
        }}>
          <PaymentForm
            amount={calculateTotal()}
            bookingId={pendingBookingData.bookingId}
            customerEmail={pendingBookingData.customerEmail}
            onSuccess={async () => {
              router.push(`/dashboard/${businessId}/bookings`);
            }}
            onError={(error) => toast({ title: "Payment Error", description: error, variant: "destructive" })}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
              ${currentStep >= step.number ? 'bg-primary text-primary-foreground border-primary' : 'border-gray-300 text-gray-300'}`}>
              <step.icon className="w-5 h-5" />
            </div>
            <span className={`mt-2 text-sm font-medium ${currentStep >= step.number ? 'text-primary' : 'text-gray-300'}`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`absolute top-5 left-10 w-[calc(100%-2.5rem)] h-[2px] ${currentStep > step.number ? 'bg-primary' : 'bg-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Date</Label>
                <Input
                  type="date"
                  value={newBooking.eventDate}
                  onChange={(e) => setNewBooking({ ...newBooking, eventDate: e.target.value, bounceHouseId: "" })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newBooking.startTime}
                  onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value, bounceHouseId: "" })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newBooking.endTime}
                  onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value, bounceHouseId: "" })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={newBooking.eventType || undefined} onValueChange={(value) => setNewBooking({ ...newBooking, eventType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BIRTHDAY">Birthday Party</SelectItem>
                    <SelectItem value="CORPORATE">Corporate Event</SelectItem>
                    <SelectItem value="SCHOOL">School Event</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Bounce House Selection would be loaded here via useQuery */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Bounce House</h3>
              {/* Render available bounce houses */}
              {/* (Assume fetched data renders cards here with selection logic) */}
              <p className="text-muted-foreground">Bounce houses will load once you set the date and time.</p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={newBooking.customerName} onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newBooking.customerEmail} onChange={(e) => setNewBooking({ ...newBooking, customerEmail: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={newBooking.customerPhone} onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                placeholder="Any special requirements or notes"
                value={newBooking.specialInstructions}
                onChange={(e) => setNewBooking({ ...newBooking, specialInstructions: e.target.value })}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Event Date:</span>
                  <p>{newBooking.eventDate}</p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p>{newBooking.startTime} - {newBooking.endTime}</p>
                </div>
                <div>
                  <span className="font-medium">Customer:</span>
                  <p>{newBooking.customerName}</p>
                </div>
                <div>
                  <span className="font-medium">Contact:</span>
                  <p>{newBooking.customerEmail}</p>
                  <p>{newBooking.customerPhone}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : currentStep === 3 ? (
            'Proceed to Payment'
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
