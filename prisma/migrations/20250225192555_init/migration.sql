/*
  Warnings:

  - The values [BALANCE] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bounceHouseId` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `bounceHouseId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `packageId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AddOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookingAddOn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BounceHouse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BounceHouseFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BusinessHours` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceArea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AddOnToPackage` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inventoryId` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('BOUNCE_HOUSE', 'INFLATABLE', 'GAME', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('DEPOSIT', 'FULL_PAYMENT', 'REFUND');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "PaymentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AddOn" DROP CONSTRAINT "AddOn_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_bounceHouseId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_bounceHouseId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_packageId_fkey";

-- DropForeignKey
ALTER TABLE "BookingAddOn" DROP CONSTRAINT "BookingAddOn_addOnId_fkey";

-- DropForeignKey
ALTER TABLE "BookingAddOn" DROP CONSTRAINT "BookingAddOn_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BounceHouse" DROP CONSTRAINT "BounceHouse_businessId_fkey";

-- DropForeignKey
ALTER TABLE "BounceHouseFeature" DROP CONSTRAINT "BounceHouseFeature_bounceHouseId_fkey";

-- DropForeignKey
ALTER TABLE "BusinessHours" DROP CONSTRAINT "BusinessHours_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Coupon" DROP CONSTRAINT "Coupon_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_businessId_fkey";

-- DropForeignKey
ALTER TABLE "PackageItem" DROP CONSTRAINT "PackageItem_bounceHouseId_fkey";

-- DropForeignKey
ALTER TABLE "PackageItem" DROP CONSTRAINT "PackageItem_packageId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceArea" DROP CONSTRAINT "ServiceArea_businessId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AddOnToPackage" DROP CONSTRAINT "_AddOnToPackage_A_fkey";

-- DropForeignKey
ALTER TABLE "_AddOnToPackage" DROP CONSTRAINT "_AddOnToPackage_B_fkey";

-- DropIndex
DROP INDEX "Availability_bounceHouseId_idx";

-- DropIndex
DROP INDEX "Booking_bounceHouseId_idx";

-- DropIndex
DROP INDEX "Booking_packageId_idx";

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "bounceHouseId",
ADD COLUMN     "inventoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bounceHouseId",
DROP COLUMN "packageId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified",
DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "clerkUserId" TEXT;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "AddOn";

-- DropTable
DROP TABLE "BookingAddOn";

-- DropTable
DROP TABLE "BounceHouse";

-- DropTable
DROP TABLE "BounceHouseFeature";

-- DropTable
DROP TABLE "BusinessHours";

-- DropTable
DROP TABLE "Coupon";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Package";

-- DropTable
DROP TABLE "PackageItem";

-- DropTable
DROP TABLE "ServiceArea";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "_AddOnToPackage";

-- DropEnum
DROP TYPE "DiscountType";

-- DropEnum
DROP TYPE "EmployeeRole";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "type" "InventoryType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "dimensions" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "setupTime" INTEGER NOT NULL,
    "teardownTime" INTEGER NOT NULL,
    "images" TEXT[],
    "primaryImage" TEXT,
    "status" "InventoryStatus" NOT NULL,
    "minimumSpace" TEXT NOT NULL,
    "weightLimit" INTEGER NOT NULL,
    "ageRange" TEXT NOT NULL,
    "weatherRestrictions" TEXT[],
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingItem" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Inventory_businessId_idx" ON "Inventory"("businessId");

-- CreateIndex
CREATE INDEX "BookingItem_bookingId_idx" ON "BookingItem"("bookingId");

-- CreateIndex
CREATE INDEX "BookingItem_inventoryId_idx" ON "BookingItem"("inventoryId");

-- CreateIndex
CREATE INDEX "Availability_inventoryId_idx" ON "Availability"("inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
