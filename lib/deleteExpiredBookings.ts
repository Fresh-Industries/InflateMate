/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { BookingStatus, Prisma } from "../prisma/generated/prisma/client";

export async function deleteExpiredBookings() {
  const now = new Date();
  // Delete bookings that have been expired for more than 30 days to give grace period
  const deleteCutoff = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  let totalDeletedCount = 0;

  console.log(`[deleteExpiredBookings] Starting deletion job at ${now.toISOString()}`);
  console.log(`[deleteExpiredBookings] Will delete bookings expired before ${deleteCutoff.toISOString()}`);

  try {
    // Find expired bookings that are old enough to delete
    const bookingsToDelete = await prisma.booking.findMany({
      where: {
        status: BookingStatus.EXPIRED,
        updatedAt: { lt: deleteCutoff }, // Only delete if they've been expired for 30+ days
      },
      select: {
        id: true,
        customerId: true,
        businessId: true,
        eventDate: true,
        totalAmount: true,
      },
    });

    if (bookingsToDelete.length === 0) {
      console.log("[deleteExpiredBookings] No expired bookings found for deletion.");
      return 0;
    }

    console.log(`[deleteExpiredBookings] Found ${bookingsToDelete.length} expired bookings to delete.`);

    // Process deletions in batches to avoid overwhelming the database
    const batchSize = 10;
    for (let i = 0; i < bookingsToDelete.length; i += batchSize) {
      const batch = bookingsToDelete.slice(i, i + batchSize);
      const bookingIds = batch.map(b => b.id);

      try {
        await prisma.$transaction(async (tx) => {
          console.log(`[deleteExpiredBookings] Processing batch: ${bookingIds.join(', ')}`);

          // Delete in proper order to respect foreign key constraints
          
          // 1. Delete BookingItems first
          const deletedBookingItems = await tx.bookingItem.deleteMany({
            where: { bookingId: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedBookingItems.count} booking items`);

          // 2. Delete Payments
          const deletedPayments = await tx.payment.deleteMany({
            where: { bookingId: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedPayments.count} payments`);

          // 3. Delete Waivers
          const deletedWaivers = await tx.waiver.deleteMany({
            where: { bookingId: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedWaivers.count} waivers`);

          // 4. Delete Invoices
          const deletedInvoices = await tx.invoice.deleteMany({
            where: { bookingId: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedInvoices.count} invoices`);

          // 5. Delete Quotes
          const deletedQuotes = await tx.quote.deleteMany({
            where: { bookingId: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedQuotes.count} quotes`);

          // 6. Finally delete the Bookings themselves
          const deletedBookings = await tx.booking.deleteMany({
            where: { id: { in: bookingIds } }
          });
          console.log(`[deleteExpiredBookings] Deleted ${deletedBookings.count} bookings`);

          totalDeletedCount += deletedBookings.count;
        }, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });

        console.log(`[deleteExpiredBookings] Successfully processed batch of ${batch.length} bookings`);
        
      } catch (error: any) {
        console.error(`[deleteExpiredBookings] Failed to delete batch ${bookingIds.join(', ')}:`, error.message);
        // Continue with next batch instead of failing entire job
      }
    }

    console.log(`[deleteExpiredBookings] Job completed. Total bookings deleted: ${totalDeletedCount}`);
    return totalDeletedCount;

  } catch (error: any) {
    console.error("[deleteExpiredBookings] Critical error during deletion job:", error);
    throw error;
  }
} 