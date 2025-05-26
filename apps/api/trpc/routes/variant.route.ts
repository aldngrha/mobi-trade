import { publicProcedure, router } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";
import {
  productVariants,
  productVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../../services/variant.service";
import {
  productVariantDeleteSchema,
  productVariantSchema,
  productVariantSchemaInput,
  productVariantUpdateSchema,
} from "../../schemas/variant.schema";

export const variantRouter = router({
  list: publicProcedure.query(async () => {
    return await productVariants();
  }),

  detail: publicProcedure
    .input(productVariantSchemaInput)
    .query(async ({ input }) => {
      const variant = await productVariant(input.id);
      if (!variant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product variant with id "${input.id}" not found`,
        });
      }
      return variant;
    }),

  create: publicProcedure
    .input(productVariantSchema)
    .mutation(async ({ input }) => {
      const create = await createProductVariant(input);
      return create;
    }),

  update: publicProcedure
    .input(productVariantUpdateSchema)
    .mutation(async ({ input }) => {
      const updated = await updateProductVariant(input.id, input);
      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product variant with id "${input.id}" not found`,
        });
      }
      return updated;
    }),

  delete: publicProcedure
    .input(productVariantDeleteSchema)
    .mutation(async ({ input }) => {
      const deleted = await deleteProductVariant(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product variant with id "${input.id}" not found`,
        });
      }
      return { success: true };
    }),
});
