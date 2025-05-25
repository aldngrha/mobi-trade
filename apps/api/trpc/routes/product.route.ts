import { publicProcedure, router } from "../../utils/trpc";
import {
  getProductBySlugSchema,
  productDeleteSchema,
  productSchema,
  productUpdateSchema,
} from "../../schemas/product.schema";
import {
  createProduct,
  deleteProduct,
  ProductBySlug,
  Products,
  updateProduct,
} from "../../services/product.service";
import { TRPCError } from "@trpc/server";
import { Product } from "../../types/types";

export const productRouter = router({
  getAll: publicProcedure.query(async (): Promise<Product[]> => {
    const products = await Products();
    return products;
  }),

  getBySlug: publicProcedure
    .input(getProductBySlugSchema)
    .query(async ({ input: { slug } }) => {
      const product = await ProductBySlug(slug);
      if (!product)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with slug "${slug}" not found`,
        });
      return product;
    }),

  create: publicProcedure.input(productSchema).mutation(async ({ input }) => {
    const created = await createProduct(input);
    return created;
  }),

  update: publicProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
      const updated = await updateProduct(input.id, input);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with id "${input.id}" not found`,
        });
      }
      return updated;
    }),

  delete: publicProcedure
    .input(productDeleteSchema)
    .mutation(async ({ input }) => {
      const deleted = await deleteProduct(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with id "${input.id}" not found`,
        });
      }
      return { success: true };
    }),
});
