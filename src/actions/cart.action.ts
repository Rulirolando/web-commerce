"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number) {
  const userId = await getDbUserId();
  if (!userId) throw new Error("Unauthorized");

  const existing = await prisma.cart.findFirst({
    where: { authorId: userId, productId },
    include: { product: true },
  });

  if (existing) {
    const newQty = existing.quantity + quantity;
    await prisma.cart.update({
      where: { id: existing.id },
      data: {
        quantity: newQty,
        totalPrice: newQty * existing.product.price,
      },
    });
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error("Produk tidak ditemukan");

    await prisma.cart.create({
      data: {
        cartId: `cart_${Date.now()}`,
        productId,
        quantity,
        totalPrice: quantity * product.price,
        authorId: userId,
      },
    });
  }

  revalidatePath("/cart");
}

export async function getCartItems() {
  const userId = await getDbUserId();
  if (!userId) return [];

  return prisma.cart.findMany({
    where: { authorId: userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
  });
}

export async function deleteCartItem(cartId: string) {
  const userId = await getDbUserId();
  if (!userId) return;

  await prisma.cart.delete({
    where: { id: cartId },
  });

  revalidatePath("/cart");
}

export async function purchaseCart(cartIds: string[]) {
  const userId = await getDbUserId();
  if (!userId) throw new Error("Unauthorized");

  const items = await prisma.cart.findMany({
    where: { id: { in: cartIds }, authorId: userId },
    include: { product: true },
  });

  const transactions = items.flatMap((ci) => {
    if (ci.product.stock < ci.quantity) {
      throw new Error(`Stok tidak cukup untuk produk ${ci.product.name}`);
    }

    return [
      prisma.order.create({
        data: {
          orderId: `order_${Date.now()}_${ci.id}`,
          productId: ci.productId,
          authorId: userId,
          quantity: ci.quantity,
          totalPrice: ci.totalPrice,
        },
      }),
      prisma.product.update({
        where: { id: ci.productId },
        data: {
          stock: {
            decrement: ci.quantity,
          },
        },
      }),
    ];
  });

  // Use the batch form of $transaction by passing an array of Prisma promises
  await prisma.$transaction([
    ...transactions,
    prisma.cart.deleteMany({
      where: { id: { in: cartIds }, authorId: userId },
    }),
  ]);

  revalidatePath("/cart");
}

export async function getOrderItems() {
  const userId = await getDbUserId();
  if (!userId) return [];

  return prisma.order.findMany({
    where: { authorId: userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
