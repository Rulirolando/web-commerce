"use client";

import { createPost } from "@/actions/post.action";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function CreatePost() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imagesInput, setImagesInput] = useState(""); // ✅ Ganti dari image jadi imagesInput
  const [stock, setStock] = useState("");
  const [sizesInput, setSizesInput] = useState(""); // input: "XL,XXL,XXXL"
  const [colorInput, setColorInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const colors = colorInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const imageUrls = imagesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      imageUrls.length === 0 || // ✅ validasi array gambar
      !stock ||
      sizes.length === 0 ||
      colors.length === 0
    ) {
      toast.error("Semua field wajib diisi");
      return;
    }

    setIsPosting(true);
    try {
      const post = await createPost(
        name,
        description,
        parseFloat(price),
        imageUrls, // ✅ kirim array
        parseFloat(stock),
        sizes,
        colors
      );

      if (post?.success) {
        setName("");
        setDescription("");
        setPrice("");
        setImagesInput(""); // ✅ reset input gambar

        setStock("");
        setSizesInput("");
        setColorInput("");
        toast.success("Postingan berhasil dibuat");
        router.push("/");
      }
      console.error("Error creating post:", Error);
      toast.error("Postingan gagal dibuat");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4">Buat Postingan</h2>

      <input
        type="text"
        placeholder="Nama Produk"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <input
        type="number"
        placeholder="Harga"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <input
        type="text"
        placeholder="URL Gambar (pisahkan dengan koma)"
        value={imagesInput}
        onChange={(e) => setImagesInput(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <input
        type="number"
        placeholder="Stok"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <input
        type="text"
        placeholder="Ukuran (misal: XL,XXL,XXXL)"
        value={sizesInput}
        onChange={(e) => setSizesInput(e.target.value)}
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      <input
        type="text"
        placeholder="Warna (misal: putih,hitam,hijau)"
        value={colorInput}
        onChange={(e) => setColorInput(e.target.value)}
        className="w-full border px-3 py-2 mb-4 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={isPosting}
        className={`w-full py-2 rounded bg-blue-500 text-white font-semibold ${
          isPosting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPosting ? "Memposting..." : "Posting"}
      </button>
    </div>
  );
}

export default CreatePost;
