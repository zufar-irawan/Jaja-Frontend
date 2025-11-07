"use client";
import { create } from "zustand";
import { getCart, addToCart } from "@/utils/cartActions";

interface CartStore {
  cartCount: number;
  fetchCartCount: () => Promise<void>;
  addToCartAndUpdate: (data: any) => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cartCount: 0,

  fetchCartCount: async () => {
    const result = await getCart();
    set({ cartCount: result.data?.items?.length ?? 0 });
  },

  addToCartAndUpdate: async (data) => {
    await addToCart(data);
    const result = await getCart();
    set({ cartCount: result.data?.items?.length ?? 0 });
  }
}));
