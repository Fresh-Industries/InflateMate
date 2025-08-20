// app/api/businesses/[businessId]/availability/route.ts

import { NextRequest, NextResponse } from "next/server";
import { searchAvailability } from "@/features/booking/availability.service";

type Params = { params: Promise<{ businessId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { businessId } = await params;

    if (!businessId) return NextResponse.json({ error: "Business ID is required" }, { status: 400 });

    const url = new URL(req.url);
    const result = await searchAvailability(businessId, {
      date: url.searchParams.get("date"),
      startTime: url.searchParams.get("startTime"),
      endTime: url.searchParams.get("endTime"),
      tz: url.searchParams.get("tz") || undefined,
      excludeBookingId: url.searchParams.get("excludeBookingId") || undefined,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // Align with business route error style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to search availability" }, { status: e?.status || 500 });
  }
}
