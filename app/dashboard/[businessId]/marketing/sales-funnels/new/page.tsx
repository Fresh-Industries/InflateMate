import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { SalesFunnelFormWrapper } from "../../_components/SalesFunnelFormWrapper";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
             <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`} passHref>
               <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Sales Funnels</span>
                </Button>
             </Link>
             <div>
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Sales Funnel</h1>
               <p className="text-base text-gray-500 mt-1">
                 Set up a new funnel to capture leads.
               </p>
             </div>
          </div>
        </div>
        
        <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <SalesFunnelFormWrapper 
            businessId={params.businessId}
            returnUrl={`/dashboard/${params.businessId}/marketing/sales-funnels`}
          />
        </Card>
      </div>
    </div>
  );
} 