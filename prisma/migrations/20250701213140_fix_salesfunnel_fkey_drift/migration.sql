-- AddForeignKey
ALTER TABLE "SalesFunnel" ADD CONSTRAINT "SalesFunnel_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE; 