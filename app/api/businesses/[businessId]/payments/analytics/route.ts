// app/api/businesses/[businessId]/payments/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withBusinessAuth } from "@/lib/auth/clerk-utils";
import { PaymentType, PaymentStatus } from "../../../../../../prisma/generated/prisma/client";
import { startOfDay } from "date-fns";

const analyticsQuerySchema = z.object({
  period: z.enum(["day", "week", "month", "year", "custom", "all"]).default("month"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ businessId: string }> }
) {
  const { businessId } = await props.params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!businessId) return NextResponse.json({ error: "Business ID is required" }, { status: 400 });

  // parse + validate query
  const { searchParams } = new URL(req.url);
  let analyticsParams;
  try {
    analyticsParams = analyticsQuerySchema.parse(Object.fromEntries(searchParams));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: e.errors },
        { status: 400 }
      );
    }
    throw e;
  }
  const { period, startDate, endDate } = analyticsParams;

  const result = await withBusinessAuth(businessId, userId, async () => {
    // determine date window
    const now = new Date();
    let start: Date | null = null;
    let end = new Date(now);
    if (period === "custom" && startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else if (period !== "all") {
      switch (period) {
        case "day":
          start = startOfDay(now);
          break;
        case "week":
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          start = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "year":
          start = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          start = new Date(now.setMonth(now.getMonth() - 1));
      }
    }
    const dateFilter = start ? { createdAt: { gte: start, lte: end } } : {};

    // aggregates
    const revenueAgg = await prisma.payment.aggregate({
      where: { businessId, status: PaymentStatus.COMPLETED, type: { in: [PaymentType.DEPOSIT, PaymentType.FULL_PAYMENT] }, ...dateFilter },
      _sum: { amount: true },
    });
    const refundAgg = await prisma.payment.aggregate({
      where: { businessId, status: PaymentStatus.REFUNDED, type: PaymentType.REFUND, ...dateFilter },
      _sum: { amount: true },
    });
    const completedCount = await prisma.payment.count({
      where: { businessId, status: PaymentStatus.COMPLETED, type: { in: [PaymentType.DEPOSIT, PaymentType.FULL_PAYMENT] }, ...dateFilter },
    });
    const refundedCount = await prisma.payment.count({
      where: { businessId, status: PaymentStatus.REFUNDED, type: PaymentType.REFUND, ...dateFilter },
    });

    // monthly breakdown via raw SQL
    const whereClauses = [`"businessId"='${businessId}'`];
    if (start) whereClauses.push(`"createdAt">='${start.toISOString()}'`);
    if (end)   whereClauses.push(`"createdAt"<='${end.toISOString()}'`);
    const rawSql = `
      SELECT
        EXTRACT(MONTH FROM "createdAt") AS month,
        EXTRACT(YEAR  FROM "createdAt") AS year,
        SUM(CASE WHEN "status"='COMPLETED' AND "type" IN ('DEPOSIT','FULL_PAYMENT') THEN CAST(amount AS FLOAT) ELSE 0 END) AS revenue,
        SUM(CASE WHEN "status"='REFUNDED'  AND "type"='REFUND'            THEN CAST(amount AS FLOAT) ELSE 0 END) AS refunds,
        COUNT(CASE WHEN "status"='COMPLETED' AND "type" IN ('DEPOSIT','FULL_PAYMENT') THEN 1 END) AS transaction_count
      FROM "Payment"
      WHERE ${whereClauses.join(" AND ")}
      GROUP BY year, month
      ORDER BY year, month;
    `;
    const monthlyRaw = await prisma.$queryRawUnsafe<Array<{
      month: string; year: string; revenue: string; refunds: string; transaction_count: unknown;
    }>>(rawSql);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthlyData = monthlyRaw.map(r => ({
      month: monthNames[Number(r.month) - 1],
      year:  Number(r.year),
      revenue: Number(r.revenue),
      refunds: Number(r.refunds),
      netRevenue: Number(r.revenue) + Number(r.refunds),
      transactionCount: Number(r.transaction_count ?? 0),
    }));

    // statusCounts
    const statusGroups = await prisma.payment.groupBy({
      by: ["status"],
      where: { businessId, ...dateFilter },
      _count: { id: true },
    });
    const statusCounts: Record<string, number> = {
      COMPLETED: 0, PENDING: 0, FAILED: 0, REFUNDED: 0,
    };
    statusGroups.forEach(g => {
      statusCounts[g.status] = g._count.id;
    });

    // typeData
    const typeGroups = await prisma.payment.groupBy({
      by: ["type"],
      where: { businessId, ...dateFilter },
      _count: { id: true },
      _sum:   { amount: true },
    });
    const typeData: Record<string, { count: number; amount: number }> = {
      DEPOSIT: { count: 0, amount: 0 },
      FULL_PAYMENT: { count: 0, amount: 0 },
      REFUND: { count: 0, amount: 0 },
    };
    typeGroups.forEach(g => {
      typeData[g.type] = {
        count: g._count.id,
        amount: g._sum.amount ? Number(g._sum.amount) : 0,
      };
    });

    // final object
    return {
      summary: {
        totalRevenue: revenueAgg._sum.amount ? Number(revenueAgg._sum.amount) : 0,
        totalRefunds: refundAgg._sum.amount    ? Number(refundAgg._sum.amount)   : 0,
        netRevenue:   (revenueAgg._sum.amount ? Number(revenueAgg._sum.amount) : 0)
                    + (refundAgg._sum.amount ? Number(refundAgg._sum.amount) : 0),
        totalCompletedTransactions: completedCount,
        totalRefundedTransactions:  refundedCount,
        totalBookings: await prisma.booking.count({
          where: {
            businessId,
            payments: {
              some: {
                status: PaymentStatus.COMPLETED,
                type: { in: [PaymentType.DEPOSIT, PaymentType.FULL_PAYMENT] },
                ...(start ? { createdAt: { gte: start, lte: end } } : {}),
              }
            }
          }
        }),
        period,
        startDate: start ? start.toISOString() : null,
        endDate:   end.toISOString(),
      },
      statusCounts,
      typeData,
      monthlyData,
    };
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }
  console.log(result.data);
  // unwrap so client gets { summary, statusCounts, typeData, monthlyData }
  return NextResponse.json(result.data);
}