import { publicProcedure, router } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";
import {
  brandCategories,
  brandCategory,
  createBrand,
  deleteBrand,
  updateBrand,
} from "../../services/brand.service";
import {
  brandDeleteSchema,
  brandSchema,
  brandSchemaInput,
  brandUpdateSchema,
} from "../../schemas/brand.schema";
import { deleteProduct } from "../../services/product.service";

export const brandRouter = router({
  brandCategories: publicProcedure.query(async () => {
    const products = await brandCategories();
    return products;
  }),

  brandcategory: publicProcedure
    .input(brandSchemaInput)
    .query(async ({ input }) => {
      const product = await brandCategory(input.id);
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Brand with id "${input.id}" not found`,
        });
      }
      return product;
    }),

  create: publicProcedure.input(brandSchema).mutation(async ({ input }) => {
    const created = await createBrand(input);
    return created;
  }),

  update: publicProcedure
    .input(brandUpdateSchema)
    .mutation(async ({ input }) => {
      const updated = await updateBrand(input.id, input);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Brand with id "${input.id}" not found`,
        });
      }
      return updated;
    }),

  delete: publicProcedure
    .input(brandDeleteSchema)
    .mutation(async ({ input }) => {
      const deleted = await deleteBrand(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Brand with id "${input.id}" not found`,
        });
      }
      return { success: true };
    }),
});
