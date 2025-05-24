import type { Route } from "./+types/success";
import OrderSuccessPage from "~/pages/success";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Success Order - MobiTrade" },
    {
      name: "description",
      content: "Yeayy!! Your order has been successfully",
    },
  ];
}

export default function Success() {
  return <OrderSuccessPage />;
}
