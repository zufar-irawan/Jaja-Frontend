"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    address: string;
    slug: string;
    viewedAt: number;
}

interface RecentlyViewedStore {
    products: RecentlyViewedProduct[];
    addProduct: (product: Omit<RecentlyViewedProduct, "viewedAt">) => void;
    getRecentProducts: (limit?: number) => RecentlyViewedProduct[];
    clearAll: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
    persist(
        (set, get) => ({
            products: [],

            addProduct: (product) => {
                set((state) => {
                    const existingIndex = state.products.findIndex(
                        (p) => p.id === product.id,
                    );

                    let updatedProducts = [...state.products];

                    if (existingIndex !== -1) {
                        updatedProducts.splice(existingIndex, 1);
                    }

                    const newProduct: RecentlyViewedProduct = {
                        ...product,
                        viewedAt: Date.now(),
                    };

                    updatedProducts.unshift(newProduct);

                    if (updatedProducts.length > 8) {
                        updatedProducts = updatedProducts.slice(0, 8);
                    }

                    return { products: updatedProducts };
                });
            },

            getRecentProducts: (limit = 8) => {
                const { products } = get();
                return products.slice(0, limit);
            },

            clearAll: () => {
                set({ products: [] });
            },
        }),
        {
            name: "recently-viewed-storage",
        },
    ),
);
