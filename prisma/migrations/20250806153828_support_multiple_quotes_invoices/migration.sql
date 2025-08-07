/*
  Warnings:

  - The values [SENT] on the enum `QuoteStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hostedQuoteUrl` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuoteStatus_new" AS ENUM ('DRAFT', 'OPEN', 'ACCEPTED', 'CANCELED', 'EXPIRED');
ALTER TABLE "Quote" ALTER COLUMN "status" TYPE "QuoteStatus_new" USING ("status"::text::"QuoteStatus_new");
ALTER TYPE "QuoteStatus" RENAME TO "QuoteStatus_old";
ALTER TYPE "QuoteStatus_new" RENAME TO "QuoteStatus";
DROP TYPE "QuoteStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "Invoice_bookingId_key";

-- DropIndex
DROP INDEX "Quote_bookingId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "currentQuoteId" TEXT;

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "hostedQuoteUrl",
ADD COLUMN     "appQuoteUrl" TEXT,
ADD COLUMN     "replacesQuoteId" TEXT,
ADD COLUMN     "stripeHostedUrl" TEXT,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_currentQuoteId_fkey" FOREIGN KEY ("currentQuoteId") REFERENCES "Quote"("id") ON DELETE SET NULL ON UPDATE CASCADE;
