import { prisma } from "../prisma/client";
import { Brand, Model, Product } from "../types/types";
import { generateNanoid, generateUlid } from "../utils";

export const Products = async (): Promise<
  (Product & { galleries: any[]; model?: Model & { brand?: Brand } })[]
> => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      galleries: true,
      model: {
        include: {
          brand: true,
        },
      },
    },
  });
};

export const ProductBySlug = async (
  slug: string,
): Promise<
  (Product & { galleries: any[]; model?: Model & { brand?: Brand } }) | null
> => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      galleries: true,
      model: {
        include: {
          brand: true,
        },
      },
    },
  });
};

// Input type tanpa ID, karena ID generate sendiri
type CreateProductInput = Omit<Product, "id" | "slug" | "model">;

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

type ProductUpdateInput = Partial<Omit<Product, "slug" | "model">>;

export const updateProduct = async (id: string, data: ProductUpdateInput) => {
  const cleanedData = { ...data };

  if (cleanedData.discount !== undefined && cleanedData.discount !== null) {
    cleanedData.discount = Number(cleanedData.discount);
  }
  if (cleanedData.minimumOrderQuantity !== undefined) {
    cleanedData.minimumOrderQuantity = Number(cleanedData.minimumOrderQuantity);
  }
  if (
    cleanedData.batteryHealth !== undefined &&
    cleanedData.batteryHealth !== null
  ) {
    cleanedData.batteryHealth = Number(cleanedData.batteryHealth);
  }

  return prisma.product.update({
    where: { id },
    data: cleanedData,
  });
};

export const deleteProduct = async (id: string) => {
  return prisma.product.delete({
    where: { id },
  });
};
