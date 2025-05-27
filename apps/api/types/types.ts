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

export type TransactionStatus =
  | "PENDING"
  | "PAID"
  | "APPROVED"
  | "REJECTED"
  | "SHIPPED"
  | "DELIVERED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED";
export type Role = "ADMIN" | "USER";

export type Transaction = {
  id: string;
  userId: string;
  status: TransactionStatus;
  totalPrice: string | null;
  shippingAddressId: string | null;
  shippingMethod: string;
  paymentMethod: string;
  orderReference: string;
  createdAt: string;
  updatedAt: string;
  payments?: Payment[];
  shippingAddress?: ShippingAddress | null;
  user: User;
  items: TransactionItem[];
};

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type TransactionItem = {
  id: string;
  transactionId: string;
  productId: string;
  price: string;
  quantity: number;
  storage?: string | null;
  condition?: string | null;
  product: Product;
  transaction: Transaction;
};

export type ShippingAddress = {
  id: string;
  transactionId: string;
  fullName: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  email: string;
  country: string;
  phoneNumber: string;
  transaction: Transaction;
};

export type Payment = {
  id: string;
  transactionId: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentReference?: string | null;
  paidAt?: string | null;
  transaction: Transaction;
};
