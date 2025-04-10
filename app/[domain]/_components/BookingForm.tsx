'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Users, MapPin, Info } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";


// Types
interface InventoryItem {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price: number;
  dimensions: string;
  capacity: number;
  imageUrl?: string | null;
}

interface Business {
  id: string;
  name: string;
  depositRequired: boolean;
  depositPercentage: number;
  minAdvanceBooking: number;
  maxAdvanceBooking: number;
  bufferTime: number;
  defaultTaxRate: number;
  applyTaxToBookings: boolean;
  siteConfig?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
    };
  } | null;
}

interface BookingFormProps {
  businessId: string;
  siteConfig?: any;
}

export default function BookingForm({ businessId, siteConfig }: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [business, setBusiness] = useState<Business | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  // Form data
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    eventType: "",
    eventAddress: "",
    eventCity: "",
    eventState: "",
    eventZipCode: "",
    participantCount: "",
    specialInstructions: "",
  });

  // Colors from site config
  const colors = siteConfig?.colors || {
    primary: "#3b82f6", // Default blue
    secondary: "#6b7280", // Default gray
    accent: "#f59e0b", // Default amber
    background: "#f9fafb", // Default gray-50
  };

  // Fetch business data and inventory items
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch business data
        const businessRes = await fetch(`/api/businesses/${businessId}`);
        const businessData = await businessRes.json();
        setBusiness(businessData);

        // Fetch inventory items
        const inventoryRes = await fetch(`/api/businesses/${businessId}/inventory?status=AVAILABLE`);
        const inventoryData = await inventoryRes.json();
        setInventoryItems(inventoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [businessId]);

  // Calculate available times when date changes
  useEffect(() => {
    if (date && selectedItem) {
      checkAvailability();
    }
  }, [date, selectedItem]);

  const checkAvailability = async () => {
    if (!date || !selectedItem) return;

    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const res = await fetch(
        `/api/businesses/${businessId}/availability?date=${formattedDate}&inventoryId=${selectedItem}`
      );
      const data = await res.json();
      setAvailableTimes(data.availableTimes || []);
    } catch (error) {
      console.error("Error checking availability:", error);
      setAvailableTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && (!date || !selectedItem || !time)) {
      alert("Please select a date, item, and time");
      return;
    }

    if (step === 2) {
      // Validate customer info
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
        alert("Please fill in all required customer information");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    
    const item = inventoryItems.find(item => item.id === selectedItem);
    if (!item) return 0;
    
    let total = item.price;
    
    // Apply tax if business settings require it
    if (business?.applyTaxToBookings && business?.defaultTaxRate) {
      const taxAmount = total * (business.defaultTaxRate / 100);
      total += taxAmount;
    }
    
    return total;
  };

  const handleSubmit = async () => {
    if (!date || !selectedItem || !time) return;

    setIsLoading(true);
    try {
      const item = inventoryItems.find(item => item.id === selectedItem);
      if (!item) throw new Error("Selected item not found");

      const [hours, minutes] = time.split(':').map(Number);
      const startTime = new Date(date);
      startTime.setHours(hours, minutes);

      // Calculate end time (typically 4-5 hours later)
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 5);

      const bookingData = {
        inventoryId: selectedItem,
        eventDate: format(date, "yyyy-MM-dd"),
        startTime: format(startTime, "HH:mm"),
        endTime: format(endTime, "HH:mm"),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        eventType: formData.eventType,
        eventAddress: formData.eventAddress,
        eventCity: formData.eventCity,
        eventState: formData.eventState,
        eventZipCode: formData.eventZipCode,
        participantCount: parseInt(formData.participantCount) || 0,
        specialInstructions: formData.specialInstructions,
        totalAmount: calculateTotal(),
      };

      const res = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Failed to create booking");

      const result = await res.json();
      
      // Redirect to payment page or confirmation
      if (business?.depositRequired) {
        router.push(`/payment/${result.id}`);
      } else {
        // Show confirmation
        setStep(4);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error creating your booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !business) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {["Select Date & Item", "Your Information", "Review & Confirm", "Complete"].map((label, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step > idx + 1 
                    ? `bg-green-500 text-white` 
                    : step === idx + 1 
                    ? `bg-[${colors.primary}] text-white` 
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > idx + 1 ? "✓" : idx + 1}
              </div>
              <span className={`text-xs ${step === idx + 1 ? "font-medium" : "text-gray-500"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-1 w-full bg-gray-200">
          <div 
            className="h-full bg-[#3b82f6]" 
            style={{ 
              width: `${(step - 1) * 33.33}%`,
              backgroundColor: colors.primary 
            }}
          ></div>
        </div>
      </div>

      {/* Step 1: Select Date & Item */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Item</CardTitle>
            <CardDescription>Choose when you need the rental and what item you want</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Event Date</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-[240px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => {
                        // Disable dates before minAdvanceBooking
                        const minDate = new Date();
                        minDate.setHours(minDate.getHours() + (business?.minAdvanceBooking || 24));
                        
                        // Disable dates after maxAdvanceBooking
                        const maxDate = new Date();
                        maxDate.setDate(maxDate.getDate() + (business?.maxAdvanceBooking || 90));
                        
                        return date < minDate || date > maxDate;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Select Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - ${item.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {date && selectedItem && (
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.length > 0 ? (
                      availableTimes.map((timeSlot) => (
                        <SelectItem key={timeSlot} value={timeSlot}>
                          {timeSlot}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No available times
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedItem && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Selected Item Details</h3>
                {(() => {
                  const item = inventoryItems.find(item => item.id === selectedItem);
                  if (!item) return null;
                  
                  return (
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {item.name}</p>
                      <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                      {item.description && <p><strong>Description:</strong> {item.description}</p>}
                      <p><strong>Dimensions:</strong> {item.dimensions}</p>
                      <p><strong>Capacity:</strong> {item.capacity} people</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleNext}
              disabled={!date || !selectedItem || !time}
              style={{ backgroundColor: colors.primary }}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Customer Information */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Tell us about yourself and the event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Your Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address</Label>
                <Input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select name="eventType" value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="school">School Event</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participantCount">Number of Participants</Label>
                <Input
                  id="participantCount"
                  name="participantCount"
                  type="number"
                  value={formData.participantCount}
                  onChange={handleInputChange}
                  placeholder="Estimated number of participants"
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="eventAddress">Event Address</Label>
                <Input
                  id="eventAddress"
                  name="eventAddress"
                  value={formData.eventAddress}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventCity">City</Label>
                  <Input
                    id="eventCity"
                    name="eventCity"
                    value={formData.eventCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventState">State</Label>
                  <Input
                    id="eventState"
                    name="eventState"
                    value={formData.eventState}
                    onChange={handleInputChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventZipCode">Zip Code</Label>
                <Input
                  id="eventZipCode"
                  name="eventZipCode"
                  value={formData.eventZipCode}
                  onChange={handleInputChange}
                  placeholder="Zip Code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special instructions or requests"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!formData.customerName || !formData.customerEmail || !formData.customerPhone}
              style={{ backgroundColor: colors.primary }}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Review & Confirm */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Confirm</CardTitle>
            <CardDescription>Please review your booking details before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Date:</strong></div>
                  <div>{date ? format(date, "PPP") : "Not selected"}</div>
                  
                  <div><strong>Time:</strong></div>
                  <div>{time}</div>
                  
                  <div><strong>Event Type:</strong></div>
                  <div>{formData.eventType || "Not specified"}</div>
                  
                  <div><strong>Participants:</strong></div>
                  <div>{formData.participantCount || "Not specified"}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Name:</strong></div>
                  <div>{formData.customerName}</div>
                  
                  <div><strong>Email:</strong></div>
                  <div>{formData.customerEmail}</div>
                  
                  <div><strong>Phone:</strong></div>
                  <div>{formData.customerPhone}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Event Location
                </h3>
                <div>
                  <p>{formData.eventAddress}</p>
                  <p>{formData.eventCity}, {formData.eventState} {formData.eventZipCode}</p>
                </div>
              </div>
              
              {formData.specialInstructions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    Special Instructions
                  </h3>
                  <p>{formData.specialInstructions}</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Selected Item</h3>
                {(() => {
                  const item = inventoryItems.find(item => item.id === selectedItem);
                  if (!item) return <p>No item selected</p>;
                  
                  return (
                    <div>
                      <p><strong>{item.name}</strong></p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <p className="mt-2"><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    </div>
                  );
                })()}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>
                    ${(() => {
                      const item = inventoryItems.find(item => item.id === selectedItem);
                      return item ? item.price.toFixed(2) : "0.00";
                    })()}
                  </span>
                </div>
                
                {business?.applyTaxToBookings && (
                  <div className="flex justify-between mb-2">
                    <span>Tax ({business.defaultTaxRate}%):</span>
                    <span>
                      ${(() => {
                        const item = inventoryItems.find(item => item.id === selectedItem);
                        if (!item) return "0.00";
                        return ((item.price * business.defaultTaxRate) / 100).toFixed(2);
                      })()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                
                {business?.depositRequired && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
                    <p>A {business.depositPercentage}% deposit (${(calculateTotal() * business.depositPercentage / 100).toFixed(2)}) is required to secure your booking.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ backgroundColor: colors.primary }}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg">Thank you for your booking!</p>
              <p className="text-gray-500 mt-2">
                We've sent a confirmation email to {formData.customerEmail} with all the details.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Date:</strong></div>
                <div>{date ? format(date, "PPP") : "Not selected"}</div>
                
                <div><strong>Time:</strong></div>
                <div>{time}</div>
                
                <div><strong>Item:</strong></div>
                <div>
                  {(() => {
                    const item = inventoryItems.find(item => item.id === selectedItem);
                    return item ? item.name : "Not selected";
                  })()}
                </div>
                
                <div><strong>Total:</strong></div>
                <div>${calculateTotal().toFixed(2)}</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                If you have any questions about your booking, please contact us.
              </p>
              <Button 
                onClick={() => router.push("/")}
                style={{ backgroundColor: colors.primary }}
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 