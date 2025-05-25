import { prisma } from "../prisma/client";
import { generateUlid } from "../utils";
import { TRPCError } from "@trpc/server";

export type CheckoutItem = {
  productId: string;
  quantity: number;
  storage: string;
  condition: string;
};

export type ShippingAddressInput = {
  fullName: string;
  addressLine: string;
  email: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

export type CheckoutInput = {
  userId: string;
  items: CheckoutItem[];
  shippingAddress: ShippingAddressInput;
  shippingMethod: string;
  paymentMethod: string;
  orderReference: string;
};

export const checkout = async (input: CheckoutInput) => {
  const {
    userId,
    items,
    shippingAddress,
    shippingMethod,
    paymentMethod,
    orderReference,
  } = input;

  if (items.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cart cannot be empty",
    });
  }

  const itemIds = items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: itemIds },
    },
  });

  const validIds = products.map((p) => p.id);
  const invalidIds = itemIds.filter((id) => !validIds.includes(id));

  if (invalidIds.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid product IDs: ${invalidIds.join(", ")}`,
    });
  }

  // Validate stock quantity
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stockQuantity < item.quantity) {
      throw new Error(`Not enough stock for product ${product.name}`);
    }
  }

  // Calculate totalPrice from current product prices
  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const price = product.price.toNumber();
    return sum + price * item.quantity;
  }, 0);

  const transaction = await prisma.$transaction(async (tx) => {
    // Create Transaction first
    const createdTransaction = await tx.transaction.create({
      data: {
        id: generateUlid(),
        userId,
        status: "PENDING",
        totalPrice: totalPrice.toFixed(2),
        shippingMethod,
        paymentMethod,
        orderReference,
        shippingAddress: {
          create: { id: generateUlid(), ...shippingAddress },
        },
      },
    });

    // Create TransactionItems
    await Promise.all(
      items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return tx.transactionItem.create({
          data: {
            id: generateUlid(),
            transactionId: createdTransaction.id,
            productId: product.id,
            price: product.price,
            quantity: item.quantity,
            storage: item.storage,
            condition: item.condition,
          },
        });
      }),
    );

    await Promise.all(
      items.map((item) =>
        tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { decrement: item.quantity } },
        }),
      ),
    );

    return createdTransaction;
  });

  return transaction;
};
