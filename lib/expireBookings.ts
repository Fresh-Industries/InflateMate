/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/expireBookings.ts
import { prisma } from "@/lib/prisma";

export async function expireOverdueBookings() {
  const now = new Date();
  console.log(`[expireOverdueBookings] Starting job at ${now.toISOString()}`);

  try {
    // Use a direct SQL update for efficiency
    // Expire any HOLD or PENDING bookings whose expiresAt is in the past
    const result = await prisma.$executeRaw`
      UPDATE "Booking"
      SET status = 'EXPIRED', "updatedAt" = NOW()
      WHERE status IN ('HOLD','PENDING') AND "expiresAt" < NOW();
    `;

    console.log(`[expireOverdueBookings] Updated ${result} PENDING bookings to EXPIRED status.`);

    // Also update related BookingItems to EXPIRED status for those bookings we just expired (last minute window)
    const bookingItemsResult = await prisma.$executeRaw`
      UPDATE "BookingItem"
      SET "bookingStatus" = 'EXPIRED', "updatedAt" = NOW()
      WHERE "bookingId" IN (
        SELECT id FROM "Booking" 
        WHERE status = 'EXPIRED' AND "updatedAt" > NOW() - INTERVAL '1 minute'
      )
      AND "bookingStatus" IN ('HOLD', 'PENDING');
    `;

    console.log(`[expireOverdueBookings] Updated ${bookingItemsResult} BookingItems to EXPIRED status.`);

    return result;
  } catch (error: any) {
    console.error("[expireOverdueBookings] Critical error during expiration job:", error);
    throw error;
  }
} 