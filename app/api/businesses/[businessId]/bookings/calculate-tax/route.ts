import { NextRequest, NextResponse } from "next/server";
import { calculateTaxQuote } from "@/features/booking/payment.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    const body = await req.json();
    const result = await calculateTaxQuote(businessId, body);
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || "Failed to calculate tax" }, { status: e?.status || 500 });
  }
}