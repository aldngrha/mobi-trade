export type Product = {
  id: string;
  sku: string;
  slug?: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: string;
  discount?: number | null;
  condition?: string | null;
  storage?: string | null;
  minimumOrderQuantity: number;
  warrantyMonths?: number | null;
  stockQuantity: number;
  rating?: number | null;
  reviewsCount?: number | null;
  batteryHealth?: number | null;
  ram?: string | null;
  display?: string | null;
  processor?: string | null;
  camera?: string | null;
  battery?: string | null;
  os?: string | null;
  connectivity?: string | null;
  color?: string | null;
};

export type Brand = {
  id: string;
  name: string;
};

export type Model = {
  id: string;
  name: string;
  brandId: string;
  brand?: Brand;
};
