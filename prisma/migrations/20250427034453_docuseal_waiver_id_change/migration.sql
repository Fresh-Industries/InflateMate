/*
  Warnings:

  - You are about to drop the column `openSignDocumentId` on the `Waiver` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[docuSealDocumentId]` on the table `Waiver` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `docuSealDocumentId` to the `Waiver` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Waiver_openSignDocumentId_key";

-- AlterTable
ALTER TABLE "Waiver" DROP COLUMN "openSignDocumentId",
ADD COLUMN     "docuSealDocumentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Waiver_docuSealDocumentId_key" ON "Waiver"("docuSealDocumentId");
