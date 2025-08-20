import { NextRequest, NextResponse } from "next/server";
import { listBookingsForDate } from "@/features/booking/booking.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ businessId: string }> }) {
  try {
    const { businessId } = await params;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const result = await listBookingsForDate(businessId, date);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to fetch bookings for date" }, { status: e?.status || 500 });
  }
}