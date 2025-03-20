import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/clerk-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WebsiteCustomizer from "./_components/website-customizer";
import WebsiteHeader from "./_components/website-header";
import { Skeleton } from "@/components/ui/skeleton";


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

export default async function WebsitePage({ params }: PageProps) {
  const { businessId } = await params;
  const business = await getBusinessData(businessId);

  return (
    <div className="space-y-8">
      <WebsiteHeader businessId={businessId} businessName={business.name} customDomain={business.customDomain} />
      <Suspense fallback={<WebsiteCustomizerSkeleton />}>
        <WebsiteCustomizer businessId={businessId} initialData={business} />
      </Suspense>
    </div>
  );
}

function WebsiteCustomizerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        <Skeleton className="h-8 w-1/3 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-40 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
