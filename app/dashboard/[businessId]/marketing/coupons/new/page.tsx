import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { CouponFormWrapper } from "../../_components/CouponFormWrapper";

export const metadata: Metadata = {
  title: "Create Coupon | Marketing",
  description: "Create a new discount coupon for your customers",
};

export default async function NewCouponPage({
  params,
}: {
  params: { businessId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const result = await withBusinessAuth<{ hasAccess: boolean }>(
    params.businessId,
    user.id,
    async () => {
      return { hasAccess: true };
    }
  );

  if (result.error) {
    redirect("/");
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Create Coupon</h1>
        </div>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <CouponFormWrapper 
            businessId={params.businessId} 
            mode="create"
          />
        </div>
      </div>
    </div>
  );
} 