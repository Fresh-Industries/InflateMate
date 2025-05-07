import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { CouponFormWrapper } from "../../_components/CouponFormWrapper";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Edit Coupon | Marketing",
  description: "Edit an existing discount coupon",
};

export default async function EditCouponPage(
  props: {
    params: Promise<{ businessId: string; couponId: string }>;
  }
) {
  const params = await props.params;
  const user = await getCurrentUserWithOrgAndBusiness();

  if (!user) {
    redirect("/sign-in");
  }

  // Check that the user has access to this business
  const userBusinessId = user.membership?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== params.businessId) {
    redirect("/");
  }

  const coupon = await prisma.coupon.findUnique({
    where: {
      id: params.couponId,
      businessId: params.businessId,
    },
  });

  if (!coupon) {
    redirect(`/dashboard/${params.businessId}/marketing/coupons`);
  }

  // Convert Date objects to strings for the component
  const formattedCoupon = {
    ...coupon,
    startDate: coupon.startDate?.toISOString() || null,
    endDate: coupon.endDate?.toISOString() || null,
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/${params.businessId}/marketing/coupons`} passHref>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Coupons</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Coupon</h1>
              <p className="text-base text-gray-500 mt-1">
                Update the details for coupon code: <span className="font-semibold text-gray-700">{coupon.code}</span>
              </p>
            </div>
          </div>
        </div>
        <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <CouponFormWrapper 
            businessId={params.businessId} 
            mode="edit"
            coupon={formattedCoupon}
          />
        </Card>
      </div>
    </div>
  );
}
