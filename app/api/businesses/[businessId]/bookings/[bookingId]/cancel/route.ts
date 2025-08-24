import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils";
import { cancelBooking } from "@/features/booking/booking.service";

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
      return NextResponse.json({ error: "You don't have access to this business" }, { status: 403 });
    }

    const body = await req.json();
    const result = await cancelBooking(businessId, bookingId, body);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to cancel booking" }, { status: e?.status || 500 });
  }
}
