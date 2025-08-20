// app/api/businesses/[businessId]/bookings/route.ts
// This route handles fetching all bookings (GET) and processing the final booking
// details + creating the Stripe Payment Intent (POST).

import { NextRequest, NextResponse } from "next/server";
import { finalizeBookingAndCreatePI } from "@/features/booking/payment.service";
import { listBookings } from "@/features/booking/booking.service";

type Params = { params: Promise<{ businessId: string }> };

// --- POST: Finalize Booking and Create Payment Intent ---
export async function POST(req: NextRequest, { params }: Params ) {
  try {
    const { businessId } = await params;
    if (!businessId) return NextResponse.json({ error: "Business ID is required" }, { status: 400 });

    const body = await req.json();
    const result = await finalizeBookingAndCreatePI(businessId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // Align with business route error style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    if (e?.isExpired) return NextResponse.json({ error: e.message, isExpired: true }, { status: e?.status || 409 });
    return NextResponse.json({ error: e?.message || "Failed to finalize booking" }, { status: e?.status || 500 });
  }
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { businessId } = await params;
    const result = await listBookings(businessId);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to fetch bookings" }, { status: e?.status || 500 });
  }
}



