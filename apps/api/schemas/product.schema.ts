import { z } from "zod";

export const getProductBySlugSchema = z.object({
  slug: z.string().min(1),
});
