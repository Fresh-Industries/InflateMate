import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(
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

    // Find the booking (no need to check business.userId anymore)
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        businessId: businessId,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "COMPLETED",
        isCompleted: true,
      },
    });

    // Send real-time update via Supabase for completed booking
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('Booking')
        .update({
          status: 'COMPLETED',
          isCompleted: true,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', bookingId);
      console.log("Booking completed: real-time update sent via Supabase");
    }

    // Revalidate the bookings tag to update cached lists
    revalidateTag(`bookings-${businessId}`);
    revalidateTag('bookings');

    return NextResponse.json(updatedBooking, { status: 200 });

  } catch (error) {
    console.error("Error completing booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
