-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "socialMedia" JSONB;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isLead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Regular';
