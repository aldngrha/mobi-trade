import type { Route } from "./+types/variants";
import VariantPage from "~/pages/admin/variants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Models - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function Variants() {
  return <VariantPage />;
}
