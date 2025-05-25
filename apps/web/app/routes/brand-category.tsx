import type { Route } from "./+types/brand-category";
import BrandCategoryPage from "~/pages/admin/brand-category";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brand Categories - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function BrandCategories() {
  return <BrandCategoryPage />;
}
