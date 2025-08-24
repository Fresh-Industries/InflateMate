import { NextRequest, NextResponse } from "next/server";
import { getPublicBookingDetails } from "@/features/booking/booking.service";

// GET endpoint to fetch public-safe booking details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; bookingId: string }> }
) {
  try {
    const { businessId, bookingId } = await params;

    const data = await getPublicBookingDetails(businessId, bookingId);
    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to fetch booking" }, { status: e?.status || 500 });
  }
} 