/*
  Warnings:

  - A unique constraint covering the columns `[stripeProductId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "stripePriceId" TEXT,
ADD COLUMN     "stripeProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_stripeProductId_key" ON "Inventory"("stripeProductId");
