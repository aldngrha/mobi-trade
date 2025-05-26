import { prisma } from "../prisma/client";
import { generateUlid } from "../utils";
import { Gallery } from "../types/types"; // assuming you have this type

export const galleries = () => {
  return prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: true,
    },
  });
};

export const gallery = (id: string) => {
  return prisma.gallery.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });
};

export type GalleryCreate = Omit<Gallery, "id" | "product">;

export const createGallery = (data: GalleryCreate) => {
  return prisma.gallery.create({
    data: {
      ...data,
      id: generateUlid(),
    },
  });
};

type GalleryUpdate = Partial<Omit<Gallery, "id" | "product">>;

export const updateGallery = (id: string, data: GalleryUpdate) => {
  return prisma.gallery.update({
    where: { id },
    data,
  });
};

export const deleteGallery = (id: string) => {
  return prisma.gallery.delete({
    where: { id },
  });
};
