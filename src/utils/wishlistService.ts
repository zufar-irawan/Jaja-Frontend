"use server";

import api from "./api";

export interface WishlistProductStore {
    id_toko: number;
    nama_toko: string;
    slug_toko: string;
}

export interface WishlistProductMeta {
    harga: number;
    stok: number;
    status_produk: string;
    tokos?: WishlistProductStore;
}

export interface WishlistProduct {
    id_data: number;
    id_customer: number;
    id_toko: number;
    toko: string;
    id_produk: number;
    produk: string;
    produk_slug: string;
    produk_cover: string;
    created_date: string;
    created_time: string;
    notifikasi_seller: string;
    produks?: WishlistProductMeta;
}

export interface WishlistResponse {
    success: boolean;
    message?: string;
    data: WishlistProduct[];
}

export async function getWishlistProducts(): Promise<WishlistResponse> {
    try {
        const response = await api.get("/main/wishlist");
        const payload = response.data;

        const wishlistData: WishlistProduct[] = Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
                ? payload
                : [];

        return {
            success: true,
            message: payload?.message,
            data: wishlistData,
        };
    } catch (error: any) {
        console.error("Error fetching wishlist products:", error.response?.data || error.message);

        return {
            success: false,
            message: error.response?.data?.message || "Gagal mengambil wishlist",
            data: [],
        };
    }
}

export interface ToggleWishlistResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

export async function toggleWishlistProduct(
    productId: number,
): Promise<ToggleWishlistResponse> {
    try {
        const response = await api.post("/main/wishlist", {
            id_produk: productId,
        });

        return {
            success: true,
            message: response.data?.message || "Wishlist diperbarui",
            data: response.data?.data,
        };
    } catch (error: any) {
        console.error("Error toggling wishlist product:", error.response?.data || error.message);

        return {
            success: false,
            message: error.response?.data?.message || "Gagal memperbarui wishlist",
        };
    }
}
