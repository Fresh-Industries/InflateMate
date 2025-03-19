import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth/clerk-utils"
import BusinessSettingsForm from "@/app/dashboard/[businessId]/settings/_components/BusinessSettingsForm"
import StripeSettingsForm from "@/app/dashboard/[businessId]/settings/_components/StripeSettingsForm"

// Business interface for settings form
interface BusinessSettings {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  logo?: string | null;
  minAdvanceBooking: number;
  maxAdvanceBooking: number;
  minimumPurchase: number;
  stripeAccountId?: string | null;
  depositPercentage?: number;
  taxRate?: number;
  [key: string]: unknown;
}

export const dynamic = "force-dynamic"

async function getBusinessData(businessId: string): Promise<BusinessSettings | null> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      userId: user.id,
    },
  });

  if (!business) {
    redirect("/dashboard");
  }

  return business as BusinessSettings;
}

export default async function Settings({ 
  params,
  searchParams 
}: { 
  params: Promise<{ businessId: string }>, 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const business = await getBusinessData(resolvedParams.businessId);
  
  if (!business) {
    redirect("/dashboard");
  }
  
  // Extract stripe status from query params
  const stripeStatus = resolvedSearchParams.stripe as string | undefined;
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your business settings and integrations</p>
        
        {/* Display Stripe connection status notifications */}
        {stripeStatus === 'success' && (
          <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200 text-green-800">
            Stripe account connected successfully!
          </div>
        )}
        {stripeStatus === 'disconnected' && (
          <div className="mt-4 p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
            Stripe account disconnected successfully.
          </div>
        )}
        {stripeStatus === 'error' && (
          <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200 text-red-800">
            There was an error with your Stripe account. Please try again.
          </div>
        )}
      </div>
      
      <Tabs defaultValue="business" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="business">Business Settings</TabsTrigger>
          <TabsTrigger value="stripe">Stripe Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="business">
          <BusinessSettingsForm business={business} />
        </TabsContent>
        
        <TabsContent value="stripe">
          <StripeSettingsForm business={business} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
