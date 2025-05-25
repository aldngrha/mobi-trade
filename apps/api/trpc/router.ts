import { router } from "../utils/trpc";
import { authRouter } from "./routes/auth.route";
import { productRouter } from "./routes/product.route";
import { checkoutRouter } from "./routes/checkout.route";
import { brandRouter } from "./routes/brand.route";
import { modelRouter } from "./routes/model.route";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  checkout: checkoutRouter,
  brand: brandRouter,
  model: modelRouter,
});

export type AppRouter = typeof appRouter;
