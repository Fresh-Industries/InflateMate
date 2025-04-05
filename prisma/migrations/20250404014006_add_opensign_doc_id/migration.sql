/*
  Warnings:

  - A unique constraint covering the columns `[openSignDocumentId]` on the table `Waiver` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Waiver" ADD COLUMN     "openSignDocumentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Waiver_openSignDocumentId_key" ON "Waiver"("openSignDocumentId");
