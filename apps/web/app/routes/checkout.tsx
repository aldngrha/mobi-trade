import type { Route } from "./+types/checkout";
import CheckoutPage from "~/pages/checkout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function Checkout() {
  return <CheckoutPage />;
}
