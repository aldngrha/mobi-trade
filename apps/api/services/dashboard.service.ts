import { prisma, TransactionStatus } from "../prisma/client";
import { TRPCError } from "@trpc/server";

export const dashboardService = async () => {
  try {
    const now = new Date();

    // Define the start of the current and previous month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // last day of previous month

    // Fetch all required metrics in parallel for better performance
    const [
      totalUsers,
      totalProducts,
      totalTransactions,
      totalBrands,

      // Revenue (sum of totalPrice) for current and previous month
      currentMonthRevenueResult,
      previousMonthRevenueResult,

      // Entity counts created in the current month
      currentMonthUsers,
      currentMonthProducts,
      currentMonthTransactions,
      currentMonthBrands,

      // Entity counts created in the previous month
      previousMonthUsers,
      previousMonthProducts,
      previousMonthTransactions,
      previousMonthBrands,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.transaction.count(),
      prisma.brand.count(),

      prisma.transaction.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.transaction.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.product.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.transaction.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),
      prisma.brand.count({
        where: {
          createdAt: { gte: currentMonthStart },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),
      prisma.product.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),
      prisma.brand.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lte: previousMonthEnd,
          },
        },
      }),
    ]);

    // Convert revenue results to numbers (fallback to 0 if null)
    const currentMonthRevenue = Number(
      currentMonthRevenueResult._sum.totalPrice ?? 0,
    );
    const previousMonthRevenue = Number(
      previousMonthRevenueResult._sum.totalPrice ?? 0,
    );

    // total transactions by each status
    const transactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });
    const transactionStatus = await prisma.transaction.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const statusColorMap: Record<string, string> = {
      DELIVERED: "#bbf7d0",
      SHIPPED: "#bfdbfe",
      PAID: "#fde68a",
      PENDING: "#e2e8f0",
      REJECTED: "#fecaca",
      APPROVED: "#bae6fd",
    };

    const transactionStatusData = transactionStatus.map((item) => ({
      status: item.status,
      count: item._count.status,
      fill: statusColorMap[item.status] ?? "#e5e7eb", // fallback color (gray-200)
    }));

    const formatted = transactions.map((tx) => ({
      orderReference: tx.orderReference,
      customerName: tx.user.name,
      totalPrice: `${Number(tx.totalPrice ?? 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: "currency",
        currency: "USD",
      })}`,
      status: tx.status,
    }));

    // monthly revenue and transaction count
    const currentYear = new Date().getFullYear();

    const result = await prisma.transaction.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lte: new Date(`${currentYear}-12-31`),
        },
      },
      _sum: {
        totalPrice: true,
      },
      _count: true,
    });

    const monthlyMap: Record<
      number,
      { revenue: number; transactions: number }
    > = {};

    for (const row of result) {
      const month = new Date(row.createdAt).getMonth(); // 0–11
      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          revenue: 0,
          transactions: 0,
        };
      }

      monthlyMap[month].revenue += Number(row._sum.totalPrice ?? 0);
      monthlyMap[month].transactions += row._count;
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueData = months.map((monthLabel, idx) => ({
      month: monthLabel,
      revenue: monthlyMap[idx]?.revenue ?? 0,
      transactions: monthlyMap[idx]?.transactions ?? 0,
    }));

    return {
      totalUsers,
      totalProducts,
      totalTransactions,
      totalBrands,
      totalRevenue: currentMonthRevenue,
      lastMonthRevenue: previousMonthRevenue,
      recentTransactions: formatted,
      transactionStatus: transactionStatusData,
      revenuePerMonth: revenueData,

      monthlyStats: {
        users: {
          current: currentMonthUsers,
          previous: previousMonthUsers,
        },
        products: {
          current: currentMonthProducts,
          previous: previousMonthProducts,
        },
        transactions: {
          current: currentMonthTransactions,
          previous: previousMonthTransactions,
        },
        brands: {
          current: currentMonthBrands,
          previous: previousMonthBrands,
        },
      },
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch dashboard data",
    });
  }
};
