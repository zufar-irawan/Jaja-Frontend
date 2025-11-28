'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import { getAllTransactions } from '@/utils/checkoutActions'
import type { TransactionData } from '@/utils/checkoutService'

export default function OrdersPage() {
    const router = useRouter()
    const [tab, setTab] = useState<'active' | 'history'>('active')
    const [orders, setOrders] = useState<TransactionData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAllTransactions()
            
            console.log('Orders API Response:', response)
            
            if (response.success && response.data) {
                // Handle if data is array or single object
                const ordersData = Array.isArray(response.data) ? response.data : [response.data]
                setOrders(ordersData)
            } else {
                setError(response.message || 'Gagal memuat pesanan')
            }
        } catch (err) {
            console.error('Error fetching orders:', err)
            setError('Terjadi kesalahan saat memuat pesanan')
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: string | number) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
        if (isNaN(numAmount)) return 'Rp 0'
        
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(numAmount)
    }

    const formatDate = (dateString: string, timeString?: string) => {
        try {
            let date
            if (timeString) {
                date = new Date(`${dateString} ${timeString}`)
            } else {
                date = new Date(dateString)
            }
            
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        } catch {
            return dateString
        }
    }

    const formatTimeRemaining = (deadline: string) => {
        try {
            const now = new Date().getTime()
            const deadlineTime = new Date(deadline).getTime()
            const distance = deadlineTime - now

            if (distance < 0) {
                return 'Kadaluarsa'
            }

            const hours = Math.floor(distance / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

            if (hours > 0) {
                return `${hours} jam ${minutes} menit`
            }
            return `${minutes} menit`
        } catch {
            return 'Invalid date'
        }
    }

    const isExpired = (deadline: string) => {
        try {
            return new Date(deadline).getTime() < new Date().getTime()
        } catch {
            return false
        }
    }

    const isPending = (status: string) => {
        const pendingStatuses = ['Menunggu Pembayaran', 'pending', 'Belum Bayar']
        return pendingStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()))
    }

    const isCompleted = (status: string) => {
        const completedStatuses = ['selesai', 'completed', 'delivered', 'diterima']
        return completedStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()))
    }

    const handleOrderClick = (orderId: number) => {
        router.push(`/Order/${orderId}`)
    }

    // Filter orders
    const activeOrders = orders.filter(
        (order) => isPending(order.status_transaksi) && !isExpired(order.batas_pembayaran)
    )

    const completedOrders = orders.filter(
        (order) => isCompleted(order.status_transaksi) || isExpired(order.batas_pembayaran)
    )

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center py-20 w-full'>
                <Loader2 className="w-12 h-12 text-[#55B4E5] animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Memuat pesanan...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex flex-col gap-6 w-full'>
                <h1 className='text-3xl font-bold text-gray-800'>Pesanan Kamu</h1>
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <p className="text-gray-600 font-semibold text-lg mb-2">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#55B4E5] text-white rounded-lg hover:bg-[#55B4E5]/90 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Coba Lagi
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 w-full'>
            <div className="flex items-center justify-between">
                <h1 className='text-3xl font-bold text-gray-800'>Pesanan Kamu</h1>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#55B4E5] hover:bg-[#55B4E5]/10 rounded-lg transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200">
                <button
                    className={`pb-3 border-b-2 font-medium transition-colors ${
                        tab === 'active'
                            ? 'border-[#55B4E5] text-[#55B4E5]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setTab('active')}
                >
                    Pesanan Aktif
                    {activeOrders.length > 0 && (
                        <span className="ml-2 bg-[#55B4E5] text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {activeOrders.length}
                        </span>
                    )}
                </button>
                <button
                    className={`pb-3 border-b-2 font-medium transition-colors ${
                        tab === 'history'
                            ? 'border-[#55B4E5] text-[#55B4E5]'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setTab('history')}
                >
                    Riwayat Pesanan
                    {completedOrders.length > 0 && (
                        <span className="ml-2 bg-gray-400 text-white text-xs font-bold rounded-full px-2 py-0.5">
                            {completedOrders.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Orders List */}
            <div className='flex flex-col w-full gap-4'>
                {tab === 'active' && (
                    <>
                        {activeOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-semibold text-lg">Tidak ada pesanan aktif</p>
                                <p className="text-gray-400 text-sm mt-1">Pesanan yang menunggu pembayaran akan muncul di sini</p>
                            </div>
                        ) : (
                            activeOrders.map((order) => (
                                <div
                                    key={order.id_data}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => handleOrderClick(order.id_data)}
                                >
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-yellow-50 rounded-lg">
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {order.invoice || `Order #${order.id_data}`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(order.created_date, order.created_time)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                                            {order.status_transaksi}
                                        </span>
                                    </div>

                                    {/* Products */}
                                    <div className="space-y-3 mb-4">
                                        {order.details && order.details.slice(0, 2).map((detail, index) => (
                                            <div key={detail.id_detail || index} className="flex items-center gap-3">
                                                {detail.foto_produk ? (
                                                    <img
                                                        src={detail.foto_produk}
                                                        alt={detail.nama_produk}
                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                                        {detail.nama_produk}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {detail.qty} x {formatCurrency(detail.harga_aktif)}
                                                    </p>
                                                    {detail.nama_toko && (
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {detail.nama_toko}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {order.details && order.details.length > 2 && (
                                            <p className="text-sm text-gray-500 pl-19">
                                                +{order.details.length - 2} produk lainnya
                                            </p>
                                        )}
                                    </div>

                                    {/* Total and Time */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                                            <p className="text-xl font-bold text-[#55B4E5]">
                                                {formatCurrency(order.total_tagihan)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500 mb-1">Waktu Tersisa</p>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-red-500" />
                                                <p className="text-sm font-semibold text-red-600">
                                                    {formatTimeRemaining(order.batas_pembayaran)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleOrderClick(order.id_data)
                                        }}
                                        className="w-full mt-4 bg-gradient-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                    >
                                        Bayar Sekarang
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </>
                )}

                {tab === 'history' && (
                    <>
                        {completedOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Package className="w-12 h-12 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-semibold text-lg">Tidak ada riwayat pesanan</p>
                                <p className="text-gray-400 text-sm mt-1">Riwayat pesanan Anda akan muncul di sini</p>
                            </div>
                        ) : (
                            completedOrders.map((order) => {
                                const expired = isExpired(order.batas_pembayaran)
                                const completed = isCompleted(order.status_transaksi)
                                
                                return (
                                    <div
                                        key={order.id_data}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => handleOrderClick(order.id_data)}
                                    >
                                        {/* Order Header */}
                                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${expired ? 'bg-red-50' : 'bg-green-50'}`}>
                                                    {expired ? (
                                                        <XCircle className="w-5 h-5 text-red-600" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {order.invoice || `Order #${order.id_data}`}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(order.created_date, order.created_time)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                                                expired
                                                    ? 'bg-red-100 text-red-700'
                                                    : completed
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {expired ? 'Kadaluarsa' : order.status_transaksi}
                                            </span>
                                        </div>

                                        {/* Products */}
                                        <div className="space-y-3 mb-4">
                                            {order.details && order.details.slice(0, 2).map((detail, index) => (
                                                <div key={detail.id_detail || index} className="flex items-center gap-3">
                                                    {detail.foto_produk ? (
                                                        <img
                                                            src={detail.foto_produk}
                                                            alt={detail.nama_produk}
                                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 text-sm line-clamp-1">
                                                            {detail.nama_produk}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {detail.qty} x {formatCurrency(detail.harga_aktif)}
                                                        </p>
                                                        {detail.nama_toko && (
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                {detail.nama_toko}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.details && order.details.length > 2 && (
                                                <p className="text-sm text-gray-500 pl-19">
                                                    +{order.details.length - 2} produk lainnya
                                                </p>
                                            )}
                                        </div>

                                        {/* Total */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <p className="text-sm text-gray-500">Total Belanja</p>
                                            <p className="text-xl font-bold text-gray-800">
                                                {formatCurrency(order.total_tagihan)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
