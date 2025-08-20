// app/api/businesses/[businessId]/holds/route.ts
// This route is called when the user selects items and a time slot
// to place a temporary 'HOLD' on the inventory.

import { NextRequest, NextResponse } from "next/server";
import { createHold } from "@/features/booking/booking.service";

type Params = { params: Promise<{ businessId: string }> };

export async function POST(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { businessId } = await params;
    if (!businessId) return NextResponse.json({ error: "Business ID is required" }, { status: 400 });

    const body = await req.json();
    const result = await createHold(businessId, body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    // Align with business route error style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = err;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to place hold on inventory" }, { status: e?.status || 500 });
  }
}
