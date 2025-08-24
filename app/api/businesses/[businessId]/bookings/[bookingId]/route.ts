/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { UpdateBookingDataInput, BookingConflictError } from '@/lib/updateBookingSafely';
import { z } from 'zod'; // Import Zod for schema validation
import { getBookingForEdit, updateBooking, deleteBookingSafely } from "@/features/booking/booking.service";
import { updateBookingSchema } from "@/features/booking/booking.schema";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = await params;

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const details = await getBookingForEdit(businessId, bookingId);
    return NextResponse.json(details);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Schema moved to features/booking/booking.schema.ts

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized: User details missing." }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Forbidden: Access denied to this business." }, { status: 403 });
    }

    // Parse and validate the request body
    let body: UpdateBookingDataInput;
    try {
      const rawBody = await request.json();
      console.log('[API PATCH Booking] Request body:', JSON.stringify(rawBody));
      
      // Validate the request body with Zod schema
      const validatedData = updateBookingSchema.parse(rawBody);
      body = validatedData as UpdateBookingDataInput;
      
      // Log if we're processing an intent
      if (body.intent) {
        console.log(`[API PATCH Booking] Processing with intent: ${body.intent}`);
      }
    } catch (error) {
      console.error('[API PATCH Booking] Error parsing request body:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ 
          error: "Invalid request body format.", 
          details: error.errors 
        }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const updated = await updateBooking(businessId, bookingId, body);
    return NextResponse.json(updated, { status: 200 });

  } catch (error: any) {
    try {
      const { bookingId } = await params;
      console.error(`[API PATCH Booking] Error updating booking ${bookingId}:`, error);
    } catch {
      console.error(`[API PATCH Booking] Error updating booking:`, error);
    }

    // Handle specific error types
    if (error instanceof BookingConflictError) {
      return NextResponse.json({ 
        error: error.message || "Booking conflict detected - Items may no longer be available.", 
        code: "CONFLICT"
      }, { status: 409 });
    }
    
    if (error.message.includes("cannot be edited")) {
      return NextResponse.json({ 
        error: error.message, 
        code: "CANNOT_EDIT"
      }, { status: 400 });
    }
    
    if (error.message.includes("not found")) {
      return NextResponse.json({ 
        error: error.message, 
        code: "NOT_FOUND"
      }, { status: 404 });
    }

    return NextResponse.json({ error: error.message || "Internal Server Error." }, { status: 500 });
  }
}

// Delete Booking only if pending or hold if no payment has been made then it can be safely deleted 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check that the user has access to this business
    const membership = getMembershipByBusinessId(user, businessId);
    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const result = await deleteBookingSafely(businessId, bookingId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE booking route:", error);
    const e = error as { message?: string; status?: number; issues?: { message?: string }[] };
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Internal Server Error" }, { status: e?.status || 500 });
  }
}