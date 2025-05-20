import { NextResponse } from 'next/server';
import { expireOverdueBookings } from '@/lib/expireBookings';

export async function GET() {
  try {
    const expiredCount = await expireOverdueBookings();
    console.log(`[Cron Job] Expire Overdue Bookings: ${expiredCount} bookings processed for expiration.`);
    return NextResponse.json({
      success: true,
      message: `Processed ${expiredCount} bookings for expiration.`,
      expiredBookingsCount: expiredCount 
    });
  } catch (error) {
    console.error("[Cron Job] Failed to expire overdue bookings:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to expire overdue bookings due to an internal error."
    }, { status: 500 });
  }
}
