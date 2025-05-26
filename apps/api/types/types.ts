export type Product = {
  id: string;
  sku: string;
  slug?: string;
  name: string;
  modelId: string;
  model?: Model;
  description: string;
  discount?: number | null;
  minimumOrderQuantity: number;
  batteryHealth?: number | null;
  display?: string | null;
  processor?: string | null;
  camera?: string | null;
  battery?: string | null;
  os?: string | null;
  connectivity?: string | null;
};

export type Variant = {
  id: string;
  productId: string;
  product?: Product;
  storage?: string | null;
  ram?: string | null;
  color?: string | null;
  condition?: string | null;
  price: any;
  stockQuantity: number;
  warrantyMonths?: number | null;
};

export type Gallery = {
  id: string;
  productId: string;
  product?: Product;
  imageUrl: string;
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
