import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Users, Percent, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, withBusinessAuth } from "@/lib/auth/clerk-utils";
import { prisma } from "@/lib/prisma";

// Define the SalesFunnel type
interface SalesFunnel {
  id: string;
  businessId: string;
  isActive: boolean;
  [key: string]: unknown;
}

export default async function MarketingPage({
  params,
}: {
  params: { businessId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const result = await withBusinessAuth<{
    activeFunnel: SalesFunnel | null;
    funnelsCount: number;
    couponsCount: number;
    leadsCount: number;
    conversionRate: number;
  }>(
    params.businessId,
    user.id,
    async () => {
      // Initialize default values
      let activeFunnel = null;
      let funnelsCount = 0;
      let couponsCount = 0;
      let leadsCount = 0;
      let conversionRate = 0;
      
      try {
        // Check if the salesFunnel model exists and has active funnels
        if (prisma.salesFunnel) {
          // Get active funnel
          activeFunnel = await prisma.salesFunnel.findFirst({
            where: {
              businessId: params.businessId,
              isActive: true,
            },
          });
          
          // Count total funnels
          funnelsCount = await prisma.salesFunnel.count({
            where: {
              businessId: params.businessId,
            },
          });
        }
        
        // Count coupons if model exists
        if (prisma.coupon) {
          couponsCount = await prisma.coupon.count({
            where: {
              businessId: params.businessId,
            },
          });
        }
        
        // Count leads (Customers with isLead = true)
        leadsCount = await prisma.customer.count({
          where: {
            businessId: params.businessId,
            isLead: true, // Count customers marked as leads
          },
        });
          
        // Calculate conversion rate if there are leads
        if (leadsCount > 0) {
          // Count leads that have at least one booking
          const convertedLeadsCount = await prisma.customer.count({
            where: {
              businessId: params.businessId,
              isLead: true,
              bookings: { // Check if the customer has any related bookings
                some: {},
              },
            },
          });
          
          conversionRate = Math.round((convertedLeadsCount / leadsCount) * 100);
        }
      } catch (error) {
        console.error("Error fetching marketing data:", error);
        // Continue with default values
      }

      return { 
        activeFunnel,
        funnelsCount,
        couponsCount,
        leadsCount,
        conversionRate
      };
    }
  );

  if (result.error) {
    redirect("/");
  }

  // Ensure result.data exists before destructuring
  const { 
    activeFunnel, 
    funnelsCount = 0, 
    couponsCount = 0, 
    leadsCount = 0, 
    conversionRate = 0 
  } = result.data || {};

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Marketing Hub
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Manage your marketing campaigns, leads, and tools.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4 text-gray-800">Overview</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-4 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Funnels</CardTitle>
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{funnelsCount}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeFunnel ? `1 active funnel` : "No active funnels"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-4 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Coupons</CardTitle>
                <Percent className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{couponsCount}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Discount codes available
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-4 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{leadsCount}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Captured from funnels
                </p>
              </CardContent>
            </Card>
            
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-4 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
                <p className="text-xs text-gray-500 mt-1">
                  Lead to customer rate
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4 text-gray-800">Marketing Tools</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Sales Funnels</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Create and manage automated sales funnels with popups.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Capture leads and guide visitors towards becoming customers.
                    {activeFunnel ? " You have an active funnel ready to embed." : " Create your first funnel to get started."}
                  </p>
                </CardContent>
              </div>
              <CardFooter className="mt-4">
                <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`} className="w-full">
                  <Button variant="outline" className="w-full inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-all duration-300">
                    Manage Funnels
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Coupons</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Create and manage discount codes for your customers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Boost sales with limited-time offers and special promotions.
                  </p>
                </CardContent>
              </div>
              <CardFooter className="mt-4">
                <Link href={`/dashboard/${params.businessId}/marketing/coupons`} className="w-full">
                  <Button variant="outline" className="w-full inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-all duration-300">
                    Manage Coupons
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card className="rounded-xl border border-gray-100 bg-white shadow-md p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Leads</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    View and manage potential customers captured via funnels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Keep track of your leads and nurture them through the sales process.
                  </p>
                </CardContent>
              </div>
              <CardFooter className="mt-4">
                <Link href={`/dashboard/${params.businessId}/marketing/leads`} className="w-full">
                  <Button variant="outline" className="w-full inline-flex items-center justify-center rounded-full border-2 border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 bg-transparent hover:bg-blue-50 transition-all duration-300">
                    View Leads
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
