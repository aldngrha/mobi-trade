import type { Route } from "./+types/dashboard";
import DashboardPage from "~/pages/admin/dashboard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function Checkout() {
  return <DashboardPage />;
}
