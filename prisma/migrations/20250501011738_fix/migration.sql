/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `membershipId` on the `Membership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clerkMembershipId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Made the column `siteConfig` on table `Business` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `clerkMembershipId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Business_organizationId_key";

-- DropIndex
DROP INDEX "Membership_membershipId_key";

-- DropIndex
DROP INDEX "Organization_businessId_idx";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "organizationId",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "siteConfig" SET NOT NULL,
ALTER COLUMN "serviceArea" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "membershipId",
ADD COLUMN     "clerkMembershipId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SalesFunnel" ADD COLUMN     "couponId" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_clerkMembershipId_key" ON "Membership"("clerkMembershipId");
