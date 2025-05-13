-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('SOLO', 'GROWTH');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "type" "SubscriptionType" NOT NULL DEFAULT 'GROWTH';
