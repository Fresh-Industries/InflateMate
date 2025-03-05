/*
  Warnings:

  - A unique constraint covering the columns `[email,businessId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_businessId_key" ON "Customer"("email", "businessId");
