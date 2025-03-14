import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { SalesFunnelFormWrapper } from "../../_components/SalesFunnelFormWrapper";

export default async function NewSalesFunnelPage({
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
    <div className="grid gap-8">
      <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`}>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sales Funnels
        </Button>
      </Link>
      
      <div className="grid gap-8">
        <div className="max-w-3xl">
          <SalesFunnelFormWrapper 
            businessId={params.businessId}
            returnUrl={`/dashboard/${params.businessId}/marketing/sales-funnels`}
          />
        </div>
      </div>
    </div>
  );
} 