import { z } from "zod";

export const checkoutInputSchema = z.object({
  userId: z.string(),
  shippingMethod: z.string(),
  paymentMethod: z.string(),
  orderReference: z.string(),

  shippingAddress: z.object({
    fullName: z.string(),
    addressLine: z.string(),
    city: z.string(),
    state: z.string(),
    email: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phoneNumber: z.string(),
  }),

  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().min(1),
      storage: z.string(),
      condition: z.string(),
    }),
  ),
});
