"use server";

import prisma from "@/lib/prisma";

export async function getProfileByUsername(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        img: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function getUserPosts(userId: string) {
  try {
    const posts = await prisma.product.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
        productSizes: true,
        productColors: true,
        carts: true,
        orders: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Failed to fetch user posts");
  }
}
