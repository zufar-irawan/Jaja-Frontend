'use client'

import { CircleUserRound, MapPin, Package2, CreditCard, ShieldCheck, Heart, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useState } from 'react'

export default function ClientSidebar() {
    const segment = useSelectedLayoutSegment() // 'profile', 'orders', etc.
    const [isOpen, setIsOpen] = useState(false)

    const menuItems = [
        { title: 'Profil', route: 'profile', icon: <CircleUserRound strokeWidth={1.5} size={24} /> },
        { title: 'Wishlist', route: 'wishlist', icon: <Heart strokeWidth={1.5} size={24} /> },
        { title: 'Pesanan', route: 'orders', icon: <Package2 strokeWidth={1.5} size={24} /> },
        { title: 'Alamat', route: 'address', icon: <MapPin strokeWidth={1.5} size={24} /> },
        { title: 'Rekening', route: 'account', icon: <CreditCard strokeWidth={1.5} size={24} /> },
        { title: 'Keamanan', route: 'security', icon: <ShieldCheck strokeWidth={1.5} size={24} /> },
    ]

    const currentMenu = menuItems.find(item => item.route === segment) || menuItems[0]

    return (
        <>
            {/* Mobile/Tablet Dropdown */}
            <div className="lg:hidden w-full bg-white rounded-lg shadow-md">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-4 px-4 flex items-center justify-between text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {currentMenu.icon}
                        <span className="font-medium text-base">{currentMenu.title}</span>
                    </div>
                    <ChevronDown
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        size={20}
                    />
                </button>

                {isOpen && (
                    <nav className="border-t border-gray-100">
                        <ul className="py-2">
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={`/clientArea/${item.route}`}
                                    scroll={false}
                                    onClick={() => setIsOpen(false)}
                                    className={`py-3 px-4 flex gap-3 items-center text-base cursor-pointer transition-colors ${segment === item.route
                                            ? 'bg-blue-400 text-white'
                                            : 'text-gray-800 hover:bg-gray-100 hover:text-blue-400'
                                        }`}
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            ))}
                        </ul>
                    </nav>
                )}
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex bg-white px-5 flex-1/4 py-8 rounded-lg shadow-md">
                <nav className="w-full">
                    <ul className="flex flex-col gap-2">
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                href={`/clientArea/${item.route}`}
                                scroll={false}
                                className={`py-4 px-3 flex gap-2 rounded-lg items-center text-lg border-b-2 cursor-pointer ${segment === item.route
                                        ? 'bg-blue-400 text-gray-50'
                                        : 'border-gray-200/60 text-gray-800 hover:bg-gray-100 hover:text-blue-400'
                                    }`}
                            >
                                {item.icon}
                                {item.title}
                            </Link>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}