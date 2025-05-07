/*
  Warnings:

  - You are about to drop the column `socialMedia` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `isLead` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `refundAmount` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `refundReason` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `SalesFunnel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `role` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BookingItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "socialMedia",
ADD COLUMN     "organizationId" TEXT;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "isLead",
DROP COLUMN "status",
DROP COLUMN "type",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "paidAt",
DROP COLUMN "refundAmount",
DROP COLUMN "refundReason",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SalesFunnel" DROP COLUMN "couponId",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Waiver" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Business_organizationId_key" ON "Business"("organizationId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
