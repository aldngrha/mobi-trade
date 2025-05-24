import { prisma } from "../prisma/client";

export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      galleries: true,
    },
  });
};

export const getProductBySlug = async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      galleries: true,
    },
  });
};
