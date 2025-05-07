-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "eventTimeZone" TEXT NOT NULL DEFAULT 'America/Chicago',
ALTER COLUMN "eventDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "timeZone" TEXT NOT NULL DEFAULT 'America/Chicago';
