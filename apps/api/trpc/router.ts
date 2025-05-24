import { router } from "../utils/trpc";
import { authRouter } from "./routes/auth.route";
import { productRouter } from "./routes/product.route";
import { checkoutRouter } from "./routes/checkout.route";

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  checkout: checkoutRouter,
});

export type AppRouter = typeof appRouter;
