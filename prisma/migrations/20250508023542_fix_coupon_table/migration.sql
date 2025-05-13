/*
  Warnings:

  - The values [NO_SHOW,WEATHER_HOLD] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `bookingStatus` to the `BookingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endUTC` to the `BookingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startUTC` to the `BookingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'HOLD');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "BookingItem" ADD COLUMN     "bookingStatus" TEXT NOT NULL,
ADD COLUMN     "endUTC" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startUTC" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "stripeCouponId" TEXT,
ADD COLUMN     "stripePromotionId" TEXT;
