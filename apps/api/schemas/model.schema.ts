import { z } from "zod";

export const modelSchema = z.object({
  name: z.string().min(3, "Model name must be at least 3 characters long"),
  brandId: z.string({ required_error: "Brand is required" }),
});

export const modelSchemaInput = z.object({
  id: z.string(),
});

export const modelUpdateSchema = modelSchema.extend({
  id: z.string(),
});

export const modelDeleteSchema = z.object({
  id: z.string(),
});
