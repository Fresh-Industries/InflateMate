-- CreateTable
CREATE TABLE "CustomerStripeAccount" (
    "id" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "CustomerStripeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerStripeAccount_stripeCustomerId_key" ON "CustomerStripeAccount"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "CustomerStripeAccount_customerId_idx" ON "CustomerStripeAccount"("customerId");

-- CreateIndex
CREATE INDEX "CustomerStripeAccount_businessId_idx" ON "CustomerStripeAccount"("businessId");

-- CreateIndex
CREATE INDEX "CustomerStripeAccount_stripeCustomerId_idx" ON "CustomerStripeAccount"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerStripeAccount_customerId_businessId_key" ON "CustomerStripeAccount"("customerId", "businessId");

-- AddForeignKey
ALTER TABLE "CustomerStripeAccount" ADD CONSTRAINT "CustomerStripeAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStripeAccount" ADD CONSTRAINT "CustomerStripeAccount_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
