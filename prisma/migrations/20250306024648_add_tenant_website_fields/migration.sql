/*
  Warnings:

  - You are about to drop the `WebsiteComponent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebsitePage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WebsiteSection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customDomain]` on the table `Business` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subdomain]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WebsiteComponent" DROP CONSTRAINT "WebsiteComponent_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "WebsitePage" DROP CONSTRAINT "WebsitePage_businessId_fkey";

-- DropForeignKey
ALTER TABLE "WebsiteSection" DROP CONSTRAINT "WebsiteSection_pageId_fkey";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "customDomain" TEXT,
ADD COLUMN     "siteEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "siteTheme" JSONB,
ADD COLUMN     "subdomain" TEXT;

-- DropTable
DROP TABLE "WebsiteComponent";

-- DropTable
DROP TABLE "WebsitePage";

-- DropTable
DROP TABLE "WebsiteSection";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Page_businessId_idx" ON "Page"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_businessId_slug_key" ON "Page"("businessId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Business_customDomain_key" ON "Business"("customDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Business_subdomain_key" ON "Business"("subdomain");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
