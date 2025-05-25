import { router, publicProcedure } from "../../utils/trpc";
import { checkoutInputSchema } from "../../schemas/checkout.schema";
import { checkout } from "../../services/checkout.service";

export const checkoutRouter = router({
  create: publicProcedure
    .input(checkoutInputSchema)
    .mutation(async ({ input }) => {
      const transaction = await checkout(input);

      return {
        message: "Checkout success",
        transaction,
      };
    }),
});
