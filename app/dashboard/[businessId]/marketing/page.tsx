import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Code, Users, Percent, TrendingUp, BarChart3 } from "lucide-react";
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
        
        // Count leads if model exists
        if (prisma.lead) {
          leadsCount = await prisma.lead.count({
            where: {
              businessId: params.businessId,
            },
          });
          
          // Calculate conversion rate if there are leads
          if (leadsCount > 0) {
            // Try to calculate conversion rate if possible
            try {
              // Check if we can access conversions through leads
              const conversionsCount = await prisma.lead.count({
                where: {
                  businessId: params.businessId,
                  converted: true,
                },
              });
              
              conversionRate = Math.round((conversionsCount / leadsCount) * 100);
            } catch (error) {
              console.error("Error calculating conversion rate:", error);
              // Keep default conversion rate
            }
          }
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
    <div className="space-y-8">
      {/* Marketing Overview */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-6">Marketing Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Funnels</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{funnelsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeFunnel ? "1 active funnel" : "No active funnels"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{couponsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Discount codes available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Captured from funnels
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lead to customer rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Marketing Tools */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Marketing Tools</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle>Sales Funnels</CardTitle>
              <CardDescription>
                Create and manage sales funnels with popups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create popups to capture leads and offer discounts to your customers. 
                {activeFunnel ? " You have an active funnel ready to embed." : " Create your first funnel to start capturing leads."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`}>
                <Button variant="outline">
                  Manage Funnels
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>
                Create and manage discount coupons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create discount coupons to offer to your customers. Boost sales with limited-time offers and special promotions.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/${params.businessId}/marketing/coupons`}>
                <Button variant="outline">
                  Manage Coupons
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle>Leads</CardTitle>
              <CardDescription>
                View and manage your leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage leads captured from your sales funnels. Convert leads into customers with targeted follow-ups.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/${params.businessId}/marketing/leads`}>
                <Button variant="outline">
                  View Leads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      {!activeFunnel && funnelsCount === 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Get Started with Marketing</CardTitle>
            <CardDescription>
              Set up your first marketing campaign in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              You haven&apos;t created any sales funnels yet. Create your first funnel to start capturing leads and growing your business.
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/dashboard/${params.businessId}/marketing/sales-funnels`}>
              <Button>
                Create First Funnel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
