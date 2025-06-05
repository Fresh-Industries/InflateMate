import React from 'react'
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUserWithOrgAndBusiness, getMembershipByBusinessId } from "@/lib/auth/clerk-utils"
import BusinessSettingsForm from "@/app/dashboard/[businessId]/settings/_components/BusinessSettingsForm"

// Business interface for settings form
interface Business {
  id: string;
  name: string;
  minNoticeHours: number;
  maxNoticeHours: number;
  minBookingAmount: number;
  bufferBeforeHours: number;
  bufferAfterHours: number;
  timeZone: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  logo?: string | null;
  stripeAccountId?: string | null;
  depositPercentage?: number;
  taxRate?: number;
  [key: string]: unknown;
}

export const dynamic = "force-dynamic"

async function getBusinessData(businessId: string): Promise<Business | null> {
  const user = await getCurrentUserWithOrgAndBusiness();

  if (!user) {
    redirect("/sign-in");
  }

  // Check that the user has access to this business
  const membership = getMembershipByBusinessId(user, businessId);
  const userBusinessId = membership?.organization?.business?.id;
  if (!userBusinessId || userBusinessId !== businessId) {
    redirect("/dashboard");
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    redirect("/dashboard");
  }

  return business as Business;
}

export default async function Settings({ 
  params,
}: { 
  params: Promise<{ businessId: string }>, 
}) {
  const resolvedParams = await params;
  const business = await getBusinessData(resolvedParams.businessId);

  if (!business) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
          <p className="text-base text-muted-foreground mt-1">Manage your business settings and integrations</p>
        </div>
      </div>
      <div className="mt-8">
        <BusinessSettingsForm business={business} />
      </div>
    </div>
  )
}
