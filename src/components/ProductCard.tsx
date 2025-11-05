import useIsMobile from '@/hooks/useIsMobile'
import formatCurrency from '@/utils/format'
import { MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

type ProductCardProps = {
    index: number
    item: {
        id?: number
        name: string
        price: number
        image: string
        address: string
    }
}

export default function ProductCard({ index, item }: ProductCardProps) {
    const isMobile = useIsMobile()
    const router = useRouter()

    // Fungsi untuk handle klik produk
    const handleProductClick = () => {
        // Navigasi ke halaman produk dengan ID
        router.push(`/product/${item.id || index}`)
    }

    // Fungsi untuk handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleProductClick()
        }
    }

    return (
        <div
            onClick={handleProductClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Lihat detail produk ${item.name}`}
            className={`bg-white hover:shadow-xl transition-all cursor-pointer shadow-sm rounded-lg
                ${isMobile ? 'w-38' : 'w-48'}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                hover:scale-105
            `}>

            {/* Image/Placeholder Section */}
            <div className={`bg-gray-100 ${isMobile ? 'h-40' : 'h-45'} rounded-t-lg flex items-center justify-center overflow-hidden`}>
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <p className="text-blue-600 text-2xl font-bold text-center">
                        Jaja
                        <span className="text-orange-400">ID</span>
                    </p>
                )}
            </div>

            {/* Product Info Section */}
            <div className='px-5 py-6'>
                <p className={`text-start ${isMobile ? 'text-md' : 'text-lg'} h-13 line-clamp-2 mb-2`}>
                    {item.name}
                </p>

                <p className="text-start font-bold text-blue-800 text-md">
                    {formatCurrency(item.price)}
                </p>

                {/* Rating Section */}
                <div className="flex flex-row items-center mt-2 gap-0.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#F9DB78">
                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                    </svg>
                    <p className={`items-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        4.9 (200+)
                    </p>
                </div>

                {/* Location Section */}
                <div className="flex flex-row items-center gap-0.5 mt-1">
                    <MapPin size={20} color='#f54842' />
                    <p className={`items-center ${isMobile ? 'text-xs' : 'text-sm'} truncate`}>
                        {item.address}
                    </p>
                </div>
            </div>
        </div>
    )
}