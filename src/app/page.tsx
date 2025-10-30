import { Music, Palette, Gamepad, Book, Flower2, ToyBrick, Dumbbell, Monitor, Camera } from 'lucide-react'
import ProductCard from '@/components/ProductCard'

// Home Page
export default function Home() {

    const categories = [
        { name: 'Musik', icon: (<Music size={46} />) },
        { name: 'Seni', icon: (<Palette size={46} />) },
        { name: 'Game', icon: (<Gamepad size={46} />) },
        { name: 'Buku', icon: (<Book size={46} />) },
        { name: 'Berkebun', icon: (<Flower2 size={46} />) },
        { name: 'Mainan', icon: (<ToyBrick size={46} />) },
        { name: 'Olahraga', icon: (<Dumbbell size={46} />) },
        { name: 'Elektronik', icon: (<Monitor size={46} />) },
        { name: 'Fotografi', icon: (<Camera size={46} />) },
    ]

    const products = [
        { name: 'Produk 1', price: 10000, image: '', address: 'Jakarta' },
        { name: 'Produk 2', price: 20000, image: '', address: 'Bandung' },
        { name: 'Produk 3', price: 30000, image: '', address: 'Surabaya' },
        { name: 'Produk 4', price: 40000, image: '', address: 'Medan' },
        { name: 'Produk 5', price: 50000, image: '', address: 'Bali' },
        { name: 'Produk 6', price: 60000, image: '', address: 'Yogyakarta' },
        { name: 'Produk 7', price: 70000, image: '', address: 'Semarang' },
        { name: 'Produk 8', price: 80000, image: '', address: 'Makassar' },
        { name: 'Produk 9', price: 90000, image: '', address: 'Palembang' },
        { name: 'Produk 10', price: 100000, image: '', address: 'Balikpapan' },
    ]

    return (
        <div className="py-10 gap-y-10 flex flex-col">

            {/* Hero Banner */}
            <section className="text-gray-50 text-4xl flex flex-row w-full min-h-[300px] bg-gray-900 items-center justify-center">
                Welcome to our app!
            </section>

            {/* Category Section */}
            <section className="w-full flex flex-col gap-y-5 px-40">

                <header className="py-5 text-4xl text-gray-900">Kategori pilihan</header>

                <div className="flex w-full flex-wrap gap-2 justify-center">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="w-40 h-45 hover:scale-105 transition-all rounded-lg justify-center items-center flex flex-col p-5">
                            <div
                                className="cursor-pointer flex w-20 bg-white shadow-md rounded-full h-20 justify-center items-center">
                                {item.icon}
                            </div>

                            <p className="text-center text-gray-900 py-2">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>

            </section>

            {/* Featured Product */}
            <section className="w-full flex flex-col gap-y-5 px-40">

                <header className="text-4xl text-gray-900 py-5">
                    Produk terbaru dari Jaja!
                </header>

                <div className="flex flex-row w-full">

                    {/* Div Cover */}
                    <div className="bg-blue-900 w-130 rounded-lg flex flex-col items-center justify-center">
                        <p className="text-blue-600 text-2xl font-bold text-center px-10 py-15">
                            Jaja
                            <span className="text-orange-400">ID</span>
                        </p>
                    </div>

                    {/* Product Item grid */}
                    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-5 ml-5">
                        {products.slice(0, 8).map((item, index) => (
                            <ProductCard key={index} item={item} />
                        ))}
                    </div>

                </div>

            </section>

        </div>
    )
}
