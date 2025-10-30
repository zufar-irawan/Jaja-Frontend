type ProductCardProps = {
    key: number
    item: {
        name: string
        price: number
        image: string
    }
}

export default function ProductCard({ key, item }: ProductCardProps) {
    return (
        <div
            key={key}
            className="w-45 hover:shadow-xl transition-all h-fit cursor-pointer shadow-sm rounded-lg">
            <p className="text-blue-600 bg-gray-100 h-45 text-2xl font-bold text-center px-10 py-15">
                Jaja
                <span className="text-orange-400">ID</span>
            </p>

            <div className='px-5 py-6'>
                <p className="text-start text-xl">{item.name}</p>
                <p className="text-start font-bold text-blue-800">Rp{item.price}</p>
            </div>
        </div>
    )
}