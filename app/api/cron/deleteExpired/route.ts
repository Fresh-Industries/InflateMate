import { NextResponse } from "next/server";
import { deleteExpiredBookings } from "@/lib/deleteExpiredBookings";

export async function GET() {
  try {
    console.log('[CRON] Starting delete expired bookings job');
    
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
