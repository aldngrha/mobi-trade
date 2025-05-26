import { z } from "zod";

export const productVariantSchema = z.object({
  productId: z.string(),
  storage: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || /^\d+$/.test(val), {
      message: "Storage must contain only numbers",
    }),

  ram: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || /^\d+$/.test(val), {
      message: "RAM must contain only numbers",
    }),
  color: z.string().optional().nullable(),
  condition: z.string().optional().nullable(),
  price: z.union([z.string(), z.number()]),
  stockQuantity: z.number(),
  warrantyMonths: z.number().optional().nullable(),
});

export const productVariantSchemaInput = z.object({
  id: z.string(),
});

export const productVariantUpdateSchema = productVariantSchema.extend({
  id: z.string(),
});

export const productVariantDeleteSchema = z.object({
  id: z.string(),
});
