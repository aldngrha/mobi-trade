import { publicProcedure, router } from "../../utils/trpc";
import { registerSchema, loginSchema } from "../../schemas/auth.schema";
import { registerUser, loginUser } from "../../services/auth.service";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const user = await registerUser(input.name, input.email, input.password);
      return {
        message: "Register success",
        user: { id: user.id, name: user.name, email: user.email },
      };
    }),

  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      const result = await loginUser(input.email, input.password);

      if (!result) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email atau password salah",
        });
      }

      return {
        message: "Login success",
        ...result,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Login Error:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Terjadi kesalahan saat proses login",
        cause: error,
      });
    }
  }),
});
