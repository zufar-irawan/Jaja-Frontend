import useIsMobile from '@/hooks/useIsMobile'
import formatCurrency from '@/utils/format'
import { MapPin } from 'lucide-react'

type ProductCardProps = {
    index: number
    item: {
        name: string
        price: number
        image: string
        address: string
    }
}

export default function ProductCard({ index, item }: ProductCardProps) {
    const isMobile = useIsMobile()

    return (
        <div
            key={index}
            className={`bg-white hover:shadow-xl transition-all h-fit cursor-pointer shadow-sm rounded-lg
                ${isMobile ? 'w-38' : 'w-48'}
            `}>
            <p className={`text-blue-600 bg-gray-100 ${isMobile ? 'h-40' : 'h-45'} text-2xl font-bold rounded-t-lg text-center flex items-center justify-center`}>
                Jaja
                <span className="text-orange-400">ID</span>
            </p>

            <div className='px-5 py-6'>
                <p className={`text-start ${isMobile ? 'text-md' : 'text-xl'}`}>{item.name}</p>
                <p className="text-start font-bold text-blue-800">{formatCurrency(item.price)}</p>

                <div className="flex flex-row items-center mt-2 gap-0.5">
                    {/* Star icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#F9DB78">
                        <path d="m233-120 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z" />
                    </svg>

                    <p className={`items-center ${isMobile ? 'text-xs' : ''}`}>4.9 (200+)</p>
                </div>

                <div className="flex flex-row items-center gap-0.5">
                    <MapPin size={20} color='#f54842' />

                    <p className='items-center'>{item.address}</p>
                </div>
            </div>
        </div>
    )
}