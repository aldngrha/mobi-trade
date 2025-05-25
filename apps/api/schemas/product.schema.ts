import { z } from "zod";

export const getProductBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  slug: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  brand: z.string(),
  model: z.string().min(1, "Model is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a number with up to 2 decimals")
    .refine((val) => parseFloat(val) > 0, {
      message: "Price must be positive",
    }),
  discount: z.number().optional().nullable(),
  condition: z.string().optional().or(z.literal("")).nullable(),
  storage: z.string().optional().or(z.literal("")).nullable(),
  minimumOrderQuantity: z.number(),
  warrantyMonths: z.number().optional().nullable(),
  stockQuantity: z.number(),
  reviewsCount: z.number().optional().nullable(),
  batteryHealth: z.number().optional().nullable(),
  ram: z.string().optional().or(z.literal("")).nullable(),
  display: z.string().optional().or(z.literal("")).nullable(),
  processor: z.string().optional().or(z.literal("")).nullable(),
  camera: z.string().optional().or(z.literal("")).nullable(),
  battery: z.string().optional().or(z.literal("")).nullable(),
  os: z.string().optional().or(z.literal("")).nullable(),
  connectivity: z.string().optional().or(z.literal("")).nullable(),
  color: z.string().optional().or(z.literal("")).nullable(),
});

export const productUpdateSchema = productSchema.extend({
  id: z.string(),
});

export const productDeleteSchema = z.object({
  id: z.string(),
});
