"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Heart, Loader2 } from "lucide-react";

interface WishlistItem {
    id_data: number;
    id_produk: number;
    produk: string;
    produk_slug: string;
    produk_cover: string;
    toko: string;
    produks?: {
        harga: number;
        stok: number;
        status_produk: string;
        tokos?: {
            nama_toko: string;
            slug_toko: string;
        };
    };
}

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadWishlist = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("/api/wishlist", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Gagal mengambil data wishlist");
                }

                const result = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setWishlistItems(result.data);
                } else {
                    setWishlistItems([]);
                }
            } catch (err: any) {
                console.error("Error loading wishlist:", err);
                setError(err.message || "Terjadi kesalahan saat memuat wishlist");
            } finally {
                setLoading(false);
            }
        };

        void loadWishlist();
    }, []);

    const transformToProductCardProps = (item: WishlistItem) => {
        const address = item.produks?.tokos?.nama_toko || item.toko || "Toko";

        return {
            id: item.id_produk,
            name: item.produk,
            price: item.produks?.harga || 0,
            image: item.produk_cover,
            address: address,
            slug: item.produk_slug,
        };
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
                    <p className="mt-4 text-gray-600">Memuat wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <Heart className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        Terjadi Kesalahan
                    </h3>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        Wishlist Kosong
                    </h3>
                    <p className="text-gray-600">
                        Belum ada produk di wishlist Anda
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Wishlist Saya
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        {wishlistItems.length} produk tersimpan
                    </p>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {wishlistItems.map((item) => (
                    <ProductCard
                        key={item.id_data}
                        item={transformToProductCardProps(item)}
                    />
                ))}
            </div>
        </div>
    );
}