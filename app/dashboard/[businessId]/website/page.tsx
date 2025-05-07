import { Suspense } from "react";
import { getCurrentUserWithOrgAndBusiness } from "@/lib/auth/clerk-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WebsiteCustomizer from "./_components/website-customizer";
import WebsiteHeader from "./_components/website-header";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

async function getBusinessData(businessId: string) {
  const user = await getCurrentUserWithOrgAndBusiness();
  if (!user) {
    redirect('/sign-in');
  }

  // Check that the user has access to this business
  const userBusinessId = user.membership?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== businessId) {
    redirect('/dashboard');
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    redirect('/dashboard');
  }

  return business;
}

export default async function WebsitePage({ params }: { params: Promise<{ businessId: string }> }) {
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
      {/* Skeleton for Save Button */}
      <div className="flex justify-end mb-6">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Skeleton for Tabs */}
      <div className="w-full">
        {/* Skeleton for TabsList */}
        <div className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto border-b">
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-12 w-full rounded-none" />
          <Skeleton className="h-12 w-full rounded-none" />
        </div>

        {/* Skeleton for TabsContent wrapped in Card */}
        <div className="mt-8">
          <div className="rounded-xl border bg-card text-card-foreground shadow-md p-6 space-y-6">
            {/* Skeleton for CardHeader */}
            <Skeleton className="h-7 w-1/3 mb-4" />
            {/* Skeleton for CardContent - example for a typical settings form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
