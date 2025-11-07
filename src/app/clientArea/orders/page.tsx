'use client'

import OrderListCard from '@/components/OrderListCard'
import { useState } from 'react'

export default function OrdersPage() {
    const [tab, setTab] = useState<'active' | 'history'>('active')

    const pesanan = [
        { id: 1, title: 'Produk A', subtotal: 58000, quantity: 2, total: 116000, status: 'pending' },
        { id: 2, title: 'Produk B', subtotal: 60000, quantity: 1, total: 60000, status: 'processing' },
        { id: 3, title: 'Produk C', subtotal: 70000, quantity: 3, total: 210000, status: 'shipped' },
        { id: 4, title: 'Produk D', subtotal: 80000, quantity: 1, total: 80000, status: 'completed' },
    ]

    return (
        <div className='flex flex-col gap-4 w-full'>
            <h1 className='text-3xl font-bold text-gray-800'>Pesanan Kamu</h1>

            <div className="flex space-x-8 text-gray-900">
                <p className={`pb-2 border-b-2 cursor-pointer
                    ${tab === 'active'
                        ? 'border-black'
                        : 'border-transparent'}`}
                    onClick={() => setTab('active')}>
                    Pesanan Aktif
                </p>
                <p className={`pb-2 border-b-2 cursor-pointer
                    ${tab === 'history'
                        ? 'border-black'
                        : 'border-transparent'}`}
                    onClick={() => setTab('history')}>
                    Riwayat Pesanan
                </p>
            </div>

            <div className='flex flex-col w-full gap-5'>
                {tab === 'active' && pesanan.filter(item => item.status !== 'completed').map((item => (
                    <OrderListCard key={item.id} pesanan={item} />
                )))}

                {tab === 'history' && pesanan.filter(item => item.status === 'completed').map((item => (
                    <OrderListCard key={item.id} pesanan={item} />
                )))}
            </div>
        </div>
    )
}