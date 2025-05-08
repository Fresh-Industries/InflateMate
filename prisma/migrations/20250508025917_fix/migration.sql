/*
  Warnings:

  - Added the required column `period` to the `BookingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingItem" ADD COLUMN     "period" tstzrange NOT NULL;
