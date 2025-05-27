import { router } from "../utils/trpc";
import { authRouter } from "./routes/auth.route";
import { productRouter } from "./routes/product.route";
import { checkoutRouter } from "./routes/transaction.route";
import { brandRouter } from "./routes/brand.route";
import { modelRouter } from "./routes/model.route";
import { variantRouter } from "./routes/variant.route";
import { galleryRouter } from "./routes/gallery.route";
import { dashboardRouter } from "./routes/dashboard.route";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  checkout: checkoutRouter,
  brand: brandRouter,
  model: modelRouter,
  variant: variantRouter,
  gallery: galleryRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
