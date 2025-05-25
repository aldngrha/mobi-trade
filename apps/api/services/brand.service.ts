import { prisma } from "../prisma/client";
import { Brand } from "../types/types";
import { generateNanoid, generateUlid } from "../utils";

export const brandCategories = async () => {
  return prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const brandCategory = async (id: string) => {
  return prisma.brand.findUnique({
    where: { id },
  });
};

type CreateBrand = Omit<Brand, "id">;

export const createBrand = async (data: CreateBrand) => {
  return prisma.brand.create({
    data: {
      name: data.name,
      id: generateUlid(),
    },
  });
};

type BrandUpdate = Partial<Brand>;

export const updateBrand = async (id: string, data: BrandUpdate) => {
  return prisma.brand.update({
    where: { id },
    data: {
      ...data,
    },
  });
};

export const deleteBrand = async (id: string) => {
  return prisma.brand.delete({
    where: { id },
  });
};
