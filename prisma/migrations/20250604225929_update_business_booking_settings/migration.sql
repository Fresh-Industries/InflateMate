/*
  Warnings:

  - You are about to drop the column `maxAdvanceBooking` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `minAdvanceBooking` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPurchase` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "maxAdvanceBooking",
DROP COLUMN "minAdvanceBooking",
DROP COLUMN "minimumPurchase",
ADD COLUMN     "bufferAfterHours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bufferBeforeHours" INTEGER NOT NULL DEFAULT 2,
ADD COLUMN     "maxNoticeHours" INTEGER NOT NULL DEFAULT 2160,
ADD COLUMN     "minBookingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "minNoticeHours" INTEGER NOT NULL DEFAULT 24;
