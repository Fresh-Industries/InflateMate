import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
             <Link href={`/dashboard/${params.businessId}/marketing`} passHref>
               <Button variant="outline" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Marketing</span>
                </Button>
             </Link>
             <div>
               <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sales Funnels</h1>
               <p className="text-base text-gray-500 mt-1">
                 Create and manage funnels to capture leads and offer discounts.
               </p>
             </div>
          </div>
          
          <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels/new`} passHref>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 px-5 py-2.5">
              <Plus className="mr-2 h-4 w-4" />
              Create Funnel
            </Button>
          </Link>
        </div>
        
        <SalesFunnelList businessId={params.businessId} />
      </div>
    </div>
  );
} 