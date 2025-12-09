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
  Star,
  AlertTriangle,
} from "lucide-react";
import {
  getAllTransactions,
  getProductTransactionDetail,
} from "@/utils/checkoutActions";
import ReviewProductModal from "./ReviewProductModal";
import ComplainModal from "./ComplainModal";
import { useOrderNotificationStore } from "@/store/orderNotificationStore";

type OrderTab = "unpaid" | "processing" | "completed";
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
  id_status?: number;
  details: Array<{
    id_detail: number;
    id_produk: number;
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
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [complainModalOpen, setComplainModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: number;
    transactionId: number;
    productName: string;
    productImage?: string;
    invoice?: string;
  } | null>(null);
  const [productDetails, setProductDetails] = useState<{
    [key: string]: {
      id_status: number;
      hasComplain: boolean;
      hasRating: boolean;
    };
  }>({});

  // Get notification store functions
  const clearExpiredOrders = useOrderNotificationStore(
    (state) => state.clearExpiredOrders,
  );
  const markOrderAsCancelled = useOrderNotificationStore(
    (state) => state.markOrderAsCancelled,
  );

  useEffect(() => {
    fetchOrders();
    // Clear expired orders from notifications on mount
    clearExpiredOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        // Clean up notifications for cancelled/expired orders
        ordersData.forEach((order) => {
          const statusLower = order.status_transaksi?.toLowerCase() || "";
          const isCancelled =
            statusLower.includes("batal") ||
            statusLower.includes("cancel") ||
            statusLower.includes("ditolak") ||
            statusLower.includes("tolak");
          const isExpiredOrder =
            order.batas_pembayaran && isExpired(order.batas_pembayaran);

          // Remove from notifications if cancelled or expired
          if (isCancelled || isExpiredOrder) {
            markOrderAsCancelled(order.id_data.toString());
          }
        });
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

  const fetchProductDetail = async (idData: number, idProduk: number) => {
    const key = `${idData}-${idProduk}`;

    if (productDetails[key]) {
      return productDetails[key];
    }

    try {
      const response = await getProductTransactionDetail(idData, idProduk);

      if (response.success && response.data) {
        const detail = {
          id_status: response.data.transaksi.id_status,
          hasComplain: response.data.history_komplain.length > 0,
          hasRating: response.data.rating_saya !== null,
        };

        setProductDetails((prev) => ({
          ...prev,
          [key]: detail,
        }));

        return detail;
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    }

    return null;
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

  const formatDate = (date: string, time?: string) => {
    try {
      let dateObj;
      if (time) {
        dateObj = new Date(`${date} ${time}`);
      } else {
        dateObj = new Date(date);
      }

      if (isNaN(dateObj.getTime())) {
        return date;
      }

      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      const hour = String(dateObj.getHours()).padStart(2, "0");
      const minute = String(dateObj.getMinutes()).padStart(2, "0");

      return `${day}/${month}/${year} ${hour}:${minute}`;
    } catch {
      return date;
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

      return `${hours}j ${minutes}m`;
    } catch {
      return "";
    }
  };

  const isExpired = (deadline: string) => {
    try {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline).getTime();
      return now > deadlineTime;
    } catch {
      return false;
    }
  };

  const getOrdersByStatus = (status: OrderTab) => {
    if (status === "unpaid") {
      return orders.filter((order) => {
        const statusLower = order.status_transaksi?.toLowerCase() || "";
        const isCancelled =
          statusLower.includes("batal") || statusLower.includes("cancel");
        const isExpiredOrder = isExpired(order.batas_pembayaran);

        if (isCancelled || isExpiredOrder) return false;

        return (
          statusLower.includes("menunggu") ||
          statusLower.includes("pending") ||
          statusLower.includes("belum bayar") ||
          statusLower.includes("booked")
        );
      });
    }

    if (status === "processing") {
      return orders.filter((order) => {
        const statusLower = order.status_transaksi?.toLowerCase() || "";
        
        // Include orders with id_status = 7 (Dikirim/Delivered)
        if (order.id_status === 7) {
          return true;
        }

        const isCancelled =
          statusLower.includes("batal") ||
          statusLower.includes("cancel") ||
          statusLower.includes("tolak");

        if (isCancelled) return false;

        return (
          statusLower.includes("paid") ||
          statusLower.includes("diproses") ||
          statusLower.includes("dikemas") ||
          statusLower.includes("dikirim") ||
          statusLower.includes("diapkan") ||
          statusLower.includes("shipped") ||
          statusLower.includes("delivery")
        );
      });
    }

    if (status === "completed") {
      return orders.filter((order) => {
        const statusLower = order.status_transaksi?.toLowerCase() || "";
        const isCancelled =
          statusLower.includes("batal") ||
          statusLower.includes("cancel") ||
          statusLower.includes("tolak");

        if (isCancelled) return false;
        
        return order.id_status === 9 || 
               statusLower.includes("selesai") || 
               statusLower.includes("completed") || 
               statusLower.includes("diterima");
      });
    }

    return [];
  };

  const currentOrders = getOrdersByStatus(tab);
  const unpaidCount = getOrdersByStatus("unpaid").length;
  const processingCount = getOrdersByStatus("processing").length;
  const completedCount = getOrdersByStatus("completed").length;

  const handleOrderClick = (orderId: number) => {
    router.push(`/Order/${orderId}`);
  };

  const handleTrackingClick = (e: React.MouseEvent, resi: string) => {
    e.stopPropagation();
    router.push(`/clientArea/tracking/${resi}`);
  };

  const handleReviewClick = async (
    e: React.MouseEvent,
    productId: number,
    transactionId: number,
    productName: string,
    invoice: string,
    productImage?: string,
  ) => {
    e.stopPropagation();

    // Check if already reviewed
    const detail = await fetchProductDetail(transactionId, productId);

    if (detail?.hasRating) {
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        icon: "info",
        title: "Sudah Direview",
        text: "Anda sudah memberikan review untuk produk ini",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    setSelectedProduct({
      productId,
      transactionId,
      productName,
      productImage,
      invoice,
    });
    setReviewModalOpen(true);
  };

  const handleComplainClick = async (
    e: React.MouseEvent,
    productId: number,
    transactionId: number,
    productName: string,
    invoice: string,
    productImage?: string,
  ) => {
    e.stopPropagation();

    // Check if already complained
    const detail = await fetchProductDetail(transactionId, productId);

    if (detail?.hasComplain) {
      const Swal = (await import("sweetalert2")).default;
      Swal.fire({
        icon: "info",
        title: "Komplain Sudah Ada",
        text: "Anda sudah membuat komplain untuk produk ini",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    setSelectedProduct({
      productId,
      transactionId,
      productName,
      productImage,
      invoice,
    });
    setComplainModalOpen(true);
  };

  const handleReviewSuccess = () => {
    fetchOrders();
  };

  const handleComplainSuccess = () => {
    fetchOrders();
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
        label: "Diproses",
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

  const canShowComplainButton = (order: TransactionData) => {
    // Komplain bisa dibuat jika id_status = 7 (Dikirim)
    return order.id_status === 7;
  };

  const canShowReviewButton = (order: TransactionData) => {
    // Rating bisa dibuat jika id_status = 9 (Selesai)
    return order.id_status === 9;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#55B4E5] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Gagal Memuat Pesanan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-3 bg-[#55B4E5] text-white rounded-lg hover:bg-[#55B4E5]/90 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Pesanan Saya
        </h1>
        <p className="text-gray-600">Kelola dan lacak pesanan Anda di sini</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
            tab === "unpaid"
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
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
            tab === "processing"
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
          className={`pb-3 px-3 md:px-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
            tab === "completed"
              ? "border-[#55B4E5] text-[#55B4E5]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setTab("completed")}
        >
          Selesai
          {completedCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-[#55B4E5] text-white rounded-full">
              {completedCount}
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
            </p>
          </div>
        ) : (
          currentOrders.map((order) => {
            const expired =
              tab === "unpaid" ? isExpired(order.batas_pembayaran) : false;
            const statusBadge = getStatusBadge(order.status_transaksi, expired);
            const hasTracking = order.resi_pengiriman && order.kurir;
            const showComplainButton = canShowComplainButton(order);
            const showReviewButton = canShowReviewButton(order);

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
                        <div className="flex flex-col gap-2">
                          {/* Tombol Komplain - tampil jika id_status = 7 */}
                          {showComplainButton && (
                            <button
                              onClick={(e) =>
                                handleComplainClick(
                                  e,
                                  detail.id_produk,
                                  order.id_data,
                                  detail.nama_produk,
                                  order.invoice,
                                  detail.foto_produk,
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm hover:shadow-md"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Komplain
                            </button>
                          )}
                          {/* Tombol Review - tampil jika id_status = 9 */}
                          {showReviewButton && (
                            <button
                              onClick={(e) =>
                                handleReviewClick(
                                  e,
                                  detail.id_produk,
                                  order.id_data,
                                  detail.nama_produk,
                                  order.invoice,
                                  detail.foto_produk,
                                )
                              }
                              className="flex items-center gap-1.5 px-3 py-2 bg-linear-to-r from-[#FBB338] to-[#FBB338]/90 text-white text-xs font-semibold rounded-lg hover:from-[#FBB338]/90 hover:to-[#FBB338] transition-all shadow-sm hover:shadow-md"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Review
                            </button>
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

      {/* Review Product Modal */}
      {selectedProduct && (
        <ReviewProductModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.productId}
          transactionId={selectedProduct.transactionId}
          productName={selectedProduct.productName}
          productImage={selectedProduct.productImage}
          onSuccess={handleReviewSuccess}
        />
      )}

      {/* Complain Modal */}
      {selectedProduct && (
        <ComplainModal
          isOpen={complainModalOpen}
          onClose={() => {
            setComplainModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.productId}
          productName={selectedProduct.productName}
          invoice={selectedProduct.invoice || ""}
          productImage={selectedProduct.productImage}
          onSuccess={handleComplainSuccess}
        />
      )}
    </div>
  );
}
