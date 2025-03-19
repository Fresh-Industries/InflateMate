import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";

// Schema for analytics query parameters
const analyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "year", "custom", "all"]).default("month"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Type for monthly revenue data
type MonthlyRevenueRow = {
  month: string;
  year: string;
  revenue: string;
  refunds: string;
};

/**
 * GET payment analytics for a business
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { businessId: string } }
) {
  try {
    // Authentication check
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get path parameters - fix for Next.js params warning
    // The { businessId } = params pattern triggers a Next.js warning
    // Use direct access instead
    const businessId = params?.businessId;
    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    let analyticsParams;
    try {
      analyticsParams = analyticsQuerySchema.parse(Object.fromEntries(searchParams));
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid query parameters", details: parseError.errors },
          { status: 400 }
        );
      }
      throw parseError;
    }

    const { period, startDate, endDate } = analyticsParams;
    
    console.log(`Fetching analytics for businessId: ${businessId}, period: ${period}`);
    
    // Call withBusinessAuth with error handling
    const result = await withBusinessAuth(businessId, userId, async () => {
      // Calculate date ranges based on the period
      const now = new Date();
      let start: Date | null = null;
      let end: Date = new Date(now);
      
      if (period === "custom" && startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      } else if (period === "all") {
        // No filtering if "all"
        start = null;
      } else {
        switch (period) {
          case "day":
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            break;
          case "week":
            start = new Date(now);
            start.setDate(now.getDate() - 7);
            break;
          case "month":
            start = new Date(now);
            start.setMonth(now.getMonth() - 1);
            break;
          case "year":
            start = new Date(now);
            start.setFullYear(now.getFullYear() - 1);
            break;
          default:
            start = new Date(now);
            start.setMonth(now.getMonth() - 1);
        }
      }
      
      // Build where clause for Prisma queries
      const dateFilter = start
        ? { createdAt: { gte: start, lte: end } }
        : {};
      
      try {
        // Debug: fetch all payments using the filter
        const allPayments = await prisma.payment.findMany({
          where: { businessId, ...dateFilter },
          select: {
            id: true,
            amount: true,
            type: true,
            status: true,
            createdAt: true,
            bookingId: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        console.log(`Found ${allPayments.length} payments for business ${businessId}`);
        
        // Get total revenue (excluding refunds)
        const revenue = await prisma.payment.aggregate({
          where: {
            businessId,
            type: { in: ["DEPOSIT", "FULL_PAYMENT"] },
            status: "COMPLETED",
            ...dateFilter,
          },
          _sum: { amount: true },
        });
        
        // Get total refunds
        const refunds = await prisma.payment.aggregate({
          where: {
            businessId,
            type: "REFUND",
            status: "COMPLETED",
            ...dateFilter,
          },
          _sum: { amount: true },
        });
        
        // Get payment counts by status
        const paymentCounts = await prisma.payment.groupBy({
          by: ["status"],
          where: { businessId, ...dateFilter },
          _count: { id: true },
        });
        
        // Get payment counts by type
        const paymentTypeData = await prisma.payment.groupBy({
          by: ["type"],
          where: { businessId, ...dateFilter },
          _count: { id: true },
          _sum: { amount: true },
        });
        
        // Get monthly revenue using a raw SQL query
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Define the type for monthly data
        type MonthlyDataItem = {
          month: string;
          year: number;
          revenue: number;
          refunds: number;
          netRevenue: number;
        };
        
        let monthlyData: MonthlyDataItem[] = [];
        try {
          const monthlyRevenue = await prisma.$queryRaw<MonthlyRevenueRow[]>`
            SELECT 
              EXTRACT(MONTH FROM "createdAt") as month,
              EXTRACT(YEAR FROM "createdAt") as year,
              SUM(CASE WHEN "type" IN ('DEPOSIT', 'FULL_PAYMENT') THEN CAST("amount" as FLOAT) ELSE 0 END) as revenue,
              SUM(CASE WHEN "type" = 'REFUND' THEN CAST("amount" as FLOAT) ELSE 0 END) as refunds
            FROM "Payment"
            WHERE 
              "businessId" = ${businessId}
              AND "status" = 'COMPLETED'
              ${start ? `AND "createdAt" >= '${start.toISOString()}'` : ''}
              ${start ? `AND "createdAt" <= '${end.toISOString()}'` : ''}
            GROUP BY 
              EXTRACT(MONTH FROM "createdAt"::timestamptz),
              EXTRACT(YEAR FROM "createdAt"::timestamptz)
            ORDER BY 
              year ASC, month ASC
          `;
          
          // Format the monthly data
          monthlyData = monthlyRevenue.map(row => {
            const monthIndex = parseInt(row.month) - 1;
            return {
              month: monthNames[monthIndex],
              year: parseInt(row.year),
              revenue: parseFloat(row.revenue) || 0,
              refunds: parseFloat(row.refunds) || 0,
              netRevenue: (parseFloat(row.revenue) || 0) + (parseFloat(row.refunds) || 0),
            };
          });
        } catch (sqlError) {
          console.error("SQL query error:", 
            sqlError ? (sqlError instanceof Error ? sqlError.message : String(sqlError)) : "Unknown error");
          // Continue with empty monthly data rather than failing the whole request
        }
        
        // Convert Decimal to numbers for revenue calculations
        const totalRevenue = revenue._sum.amount ? parseFloat(revenue._sum.amount.toString()) : 0;
        const totalRefunds = refunds._sum.amount ? parseFloat(refunds._sum.amount.toString()) : 0;
        const netRevenue = totalRevenue + totalRefunds;
        
        // Format status counts
        const statusCounts: { [key: string]: number } = {
          COMPLETED: 0,
          PENDING: 0,
          FAILED: 0,
          REFUNDED: 0,
        };
        paymentCounts.forEach(count => {
          statusCounts[count.status] = count._count.id;
        });
        
        // Format type data
        const typeData: { [key: string]: { count: number; amount: number } } = {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 },
        };
        paymentTypeData.forEach(data => {
          typeData[data.type] = {
            count: data._count.id,
            amount: data._sum.amount ? parseFloat(data._sum.amount.toString()) : 0,
          };
        });
        
        // Count unique bookings that have payments
        const bookingsWithPayments = await prisma.booking.count({
          where: {
            businessId,
            payments: {
              some: {
                status: "COMPLETED",
                type: { in: ["DEPOSIT", "FULL_PAYMENT"] },
                ...dateFilter,
              },
            },
          },
        });
        
        return {
          summary: {
            totalRevenue,
            totalRefunds,
            netRevenue,
            totalBookings: bookingsWithPayments,
            period,
            startDate: start ? start.toISOString() : null,
            endDate: end.toISOString(),
          },
          statusCounts,
          typeData,
          monthlyData,
          debug: { paymentCount: allPayments.length },
        };
      } catch (prismError) {
        // Fix error logging to handle null cases
        console.error("Database error in analytics:", 
          prismError ? (prismError instanceof Error ? prismError.message : String(prismError)) : "Unknown error");
        throw new Error("Error fetching analytics data");
      }
    });
    
    console.log("Analytics route result:", result);
    
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }
    
    // Add a fallback for undefined data
    if (!result.data) {
      console.error("Unexpected null data in analytics result");
      return NextResponse.json({ 
        summary: { 
          totalRevenue: 0, 
          totalRefunds: 0, 
          netRevenue: 0,
          totalBookings: 0,
          period,
          startDate: null,
          endDate: new Date().toISOString()
        },
        statusCounts: { COMPLETED: 0, PENDING: 0, FAILED: 0, REFUNDED: 0 },
        typeData: {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 }
        },
        monthlyData: [],
        debug: { error: "No data returned from analytics processor" }
      });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in payment analytics route:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
