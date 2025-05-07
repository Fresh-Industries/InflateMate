/*
  Warnings:

  - You are about to alter the column `totalAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `depositAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `subtotalAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `taxAmount` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `taxRate` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `BookingItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `discountAmount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `minimumAmount` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `totalSpent` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `price` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `amountDue` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `amountPaid` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `amountRemaining` on the `Invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "totalAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "depositAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotalAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "taxAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "taxRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "BookingItem" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "discountAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minimumAmount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "totalSpent" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "amountDue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "amountPaid" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "amountRemaining" SET DATA TYPE DOUBLE PRECISION;
