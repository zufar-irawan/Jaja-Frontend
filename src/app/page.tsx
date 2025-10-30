import React from 'react'
import { Music, Palette, Gamepad, Book, Flower2, ToyBrick, Dumbbell, Monitor, Camera } from 'lucide-react'

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
        { name: 'Produk 1', price: 10000, image: '' },
        { name: 'Produk 2', price: 20000, image: '' },
        { name: 'Produk 3', price: 30000, image: '' },
        { name: 'Produk 4', price: 40000, image: '' },
        { name: 'Produk 5', price: 50000, image: '' },
        { name: 'Produk 6', price: 60000, image: '' },
        { name: 'Produk 7', price: 70000, image: '' },
        { name: 'Produk 8', price: 80000, image: '' },
        { name: 'Produk 9', price: 90000, image: '' },
        { name: 'Produk 10', price: 100000, image: '' },
    ]

    return (
        <div className="py-10 px-40 gap-y-10 flex flex-col">

            {/* Hero Banner */}
            <section className="text-gray-50 text-4xl flex flex-row w-full min-h-[300px] bg-gray-900 items-center justify-center">
                Welcome to our app!
            </section>

            {/* Category Section */}
            <section className="w-full flex flex-col gap-y-5">

                <header className="py-5 text-4xl text-gray-900">Kategori pilihan</header>

                <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-5">
                    {categories.map((item, index) => (
                        <div key={index} className="shadow-2xl rounded-lg justify-center items-center flex flex-col py-5">
                            <div className="flex w-35 h-35 items-center justify-center">
                                {item.icon}
                            </div>

                            <p className="text-center py-5">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>

            </section>

            {/* Featured Product */}
            <section className="w-full flex flex-col">

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
                            <div key={index} className="w-45 h-fit shadow-2xl rounded-lg">
                                <p className="text-blue-600 bg-gray-100 h-45 text-2xl font-bold text-center px-10 py-15">
                                    Jaja
                                    <span className="text-orange-400">ID</span>
                                </p>

                                <div className='px-5 py-6 gap-2 flex flex-col'>
                                    <p className="text-start text-2xl">{item.name}</p>
                                    <p className="text-start font-bold text-blue-800">Rp{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </section>

        </div>
    )
}
