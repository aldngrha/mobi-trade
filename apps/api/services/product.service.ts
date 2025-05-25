import { prisma } from "../prisma/client";
import { Product } from "../types/types";
import { generateNanoid, generateUlid } from "../utils";

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

type CreateProductInput = Omit<Product, "id">;

export const createProduct = async (data: CreateProductInput) => {
  return prisma.product.create({
    data: {
      ...data,
      id: generateUlid(),
      slug:
        data.name.toLowerCase().replace(/\s+/g, "-") + "-" + generateNanoid(),
    },
  });
};

type ProductUpdateInput = Partial<Product>;

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      discount: Number(data.discount),
      minimumOrderQuantity: Number(data.minimumOrderQuantity),
      warrantyMonths: data.warrantyMonths
        ? Number(data.warrantyMonths)
        : undefined,
      batteryHealth: Number(data.batteryHealth),
      storage: data.storage ? String(data.storage) : undefined,
      stockQuantity: data.stockQuantity ? Number(data.stockQuantity) : 0,
      rating: data.rating ? Number(data.rating) : undefined,
      reviewsCount: data.reviewsCount ? Number(data.reviewsCount) : undefined,
    },
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
