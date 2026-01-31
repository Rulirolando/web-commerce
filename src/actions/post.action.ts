"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(
  name: string,
  description: string,
  price: number,
  images: string[],
  stock: number,
  sizes: string[],
  colors: string[]
) {
  const userId = await getDbUserId();
  if (!userId) return null;

  const post = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      image: images[0],
      authorId: userId,
      productSizes: {
        create: sizes.map((size) => ({ size })),
      },
      productColors: {
        create: colors.map((color) => ({ color })),
      },
      productImages: {
        create: images.map((url) => ({ url })),
      },
    },
  });

  revalidatePath("/");
  return { success: true, post };
}

export async function getPost() {
  try {
    const post = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        productSizes: true,
        productColors: true,
        productImages: true,
      },
    });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;
    const post = await prisma.product.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("You are not authorized to delete this post");

    await prisma.product.delete({
      where: {
        id: postId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function updatePost(
  postId: string,
  updatedData: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: string[];
    sizes?: string[];
    colors?: string[];
  }
) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthorized");

    // Validasi kepemilikan
    const post = await prisma.product.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post || post.authorId !== userId) throw new Error("Not allowed");

    // Hapus relasi lama
    await prisma.productSize.deleteMany({ where: { productId: postId } });
    await prisma.productColor.deleteMany({ where: { productId: postId } });
    await prisma.productImage.deleteMany({ where: { productId: postId } });

    const updated = await prisma.product.update({
      where: { id: postId },
      data: {
        name: updatedData.name,
        description: updatedData.description,
        price: updatedData.price,
        stock: updatedData.stock,
        image: updatedData.images?.[0],
        productSizes: {
          create: updatedData.sizes?.map((size) => ({ size })) || [],
        },
        productColors: {
          create: updatedData.colors?.map((color) => ({ color })) || [],
        },
        productImages: {
          create: updatedData.images?.map((url) => ({ url })) || [],
        },
      },
    });

    revalidatePath("/");
    return { success: true, updated };
  } catch (err) {
    console.error("Failed to update post:", err);
    return { success: false, error: "Gagal update post" };
  }
}
