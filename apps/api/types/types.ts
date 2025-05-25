export type Product = {
  id: string;
  sku: string;
  slug?: string;
  name: string;
  modelId: string;
  model?: Model;
  description: string;
  price: any;
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
