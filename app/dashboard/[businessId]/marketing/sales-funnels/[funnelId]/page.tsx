import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { SalesFunnelFormWrapper } from "../../_components/SalesFunnelFormWrapper";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Edit Sales Funnel | Marketing",
  description: "Edit an existing sales funnel",
};

export default async function EditSalesFunnelPage(
  props: {
    params: Promise<{ businessId: string; funnelId: string }>;
  }
) {
  const params = await props.params;
  const user = await getCurrentUserWithOrgAndBusiness();

  if (!user) {
    redirect("/sign-in");
  }

  // Check that the user has access to this business
  const userBusinessId = user.memberships[0]?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== params.businessId) {
    redirect("/");
  }

  const funnel = await prisma.salesFunnel.findUnique({
    where: {
      id: params.funnelId,
      businessId: params.businessId,
    },
  });

  if (!funnel) {
    notFound();
  }

  // Convert null values to undefined for the client component
  const formattedFunnel = {
    ...funnel,
    popupImage: funnel.popupImage || undefined,
    couponId: funnel.couponId || undefined,
  };

  return (
    <div className="min-h-screen">
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Sales Funnel</h1>
              <p className="text-base text-gray-500 mt-1">
                Update the details for your funnel: {formattedFunnel.name}
              </p>
            </div>
          </div>
        </div>
        <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300">
          <SalesFunnelFormWrapper 
            businessId={params.businessId}
            funnel={formattedFunnel}
            returnUrl={`/dashboard/${params.businessId}/marketing/sales-funnels`}
          />
        </Card>
      </div>
    </div>
  );
}
