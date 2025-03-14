import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { CouponFormWrapper } from "../../_components/CouponFormWrapper";

export const metadata: Metadata = {
  title: "Edit Coupon | Marketing",
  description: "Edit an existing discount coupon",
};

export default async function EditCouponPage({
  params,
}: {
  params: { businessId: string; couponId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const result = await withBusinessAuth(
    params.businessId,
    user.id,
    async (business) => {
      const coupon = await prisma.coupon.findUnique({
        where: {
          id: params.couponId,
          businessId: business.id,
        },
      });

      if (!coupon) {
        return { error: "Coupon not found" };
      }

      return { coupon };
    }
  );

  if (result.error) {
    if (result.error === "Coupon not found") {
      redirect(`/dashboard/${params.businessId}/marketing/coupons`);
    }
    redirect("/");
  }

  const coupon = result.data?.coupon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${params.businessId}/marketing/coupons`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Coupons
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Coupon</h1>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <CouponFormWrapper 
            businessId={params.businessId} 
            coupon={coupon}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
} 