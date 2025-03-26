-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "serviceArea" TEXT[],
ADD COLUMN     "twilioSubAccountSid" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isLead" BOOLEAN NOT NULL DEFAULT false;
