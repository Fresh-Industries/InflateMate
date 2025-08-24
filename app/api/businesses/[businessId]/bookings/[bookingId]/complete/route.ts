import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { revalidateTag } from "next/cache";
import { completeBooking } from "@/features/booking/booking.service";

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

    const updatedBooking = await completeBooking(businessId, bookingId);

    // Revalidate the bookings tag to update cached lists
    revalidateTag(`bookings-${businessId}`);
    revalidateTag('bookings');

    return NextResponse.json(updatedBooking, { status: 200 });

  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to complete booking" }, { status: e?.status || 500 });
  }
}
