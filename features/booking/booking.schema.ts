import { z } from "zod";

// Define a schema for the FULL payload when finalizing the booking
export const finalizeBookingSchema = z.object({
    holdId: z.string().cuid("Invalid hold ID format"), // Require the ID from the previous HOLD step
    customerEmail: z.string().email("Invalid email address"),
    customerName: z.string().min(1, "Customer name is required"),
    customerPhone: z.string().min(1, "Customer phone is required"),
    // Event details might be resent or assumed from the holdId lookup
    // Include them here for validation and potential updates to the booking
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (expected HH:MM)"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (expected HH:MM)"),
    eventAddress: z.string().min(1, "Event address is required"),
    eventCity: z.string().min(1, "Event city is required"),
    eventState: z.string().min(1, "Event state is required"),
    eventZipCode: z.string().min(1, "Event zip code is required"),
    eventTimeZone: z.string().optional(), // Timezone used for the event
    eventType: z.string().optional().nullable(),
    participantCount: z.number().min(1, "Participant count must be at least 1"),
    participantAge: z.number().optional().nullable(),
    specialInstructions: z.string().optional().nullable(),
    // Amounts based on final calculation after items/coupon/tax
    subtotalAmount: z.number().min(0, "Subtotal amount must be non-negative"), // Amount in dollars
    taxAmount: z.number().min(0, "Tax amount must be non-negative"),       // Amount in dollars
    taxRate: z.number().min(0, "Tax rate must be non-negative"),           // Percentage rate
    totalAmount: z.number().min(0, "Total amount must be non-negative"),     // Amount in dollars (should match amount in cents / 100)
    // The amount in cents for the Payment Intent
    amountCents: z.number().int().min(0, "Amount in cents must be non-negative integer"),
  
    // Coupon applied, if any
    couponCode: z.string().optional().nullable(),
    // selectedItems are NOT needed here as they are part of the held booking
});

export const createHoldSchema = z.object({
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (expected HH:MM)"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (expected HH:MM)"),
    // Make location fields optional for the initial hold
    eventAddress: z.string().optional().nullable().default(''),
    eventCity: z.string().optional().nullable().default(''),
    eventState: z.string().optional().nullable().default(''),
    eventZipCode: z.string().optional().nullable().default(''),
    eventTimeZone: z.string().optional(), // Will fallback to business timezone if not provided
    eventType: z.string().optional().nullable().default('OTHER'),
    participantCount: z.number().min(0).default(0), // Default to 0 if not provided
    participantAge: z.number().optional().nullable(),
    specialInstructions: z.string().optional().nullable(),
    selectedItems: z.array(z.object({
      id: z.string(), // This is the Inventory ID
      quantity: z.number().min(1, "Item quantity must be at least 1"),
      // Price is not strictly needed for the HOLD, but keep it if available
      price: z.number().optional().nullable().default(0),
    })).min(1, "At least one item must be selected"), // Ensure at least one item
    // Customer info, amounts, coupon info are NOT needed for the initial HOLD
});

export const calculateTaxSchema = z.object({
    selectedItems: z.array(z.object({
      inventoryId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })),
    customerAddress: z.object({
      line1: z.string().min(1, "Address line 1 is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      postalCode: z.string().min(1, "Zip code is required"),
      country: z.string().optional().default('US'),
    }).nullable(), // Address can be null if not yet entered
    couponCode: z.string().optional().nullable(),
});

// Define a schema for the booking update request body
export const updateBookingSchema = z.object({
    // Customer information
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
    
    // Special instructions
    specialInstructions: z.string().nullable().optional(),
    
    // Event location fields
    eventAddress: z.string().optional(),
    eventCity: z.string().optional(),
    eventState: z.string().optional(),
    eventZipCode: z.string().optional(),
    
    // Participant fields
    participantCount: z.number().int().min(1).optional(),
    participantAge: z.number().int().positive().nullable().optional(),
    
    // Original date/time fields - typically shouldn't change in edit flow but kept for validation
    eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    eventTimeZone: z.string().optional(),
    
    // Inventory items - make optional to allow confirmed booking updates without items
    items: z.array(
      z.object({
        inventoryId: z.string(),
        quantity: z.number().int().min(1),
        price: z.number().min(0),
        // These will be converted to Date objects in updateBookingSafely
        startUTC: z.date().or(z.string()),
        endUTC: z.date().or(z.string()),
        status: z.string().optional(),
      })
    ).optional(),
    
    // Amounts for validation
    subtotalAmount: z.number().min(0).optional(),
    taxAmount: z.number().min(0).optional(),
    totalAmount: z.number().min(0).optional(),
    
    // Coupon
    couponCode: z.string().optional().nullable(),
    
    // Intent for prepare_for_quote or prepare_for_payment
    intent: z.enum([
      "prepare_for_quote", 
      "prepare_for_payment", 
      "prepare_for_payment_difference",
      "update_customer_info_only"
    ]).optional(),
});

// Schema for cancellation request
export const cancelBookingSchema = z.object({
    fullRefund: z.boolean().default(false),
    reason: z.string().optional(),
});

export const availabilitySearchSchema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (expected YYYY-MM-DD)"),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (expected HH:MM)"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (expected HH:MM)"),
    tz: z.string().optional(),
    excludeBookingId: z.string().optional(),
  });