'use client'

import { CircleUserRound, MapPin, Package2, CreditCard, ShieldCheck, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function ClientSidebar() {
    const segment = useSelectedLayoutSegment() // 'profile', 'orders', etc.

    const menuItems = [
        { title: 'Profil', route: 'profile', icon: <CircleUserRound strokeWidth={1.5} size={40} /> },
        { title: 'Pesanan', route: 'orders', icon: <Package2 strokeWidth={1.5} size={40} /> },
        { title: 'Alamat', route: 'address', icon: <MapPin strokeWidth={1.5} size={40} /> },
        { title: 'Rekening', route: 'account', icon: <CreditCard strokeWidth={1.5} size={40} /> },
        { title: 'Keamanan', route: 'security', icon: <ShieldCheck strokeWidth={1.5} size={40} /> },
    ]

    return (
        <aside className="bg-white px-5 flex-1/4 flex py-8 rounded-lg shadow-md">
            <nav className="w-full">
                <ul className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.route}
                            href={`/clientArea/${item.route}`}
                            scroll={false}
                            className={`py-4 px-3 flex gap-2 rounded-lg items-center text-xl border-b-2 cursor-pointer ${segment === item.route
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
    )
}