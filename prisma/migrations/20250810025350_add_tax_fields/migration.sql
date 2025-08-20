-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "defaultTaxCode" TEXT,
ADD COLUMN     "shippingTaxCode" TEXT,
ADD COLUMN     "taxBehavior" TEXT DEFAULT 'exclusive';

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "taxCode" TEXT;
