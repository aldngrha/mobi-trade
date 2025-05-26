import { prisma } from "../prisma/client";
import { generateUlid } from "../utils";
import { Variant } from "../types/types";

export const productVariants = () => {
  return prisma.productVariant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          model: true,
        },
      },
    },
  });
};

export const productVariant = (id: string) => {
  return prisma.productVariant.findMany({
    where: { id },
    include: {
      product: true,
    },
  });
};

type ProductVariantCreate = Omit<Variant, "id" | "product">;

export const createProductVariant = (data: ProductVariantCreate) => {
  return prisma.productVariant.create({
    data: {
      ...data,
      id: generateUlid(),
    },
  });
};

type ProductVariantUpdate = Partial<Omit<Variant, "product">>;

export const updateProductVariant = (
  id: string,
  data: ProductVariantUpdate,
) => {
  return prisma.productVariant.update({
    where: { id },
    data,
  });
};

export const deleteProductVariant = (id: string) => {
  return prisma.productVariant.delete({
    where: { id },
  });
};
