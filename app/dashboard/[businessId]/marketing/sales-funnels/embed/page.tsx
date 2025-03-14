"use server";

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";
import { EmbedCodeDisplay } from "../../_components/EmbedCodeDisplay";

export const metadata: Metadata = {
  title: "Sales Funnel Embed Code",
  description: "Get the embed code for your sales funnel",
};

export default async function SalesFunnelEmbedPage({
  params,
}: {
  params: { businessId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const result = await withBusinessAuth<{ hasActiveFunnel: boolean }>(
    params.businessId,
    user.id,
    async (business) => {
      // Check if there's an active funnel
      const activeFunnel = await prisma.salesFunnel.findFirst({
        where: {
          businessId: business.id,
          isActive: true,
        },
      });

      return { hasActiveFunnel: !!activeFunnel };
    }
  );

  if (result.error) {
    redirect("/");
  }

  if (result.data?.hasActiveFunnel === false) {
    // Redirect to sales funnels page if no active funnel
    redirect(`/dashboard/${params.businessId}/marketing/sales-funnels`);
  }
  
  return (
    <div className="grid gap-8">
      <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sales Funnels
        </Button>
      </Link>
      <div className="grid gap-8">
        <EmbedCodeDisplay businessId={params.businessId} />
      </div>
    </div>
  );
} 