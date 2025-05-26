import { z } from "zod";

export const gallerySchema = z.object({
  productId: z.string(),
  imageUrl: z.string(),
});

export const fileUploadSchema = z.object({
  file: z.string(),
  fileName: z.string(),
});

export const gallerySchemaInput = z.object({
  id: z.string(),
});

export const galleryUpdateSchema = gallerySchema.extend({
  id: z.string(),
  file: z.string().optional(),
  fileName: z.string().optional(),
});

export const galleryDeleteSchema = z.object({
  id: z.string(),
});
