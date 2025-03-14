import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { SalesFunnelFormWrapper } from "../../_components/SalesFunnelFormWrapper";

export const metadata: Metadata = {
  title: "Edit Sales Funnel | Marketing",
  description: "Edit an existing sales funnel",
};

interface SalesFunnel {
  id: string;
  name: string;
  popupTitle: string;
  popupText: string;
  popupImage?: string | null;
  formTitle: string;
  thankYouMessage: string;
  couponId?: string | null;
  isActive: boolean;
}

export default async function EditSalesFunnelPage({
  params,
}: {
  params: { businessId: string; funnelId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const result = await withBusinessAuth<{ funnel: SalesFunnel | null }>(
    params.businessId,
    user.id,
    async (business) => {
      const funnel = await prisma.salesFunnel.findUnique({
        where: {
          id: params.funnelId,
          businessId: business.id,
        },
      });

      return { funnel };
    }
  );

  if (result.error || !result.data?.funnel) {
    notFound();
  }

  // Convert null values to undefined for the client component
  const funnel = {
    ...result.data.funnel,
    popupImage: result.data.funnel.popupImage || undefined,
    couponId: result.data.funnel.couponId || undefined,
  };

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
            funnel={funnel}
            returnUrl={`/dashboard/${params.businessId}/marketing/sales-funnels`}
          />
        </div>
      </div>
    </div>
  );
} 