'use client'

import { formatCurrency } from '@/utils/format'
import { Eye, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'

type ProductCardProps = {
    item?: {
        id?: number
        name: string
        price: number
        image: string
        address: string
        slug?: string
        free_ongkir?: string
        views?: number
    }
}

export default function ProductCard({ item }: ProductCardProps) {
    const addProduct = useRecentlyViewedStore((state) => state.addProduct);

    const renderViewsBadge = () => {
        if (!item?.views) return null

        const formattedViews = item.views >= 1000
            ? `${(item.views / 1000).toFixed(1)}k`
            : item.views.toString()

        return (
            <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-lg">
                <Eye size={14} className="text-blue-500" />
                <span>{formattedViews} views</span>
            </div>
        )
    }

    if (!item?.slug) {
        return null
    }

    const productUrl = `/Product/${item.slug}`

    const handleClick = () => {
        if (item.id && item.slug) {
            addProduct({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                address: item.address,
                slug: item.slug,
            });
        }
    };

    return (
        <Link
            href={productUrl}
            onClick={handleClick}
            className="block w-full max-w-[200px] transform rounded-lg bg-white shadow-sm transition-all will-change-transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            <div className="flex h-full flex-col">
                {/* Image/Placeholder Section */}
                <div className="relative h-[200px] w-full overflow-hidden rounded-t-lg bg-gray-100">
                    {renderViewsBadge()}
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                // Fallback if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.nextElementSibling) {
                                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                            }}
                        />
                    ) : null}
                    {/* Fallback placeholder - always render but hide if image loads */}
                    <div
                        className="flex h-full items-center justify-center"
                        style={{ display: item.image ? 'none' : 'flex' }}
                    >
                        <p className="text-center text-2xl font-bold text-blue-600">
                            Jaja
                            <span className="text-orange-400">ID</span>
                        </p>
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="flex flex-col gap-2 p-3">
                    <h3 className="h-10 text-sm font-medium leading-tight line-clamp-2">
                        {item.name}
                    </h3>

                    <p className="text-base font-bold text-blue-800">
                        {formatCurrency(item.price)}
                    </p>

                    {/* Rating */}
                    {/* <div className="flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16px"
                            viewBox="0 -960 960 960"
                            width="16px"
                            fill="#F9DB78">
                            <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                        </svg>
                        <span className="text-xs">
                            4.9 <span className="text-gray-500">(200+)</span>
                        </span>
                    </div> */}

                    {/* Location */}
                    {item.address && (
                        <div className="flex items-center gap-1">
                            <MapPin size={14} className="shrink-0 text-red-500" />
                            <span className="truncate text-xs text-gray-600">
                                {item.address}
                            </span>
                        </div>
                    )}

                    {/* Free Ongkir Badge */}
                    {item.free_ongkir && item.free_ongkir === "T" && (
                        <div className='flex items-center gap-1'>
                            <Truck size={14} className="shrink-0 text-green-500" />
                            <div className="rounded-full bg-green-100 px-2 py-0.5">
                                <span className="text-xs font-medium text-green-700">
                                    Free Ongkir
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}