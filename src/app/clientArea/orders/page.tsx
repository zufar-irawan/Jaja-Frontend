"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Loader2,
  RefreshCw,
  Truck,
  PackageCheck,
  Ban,
  MapPin,
} from "lucide-react";

// Simulasi fungsi API
const getAllTransactions = async () => {
  // Mock data untuk demo
  return {
    success: true,
    data: [
      {
        id_data: 1,
        invoice: "INV-2024-001",
        status_transaksi: "Paid",
        created_date: "2024-11-27",
        created_time: "10:00:00",
        total_tagihan: "250000",
        batas_pembayaran: "2024-11-30 23:59:59",
        resi_pengiriman: "MT685U91", // Nomor resi untuk tracking
        kurir: "Wahana",
        details: [
          {
            id_detail: 1,
            nama_produk: "Produk A",
            qty: 2,
            harga_aktif: "100000",
            foto_produk: "https://via.placeholder.com/150",
            nama_toko: "Toko ABC",
          },
        ],
      },
      {
        id_data: 2,
        invoice: "INV-2024-002",
        status_transaksi: "Menunggu Pembayaran",
        created_date: "2024-11-28",
        created_time: "14:30:00",
        total_tagihan: "150000",
        batas_pembayaran: "2024-11-29 23:59:59",
        resi_pengiriman: null,
        kurir: null,
        details: [
          {
            id_detail: 2,
            nama_produk: "Produk B",
            qty: 1,
            harga_aktif: "150000",
            foto_produk: "https://via.placeholder.com/150",
            nama_toko: "Toko XYZ",
          },
        ],
      },
    ],
  };
};

type OrderTab = "unpaid" | "processing" | "completed" | "cancelled";
type TransactionData = {
  id_data: number;
  invoice: string;
  status_transaksi: string;
  created_date: string;
  created_time: string;
  total_tagihan: string;
  batas_pembayaran: string;
  resi_pengiriman?: string | null;
  kurir?: string | null;
  details: Array<{
    id_detail: number;
    nama_produk: string;
    qty: number;
    harga_aktif: string;
    foto_produk: string;
    nama_toko: string;
  }>;
};

