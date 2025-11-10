import { formatCurrency } from "@/utils/format";
import { Banknote, CheckCircle, Clock, Truck } from "lucide-react"
import { JSX } from "react"

function Status({ status, icon, color }: { status: string, icon: JSX.Element, color: string }) {
    return (
        <div className={`flex flex-row gap-2 text-xl items-center px-5 py-2 font-semibold rounded-lg w-full ${color}`}>
            {icon}
            {status}
        </div>
    )
}

export default function OrderListCard({ pesanan }: { pesanan: any }) {
    const status = () => {
        switch (pesanan.status) {
            case 'pending':
                return <Status status="Menunggu Pembayaran" icon={<Banknote size={30} />} color="text-yellow-500 bg-yellow-200/20 backdrop-blur-sm border border-yellow-500/80" />;
            case 'processing':
                return <Status status="Sedang Diproses" icon={<Clock size={30} />} color="text-blue-500 bg-blue-200/20 backdrop-blur-sm border border-blue-500/80" />;
            case 'shipped':
                return <Status status="Dalam Pengiriman" icon={<Truck size={30} />} color="text-orange-500 bg-orange-200/20 backdrop-blur-sm border border-orange-500/80" />;
            case 'completed':
                return <Status status="Selesai" icon={<CheckCircle size={30} />} color="text-green-500 bg-green-200/20 backdrop-blur-sm border border-green-500/80" />;
        }
    }

    return (
        <div className="group w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">

            {/* Header with Date */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-5 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <p className="text-sm font-medium text-gray-700">Order ID: #12345</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">Tanggal pembelian</p>
                    <p className="text-sm font-semibold text-gray-700">18/09/2024</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">

                {/* Product Info */}
                <div className="flex flex-1 gap-4">
                    {/* Product Image/Logo */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-orange-50 shadow-sm ring-1 ring-blue-100 sm:h-28 sm:w-28">
                        <p className="text-center text-xl font-bold text-blue-600 sm:text-2xl">
                            Jaja
                            <span className="text-orange-400">ID</span>
                        </p>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-1 flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">{pesanan.title}</h2>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Quantity Badge */}
                            <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 ring-1 ring-red-200">
                                <span className="text-sm font-medium text-red-600">Qty:</span>
                                <span className="text-lg font-bold text-red-500">{pesanan.quantity}</span>
                            </div>

                            {/* Price Info */}
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-500">Subtotal per item</p>
                                <p className="text-base font-semibold text-gray-700">{formatCurrency(pesanan.subtotal)}</p>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="mt-2 rounded-lg bg-blue-50 px-4 py-2 ring-1 ring-blue-100">
                            <p className="text-xs text-gray-600">Total Pembayaran</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(pesanan.total)}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-start w-full">
                            {status()}
                        </div>
                    </div>
                </div>


            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/30 px-5 py-3">
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                    Detail
                </button>
                <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md">
                    Beli Lagi
                </button>
            </div>

        </div>
    )
}