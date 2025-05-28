import { publicProcedure, router } from "../../utils/trpc";
import { TRPCError } from "@trpc/server";
import {
  galleries,
  gallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../../services/gallery.service";
import {
  fileUploadSchema,
  galleryDeleteSchema,
  gallerySchema,
  gallerySchemaInput,
  galleryUpdateSchema,
} from "../../schemas/gallery.schema";
import { saveImageToSupabase } from "../../utils/upload";
import { z } from "zod";

export const galleryRouter = router({
  list: publicProcedure.query(() => galleries()),

  detail: publicProcedure.input(gallerySchemaInput).query(async ({ input }) => {
    const item = await gallery(input.id);
    if (!item) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Gallery item with id "${input.id}" not found`,
      });
    }
    return item;
  }),

  create: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        file: z.string(),
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // save image dulu
      let imageUrl: string;
      try {
        imageUrl = await saveImageToSupabase(input.file, input.fileName);
      } catch (error) {
        console.error("Upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to save image to storage: ${error instanceof Error ? error.message : "unknown error"}`,
        });
      }

      // validate and create gallery record
      const validated = gallerySchema.safeParse({
        productId: input.productId,
        imageUrl,
      });

      if (!validated.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Validation failed for gallery input",
          cause: validated.error,
        });
      }

      try {
        const created = await createGallery(validated.data);
        return created;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create gallery record",
        });
      }
    }),

  update: publicProcedure
    .input(galleryUpdateSchema)
    .mutation(async ({ input }) => {
      const { id, file, fileName, imageUrl, ...rest } = input;

      const updateData: Partial<typeof rest> & { imageUrl?: string } = {
        ...rest,
      };

      if (file && fileName) {
        const savedImageUrl = await saveImageToSupabase(file, fileName);
        updateData.imageUrl = savedImageUrl;
      } else if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const updated = await updateGallery(id, updateData);

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Gallery item with id "${id}" not found`,
        });
      }

      return updated;
    }),

  delete: publicProcedure
    .input(galleryDeleteSchema)
    .mutation(async ({ input }) => {
      const deleted = await deleteGallery(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Gallery item with id "${input.id}" not found`,
        });
      }
      return { success: true };
    }),
});
