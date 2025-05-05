/*
  Warnings:

  - You are about to drop the column `userId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `businessId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `onboarded` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_userId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_businessId_fkey";

-- DropIndex
DROP INDEX "Business_userId_idx";

-- DropIndex
DROP INDEX "Business_userId_key";

-- DropIndex
DROP INDEX "Membership_userId_organizationId_key";

-- DropIndex
DROP INDEX "Organization_businessId_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "userId",
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "businessId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboarded";

-- CreateIndex
CREATE UNIQUE INDEX "Business_organizationId_key" ON "Business"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
