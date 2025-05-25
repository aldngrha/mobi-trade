"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Package,
  CreditCard,
  Images,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      icon: Package,
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
    },
    {
      title: "Transactions",
      value: "892",
      icon: CreditCard,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transaction #{i}234</p>
                    <p className="text-sm text-muted-foreground">
                      Customer {i}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(Math.random() * 1000).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Laptop Pro", "Wireless Mouse", "Keyboard", "Monitor"].map(
                (product, i) => (
                  <div
                    key={product}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{product}</p>
                      <p className="text-sm text-muted-foreground">
                        {50 - i * 10} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(Math.random() * 500 + 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
