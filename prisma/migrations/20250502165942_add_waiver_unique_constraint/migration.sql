/*
  Warnings:

  - A unique constraint covering the columns `[customerId,businessId,bookingId]` on the table `Waiver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Waiver_customerId_businessId_bookingId_key" ON "Waiver"("customerId", "businessId", "bookingId");
