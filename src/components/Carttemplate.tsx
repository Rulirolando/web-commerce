"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getCartItems,
  addToCart,
  purchaseCart,
  getOrderItems,
} from "@/actions/cart.action";
import { deleteCartItem } from "@/actions/cart.action";
import Image from "next/image";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
}

interface OrderItem {
  id: string;
  quantity: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
}

export default function CartTemplate() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const loadCart = async () => {
    const items = await getCartItems();
    setCartItems(items);
    setSelected(items.map((i) => i.id));
  };

  const handleDeleteItem = async (id: string) => {
    await deleteCartItem(id);
    toast.success("Item dihapus dari keranjang");
    loadCart();
  };

  const loadOrders = async () => {
    const items = await getOrderItems();
    setOrders(items);
  };

  useEffect(() => {
    loadCart();
    loadOrders();
  }, []);

  const handleAddQuantity = async (item: CartItem, delta: number) => {
    await addToCart(item.productId, delta);
    toast.success("Jumlah diperbarui");
    loadCart();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const total = cartItems
    .filter((i) => selected.includes(i.id))
    .reduce((sum, i) => sum + i.totalPrice, 0);

  const handlePurchase = async () => {
    if (selected.length === 0) {
      toast.error("Pilih minimal 1 item");
      return;
    }

    await purchaseCart(selected);
    toast.success("Terima kasih telah membeli!");
    await loadCart();
    await loadOrders();
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-12">
      {/* Bagian Keranjang */}
      <section className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">Keranjang Saya</h1>
          <div className="bg-white rounded-xl p-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
                <Image
                  src={item.product.image || "/default.jpg"}
                  alt={item.product.name}
                  width={80}
                  height={80}
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.product.name}</div>
                  <div className="text-sm text-gray-600">
                    Rp{item.product.price.toLocaleString("id-ID")} ×{" "}
                    {item.quantity}
                  </div>
                </div>
                <div className="px-4 font-bold text-sm">
                  Rp{item.totalPrice.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() => handleAddQuantity(item, -1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleAddQuantity(item, 1)}>+</button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:underline text-sm ml-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            {cartItems.length === 0 && (
              <p className="text-sm text-gray-500">Keranjang kosong.</p>
            )}
          </div>
        </div>

        {/* Sidebar Ringkasan */}
        <aside className="md:w-96 bg-white rounded-xl p-6 space-y-6">
          <h2 className="font-bold text-lg">Ringkasan</h2>
          <div className="flex justify-between">
            <span>Total Harga:</span>
            <span className="font-bold">Rp{total.toLocaleString("id-ID")}</span>
          </div>
          <button
            onClick={handlePurchase}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
          >
            Beli ({selected.length})
          </button>
        </aside>
      </section>

      {/* Bagian Order yang Sudah Dibeli */}
      <section>
        <h2 className="text-xl font-bold mb-4">Sudah Dibeli</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada pembelian.</p>
        ) : (
          <div className="bg-white rounded-xl p-6 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center gap-4">
                <Image
                  src={order.product.image || "/default.jpg"}
                  alt={order.product.name}
                  width={60}
                  height={60}
                  className="rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold">{order.product.name}</div>
                  <div className="text-sm text-gray-600">
                    Rp{order.product.price.toLocaleString("id-ID")} ×{" "}
                    {order.quantity}
                  </div>
                </div>
                <div className="text-sm font-bold">
                  Rp{order.totalPrice.toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
