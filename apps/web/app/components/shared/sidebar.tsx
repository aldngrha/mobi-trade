import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  ChartLine,
  Smartphone,
  TabletSmartphone,
  Cpu,
  Images,
  Box,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    link: "/admin/dashboard",
  },
  {
    title: "Brand Categories",
    icon: TabletSmartphone,
    link: "/admin/brand-categories",
  },
  {
    title: "Models",
    icon: Smartphone,
    link: "/admin/models",
  },
  {
    title: "Products",
    icon: Box,
    link: "/admin/products",
  },
  {
    title: "Variants",
    icon: Cpu,
    link: "/admin/variants",
  },
  {
    title: "Galleries",
    icon: Images,
    link: "/admin/galleries",
  },
  {
    title: "Transactions",
    icon: ChartLine,
    link: "#",
  },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="bg-white shadow fixed min-h-screen  w-64 p-4 transition-transform duration-300 ease-in-out">
        <nav>
          <h2 className="text-lg font-semibold mb-4 p-2">MobiTrade</h2>
          <ul className="space-y-3">
            {sidebarItems.map((item) => {
              // Check if current URL starts with item.link
              const isActive =
                item.link !== "#" && location.pathname.startsWith(item.link);

              return (
                <li key={item.title}>
                  <Link
                    to={item.link}
                    className={`flex items-center p-2 rounded-md duration-300 transition-colors
                      ${
                        isActive
                          ? "bg-slate-200 text-slate-900 font-semibold"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                      }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 pl-68 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
