/*
  Warnings:

  - A unique constraint covering the columns `[membershipId]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `membershipId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "membershipId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Membership_membershipId_key" ON "Membership"("membershipId");
