import type { Route } from "./+types";
import NotFoundPage from "~/pages/not-found";

export function meta({}: Route["metaArgs"]) {
  return [
    { title: "Not Found - MobiTrade" },
    { name: "description", content: "Product not found" },
  ];
}

export default function NotFound() {
  return <NotFoundPage />;
}
