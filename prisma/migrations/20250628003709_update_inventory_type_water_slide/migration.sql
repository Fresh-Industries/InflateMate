/*
  Warnings:

  - The values [INFLATABLE] on the enum `InventoryType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryType_new" AS ENUM ('BOUNCE_HOUSE', 'WATER_SLIDE', 'GAME', 'OTHER');
ALTER TABLE "Inventory" ALTER COLUMN "type" TYPE "InventoryType_new" USING ("type"::text::"InventoryType_new");
ALTER TYPE "InventoryType" RENAME TO "InventoryType_old";
ALTER TYPE "InventoryType_new" RENAME TO "InventoryType";
DROP TYPE "InventoryType_old";
COMMIT;
