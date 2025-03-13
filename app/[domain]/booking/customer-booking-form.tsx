'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Define the type for bounce houses
interface BounceHouse {
  id: string;
  name: string;
  price: number;
  status: string;
  description?: string;
  primaryImage?: string;
}

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  eventDate: z.date({ required_error: "Please select a date" }),
  eventType: z.string().min(1, { message: "Please select an event type" }),
  participantCount: z.coerce.number().min(1, { message: "Must have at least 1 participant" }),
  bounceHouseId: z.string().min(1, { message: "Please select a bounce house" }),
  eventAddress: z.string().min(5, { message: "Please enter a valid address" }),
  eventCity: z.string().min(2, { message: "Please enter a city" }),
  eventState: z.string().min(2, { message: "Please enter a state" }),
  eventZipCode: z.string().min(5, { message: "Please enter a valid zip code" }),
  specialInstructions: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerBookingFormProps {
  businessId: string;
  bounceHouses: BounceHouse[];
}

export function CustomerBookingForm({ businessId, bounceHouses }: CustomerBookingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      participantCount: 10,
      bounceHouseId: "",
      eventAddress: "",
      eventCity: "",
      eventState: "",
      eventZipCode: "",
      specialInstructions: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Find the selected bounce house to get its price
      const selectedBounceHouse = bounceHouses.find(bh => bh.id === data.bounceHouseId);
      if (!selectedBounceHouse) {
        throw new Error("Selected bounce house not found");
      }
      
      // Calculate the amount in cents
      const amount = Math.round(selectedBounceHouse.price * 100);
      
      // Prepare the metadata for the payment intent
      const metadata = {
        businessId,
        bounceHouseId: data.bounceHouseId,
        eventDate: format(data.eventDate, "yyyy-MM-dd"),
        eventType: data.eventType,
        participantCount: data.participantCount.toString(),
        customerName: data.name,
        customerPhone: data.phone,
        eventAddress: data.eventAddress,
        eventCity: data.eventCity,
        eventState: data.eventState,
        eventZipCode: data.eventZipCode,
        specialInstructions: data.specialInstructions || "",
      };
      
      // Create a payment intent
      const response = await fetch(`/api/businesses/${businessId}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          customerEmail: data.email,
          metadata,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create booking");
      }
      
      const result = await response.json();
      
      // Show success message
      toast({
        title: "Booking Request Submitted",
        description: "Your booking request has been submitted successfully. We'll contact you shortly to confirm.",
      });
      
      // Redirect to a confirmation page or payment page
      // For now, we'll just reset the form
      form.reset();
      
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit booking request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customer Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Event Details</h3>
              
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="school">School Event</SelectItem>
                        <SelectItem value="community">Community Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="participantCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Participants</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Event Location & Bounce House Selection */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Event Location</h3>
              
              <FormField
                control={form.control}
                name="eventAddress"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="eventCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eventState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="eventZipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Zip Code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Bounce House Selection</h3>
              
              <FormField
                control={form.control}
                name="bounceHouseId"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Select Bounce House</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bounce house" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bounceHouses.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} - ${item.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any special instructions or requirements" 
                        className="resize-none" 
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Include any special requests or setup instructions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Booking Request"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
} 