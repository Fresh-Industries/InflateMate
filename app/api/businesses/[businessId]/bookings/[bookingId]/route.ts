/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { updateBookingSafely, UpdateBookingDataInput, BookingConflictError } from '@/lib/updateBookingSafely';
import { z } from 'zod'; // Placeholder for Zod schema

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
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        inventoryItems: { include: { inventory: true } },
        customer: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Transform the data to match BookingFullDetails format
    const bookingFullDetails = {
      booking: {
        id: booking.id,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalAmount: booking.totalAmount,
        eventType: booking.eventType,
        eventAddress: booking.eventAddress,
        eventCity: booking.eventCity,
        eventState: booking.eventState,
        eventZipCode: booking.eventZipCode,
        eventTimeZone: booking.eventTimeZone || "America/Chicago",
        participantCount: booking.participantCount,
        participantAge: booking.participantAge,
        specialInstructions: booking.specialInstructions,
        expiresAt: booking.expiresAt,
      },
      customer: booking.customer ? {
        id: booking.customer.id,
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
      } : null,
      bookingItems: booking.inventoryItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        startUTC: item.startUTC,
        endUTC: item.endUTC,
        inventory: {
          id: item.inventory.id,
          name: item.inventory.name,
          description: item.inventory.description,
          primaryImage: item.inventory.primaryImage,
        }
      }))
    };

    return NextResponse.json(bookingFullDetails);
  } catch (error) {
    console.error("Error in GET booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Placeholder Zod schema for UpdateBookingDataInput - define this properly based on your needs
// const UpdateBookingDataSchema = z.object({...

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;
    const user = await getCurrentUserWithOrgAndBusiness();

    if (!user || !user.membership || !user.membership.organization) {
      return NextResponse.json({ error: "Unauthorized: User or organization details missing." }, { status: 401 });
    }

    const userBusiness = user.membership.organization.business;
    if (!userBusiness || userBusiness.id !== businessId) {
      return NextResponse.json({ error: "Forbidden: Access denied to this business." }, { status: 403 });
    }

    // At this point, user is authenticated and authorized for the businessId

    let body: UpdateBookingDataInput;
    try {
      const rawBody = await request.json();
      // body = UpdateBookingDataSchema.parse(rawBody); // Recommended 
      body = rawBody as UpdateBookingDataInput; // Bypassing for now
      if (!body || typeof body !== 'object' || !Array.isArray(body.items) || body.items.length === 0) {
        return NextResponse.json({ error: "Invalid request body. 'items' array is required and cannot be empty." }, { status: 400 });
      }
    } catch (error) {
      console.error('[API PATCH Booking] Error parsing request body:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: "Invalid request body format.", details: error.errors }, { status: 400 });
      }
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    console.log(`[API PATCH Booking] User ${user.id} attempting to update booking ${bookingId} for business ${businessId}`);
    
    const updatedBooking = await updateBookingSafely(bookingId, businessId, body);

    console.log(`[API PATCH Booking] Successfully updated booking ${updatedBooking.id}`);
    return NextResponse.json(updatedBooking, { status: 200 });

  } catch (error: any) {
    try {
      const { bookingId } = await params;
      console.error(`[API PATCH Booking] Error updating booking ${bookingId}:`, error);
    } catch {
      console.error(`[API PATCH Booking] Error updating booking:`, error);
    }

    if (error instanceof BookingConflictError) {
      return NextResponse.json({ error: error.message || "Booking conflict detected." }, { status: 409 });
    }
    if (error.message.includes("cannot be edited") || error.message.includes("not found")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
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
    const userBusinessId = user.membership?.organization?.business?.id;
    if (!userBusinessId || userBusinessId !== businessId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get the booking with all related records
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, businessId },
      include: {
        payments: true,
        waivers: true,
        invoice: true,
        quote: true,
        inventoryItems: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only allow deletion of PENDING or HOLD bookings
    if (booking.status !== "PENDING" && booking.status !== "HOLD") {
      return NextResponse.json(
        { error: "Only PENDING or HOLD bookings can be deleted" },
        { status: 400 }
      );
    }

    // Check if there are any completed payments
    const hasCompletedPayments = booking.payments.some(
      (payment) => payment.status === "COMPLETED"
    );
    if (hasCompletedPayments) {
      return NextResponse.json(
        { error: "Cannot delete booking with completed payments" },
        { status: 400 }
      );
    }

    // Delete the booking and all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      if (booking.invoice) {
        await tx.invoice.delete({
          where: { id: booking.invoice.id },
        });
      }

      if (booking.quote) {
        await tx.quote.delete({
          where: { id: booking.quote.id },
        });
      }

      // Delete payments
      await tx.payment.deleteMany({
        where: { bookingId },
      });

      // Delete waivers
      await tx.waiver.deleteMany({
        where: { bookingId },
      });

      // Delete booking items
      await tx.bookingItem.deleteMany({
        where: { bookingId },
      });

      // Finally delete the booking
      await tx.booking.delete({
        where: { id: bookingId },
      });
    });

    return NextResponse.json(
      { message: "Booking and related records deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE booking route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}