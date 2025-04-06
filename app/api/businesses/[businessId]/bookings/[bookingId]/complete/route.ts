import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/clerk-utils";
import { revalidateTag } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId, bookingId } = await params;

    // Verify user owns the business associated with the booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        businessId: businessId,
        business: {
          userId: user.id,
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or access denied" }, { status: 404 });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
        isCompleted: true, // Ensure this flag is set if you use it elsewhere
      },
    });

    // Revalidate the bookings tag to update cached lists
    revalidateTag(`bookings-${businessId}`); // Optional: Use a more specific tag if needed
    revalidateTag('bookings'); // Revalidate general bookings list

    return NextResponse.json(updatedBooking, { status: 200 });

  } catch (error) {
    console.error("Error completing booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 