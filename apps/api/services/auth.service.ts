import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import { signJWT } from "../utils/jwt";
import { TRPCError } from "@trpc/server";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "USER" | "ADMIN" = "USER",
) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, password: hashed, role },
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email atau password salah",
    });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email atau password salah",
    });
  }

  const token = signJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
