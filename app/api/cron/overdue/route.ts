import { NextRequest, NextResponse } from "next/server";
import { expireOverdueBookings } from "@/lib/expireBookings";

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to ensure only legitimate cron jobs can trigger this
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[CRON] Starting expire overdue bookings job');
    
    const expiredCount = await expireOverdueBookings();
    
    return NextResponse.json({ 
      success: true, 
      expiredCount,
      message: `Successfully expired ${expiredCount} overdue bookings`
    });
    
  } catch (error) {
    console.error('[CRON] Error in expire overdue bookings job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
