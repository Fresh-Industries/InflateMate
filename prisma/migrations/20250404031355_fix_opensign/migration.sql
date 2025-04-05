/*
  Warnings:

  - Made the column `documentUrl` on table `Waiver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `openSignDocumentId` on table `Waiver` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Waiver" ALTER COLUMN "documentUrl" SET NOT NULL,
ALTER COLUMN "openSignDocumentId" SET NOT NULL;
