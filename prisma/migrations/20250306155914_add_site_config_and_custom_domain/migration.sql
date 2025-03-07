/*
  Warnings:

  - You are about to drop the column `siteEnabled` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `siteTheme` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `subdomain` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_businessId_fkey";

-- DropIndex
DROP INDEX "Business_customDomain_key";

-- DropIndex
DROP INDEX "Business_subdomain_key";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "siteEnabled",
DROP COLUMN "siteTheme",
DROP COLUMN "subdomain",
ADD COLUMN     "siteConfig" JSONB;

-- DropTable
DROP TABLE "Page";
