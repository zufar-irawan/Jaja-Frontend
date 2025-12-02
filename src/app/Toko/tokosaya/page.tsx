import React from "react";
import {
    Store,
    MapPin,
    Clock,
    Star,
    Package,
    Award,
    TrendingUp,
    Truck,
    BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
    getMyToko,
    getMyTokoProducts,
    getTokoStats,
    getKurirList,
    getTokoPhotoUrl,
    isTokoOpen,
    parseBukaTokoData,
} from "@/utils/tokoService";
import ExpandableDescription from "../[slug]/ExpandableDescription";

const SELLER_PRODUCT_IMAGE_BASE_URL =
    "https://seller.jaja.id/asset/images/products/";

function NoStoreFallback() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    Kamu belum punya toko
                </h1>
                <p className="text-gray-600 mb-6">
                    Buka tokomu terlebih dahulu untuk mengakses halaman ini dan mulai
                    mengelola produkmu.
                </p>
                <Link
                    href="/Toko/buka-toko"
                    className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#55B4E5] to-[#FBB338] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                >
                    Buka Toko Sekarang
                </Link>
            </div>
        </div>
    );
}

const managementMenu = [
    {
        title: "Kelola Produk",
        description: "Atur stok, harga, dan status produk",
    },
    {
        title: "Voucher Toko",
        description: "Buat promo khusus pelanggan setia",
    },
    {
        title: "Kelola Brand",
        description: "Tata identitas dan koleksi brand",
    },
    {
        title: "Kelola Etalase",
        description: "Susun etalase agar mudah dijelajahi",
    },
    {
        title: "Hapus Toko",
        description: "Nonaktifkan toko secara permanen",
        danger: true,
    },
];

