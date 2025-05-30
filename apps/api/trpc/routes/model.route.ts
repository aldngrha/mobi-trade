import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../../utils/trpc";

import {
  models,
  model,
  createModel,
  updateModel,
  deleteModel,
} from "../../services/model.service";

import {
  modelSchema,
  modelSchemaInput,
  modelUpdateSchema,
  modelDeleteSchema,
} from "../../schemas/model.schema";

export const modelRouter = router({
  models: publicProcedure.query(async () => {
    const models2 = await models();
    return models2;
  }),

  model: publicProcedure.input(modelSchemaInput).query(async ({ input }) => {
    const model2 = await model(input.id);
    if (!model2) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Model with id "${input.id}" not found`,
      });
    }
    return model2;
  }),

  create: publicProcedure.input(modelSchema).mutation(async ({ input }) => {
    const created = await createModel(input);
    return created;
  }),

  update: publicProcedure
    .input(modelUpdateSchema)
    .mutation(async ({ input }) => {
      const updated = await updateModel(input.id, input);
      return updated;
    }),

  delete: publicProcedure
    .input(modelDeleteSchema)
    .mutation(async ({ input }) => {
      const deleted = await deleteModel(input.id);
      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Model with id "${input.id}" not found`,
        });
      }
      return { success: true };
    }),
});
