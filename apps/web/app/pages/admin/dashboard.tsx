"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { trpc } from "~/lib/trpc";
import AreaChartDashboard from "~/components/cart/area-chart";
import DonutChartDashboard from "~/components/cart/donut-chart";
import { getPercentageChange } from "~/lib/utils";

export default function AdminDashboard() {
  const { data } = trpc.dashboard.stats.useQuery();

  const result = data?.statistic;

  const cardData = [
    {
      title: "Total Revenue",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      value: result?.totalRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      change: `${result && getPercentageChange(result?.totalRevenue, result?.lastMonthRevenue)} from last month`,
    },
    {
      title: "Transactions",
      icon: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
      value: result?.totalTransactions,
      change: `${
        result &&
        getPercentageChange(
          result?.monthlyStats.transactions.current,
          result?.monthlyStats.transactions.previous,
        )
      } from last month`,
    },
    {
      title: "Products",
      icon: <Package className="h-4 w-4 text-muted-foreground" />,
      value: result?.totalProducts,
      change: `${
        result &&
        getPercentageChange(
          result?.monthlyStats.products.current,
          result?.monthlyStats.products.previous,
        )
      } from last month`,
    },
    {
      title: "Brands",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      value: result?.totalBrands,
      change: `${
        result &&
        getPercentageChange(
          result?.monthlyStats.brands.current,
          result?.monthlyStats.brands.previous,
        )
      } from last month`,
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the MobiTrade admin panel
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Monthly revenue and transaction count over the past year
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <AreaChartDashboard revenueTrends={result?.revenuePerMonth} />
            )}
          </CardContent>
        </Card>

        {/* Transaction Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>
              Distribution of transaction statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <DonutChartDashboard status={result?.transactionStatus} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest transactions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result?.recentTransactions.map((trx) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{trx.orderReference}</p>
                  <p className="text-sm text-muted-foreground">
                    {trx.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{trx.totalPrice}</p>
                  <p className="text-sm text-muted-foreground">{trx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
