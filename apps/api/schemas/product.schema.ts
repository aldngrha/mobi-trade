import { z } from "zod";

export const getProductBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const productSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  slug: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  modelId: z.string().min(1, "Model ID is required"),
  description: z.string().min(1, "Description is required"),
  discount: z.number().optional().nullable(),
  minimumOrderQuantity: z.number(),
  batteryHealth: z.number().optional().nullable(),
  display: z.string().optional().nullable(),
  processor: z.string().optional().nullable(),
  camera: z.string().optional().nullable(),
  battery: z.string().optional().nullable(),
  os: z.string().optional().nullable(),
  connectivity: z.string().optional().nullable(),
});

export const productUpdateSchema = productSchema.extend({
  id: z.string(),
});

export const productDeleteSchema = z.object({
  id: z.string(),
});
