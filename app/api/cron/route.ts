// app/api/cron/expire-holds/route.ts
import { NextResponse } from 'next/server';
import { expireHolds } from '@/lib/holdExpires';

export async function GET() {
  try {
    const expiredCount = await expireHolds();
    return NextResponse.json({ 
      success: true, 
      expiredHoldsCount: expiredCount 
    });
  } catch (error) {
    console.error("Failed to expire holds", error);
    return NextResponse.json({ 
      error: "Failed to expire holds" 
    }, { status: 500 });
  }
}
