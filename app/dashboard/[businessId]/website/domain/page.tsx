import { getCurrentUser } from "@/lib/auth/clerk-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DomainSettings from "../_components/domain-settings";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getBusinessData(businessId: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      userId: user.id,
    },
  });

  if (!business) {
    redirect('/sign-in');
  }

  return business;
}

interface PageProps {
  params: { businessId: string };
}

export default async function DomainPage({ params }: PageProps) {
  const { businessId } = params;
  const business = await getBusinessData(businessId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/${businessId}/website`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website Settings
            </Link>
          </Button>
        </div>
      </div>
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Custom Domain</h1>
        <p className="text-muted-foreground">
          Configure a custom domain for your website
        </p>
      </div>
      
      <DomainSettings businessId={businessId} initialDomain={business.customDomain} />
    </div>
  );
} 