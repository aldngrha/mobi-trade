import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "/sign-in", file: "routes/sign-in.tsx" },
  { path: "/sign-up", file: "routes/sign-up.tsx" },
  { path: "/checkout", file: "routes/checkout.tsx" },
  {
    path: "/admin",
    file: "routes/admin-layout.tsx",
    children: [
      { path: "dashboard", file: "routes/dashboard.tsx" },
      { path: "products", file: "routes/product-admin.tsx" },
      { path: "brand-categories", file: "routes/brand-category.tsx" },
      { path: "models", file: "routes/models.tsx" },
      { path: "variants", file: "routes/variants.tsx" },
      { path: "galleries", file: "routes/galleries.tsx" },
      { path: "transactions", file: "routes/transactions.tsx" },
      { path: "transaction/:transactionId", file: "routes/$transactionId.tsx" },
    ],
  },
  { path: "/checkout/success", file: "routes/success.tsx" },
  { path: "/product/:productSlug", file: "routes/$productSlug.tsx" },
  { path: "*", file: "routes/not-found.tsx" },
] satisfies RouteConfig;
