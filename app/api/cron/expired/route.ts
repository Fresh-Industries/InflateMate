import { NextResponse } from "next/server";
import { expireOverdueBookings } from "@/lib/expireBookings";

export async function GET(req: Request) {
  try {
    console.log('[CRON] Starting expire overdue bookings job');
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Unauthorized'
      }, { status: 401 });
    }
    
    const expiredCount = await expireOverdueBookings();
    
    return NextResponse.json({ 
      success: true, 
      expiredCount,
      message: `Successfully expired ${expiredCount} overdue bookings`
    });
    
  } catch (error) {
    console.error('[CRON] Error in delete expired bookings job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
