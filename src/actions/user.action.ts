"use server";
import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// Cek user jika ada
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("User not authenticated");
    }
    // Cek apakah user sudah ada di database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    // Jika user belum ada, buat user baru
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          name: user.fullName || user.firstName || "Anonymous",
          username:
            user.username || user.firstName?.toLowerCase() || "anonymous",
          email: user.emailAddresses[0]?.emailAddress || "",
          clerkId: userId,
          userId: user.id,
          img: user.imageUrl,
        },
      });
      return newUser;
    } else {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { img: user.imageUrl },
      });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  const userWithProducts = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      products: {
        include: {
          author: true, // ambil semua data dari relasi User
          productSizes: true,
          productColors: true,
        },
      },
      carts: {
        include: {
          product: true,
          authors: true,
        },
      },
    },
  });

  return userWithProducts;
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }
  const userId = user.id;
  return userId;
}
