/*
  Warnings:

  - A unique constraint covering the columns `[businessId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Business" DROP CONSTRAINT "Business_organizationId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "businessId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_businessId_key" ON "Organization"("businessId");

-- CreateIndex
CREATE INDEX "Organization_businessId_idx" ON "Organization"("businessId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
