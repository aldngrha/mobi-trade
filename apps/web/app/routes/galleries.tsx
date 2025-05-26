import type { Route } from "./+types/galleries";
import GalleryPage from "~/pages/admin/gallery";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Galleries - MobiTrade" },
    { name: "description", content: "Checkout your order!" },
  ];
}

export default function Models() {
  return <GalleryPage />;
}
