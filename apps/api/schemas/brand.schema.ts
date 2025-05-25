import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(3, "Brand name must be at least 3 characters long"),
});

export const brandSchemaInput = z.object({
  id: z.string(),
});

export const brandUpdateSchema = brandSchema.extend({
  id: z.string(),
});

export const brandDeleteSchema = z.object({
  id: z.string(),
});
