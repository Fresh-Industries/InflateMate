// app/api/businesses/[businessId]/holds/route.ts
// This route is called when the user selects items and a time slot
// to place a temporary 'HOLD' on the inventory.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createBookingSafely } from "@/lib/createBookingSafely";
import { BookingStatus } from "@/prisma/generated/prisma";
import { dateOnlyUTC, localToUTC } from "@/lib/utils";

// Define a schema for the MINIMAL payload required to place a HOLD
const createHoldSchema = z.object({
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> } // Use direct params
) {
  try {
    const { businessId } = await params;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    // Parse and validate the request payload using the HOLD schema
    const body = await req.json();
    console.log("[POST /holds] Received request body for HOLD:", body);

    // Validate the minimal payload for placing a hold
    const holdData = createHoldSchema.parse(body);
    console.log("[POST /holds] Parsed holdData:", holdData);

    // Fetch the business to get timezone
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, timeZone: true } // Select only necessary fields
    });

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    // --- Time Conversion ---
    // Use the timezone provided in the payload, falling back to business timezone
    const timezone = holdData.eventTimeZone || business.timeZone;
    console.log(`[POST /holds] Using timezone: ${timezone}`);

    // Convert local event date/time to UTC Date objects for storing
    const eventDateUTC = dateOnlyUTC(holdData.eventDate); // Date part only for the eventDate field
    const startUTC = localToUTC(holdData.eventDate, holdData.startTime, timezone);
    const endUTC = localToUTC(holdData.eventDate, holdData.endTime, timezone);
    console.log(`[POST /holds] Converted times: Start UTC=${startUTC.toISOString()}, End UTC=${endUTC.toISOString()}`);


    // --- Prepare Booking Data for createBookingSafely (Minimal) ---
    // Note: We provide initial/placeholder values for required fields that
    // will be updated later in the checkout/payment process.
    // customerId is now optional in the schema, so we omit it here.
    const bookingCreationData: Omit<import("@/prisma/generated/prisma").Prisma.BookingCreateInput, 'inventoryItems'> = {
        eventDate: eventDateUTC,
        startTime: startUTC,
        endTime: endUTC,
        eventTimeZone: timezone,
        status: "HOLD" as BookingStatus, // Explicitly set to HOLD
        totalAmount: 0, // Placeholder
        subtotalAmount: 0, // Placeholder
        taxAmount: 0, // Placeholder
        taxRate: 0, // Placeholder
        depositPaid: false, // Placeholder
        eventType: holdData.eventType || "OTHER",
        eventAddress: holdData.eventAddress || '', // Use default '' for optional fields
        eventCity: holdData.eventCity || '',
        eventState: holdData.eventState || '',
        eventZipCode: holdData.eventZipCode || '',
        participantCount: holdData.participantCount, // Use parsed participant count
        participantAge: holdData.participantAge, // Use parsed participant age (can be null)
        specialInstructions: holdData.specialInstructions, // Use parsed instructions (can be null)
        business: { connect: { id: businessId } }, // Connect to the business
        customer: { connect: { id: '' } }, // Connect to the customer
        coupon: undefined, // Coupon applied later
        invoice: undefined, // Invoice created later
        quote: undefined, // Quote created later
    };
    console.log("[POST /holds] Prepared bookingCreationData for HOLD:", bookingCreationData);


    // --- Prepare Item Data for createBookingSafely ---
    // Map the items from the request payload to the format expected by createBookingSafely
    const itemCreationData = holdData.selectedItems.map(item => ({
        quantity: item.quantity,
        price: item.price || 0, // Use item price or default to 0
        startUTC: startUTC, // Items inherit the booking's time slot
        endUTC: endUTC,
        status: "HOLD", // Items are also marked as HOLD
        inventoryId: item.id, // 'id' from payload is the inventoryId
    }));
     console.log("[POST /holds] Prepared itemCreationData:", itemCreationData);


    // --- Create Booking and BookingItems in Transaction (Places the HOLD) ---
    let booking;
    try {
        console.log("[POST /holds] Calling createBookingSafely to place hold...");
        booking = await createBookingSafely(
            bookingCreationData,
            itemCreationData
        );
        console.log(`[POST /holds] Booking and items successfully created with HOLD status. Booking ID: ${booking.id}`);

        // Ensure booking was created successfully before proceeding
        if (!booking) {
          // This case should ideally not happen if createBookingSafely doesn't throw,
          // but it's a safety check.
          console.error("[POST /holds] createBookingSafely returned null or undefined unexpectedly.");
          return NextResponse.json({ error: "Failed to create booking record for hold" }, { status: 500 });
        }

        // Calculate hold expiration time (30 minutes from now)
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        console.log(`[POST /holds] Hold expires at: ${expiresAt.toISOString()}`);

        // Return success with the booking ID (which represents the hold) and expiration time
        return NextResponse.json({
          success: true,
          holdId: booking.id, // Use booking.id as the hold ID
          expiresAt: expiresAt.toISOString(), // Return expiration time
        }, { status: 200 });
//eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { // Catch the custom error from createBookingSafely
      console.error("[POST /holds] Error during createBookingSafely transaction:", error);

      // Check if it's the specific booking conflict error
      if (error && typeof error === 'object' && 'name' in error && error.name === "BookingConflictError") {
        console.log("[POST /holds] BookingConflictError detected: Item already booked.");
        return NextResponse.json({
          error: "The selected item(s) are no longer available for the chosen time slot. Please check availability again."
        }, { status: 409 }); // 409 Conflict indicates a resource conflict
      }

      // Handle other potential errors from createBookingSafely or other parts of the try block
      console.error("[POST /holds] Other error creating hold:", error);
      return NextResponse.json({
        error: error instanceof Error ? error.message : "Failed to place hold on inventory",
        // Optionally include more details for debugging during development
        // details: process.env.NODE_ENV !== 'production' ? (error as any)?.message : undefined,
      }, { status: 500 });
    }
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Catch errors during initial parsing or setup
    console.error("[POST /holds] Error in main try block:", error);
    if (error instanceof z.ZodError) {
      console.log("[POST /holds] Zod validation error.");
      return NextResponse.json(
        { error: "Invalid request payload", details: error.errors },
        { status: 400 }
      );
    }
    // Handle other unexpected errors
    console.error("[POST /holds] Other unexpected error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