export default function OrdersPage() {
  const router = useRouter();
  const [tab, setTab] = useState<OrderTab>("unpaid");
  const [orders, setOrders] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page visible - refreshing orders...");
        fetchOrders();
      }
    };

    const handleFocus = () => {
      console.log("Window focused - refreshing orders...");
      fetchOrders();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTransactions();

      console.log("Orders API Response:", response);

      if (response.success && response.data) {
        const ordersData = Array.isArray(response.data)
          ? response.data
          : [response.data];

        ordersData.sort((a, b) => {
          const dateA = new Date(
            `${a.created_date} ${a.created_time}`,
          ).getTime();
          const dateB = new Date(
            `${b.created_date} ${b.created_time}`,
          ).getTime();
          return dateB - dateA;
        });

        setOrders(ordersData);
      } else {
        setError("Gagal memuat pesanan");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Terjadi kesalahan saat memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string, timeString?: string) => {
    try {
      let date;
      if (timeString) {
        date = new Date(`${dateString} ${timeString}`);
      } else {
        date = new Date(dateString);
      }

      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatTimeRemaining = (deadline: string) => {
    try {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      const distance = deadlineTime - now;

      if (distance < 0) {
        return "Kadaluarsa";
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        return `${hours} jam ${minutes} menit`;
      }
      return `${minutes} menit`;
    } catch {
      return "Invalid date";
    }
  };

  const isExpired = (deadline: string) => {
    try {
      return new Date(deadline).getTime() < new Date().getTime();
    } catch {
      return false;
    }
  };

  const getOrdersByStatus = (status: OrderTab) => {
    switch (status) {
      case "unpaid":
        return orders.filter((o) => {
          const statusLower = o.status_transaksi?.toLowerCase() || "";
          const isUnpaid =
            statusLower.includes("menunggu") ||
            statusLower.includes("pending") ||
            statusLower.includes("belum bayar") ||
            statusLower === "unpaid";
          return isUnpaid && !isExpired(o.batas_pembayaran);
        });

      case "processing":
        return orders.filter((o) => {
          const statusLower = o.status_transaksi?.toLowerCase() || "";
          return (
            statusLower === "paid" ||
            statusLower.includes("diproses") ||
            statusLower.includes("dikemas") ||
            statusLower.includes("dikirim") ||
            statusLower.includes("processing") ||
            statusLower.includes("shipped") ||
            statusLower.includes("delivery")
          );
        });

      case "completed":
        return orders.filter((o) => {
          const statusLower = o.status_transaksi?.toLowerCase() || "";
          return (
            statusLower.includes("selesai") ||
            statusLower.includes("completed") ||
            statusLower.includes("diterima") ||
            statusLower.includes("delivered") ||
            statusLower.includes("received")
          );
        });

      case "cancelled":
        return orders.filter((o) => {
          const statusLower = o.status_transaksi?.toLowerCase() || "";
          const isCancelled =
            statusLower.includes("batal") ||
            statusLower.includes("cancel") ||
            statusLower.includes("rejected");
          return isCancelled || isExpired(o.batas_pembayaran);
        });

      default:
        return [];
    }
  };

  const currentOrders = getOrdersByStatus(tab);
  const unpaidCount = getOrdersByStatus("unpaid").length;
  const processingCount = getOrdersByStatus("processing").length;
  const completedCount = getOrdersByStatus("completed").length;
  const cancelledCount = getOrdersByStatus("cancelled").length;

  const handleOrderClick = (orderId: number) => {
    router.push(`/Order/${orderId}`);
  };

  const handleTrackingClick = (e: React.MouseEvent, resi: string) => {
    e.stopPropagation();
    router.push(`/tracking/${resi}`);
  };

  const getStatusBadge = (status: string, expired: boolean) => {
    const statusLower = status?.toLowerCase() || "";

    if (expired) {
      return {
        label: "Kadaluarsa",
        bg: "bg-red-100",
        text: "text-red-700",
        icon: <XCircle className="w-5 h-5 text-red-600" />,
      };
    }

    if (statusLower === "paid") {
      return {
        label: "Sudah Dibayar",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
      };
    }

    if (
      statusLower.includes("menunggu") ||
      statusLower.includes("pending") ||
      statusLower.includes("belum bayar")
    ) {
      return {
        label: "Menunggu Pembayaran",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
      };
    }

    if (
      statusLower.includes("diproses") ||
      statusLower.includes("dikemas") ||
      statusLower.includes("processing")
    ) {
      return {
        label: "Sedang Diproses",
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: <Package className="w-5 h-5 text-blue-600" />,
      };
    }

    if (
      statusLower.includes("dikirim") ||
      statusLower.includes("shipped") ||
      statusLower.includes("delivery")
    ) {
      return {
        label: "Dalam Pengiriman",
        bg: "bg-purple-100",
        text: "text-purple-700",
        icon: <Truck className="w-5 h-5 text-purple-600" />,
      };
    }

    if (
      statusLower.includes("selesai") ||
      statusLower.includes("completed") ||
      statusLower.includes("diterima")
    ) {
      return {
        label: "Selesai",
        bg: "bg-green-100",
        text: "text-green-700",
        icon: <PackageCheck className="w-5 h-5 text-green-600" />,
      };
    }

    if (statusLower.includes("batal") || statusLower.includes("cancel")) {
      return {
        label: "Dibatalkan",
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: <Ban className="w-5 h-5 text-gray-600" />,
      };
    }

    return {
      label: status,
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: <Package className="w-5 h-5 text-gray-600" />,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <Loader2 className="w-12 h-12 text-[#55B4E5] animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Memuat pesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-3xl font-bold text-gray-800">Pesanan Kamu</h1>
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
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Pesanan Kamu</h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#55B4E5] hover:bg-[#55B4E5]/10 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex space-x-2 md:space-x-4 border-b border-gray-200 overflow-x-auto pb-0">
        <button
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${tab === "unpaid"
              ? "border-[#55B4E5] text-[#55B4E5]"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setTab("unpaid")}
        >
          Belum Bayar
          {unpaidCount > 0 && (
            <span className="ml-2 bg-yellow-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {unpaidCount}
            </span>
          )}
        </button>

        <button
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${tab === "processing"
              ? "border-[#55B4E5] text-[#55B4E5]"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setTab("processing")}
        >
          Diproses
          {processingCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {processingCount}
            </span>
          )}
        </button>

        <button
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${tab === "completed"
              ? "border-[#55B4E5] text-[#55B4E5]"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setTab("completed")}
        >
          Selesai
          {completedCount > 0 && (
            <span className="ml-2 bg-green-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {completedCount}
            </span>
          )}
        </button>

        <button
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${tab === "cancelled"
              ? "border-[#55B4E5] text-[#55B4E5]"
              : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setTab("cancelled")}
        >
          Dibatalkan
          {cancelledCount > 0 && (
            <span className="ml-2 bg-gray-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
              {cancelledCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col w-full gap-4">
        {currentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">
              Tidak ada pesanan
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {tab === "unpaid" &&
                "Pesanan yang belum dibayar akan muncul di sini"}
              {tab === "processing" &&
                "Pesanan yang sedang diproses akan muncul di sini"}
              {tab === "completed" &&
                "Pesanan yang sudah selesai akan muncul di sini"}
              {tab === "cancelled" &&
                "Pesanan yang dibatalkan akan muncul di sini"}
            </p>
          </div>
        ) : (
          currentOrders.map((order) => {
            const expired =
              tab === "unpaid" ? isExpired(order.batas_pembayaran) : false;
            const statusBadge = getStatusBadge(order.status_transaksi, expired);
            const hasTracking = order.resi_pengiriman && order.kurir;

            return (
              <div
                key={order.id_data}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOrderClick(order.id_data)}
              >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusBadge.bg}`}>
                      {statusBadge.icon}
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
                  <span
                    className={`${statusBadge.bg} ${statusBadge.text} text-xs font-semibold px-3 py-1.5 rounded-full`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* Tracking Info - Tampil jika ada resi */}
                {hasTracking && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Nomor Resi</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {order.resi_pengiriman}
                          </p>
                          <p className="text-xs text-gray-500">{order.kurir}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) =>
                          handleTrackingClick(e, order.resi_pengiriman!)
                        }
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Lacak
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  {order.details &&
                    order.details.slice(0, 2).map((detail, index) => (
                      <div
                        key={detail.id_detail || index}
                        className="flex items-center gap-3"
                      >
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
                        <div className="flex-1 min-w-0">
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Belanja</p>
                    <p className="text-xl font-bold text-[#55B4E5]">
                      {formatCurrency(order.total_tagihan)}
                    </p>
                  </div>
                  {tab === "unpaid" && !expired && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        Waktu Tersisa
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <p className="text-sm font-semibold text-red-600">
                          {formatTimeRemaining(order.batas_pembayaran)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {tab === "unpaid" && !expired && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(order.id_data);
                    }}
                    className="w-full mt-4 bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    Bayar Sekarang
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {tab === "processing" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(order.id_data);
                    }}
                    className="w-full mt-4 bg-white border-2 border-[#55B4E5] text-[#55B4E5] font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-[#55B4E5] hover:text-white"
                  >
                    Lihat Detail Pesanan
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}