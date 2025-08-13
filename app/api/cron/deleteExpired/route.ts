import { NextResponse } from "next/server";
import { deleteExpiredBookings } from "@/lib/deleteExpiredBookings";

export async function GET(req: Request) {
  try {
    console.log('[CRON] Starting delete expired bookings job');
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'Unauthorized'
      }, { status: 401 });
    }
    
    const deletedCount = await deleteExpiredBookings();
    
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      message: `Successfully deleted ${deletedCount} expired bookings`
    });
    
  } catch (error) {
    console.error('[CRON] Error in delete expired bookings job:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
