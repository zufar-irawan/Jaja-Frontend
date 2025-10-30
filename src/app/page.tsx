import React from 'react'

// Home Page
export default function Home() {

    const categories = [
        { name: 'Pakaian', icon: '' },
        { name: 'Seni', icon: '' },
        { name: 'Game', icon: '' },
        { name: 'Buku', icon: '' },
        { name: 'Berkebun', icon: '' },
        { name: 'Mainan', icon: '' },
        { name: 'Olahraga', icon: '' },
        { name: 'Elektronik', icon: '' },
        { name: 'Fotografi', icon: '' },
    ]

    const topProducts = [
        { name: 'Produk 1', price: 10000, image: '' },
        { name: 'Produk 2', price: 20000, image: '' },
        { name: 'Produk 3', price: 30000, image: '' },
        { name: 'Produk 4', price: 40000, image: '' },
        { name: 'Produk 5', price: 50000, image: '' },
    ]

    return (
        <div className="mt-10">

            {/* Hero Banner */}
            <section className="text-gray-50 text-4xl flex flex-row w-full min-h-[300px] bg-gray-900 items-center justify-center">
                Welcome to our app!
            </section>

            {/* Category Section */}
            <section className="w-full flex flex-col justify-center items-center gap-5">

                <header className="py-5 text-4xl text-gray-900">Kategori pilihan</header>

                <div className="grid grid-cols-7 gap-5 justify-items-center">
                    {categories.map((item, index) => (
                        <div key={index} className="w-fit shadow-2xl rounded-lg py-5">
                            <p className="text-blue-600 text-2xl font-bold text-center px-10 py-15">
                                Jaja
                                <span className="text-orange-400">ID</span>
                            </p>

                            <p className="text-center">{item.name}</p>
                        </div>
                    ))}
                </div>

            </section>

            {/*Top Products Section*/}
            <section className="w-full flex flex-col justify-center items-center gap-5">
                <header className="py-5 text-4xl text-gray-900 text-center">Produk Terpopuler</header>

                <div className="flex flex-row gap-5">
                    {topProducts.map((item, index) => (
                        <div key={index} className="w-fit shadow-2xl rounded-lg py-5">
                            <p className="text-blue-600 text-2xl font-bold text-center px-10 py-15">
                                Jaja
                                <span className="text-orange-400">ID</span>
                            </p>

                            <p className="text-center">{item.name}</p>
                            <p className="text-center">{item.price}</p>
                        </div>
                    ))}
                </div>
            </section>


        </div>
    )
}
