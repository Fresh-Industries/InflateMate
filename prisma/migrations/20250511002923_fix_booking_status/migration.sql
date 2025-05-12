-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'CASH';

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Booking_status_startTime_idx" ON "Booking"("status", "startTime");

-- CreateIndex
CREATE INDEX "BookingItem_bookingStatus_idx" ON "BookingItem"("bookingStatus");

-- CreateIndex
CREATE INDEX "Invoice_expiresAt_idx" ON "Invoice"("expiresAt");
