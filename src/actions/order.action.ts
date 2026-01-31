"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function buyNow(productId: string, quantity: number) {
  const userId = await getDbUserId();
  if (!userId) throw new Error("Unauthorized");

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || product.stock < quantity) {
    throw new Error("Stok tidak cukup atau produk tidak ditemukan");
  }

  // Kurangi stok produk
  await prisma.product.update({
    where: { id: productId },
    data: {
      stock: product.stock - quantity,
    },
  });

  // Buat order
  await prisma.order.create({
    data: {
      orderId: `order_${Date.now()}`,
      productId,
      quantity,
      totalPrice: quantity * product.price,
      authorId: userId,
    },
  });

  revalidatePath("/cart");
}
