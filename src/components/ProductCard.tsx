'use client'

import { formatCurrency } from '@/utils/format'
import { MapPin } from 'lucide-react'
import Link from 'next/link'

type ProductCardProps = {
    item?: {
        id?: number
        name: string
        price: number
        image: string
        address: string
        slug?: string
    }
}

export default function ProductCard({ item }: ProductCardProps) {
    // If item or slug is not available, don't render the card.
    if (!item?.slug) {
        return null
    }

    const productUrl = `/Product/${item.slug}`

    return (
        <Link
            href={productUrl}
            className="block h-full w-50 transform rounded-lg bg-white transition-all will-change-transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
            <div className="flex h-full flex-col">
                {/* Image/Placeholder Section */}
                <div className="relative h-40 w-full overflow-hidden rounded-t-lg bg-gray-100 sm:h-48">
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
                <div className="flex flex-1 flex-col p-4">
                    <p className="mb-2 h-12 text-start text-sm line-clamp-2 sm:text-base">
                        {item.name}
                    </p>

                    <p className="text-start text-base font-bold text-blue-800">
                        {formatCurrency(item.price)}
                    </p>

                    {/* Rating Section */}
                    <div className="mt-auto pt-2">
                        {/* Rating Section */}
                        <div className="flex flex-row items-center gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="18px"
                                viewBox="0 -960 960 960"
                                width="18px"
                                fill="#F9DB78">
                                <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                            </svg>
                            <p className="items-center text-xs sm:text-sm">
                                4.9 <span className="text-gray-500">(200+)</span>
                            </p>
                        </div>

                        {/* Location Section */}
                        {item.address && (
                            <div className="mt-1 flex flex-row items-center gap-1">
                                <MapPin size={16} className="text-red-500" />
                                <p className="truncate text-xs text-gray-600 sm:text-sm">
                                    {item.address}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}