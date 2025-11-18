"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updatePost } from "@/actions/post.action";
import toast from "react-hot-toast";
import { getPost } from "@/actions/post.action";

type Posts = Awaited<ReturnType<typeof getPost>>;
type Post = Posts[number];

export default function UpdatePostDialog({ post }: { post: Post }) {
  const [name, setName] = useState(post.name);
  const [description, setDescription] = useState(post.description);
  const [price, setPrice] = useState(post.price);
  const [stock, setStock] = useState(post.stock);
  const [sizes, setSizes] = useState(
    (post.productSizes || []).map((s) => s.size).join(", ")
  );
  const [colors, setColors] = useState(
    (post.productColors || []).map((c) => c.color).join(", ")
  );
  const [images, setImages] = useState(
    (post.productImages || []).map((i) => i.url).join(", ")
  );

  const handleUpdate = async () => {
    try {
      const sizesArray = sizes.split(",").map((s) => s.trim());
      const colorsArray = colors.split(",").map((c) => c.trim());
      const imageArray = images.split(",").map((url) => url.trim());

      const result = await updatePost(post.id, {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        sizes: sizesArray,
        colors: colorsArray,
        images: imageArray,
      });

      if (result?.success) toast.success("Produk berhasil diupdate!");
      else toast.error("Gagal update produk");
    } catch {
      toast.error("Terjadi kesalahan saat update");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ✏️ Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Produk</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="flex flex-col gap-4"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Produk"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi"
          />
          <Input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            placeholder="Harga"
          />
          <Input
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            type="number"
            placeholder="Stok"
          />
          <Input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="Ukuran (pisahkan dengan koma)"
          />
          <Input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Warna (pisahkan dengan koma)"
          />
          <Input
            value={images}
            onChange={(e) => setImages(e.target.value)}
            placeholder="Gambar URL (pisahkan dengan koma)"
          />

          <Button type="submit" className="mt-2">
            Simpan Perubahan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
