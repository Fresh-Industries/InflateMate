import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import SalesFunnelList from "../_components/SalesFunnelList";

export const metadata: Metadata = {
  title: "Sales Funnels | Marketing",
  description: "Create and manage sales funnels to capture leads and offer discounts",
};

export default async function SalesFunnelsPage({
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
        <h1 className="text-3xl font-bold tracking-tight">Sales Funnels</h1>
        <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Funnel
          </Button>
        </Link>
      </div>
      
      <p className="text-muted-foreground">
        Create and manage sales funnels to capture leads and offer discounts to your customers.
      </p>
      
      <SalesFunnelList businessId={params.businessId} />
    </div>
  );
} 