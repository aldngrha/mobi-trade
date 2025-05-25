import type { Route } from "./+types/models";
import ModelsPage from "~/pages/admin/models";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Models - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function Models() {
  return <ModelsPage />;
}
