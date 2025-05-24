import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "/sign-in", file: "routes/sign-in.tsx" },
  { path: "/sign-up", file: "routes/sign-up.tsx" },
  { path: "/checkout", file: "routes/checkout.tsx" },
  { path: "/admin/dashboard", file: "routes/dashboard.tsx" },
  { path: "/checkout/success", file: "routes/success.tsx" },
  { path: "/products/:productSlug", file: "routes/$productSlug.tsx" },
  { path: "*", file: "routes/not-found.tsx" },
] satisfies RouteConfig;
