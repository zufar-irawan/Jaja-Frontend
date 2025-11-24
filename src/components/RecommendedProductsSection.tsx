'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/utils/productService'

interface RecommendedProductsSectionProps {
    products: Product[]
}

const INITIAL_VISIBLE = 12
const LOAD_STEP = 48

export default function RecommendedProductsSection({ products }: RecommendedProductsSectionProps) {
    const [visibleCount, setVisibleCount] = useState(() => Math.min(INITIAL_VISIBLE, products.length))

    const visibleProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount])
    const hasMore = visibleCount < products.length
    const remaining = Math.max(products.length - visibleCount, 0)

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + LOAD_STEP, products.length))
    }

    if (!products.length) {
        return null
    }

    return (
        <>
            <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:ml-5 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] xl:grid-cols-6">
                {visibleProducts.map(product => (
                    <ProductCard
                        key={`recommend-${product.id_produk}`}
                        item={{
                            id: product.id_produk,
                            name: product.nama_produk,
                            price: product.harga,
                            image: product.covers?.[0]?.foto || '',
                            address: product.tokos.wilayah?.kelurahan_desa || '',
                            slug: product.slug_produk,
                        }}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="flex w-full justify-center pt-4">
                    <button
                        onClick={handleLoadMore}
                        className="w-fit rounded-full bg-blue-400 px-8 py-3 text-center font-bold text-gray-50 transition-colors hover:bg-blue-500"
                    >
                        Tampilkan lebih banyak
                    </button>
                </div>
            )}
        </>
    )
}
