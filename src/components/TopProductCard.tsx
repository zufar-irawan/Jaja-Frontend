import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import { Eye, MapPin, ShoppingBag } from "lucide-react";
import type { Product } from "@/utils/productService";

interface TopProductCardProps {
    product: Product;
    views?: number;
    className?: string;
}

export default function TopProductCard({
    product,
    views,
    className = "",
}: TopProductCardProps) {
    const coverPhoto = product.covers?.[0]?.foto
        ? `https://seller.jaja.id/asset/images/products/${product.covers[0].foto}`
        : "";

    const formattedViews = (() => {
        if (!views) return null;
        if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}m`;
        if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
        return views.toString();
    })();

    return (
        <Link
            href={`/Product/${product.slug_produk}`}
            className={`group relative flex min-h-[220px] w-[360px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl sm:w-[380px] md:flex-row ${className}`}
        >
            <div className="order-2 flex flex-1 flex-col gap-4 pr-0 md:order-1 md:pr-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                    <ShoppingBag size={16} />
                    Produk Terlaris
                </div>

                <div>
                    <p className="text-xs uppercase text-gray-400">Nama Produk</p>
                    <h3 className="text-xl font-semibold leading-tight text-gray-900 line-clamp-2">
                        {product.nama_produk}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                        {formatCurrency(product.harga)}
                    </span>
                    {product.tokos?.nama_toko && (
                        <span className="text-gray-600">{product.tokos.nama_toko}</span>
                    )}
                    {product.tokos?.wilayah?.kelurahan_desa && (
                        <span className="flex items-center gap-1 text-gray-500">
                            <MapPin size={14} />
                            {product.tokos.wilayah.kelurahan_desa}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>Stok {product.stok ?? 0}</span>
                    <span>Kondisi {product.kondisi}</span>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3">
                    <button className="rounded-xl w-fit border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 transition-colors group-hover:border-blue-500 group-hover:text-blue-600">
                        Lihat Produk
                    </button>
                    {formattedViews && (
                        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            <Eye size={14} />
                            {formattedViews} views
                        </div>
                    )}
                </div>
            </div>

            <div className="order-1 mt-0 flex w-full justify-center md:order-2 md:mt-0 md:w-auto">
                <div className="h-40 w-40 overflow-hidden rounded-xl bg-gray-50 md:h-44 md:w-44">
                    {coverPhoto ? (
                        <img
                            src={coverPhoto}
                            alt={product.nama_produk}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-500">
                            Gambar tidak tersedia
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
