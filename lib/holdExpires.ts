// lib/expireHolds.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma"; // Import Prisma for transaction types/helpers

export async function expireHolds() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  try {
    // Use a transaction to ensure atomicity: find IDs, update bookings, update items
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { count: expiredBookingsCount, ids: expiredBookingIds } = await prisma.$transaction(async (tx) => {

      console.log(`[expireHolds] Looking for HOLD bookings older than ${thirtyMinutesAgo.toISOString()}...`);

      // 1. Find IDs of bookings to cancel
      const bookingsToCancel = await tx.booking.findMany({
        where: {
          status: 'HOLD',
          createdAt: { lt: thirtyMinutesAgo },
          // We could add a check here to ensure they haven't transitioned,
          // but the 'status: 'HOLD'' condition already filters for that effectively.
          // If another process updated the status, it wouldn't match 'HOLD' here.
        },
        select: { id: true }, // Select only the ID
      });

      const expiredBookingIds = bookingsToCancel.map(b => b.id);
      const expiredBookingsCount = expiredBookingIds.length;

      console.log(`[expireHolds] Found ${expiredBookingsCount} bookings to expire.`);

      if (expiredBookingsCount === 0) {
        // If no bookings found to cancel, exit the transaction early
        return { count: 0, ids: [] };
      }

      // 2. Update the Booking status to CANCELLED
      // Use updateMany for efficiency if there are many bookings
      const updatedBookingsResult = await tx.booking.updateMany({
        where: {
          id: { in: expiredBookingIds }
        },
        data: {
          status: 'EXPIRED',
          isCancelled: true,
          updatedAt: new Date(), // Explicitly set update timestamp
        }
      });
      console.log(`[expireHolds] Updated ${updatedBookingsResult.count} bookings to CANCELLED.`);


      // 3. Update associated BookingItem status using raw SQL
      // We use raw SQL because Prisma's ORM methods are restricted for BookingItem due to Unsupported types.
      // We need to update the `bookingStatus` column in the `BookingItem` table
      // for items linked to the `expiredBookingIds`.
      // Only update BookingItems that are still on HOLD within these bookings.
      // Prisma.join is used to safely create the list for the IN clause from the array of IDs.
       await tx.$executeRaw`
        UPDATE "BookingItem"
        SET "bookingStatus" = 'CANCELLED', "updatedAt" = NOW()
        WHERE "bookingId" IN (${Prisma.join(expiredBookingIds)})
        AND "bookingStatus" = 'HOLD';
      `;
      console.log(`[expireHolds] Updated BookingItem statuses to CANCELLED for items linked to expired bookings.`);


      // Return the count of bookings that were cancelled and their IDs
      // (Returning IDs might be useful for logging or further processing, though not strictly needed by the caller)
      return { count: updatedBookingsResult.count, ids: expiredBookingIds };

    }, {
      // Using Serializable isolation level for stronger guarantees against
      // race conditions with concurrent booking attempts.
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    });

    console.log(`[expireHolds] Transaction completed. ${expiredBookingsCount} holds expired.`);
    // Return the number of bookings that were cancelled
    return expiredBookingsCount;
//eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[expireHolds] Error during hold expiration process:", error);
    // Re-throw the error so the cron job endpoint knows it failed
    throw error;
  }
}
