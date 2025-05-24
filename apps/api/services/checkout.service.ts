import { prisma } from "../prisma/client";
import { Prisma } from "@prisma/client";

type CheckoutItem = {
  productId: string;
  quantity: number;
  storage: string;
  condition: string;
};

type ShippingAddressInput = {
  fullName: string;
  addressLine1: string;
  email: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

type CheckoutInput = {
  userId: string;
  items: CheckoutItem[];
  shippingAddress: ShippingAddressInput;
  shippingMethod: string;
  paymentMethod: string;
};

export const checkout = async (input: unknown) => {
  const { userId, items, shippingAddress, shippingMethod, paymentMethod } =
    input;

  if (items.length === 0) throw new Error("Cart cannot be empty");

  // Fetch products and validate stock/prices
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map((item) => item.productId) },
    },
  });

  if (products.length !== items.length)
    throw new Error("Some products are invalid");

  // Validate stock quantity (optional)
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

  // Run everything in a transaction
  const transaction = await prisma.$transaction(async (tx) => {
    // Create Transaction first
    const createdTransaction = await tx.transaction.create({
      data: {
        userId,
        status: "PENDING",
        totalPrice: new Prisma.Decimal(totalPrice.toFixed(2)),
        shippingMethod,
        paymentMethod,
        shippingAddress: {
          create: shippingAddress,
        },
      },
    });

    // Create TransactionItems
    await Promise.all(
      items.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return tx.transactionItem.create({
          data: {
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

    // Optionally, update stock quantity here
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
