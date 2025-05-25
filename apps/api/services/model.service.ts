import { prisma } from "../prisma/client";
import { Model } from "../types/types";
import { generateUlid } from "../utils";

export const models = async () => {
  return prisma.model.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brand: true, // Include brand information
    },
  });
};

export const model = async (id: string) => {
  return prisma.model.findUnique({
    where: { id },
  });
};

type CreateModel = Omit<Model, "id">;

export const createModel = async (data: CreateModel) => {
  return prisma.model.create({
    data: {
      name: data.name,
      brandId: data.brandId,
      id: generateUlid(),
    },
  });
};

type ModelUpdate = {
  name?: string;
  brandId?: string;
};

export const updateModel = async (id: string, data: ModelUpdate) => {
  await prisma.model.update({
    where: { id },
    data,
  });
};

export const deleteModel = async (id: string) => {
  return prisma.model.delete({
    where: { id },
  });
};
