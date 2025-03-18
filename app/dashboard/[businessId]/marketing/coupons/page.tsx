import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import CouponsList from "../_components/CouponsList";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coupons | Marketing",
  description: "Create and manage discount coupons for your customers",
};

export default async function CouponsPage({
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
        <Link href={`/dashboard/${params.businessId}/marketing/coupons/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </Link>
      </div>
      
      <p className="text-muted-foreground">
        Create and manage discount coupons to offer to your customers. Boost sales with limited-time offers and special promotions.
      </p>
      
      <CouponsList businessId={params.businessId} />
    </div>
  );
} 