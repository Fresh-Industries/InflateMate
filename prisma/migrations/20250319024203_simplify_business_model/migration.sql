/*
  Warnings:

  - You are about to drop the column `applyTaxToBookings` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `bufferTime` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `cancellationPolicy` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `defaultTaxRate` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `depositPercentage` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `depositRequired` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `settings` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Business` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "applyTaxToBookings",
DROP COLUMN "bufferTime",
DROP COLUMN "cancellationPolicy",
DROP COLUMN "coverImage",
DROP COLUMN "defaultTaxRate",
DROP COLUMN "depositPercentage",
DROP COLUMN "depositRequired",
DROP COLUMN "settings",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "website",
ADD COLUMN     "minimumPurchase" DOUBLE PRECISION NOT NULL DEFAULT 0;

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
CREATE TABLE "SalesFunnel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "popupTitle" TEXT NOT NULL,
    "popupText" TEXT NOT NULL,
    "popupImage" TEXT,
    "formTitle" TEXT NOT NULL,
    "thankYouMessage" TEXT NOT NULL,
    "couponId" TEXT,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesFunnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Coupon_businessId_idx" ON "Coupon"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_businessId_key" ON "Coupon"("code", "businessId");

-- CreateIndex
CREATE INDEX "SalesFunnel_businessId_idx" ON "SalesFunnel"("businessId");

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesFunnel" ADD CONSTRAINT "SalesFunnel_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
