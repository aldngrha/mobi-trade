import { router, publicProcedure } from "../../utils/trpc";
import { checkoutSchema } from "../../schemas/checkout.schema";
import { checkout } from "../../services/checkout.service";

export const checkoutRouter = router({
  create: publicProcedure.input(checkoutSchema).mutation(async ({ input }) => {
    const transaction = await checkout(input);

    return {
      message: "Checkout success",
      transaction,
    };
  }),
});
