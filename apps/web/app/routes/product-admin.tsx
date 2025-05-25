import type { Route } from "./+types/product-admin";
import ProductAminPage from "~/pages/admin/product";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function ProductAdmin() {
  return <ProductAminPage />;
}
