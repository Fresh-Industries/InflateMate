/*
  Warnings:

  - You are about to drop the column `twilioSubAccountSid` on the `Business` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WaiverStatus" AS ENUM ('PENDING', 'SIGNED', 'REJECTED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "isCancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "twilioSubAccountSid";

-- CreateTable
CREATE TABLE "Waiver" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "status" "WaiverStatus" NOT NULL DEFAULT 'PENDING',
    "templateVersion" TEXT NOT NULL,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waiver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Waiver_businessId_idx" ON "Waiver"("businessId");

-- CreateIndex
CREATE INDEX "Waiver_customerId_idx" ON "Waiver"("customerId");

-- CreateIndex
CREATE INDEX "Waiver_bookingId_idx" ON "Waiver"("bookingId");

-- CreateIndex
CREATE INDEX "Waiver_status_idx" ON "Waiver"("status");

-- AddForeignKey
ALTER TABLE "Waiver" ADD CONSTRAINT "Waiver_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waiver" ADD CONSTRAINT "Waiver_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waiver" ADD CONSTRAINT "Waiver_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
