"use client"

import ProductCard from '@/components/ProductCard'
import useIsMobile from '@/hooks/useIsMobile'
import Image from 'next/image'

// Home Page
export default function Home() {

    const isMobile = useIsMobile()

    const categories = [
        { name: 'Musik', icon: '/category/Musik.png' },
        { name: 'Seni', icon: '/category/Seni.png' },
        { name: 'Game', icon: '/category/Game.png' },
        { name: 'Buku', icon: '/category/Buku.png' },
        { name: 'Berkebun', icon: '/category/Berkebun.png' },
        { name: 'Mainan', icon: '/category/Mainan.png' },
        { name: 'Olahraga', icon: '/category/Olahraga.png' },
        { name: 'Elektronik', icon: '/category/Electronic.png' },
        { name: 'Fotografi', icon: '/category/Fotografi.png' },
        { name: 'Peliharaan', icon: '/category/Peliharaan.png' },
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
        <div className="gap-y-10 flex flex-col">

            {/* Hero Banner */}
            <section className="text-gray-50 text-4xl flex flex-row w-full min-h-[400px] bg-gray-900 items-center justify-center">
                Welcome to our app!
            </section>

            {/* Category Section */}
            <section className="w-full flex flex-col gap-y-5 px-5 sm:px-10 lg:px-40">

                <header className="py-5 text-lg sm:text-xl lg:text-4xl text-gray-900">Kategori pilihan</header>

                <div
                    className={`flex h-48 min-h-48 w-full rounded-lg bg-white px-3 py-4 shadow-md sm:px-6 md:px-8 ${isMobile
                        ? 'flex-wrap content-start gap-4 overflow-y-auto'
                        : 'items-center gap-6 overflow-x-auto'
                        }`}>
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="flex h-32 w-32 flex-col items-center justify-center gap-3 transition-transform hover:scale-105 sm:h-36 sm:w-36">
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                                <Image
                                    src={item.icon}
                                    alt={item.name}
                                    width={isMobile ? 48 : 80}
                                    height={isMobile ? 48 : 80}
                                />
                            </div>

                            <p className="py-1 text-xs text-center text-gray-900 sm:text-sm lg:text-base">
                                {item.name}
                            </p>
                        </div>
                    ))}
                </div>

            </section>

            {/* Featured Product */}
            <section className="w-full flex flex-col gap-y-5 px-40 py-15 wave wave-svg">

                <header className="text-4xl font-bold text-gray-50 py-5">
                    Produk terbaru dari Jaja!
                </header>

                <div className={`flex w-full ${isMobile ? 'flex-col gap-6' : 'flex-row'}`}>

                    {/* Div Cover */}
                    <div
                        className={`bg-linear-to-t shadow-lg from-blue-500 to-blue-800 rounded-lg flex flex-col items-center justify-center ${isMobile ? 'w-full' : 'w-130'
                            }`}>
                        <p className="text-blue-400 text-2xl bg-white rounded-full font-bold text-center px-10 py-15">
                            Jaja
                            <span className="text-orange-400">ID</span>
                        </p>
                    </div>

                    {/* Product Item grid */}
                    <div
                        className={`${isMobile
                            ? 'flex w-full flex-nowrap gap-4 overflow-x-auto pb-2'
                            : 'ml-5 grid w-full grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-x-3 gap-y-5'
                            }`}>
                        {products.slice(0, 8).map((item, index) => (
                            <ProductCard index={index} item={item} />
                        ))}
                    </div>

                </div>

            </section>

            {/* TOP PRODUCT */}
            <section className='px-40 w-full flex flex-col gap-y-5 py-15'>

                <header className='text-gray-900 font-bold text-4xl'>
                    Produk paling laris!
                </header>

                <div className='flex flex-row gap-x-3'>
                    {products.slice(0, 6).map((item, index) => (
                        <ProductCard index={index} item={item} />
                    ))}
                </div>
            </section>

            {/* Mungkin anda suka */}
            <section className='flex flex-col w-full px-40 py-15 gap-y-5'>

                <header className='text-gray-900 font-bold text-4xl'>
                    Mungkin kamu juga suka
                </header>

                <div className="w-full flex flex-wrap gap-x-3 gap-y-5">
                    {products.map((item, index) => (
                        <ProductCard index={index} item={item} />
                    ))}
                </div>
            </section>
        </div>
    )
}
