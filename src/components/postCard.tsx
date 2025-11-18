"use client";

import { getPost, deletePost } from "@/actions/post.action";
import { addToCart } from "@/actions/cart.action";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 👈 NEW
import { Card, CardContent } from "@/components/ui/card";
import { DeleteAlertDialog } from "./DeleteAlertDialog";
import toast from "react-hot-toast";
import { useState } from "react";
import UpdatePostDialog from "./UpdatePostDialog";

type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = Posts[number];

export default function PostCard({
  post,
  dbUserId,
}: {
  post: Post;
  dbUserId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [mainImage, setMainImage] = useState(post.image || "/default.jpg");
  const [selectedColor, setSelectedColor] = useState(
    post.productColors?.[0]?.color || ""
  );
  const [selectedSize, setSelectedSize] = useState(
    post.productSizes?.[0]?.size || ""
  );
  const [quantity, setQuantity] = useState(1);
  const router = useRouter(); // 👈 NEW

  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const result = await deletePost(post.id);
      if (!result) throw new Error("Failed to delete post");
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(post.id, quantity);
      toast.success("Berhasil ditambahkan ke keranjang");
    } catch {
      toast.error("Gagal menambahkan ke keranjang");
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(post.id, quantity);
      toast.success("Produk ditambahkan. Menuju keranjang...");
      router.push("/cart");
    } catch {
      toast.error("Gagal melakukan pembelian");
    }
  };

  const subtotal = quantity * post.price;

  return (
    <Card className="w-full max-w-6xl h-full p-6 shadow-lg bg-white grid md:grid-cols-12 gap-8 overflow-x-hidden">
      {/* Kolom Gambar */}
      <div className="md:col-span-3 flex flex-col gap-3">
        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={mainImage}
            alt={post.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-gray-800 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
            {selectedColor}
          </div>
        </div>

        <div className="flex gap-2 mt-2 overflow-x-auto">
          {[post.image, ...(post.productImages || []).map((img) => img.url)]
            .filter(Boolean)
            .map((url, idx) => (
              <div
                key={idx}
                onClick={() => setMainImage(url!)}
                className={`relative w-12 h-12 rounded-md border cursor-pointer overflow-hidden ${
                  mainImage === url ? "border-green-500" : "border-gray-300"
                }`}
              >
                <Image
                  src={url!}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
        </div>
      </div>

      {/* Kolom Deskripsi */}
      <div className="md:col-span-6 overflow-x-hidden">
        <CardContent className="pt-0">
          <div className="flex justify-between">
            <h2 className="font-extrabold text-lg leading-tight text-black">
              {post.name}
            </h2>
            {dbUserId === post.author.id && <UpdatePostDialog post={post} />}
          </div>

          <p className="text-xs text-gray-500 mb-3">
            1 barang berhasil terjual
          </p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-extrabold">
              Rp{post.price.toLocaleString("id-ID")}
            </span>
            <span className="bg-red-200 text-red-600 text-xs font-semibold px-1 rounded">
              61%
            </span>
            <span className="text-gray-400 line-through text-sm">
              Rp310.000
            </span>
          </div>
          <hr className="border-gray-300 mb-4" />

          {/* Pilih warna */}
          <div className="mb-6">
            <p className="font-semibold mb-1">Pilih warna:</p>
            <div className="flex flex-wrap gap-2">
              {(post.productColors || []).map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.color)}
                  className={`relative flex items-center gap-2 border rounded-lg px-3 py-1 font-medium text-sm ${
                    selectedColor === color.color
                      ? "border-green-600 text-green-600"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {color.color}
                </button>
              ))}
            </div>
          </div>

          {/* Pilih ukuran */}
          <div className="mb-6">
            <p className="font-semibold mb-2">Pilih ukuran:</p>
            <div className="flex flex-wrap gap-2">
              {(post.productSizes || []).map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.size)}
                  className={`border rounded-full w-10 h-10 text-sm font-semibold ${
                    selectedSize === size.size
                      ? "border-green-600 text-green-600"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mt-4">
            <p className="font-semibold mb-2">Deskripsi Produk:</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap break-words rounded border border-gray-200 p-3 bg-gray-50">
              {post.description}
            </div>
          </div>

          {dbUserId === post.author.id && (
            <div className="mt-6">
              <DeleteAlertDialog
                isDeleting={isDeleting}
                onDelete={handleDeletePost}
              />
            </div>
          )}
        </CardContent>
      </div>

      {/* Sidebar pembelian */}
      <div className="md:col-span-3 border border-gray-300 rounded-lg p-4 h-fit">
        <h2 className="font-bold text-base mb-4">Atur jumlah dan catatan</h2>
        <div className="flex flex-col gap-2 mb-4">
          <h3 className="text-base font-bold text-gray-900">{post.name}</h3>
          <div className="text-sm text-gray-700">
            Ukuran: <span className="font-semibold">{selectedSize}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Image
            src={mainImage}
            alt="Thumbnail"
            width={48}
            height={48}
            className="rounded-md"
          />
          <span className="text-sm">
            {selectedColor}, {selectedSize}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => handleQuantityChange("dec")}
            className="border border-gray-300 rounded px-3 py-1 text-lg font-semibold text-gray-600"
          >
            −
          </button>
          <span className="border border-gray-300 rounded px-4 py-1 text-center w-10 font-semibold text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange("inc")}
            className="border border-green-600 text-green-600 rounded px-3 py-1 text-lg font-semibold"
          >
            +
          </button>
          <span className="text-sm font-semibold ml-3">
            Stok: <span>{post.stock}</span>
          </span>
        </div>

        <div className="text-right mb-4">
          <span className="text-xs text-gray-400 line-through">Rp310.000</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-700">Subtotal</span>
          <span className="font-extrabold text-xl">
            Rp{subtotal.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={handleBuyNow}
            className="border border-green-600 text-green-600 font-bold rounded-lg px-5 py-2 hover:bg-green-50"
          >
            Beli Langsung
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:bg-green-700"
          >
            + Keranjang
          </button>
        </div>

        <div className="flex gap-6 text-sm text-gray-700 font-semibold">
          <button className="flex items-center gap-1 hover:text-gray-900">
            💬 Chat
          </button>
          <button className="flex items-center gap-1 hover:text-gray-900">
            ❤️ Wishlist
          </button>
          <button className="flex items-center gap-1 hover:text-gray-900">
            🔗 Share
          </button>
        </div>
      </div>
    </Card>
  );
}
