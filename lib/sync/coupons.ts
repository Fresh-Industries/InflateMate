import { Coupon } from "@/prisma/generated/prisma";
import { stripe } from "@/lib/stripe-server";

export async function syncCouponToStripe(
    coupon: Coupon,
    stripeAccountId: string
  ) {
    const stripeOptions = { stripeAccount: stripeAccountId };
  
    // 1. Ensure underlying Coupon exists
    const stripeCoupon = coupon.stripeCouponId
      ? await stripe.coupons.retrieve(coupon.stripeCouponId, stripeOptions)
      : await stripe.coupons.create(
          {
            duration: 'once',                               // or 'forever', your call
            percent_off: coupon.discountType === 'PERCENTAGE'
              ? coupon.discountAmount
              : undefined,
            amount_off: coupon.discountType === 'FIXED'
              ? Math.round(coupon.discountAmount * 100)
              : undefined,
            currency: 'usd',
            metadata: { prismaCouponId: coupon.id }
          },
          stripeOptions
        );
  
    // 2. Create / ensure a Promotion-code that renters will type
    const promo = coupon.stripePromotionId
      ? await stripe.promotionCodes.retrieve(
          coupon.stripePromotionId,
          stripeOptions
        )
      : await stripe.promotionCodes.create(
          {
            code: coupon.code,          // human-friendly string
            coupon: stripeCoupon.id,
            max_redemptions: coupon.maxUses ?? undefined,
            expires_at: coupon.endDate
              ? Math.floor(coupon.endDate.getTime() / 1000)
              : undefined,
          },
          stripeOptions
        );
  
    return { stripeCoupon, promo };
  }
  