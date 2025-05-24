import { z } from "zod";

export const checkoutSchema = z.object({
  userId: z.string().uuid(),
  status: z
    .enum(["PENDING", "PAID", "APPROVED", "REJECTED", "SHIPPED", "DELIVERED"])
    .default("PENDING"),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  shippingMethod: z.string(),
  paymentMethod: z.string(),

  shippingAddress: z.object({
    fullName: z.string(),
    addressLine1: z.string(),
    city: z.string(),
    state: z.string(),
    email: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phoneNumber: z.string(),
  }),

  items: z.array(
    z.object({
      productId: z.string().uuid(),
      price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
      quantity: z.number().int().min(1),
      storage: z.string().optional(),
      condition: z.string().optional(),
    }),
  ),

  payment: z.object({
    paymentMethod: z.string(),
    paymentStatus: z
      .enum(["PENDING", "PAID", "FAILED", "EXPIRED"])
      .default("PENDING"),
    paymentReference: z.string().optional(),
    paidAt: z.string().optional(), // ISO Date string
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ShippingAddressInput = z.infer<
  typeof checkoutSchema
>["shippingAddress"];
export type CheckoutItem = z.infer<typeof checkoutSchema>["items"][number];
