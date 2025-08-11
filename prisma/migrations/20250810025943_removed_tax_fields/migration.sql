/*
  Warnings:

  - You are about to drop the column `defaultTaxCode` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `shippingTaxCode` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `taxBehavior` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `taxCode` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "defaultTaxCode",
DROP COLUMN "shippingTaxCode",
DROP COLUMN "taxBehavior";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "taxCode";
