import type { Route } from "./+types/transactions";
import TransactionsPage from "~/pages/admin/transactions";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transactions - MobiTrade" },
    { name: "description", content: "All transactions!" },
  ];
}

export default function Models() {
  return <TransactionsPage />;
}
