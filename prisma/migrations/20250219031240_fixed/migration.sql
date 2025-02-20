/*
  Warnings:

  - You are about to drop the column `balancePaid` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `setupNotes` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `weatherChecked` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `weatherStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceDate` on the `BounceHouse` table. All the data in the column will be lost.
  - You are about to drop the column `nextMaintenance` on the `BounceHouse` table. All the data in the column will be lost.
  - You are about to drop the column `taxId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Added the required column `updatedAt` to the `AddOn` table without a default value. This is not possible if the table is not empty.
  - Made the column `participantCount` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `BookingAddOn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BookingAddOn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ageRange` to the `BounceHouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumSpace` to the `BounceHouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weightLimit` to the `BounceHouse` table without a default value. This is not possible if the table is not empty.
  - Made the column `dimensions` on table `BounceHouse` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacity` on table `BounceHouse` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bounceHouseId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "BookingAddOn" DROP CONSTRAINT "BookingAddOn_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropIndex
DROP INDEX "BounceHouse_status_idx";

-- DropIndex
DROP INDEX "Payment_bookingId_idx";

-- AlterTable
ALTER TABLE "AddOn" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "balancePaid",
DROP COLUMN "notes",
DROP COLUMN "setupNotes",
DROP COLUMN "weatherChecked",
DROP COLUMN "weatherStatus",
ADD COLUMN     "specialInstructions" TEXT,
ALTER COLUMN "participantCount" SET NOT NULL;

-- AlterTable
ALTER TABLE "BookingAddOn" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "quantity" DROP DEFAULT,
ALTER COLUMN "addOnId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BounceHouse" DROP COLUMN "maintenanceDate",
DROP COLUMN "nextMaintenance",
ADD COLUMN     "ageRange" TEXT NOT NULL,
ADD COLUMN     "minimumSpace" TEXT NOT NULL,
ADD COLUMN     "primaryImage" TEXT,
ADD COLUMN     "weatherRestrictions" TEXT[],
ADD COLUMN     "weightLimit" INTEGER NOT NULL,
ALTER COLUMN "dimensions" SET NOT NULL,
ALTER COLUMN "capacity" SET NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "setupTime" DROP DEFAULT,
ALTER COLUMN "teardownTime" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "taxId",
ADD COLUMN     "stripeAccountId" TEXT;

-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
DROP COLUMN "providerId",
ADD COLUMN     "businessId" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "refundAmount" DECIMAL(10,2),
ADD COLUMN     "refundReason" TEXT,
ADD COLUMN     "stripeClientSecret" TEXT,
ADD COLUMN     "stripePaymentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "discountType" "DiscountType" NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minimumAmount" DOUBLE PRECISION,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AddOnToPackage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AddOnToPackage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "_AddOnToPackage_B_index" ON "_AddOnToPackage"("B");

-- CreateIndex
CREATE INDEX "Booking_packageId_idx" ON "Booking"("packageId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_bounceHouseId_fkey" FOREIGN KEY ("bounceHouseId") REFERENCES "BounceHouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddOn" ADD CONSTRAINT "BookingAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddOnToPackage" ADD CONSTRAINT "_AddOnToPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "AddOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddOnToPackage" ADD CONSTRAINT "_AddOnToPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
