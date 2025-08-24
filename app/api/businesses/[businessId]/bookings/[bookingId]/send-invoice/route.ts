import { NextRequest, NextResponse } from 'next/server';
import { sendInvoiceForBooking } from '@/features/booking/payment.service';

export async function POST(req: NextRequest, { params }: { params: Promise<{ businessId: string; bookingId: string }>}) {
  const { businessId, bookingId } = await params;

  try {
    const result = await sendInvoiceForBooking(businessId, bookingId);
    return NextResponse.json(result);

  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e: any = error;
    if (e?.issues?.[0]?.message) return NextResponse.json({ error: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: e?.message || 'Failed to create invoice' }, { status: e?.status || 500 });
  }
} 