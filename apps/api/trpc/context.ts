import { prisma } from "../prisma/client";
import type { inferAsyncReturnType } from "@trpc/server";

export const createContext = async () => {
  return { prisma };
};

export type Context = inferAsyncReturnType<typeof createContext>;
