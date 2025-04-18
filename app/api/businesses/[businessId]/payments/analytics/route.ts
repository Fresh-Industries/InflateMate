import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";
import { PaymentType, PaymentStatus, Prisma } from "@prisma/client";

// Schema for analytics query parameters
const analyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "year", "custom", "all"]).default("month"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Type for monthly revenue data from raw query
type MonthlyDataRow = {
  month: string;
  year: string;
  revenue: string;
  refunds: string;
  transaction_count: string; // Added transaction count
};

/**
 * GET payment analytics for a business
 */
export async function GET(req: NextRequest, props: { params: Promise<{ businessId: string }> }) {
  const params = await props.params;
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
      
      const completedFilter = {
        status: PaymentStatus.COMPLETED,
        type: { in: [PaymentType.DEPOSIT, PaymentType.FULL_PAYMENT] },
      };

      const refundedFilter = {
        status: PaymentStatus.COMPLETED,
        type: PaymentType.REFUND,
      };

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
        
        // Get total revenue (only completed deposits/full payments)
        const revenueAggregation = await prisma.payment.aggregate({
          where: {
            businessId,
            ...completedFilter,
            ...dateFilter,
          },
          _sum: { amount: true },
        });
        
        // Get total refunds (only completed refunds)
        const refundAggregation = await prisma.payment.aggregate({
          where: {
            businessId,
            ...refundedFilter,
            ...dateFilter,
          },
          _sum: { amount: true },
        });
        
        // Get count of completed transactions (deposits/full payments)
        const completedTransactionsCount = await prisma.payment.count({
          where: {
            businessId,
            ...completedFilter,
            ...dateFilter,
          },
        });
        
        // Get count of refund transactions
        const refundedTransactionsCount = await prisma.payment.count({
          where: {
            businessId,
            ...refundedFilter,
            ...dateFilter,
          },
        });
        
        // Get payment counts by status (all types included for overview)
        const paymentStatusCounts = await prisma.payment.groupBy({
          by: ["status"],
          where: { businessId, ...dateFilter },
          _count: { id: true },
        });
        
        // Get payment counts by type (all statuses included for overview)
        const paymentTypeData = await prisma.payment.groupBy({
          by: ["type"],
          where: { businessId, ...dateFilter },
          _count: { id: true },
          _sum: { amount: true },
        });
        
        // Get monthly revenue and transaction counts using a raw SQL query
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Define the type for processed monthly data
        type MonthlyDataItem = {
          month: string;
          year: number;
          revenue: number;
          refunds: number;
          netRevenue: number;
          transactionCount: number; // Added count
        };
        
        let monthlyData: MonthlyDataItem[] = [];
        try {
          // Corrected Raw SQL Query: Use EXTRACT with timestamptz and filter by status='COMPLETED'
          // Added COUNT(*) for transaction counts, ensuring we only count relevant types.
          const monthlyDataResult = await prisma.$queryRaw<MonthlyDataRow[]>`
            SELECT
              EXTRACT(MONTH FROM "createdAt"::timestamptz) as month,
              EXTRACT(YEAR FROM "createdAt"::timestamptz) as year,
              SUM(CASE WHEN "type" IN ('DEPOSIT', 'FULL_PAYMENT') AND "status" = 'COMPLETED' THEN CAST("amount" as FLOAT) ELSE 0 END) as revenue,
              SUM(CASE WHEN "type" = 'REFUND' AND "status" = 'COMPLETED' THEN CAST("amount" as FLOAT) ELSE 0 END) as refunds,
              COUNT(CASE WHEN "type" IN ('DEPOSIT', 'FULL_PAYMENT') AND "status" = 'COMPLETED' THEN 1 ELSE NULL END) as transaction_count -- Count only completed revenue transactions
            FROM "Payment"
            WHERE
              "businessId" = ${businessId}
              ${start ? Prisma.sql`AND "createdAt" >= ${start}` : Prisma.empty}
              ${end ? Prisma.sql`AND "createdAt" <= ${end}` : Prisma.empty}
            GROUP BY
              EXTRACT(YEAR FROM "createdAt"::timestamptz),
              EXTRACT(MONTH FROM "createdAt"::timestamptz)
            ORDER BY
              year ASC, month ASC
          `;
          
          // Format the monthly data
          monthlyData = monthlyDataResult.map(row => {
            const monthIndex = parseInt(row.month) - 1;
            const revenue = parseFloat(row.revenue) || 0;
            const refunds = parseFloat(row.refunds) || 0; // Refunds are usually negative, Prisma handles sum correctly
            return {
              month: monthNames[monthIndex],
              year: parseInt(row.year),
              revenue: revenue,
              refunds: refunds, // Keep original sign if needed, or use Math.abs if displaying positive
              netRevenue: revenue + refunds, // Since refunds sum is negative
              transactionCount: parseInt(row.transaction_count) || 0,
            };
          });
        } catch (sqlError) {
          console.error("SQL query error:",
            sqlError ? (sqlError instanceof Error ? sqlError.message : String(sqlError)) : "Unknown error");
          // Continue with empty monthly data rather than failing the whole request
        }
        
        // Convert Decimal to numbers for revenue calculations
        const totalRevenue = revenueAggregation._sum.amount ? parseFloat(revenueAggregation._sum.amount.toString()) : 0;
        const totalRefunds = refundAggregation._sum.amount ? parseFloat(refundAggregation._sum.amount.toString()) : 0; // Already filtered for REFUND type, sum will be negative
        const netRevenue = totalRevenue + totalRefunds; // '+' because totalRefunds sum is negative
        
        // Format status counts
        const statusCounts: { [key: string]: number } = {
          COMPLETED: 0,
          PENDING: 0,
          FAILED: 0,
          REFUNDED: 0, // May overlap with 'COMPLETED' if refunds are marked completed. Adjust logic if needed.
        };
        paymentStatusCounts.forEach(count => {
          // Ensure status key exists before assignment
          if (count.status in statusCounts) {
             statusCounts[count.status] = count._count.id;
          }
        });
        
        // Format type data
        const typeData: { [key: string]: { count: number; amount: number } } = {
          DEPOSIT: { count: 0, amount: 0 },
          FULL_PAYMENT: { count: 0, amount: 0 },
          REFUND: { count: 0, amount: 0 },
        };
        paymentTypeData.forEach(data => {
           if (data.type in typeData) {
             typeData[data.type] = {
               count: data._count.id,
               // Use Math.abs for display consistency if desired, but keep raw sum for calculations
               amount: data._sum.amount ? parseFloat(data._sum.amount.toString()) : 0,
             };
           }
        });
        
        // Count unique bookings that have payments
        const bookingsWithPayments = await prisma.booking.count({
          where: {
            businessId,
            payments: {
              some: {
                status: PaymentStatus.COMPLETED,
                type: { in: [PaymentType.DEPOSIT, PaymentType.FULL_PAYMENT] },
                // Apply date filter to payments within bookings as well
                createdAt: start ? { gte: start, lte: end } : undefined,
              },
            },
          },
        });
        
        return {
          summary: {
            totalRevenue,
            totalRefunds, // This is the summed negative amount
            netRevenue,
            totalCompletedTransactions: completedTransactionsCount,
            totalRefundedTransactions: refundedTransactionsCount, // Added count
            totalBookings: bookingsWithPayments, // Or consider a different metric like unique customers
            period,
            startDate: start ? start.toISOString() : null,
            endDate: end.toISOString(),
          },
          statusCounts, // Overall status distribution
          typeData,     // Overall type distribution
          monthlyData,
          debug: { }, // Removed payment count debug info unless needed
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
      // Provide default structure matching the expected return type
      return NextResponse.json({
        summary: {
          totalRevenue: 0,
          totalRefunds: 0,
          netRevenue: 0,
          totalCompletedTransactions: 0,
          totalRefundedTransactions: 0,
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