function ManagementSidebar() {
    return (
        <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Manajemen Toko</h2>
                    <p className="text-sm text-gray-500">
                        Akses cepat ke pengaturan penting toko kamu.
                    </p>
                </div>

                <div className="space-y-3">
                    {managementMenu.map((item) => (
                        <button
                            key={item.title}
                            type="button"
                            className={`w-full rounded-2xl border px-4 py-3 text-left transition hover:shadow-md ${item.danger
                                    ? "border-red-200 bg-red-50/80 text-red-600 hover:bg-red-50"
                                    : "border-gray-200 bg-white/60 text-gray-800 hover:border-gray-300"
                                }`}
                        >
                            <div className="font-semibold">{item.title}</div>
                            <p className="text-sm text-gray-500">
                                {item.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default async function TokoSayaPage() {
    const tokoData = await getMyToko();

    if (!tokoData) {
        return <NoStoreFallback />;
    }

    const serializedSchedule =
        typeof tokoData.data_buka_toko === "string"
            ? tokoData.data_buka_toko
            : JSON.stringify(tokoData.data_buka_toko ?? {});

    const [productsResponse, stats] = await Promise.all([
        getMyTokoProducts({ limit: 20, status_produk: "live", draft: "T" }),
        getTokoStats(tokoData.slug_toko),
    ]);

    const kurirSource = Array.isArray(tokoData.pilihan_kurir)
        ? tokoData.pilihan_kurir.join(":")
        : tokoData.pilihan_kurir || "";
    const kurirList = kurirSource ? getKurirList(kurirSource) : [];

    const bukaToko = serializedSchedule
        ? parseBukaTokoData(serializedSchedule)
        : null;
    const isOpen = serializedSchedule ? isTokoOpen(serializedSchedule) : false;

    const storePhotoUrl = getTokoPhotoUrl(tokoData.foto || "");

    const products = productsResponse?.produk ?? [];
    const transformedProducts = products.map((product) => ({
        id: product.id_produk,
        name: product.nama_produk,
        price: product.harga,
        image: product.thumbnail
            ? `${SELLER_PRODUCT_IMAGE_BASE_URL}${product.thumbnail}`
            : "",
        address: tokoData.alamat_toko.split("\n")[0] ?? tokoData.alamat_toko,
        slug: product.slug_produk,
        free_ongkir: tokoData.free_ongkir,
    }));

    const totalProducts =
        productsResponse?.pagination?.total ?? stats.totalProducts ?? 0;

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
            <div className="bg-linear-to-r from-[#55B4E5] via-[#4DA8DC] to-[#FBB338] border-b-4 border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden">
                                {tokoData.foto ? (
                                    <img
                                        src={storePhotoUrl}
                                        alt={tokoData.nama_toko}
                                        className="w-full h-full rounded-3xl object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-[#55B4E5] to-[#FBB338] rounded-3xl flex items-center justify-center">
                                        <Store className="w-16 h-16 text-white" />
                                    </div>
                                )}
                            </div>
                            {tokoData.toko_pilihan === "Y" && (
                                <div className="absolute -bottom-2 -right-2 bg-[#FBB338] rounded-2xl px-3 py-1.5 shadow-lg">
                                    <Award className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <h1 className="text-3xl font-bold text-white">{tokoData.nama_toko}</h1>
                                {tokoData.toko_pilihan === "Y" && (
                                    <span className="px-4 py-1.5 bg-[#FBB338] text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1.5">
                                        <BadgeCheck className="w-4 h-4" />
                                        Toko Pilihan
                                    </span>
                                )}
                                {tokoData.kategori_seller && (
                                    <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full capitalize">
                                        {tokoData.kategori_seller} Seller
                                    </span>
                                )}
                                {isOpen && (
                                    <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full">
                                        🟢 Buka
                                    </span>
                                )}
                            </div>

                            <p className="text-white/90 text-sm mb-2">
                                {tokoData.greating_message || tokoData.deskripsi_toko}
                            </p>

                            <ExpandableDescription text={tokoData.deskripsi_toko} maxLength={150} />

                            <div className="flex flex-wrap items-center gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                                        <Star className="w-5 h-5 fill-[#FBB338] text-[#FBB338]" />
                                        <span className="ml-2 font-bold text-white">{stats.averageRating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-sm text-white/80">({stats.totalReviews.toLocaleString()} ulasan)</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                    <Package className="w-5 h-5" />
                                    <span className="font-semibold">{totalProducts}+</span>
                                    <span className="text-sm text-white/80">Produk</span>
                                </div>

                                <div className="flex items-center gap-2 text-white">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-semibold">{(stats.totalSold / 1000).toFixed(1)}k+</span>
                                    <span className="text-sm text-white/80">Terjual</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                    <MapPin className="w-4 h-4 text-white" />
                                    <span className="text-sm font-medium text-white">{tokoData.alamat_toko.split("\n")[0]}</span>
                                </div>
                                {bukaToko && (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                        <Clock className="w-4 h-4 text-white" />
                                        <span className="text-sm font-medium text-white">
                                            {bukaToko.time_open} - {bukaToko.time_close}
                                        </span>
                                    </div>
                                )}
                                {kurirList.length > 0 && (
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                                        <Truck className="w-4 h-4 text-white" />
                                        <span className="text-sm font-medium text-white">{kurirList.join(", ")}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 lg:w-48">
                            <Link
                                href="/Toko/buka-toko"
                                className="px-6 py-3 rounded-xl font-semibold text-white bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 transition-all duration-200 text-center"
                            >
                                Edit Toko
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ManagementSidebar />

                    <div className="flex-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Produk Saya</h2>
                            <p className="text-gray-600">
                                Menampilkan {totalProducts}+ produk yang aktif di toko kamu
                            </p>
                        </div>

                        {transformedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {transformedProducts.map((product) => (
                                    <ProductCard key={product.id} item={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                                Belum ada produk yang ditayangkan.
                            </div>
                        )}

                        {productsResponse &&
                            productsResponse.pagination.total > productsResponse.produk.length && (
                                <div className="text-center mt-12">
                                    <button className="px-8 py-4 bg-white border-2 border-[#55B4E5] rounded-xl font-bold text-[#55B4E5] hover:bg-linear-to-r hover:from-[#55B4E5] hover:to-[#FBB338] hover:text-white hover:border-transparent transition-all duration-200 shadow-lg">
                                        Muat Lebih Banyak Produk
                                    </button>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
