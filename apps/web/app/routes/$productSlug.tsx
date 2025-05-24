import type { Route } from "./+types/$productSlug";
import ProductPage from "~/pages/product";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Product Detail - MobiTrade" },
    { name: "description", content: "Description to your product choice" },
  ];
}

export default function ProductSlug() {
  return <ProductPage />;
}
