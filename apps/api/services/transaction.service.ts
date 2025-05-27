import { prisma } from "../prisma/client";
import { generateUlid } from "../utils";
import { TRPCError } from "@trpc/server";
import { Brand, Model, Product, TransactionStatus } from "../types/types";

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

  // Validate user exists first
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `User not found`,
    });
  }

  if (items.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Cart cannot be empty",
    });
  }

  const productIds = items.map((item) => item.productId);

  // Take the product with its variants
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { variants: true },
  });

  // Validate whether all productIds are valid
  const validIds = products.map((p) => p.id);
  const invalidIds = productIds.filter((id) => !validIds.includes(id));
  if (invalidIds.length > 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid product IDs: ${invalidIds.join(", ")}`,
    });
  }

  // Validate stock & find corresponding variant price for each item
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    const variant = product.variants.find(
      (v) => v.storage === item.storage && v.condition === item.condition,
    );

    if (!variant) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Variant not found for product ${product.name} with storage ${item.storage} and condition ${item.condition}`,
      });
    }

    if (variant.stockQuantity < item.quantity) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Not enough stock for product ${product.name} variant`,
      });
    }
  }

  // Calculate the total price from variant.price * quantity
  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const variant = product.variants.find(
      (v) => v.storage === item.storage && v.condition === item.condition,
    )!;
    return sum + variant.price.toNumber() * item.quantity;
  }, 0);

  const transaction = await prisma.$transaction(async (tx) => {
    // create transaction
    const createdTransaction = await tx.transaction.create({
      data: {
        id: generateUlid(),
        userId,
        status: "PAID",
        totalPrice: totalPrice.toFixed(2),
        shippingMethod,
        paymentMethod,
        orderReference,
        shippingAddress: {
          create: { id: generateUlid(), ...shippingAddress },
        },
      },
    });

    // Create TransactionItem per item
    await Promise.all(
      items.map(async (item) => {
        const product = products.find((p) => p.id === item.productId)!;
        const variant = product.variants.find(
          (v) => v.storage === item.storage && v.condition === item.condition,
        )!;
        await tx.transactionItem.create({
          data: {
            id: generateUlid(),
            transactionId: createdTransaction.id,
            productId: product.id,
            price: variant.price,
            quantity: item.quantity,
            storage: item.storage,
            condition: item.condition,
          },
        });

        // Reduce variant stock
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }),
    );

    return createdTransaction;
  });

  return transaction;
};

export const transactions = async () => {
  return prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true,
    },
  });
};

export const transaction = async (id: string) => {
  const data = await prisma.transaction.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      totalPrice: true,
      shippingAddressId: true,
      shippingMethod: true,
      paymentMethod: true,
      orderReference: true,
      createdAt: true,
      updatedAt: true,
      payments: {
        select: {
          id: true,
          transactionId: true,
          paymentMethod: true,
          paymentStatus: true,
          paymentReference: true,
          paidAt: true,
        },
      },
      shippingAddress: {
        select: {
          id: true,
          fullName: true,
          addressLine: true,
          city: true,
          state: true,
          postalCode: true,
          email: true,
          country: true,
          phoneNumber: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
      items: {
        select: {
          id: true,
          transactionId: true,
          productId: true,
          price: true,
          quantity: true,
          storage: true,
          condition: true,
          product: {
            select: {
              id: true,
              name: true,
              modelId: true,
              variants: {
                select: {
                  id: true,
                  price: true,
                  stockQuantity: true,
                  storage: true,
                  condition: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!data) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Transaction with id ${id} not found`,
    });
  }

  return data;
};

const allowedStatuses: TransactionStatus[] = [
  "PENDING",
  "PAID",
  "APPROVED",
  "REJECTED",
  "SHIPPED",
  "DELIVERED",
];

function isTransactionStatus(status: string): status is TransactionStatus {
  return allowedStatuses.includes(status as TransactionStatus);
}

export const updateTransactionStatus = async (
  transactionId: string,
  status: string,
) => {
  if (!isTransactionStatus(status)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid status value: ${status}`,
    });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Transaction with id ${transactionId} not found`,
    });
  }

  const updatedTransaction = await prisma.transaction.update({
    where: { id: transactionId },
    data: { status },
  });

  return updatedTransaction;
};
