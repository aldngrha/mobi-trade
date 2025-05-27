import type { Route } from "./+types/$transactionId";
import TransactionDetailPage from "~/pages/admin/transaction-detail";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transaction Detail - MobiTrade" },
    { name: "description", content: "Description to your product choice" },
  ];
}

export default function ProductSlug() {
  return <TransactionDetailPage />;
}
