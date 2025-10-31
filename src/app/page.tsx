"use client"

import ProductCard from '@/components/ProductCard'
import useIsMobile from '@/hooks/useIsMobile'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import api from '@/utils/api'

// Home Page
export default function Home() {

    const isMobile = useIsMobile()
    const numberToSliceFeatured = isMobile ? 4 : 8

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
    const numberToSliceRecommended = isMobile ? 6 : 12

    return (
        <div className="flex flex-col gap-y-10">

            {/* Hero Banner */}
            <section className="flex w-full min-h-80 items-center justify-center bg-gray-900 px-4 text-center text-3xl text-gray-50 sm:min-h-[360px] sm:px-8 sm:text-4xl lg:min-h-[400px] lg:px-20 lg:text-5xl">
                Welcome to our app!
            </section>

            {/* Category Section */}
            <section className="flex w-full flex-col gap-y-5 px-4 sm:px-8 lg:px-20 xl:px-40">

                <header className="py-5 text-lg text-gray-900 sm:text-2xl lg:text-4xl">Kategori pilihan</header>

                <div
                    className={`flex h-48 w-full px-3 py-4 rounded-lg bg-white shadow-md 
                        ${isMobile
                            ? 'flex-wrap gap-3 overflow-y-auto items-center'
                            : 'items-center gap-5 overflow-x-auto'
                        }`}>
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 sm:h-36 sm:w-36">
                            <div
                                className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
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
            <section className="w-full flex flex-col py-10 px-4 sm:px-10 lg:px-40 wave wave-svg">

                <header className="w-full flex flex-col gap-y-2 pt-5 font-bold">
                    <p className="text-2xl text-gray-50 sm:text-3xl lg:text-4xl">
                        Produk terbaru dari Jaja!
                    </p>

                    <p className="mb-2 flex justify-end pr-5 text-sm text-blue-100 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl">
                        Lihat lainnya
                    </p>
                </header>

                <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-8">

                    {/* Div Cover */}
                    <div className="hidden h-175 w-full max-w-sm flex-col items-center justify-center rounded-lg bg-linear-to-t from-blue-500 to-blue-800 shadow-lg md:flex lg:max-w-none lg:w-130">
                        <p className="rounded-full bg-white px-5 py-10 text-center text-2xl font-bold text-blue-400">
                            Jaja
                            <span className="text-orange-400">ID</span>
                        </p>
                    </div>

                    {/* Product Item grid */}
                    <div className="w-full grid grid-cols-2 gap-3 sm:grid-cols-3 lg:ml-5 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] lg:gap-4">
                        {products.slice(0, numberToSliceFeatured).map((item, index) => (
                            <ProductCard key={`${item.name}-${index}`} index={index} item={item} />
                        ))}
                    </div>

                </div>

            </section>

            {/* TOP PRODUCT */}
            <section className="w-full flex flex-col gap-y-5 py-15 px-4 sm:px-10 lg:px-40">

                <header className="flex w-full flex-col gap-y-2 font-bold">
                    <p className="text-2xl text-gray-900 sm:text-3xl lg:text-4xl">
                        Produk paling laris!
                    </p>

                    <p className="mb-2 flex justify-end pr-5 text-sm text-blue-900 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl">
                        Lihat lainnya
                    </p>
                </header>

                <div className='flex flex-row gap-x-3 overflow-x-auto pb-2 sm:gap-x-4'>
                    {products.slice(0, 6).map((item, index) => (
                        <ProductCard key={`top-${item.name}-${index}`} index={index} item={item} />
                    ))}
                </div>
            </section>

            {/* FOR YOU PRODUCTS */}
            <section className="flex w-full flex-col items-center gap-y-6 py-15 px-4 sm:px-8 lg:px-20 xl:px-32">

                <header className='text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl'>
                    Mungkin kamu juga suka
                </header>

                <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-3 xl:grid-cols-6">
                    {products.slice(0, numberToSliceRecommended).map((item, index) => (
                        <ProductCard key={`recommend-${item.name}-${index}`} index={index} item={item} />
                    ))}
                </div>

                <div className='flex w-full justify-center'>
                    <div className='w-fit rounded-4xl bg-blue-400 px-8 py-4 text-center font-bold text-gray-50 transition-colors hover:bg-blue-300'>
                        Lihat lainnya
                    </div>
                </div>
            </section>
        </div>
    )
}
