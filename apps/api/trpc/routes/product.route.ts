import { publicProcedure, router } from "../../utils/trpc";
import { getProductBySlugSchema } from "../../schemas/product.schema";
import {
  getAllProducts,
  getProductBySlug,
} from "../../services/product.service";
import { TRPCError } from "@trpc/server";

export const productRouter = router({
  getAll: publicProcedure.query(async () => {
    const products = await getAllProducts();
    return products;
  }),

  getBySlug: publicProcedure
    .input(getProductBySlugSchema)
    .query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with slug "${input.slug}" not found`,
        });
      }
      return product;
    }),
});
