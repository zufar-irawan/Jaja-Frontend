"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, Package, X } from "lucide-react";
import { useOrderNotificationStore } from "@/store/orderNotificationStore";

export default function OrderNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { pendingOrders, unreadCount, removePendingOrder, clearExpiredOrders } =
    useOrderNotificationStore();

  useEffect(() => {
    clearExpiredOrders();
  }, [clearExpiredOrders]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatCurrency = (amount: number | string | undefined) => {
    // Handle berbagai format input
    let numAmount: number;
    
    if (typeof amount === "string") {
      numAmount = parseFloat(amount);
    } else if (typeof amount === "number") {
      numAmount = amount;
    } else {
      return "Rp 0";
    }

    // Validasi jika NaN
    if (isNaN(numAmount)) {
      console.warn("Invalid amount for currency formatting:", amount);
      return "Rp 0";
    }

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numAmount);
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
        return `${hours}j ${minutes}m`;
      }
      return `${minutes}m`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  const handleNotificationClick = (id_data: string) => {
    setIsOpen(false);
    router.push(`/Order/${id_data}`);
  };

  const handleViewAllOrders = () => {
    setIsOpen(false);
    router.push("/clientArea/orders");
  };

  const handleRemoveOrder = (e: React.MouseEvent, id_data: string) => {
    e.stopPropagation();
    removePendingOrder(id_data);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group"
      >
        <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-70 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Notifikasi</h3>
              <p className="text-sm text-gray-500">
                {unreadCount > 0
                  ? `${unreadCount} pesanan menunggu pembayaran`
                  : "Tidak ada notifikasi baru"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1 max-h-[450px]">
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">Tidak ada notifikasi</p>
                <p className="text-gray-400 text-sm mt-1">
                  Notifikasi pesanan akan muncul di sini
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {pendingOrders.map((order) => {
                  const isExpired =
                    new Date(order.batas_pembayaran).getTime() <
                    new Date().getTime();

                  return (
                    <div
                      key={order.id_data}
                      onClick={() => handleNotificationClick(order.id_data)}
                      className={`p-4 hover:bg-[#55B4E5]/5 transition-colors cursor-pointer relative group ${
                        order.status === "pending" && !isExpired
                          ? "bg-blue-50/30"
                          : ""
                      }`}
                    >
                      {/* Remove Button */}
                      <button
                        onClick={(e) => handleRemoveOrder(e, order.id_data)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="shrink-0">
                          {order.products[0]?.gambar ? (
                            <img
                              src={order.products[0].gambar}
                              alt="Product"
                              className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Order Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-800 text-sm">
                              Pesanan #{order.order_number}
                            </p>
                            {order.status === "pending" && !isExpired && (
                              <span className="shrink-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                Menunggu
                              </span>
                            )}
                            {isExpired && (
                              <span className="shrink-0 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                Kadaluarsa
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {order.products.length > 1
                              ? `${order.products[0]?.nama_produk || "Produk"} +${order.products.length - 1} produk lainnya`
                              : order.products[0]?.nama_produk || "Produk"}
                          </p>

                          <div className="flex items-center justify-between">
                            <p className="font-bold text-[#55B4E5] text-sm">
                              {formatCurrency(order.total)}
                            </p>
                            {!isExpired && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {formatTimeRemaining(order.batas_pembayaran)}
                                </span>
                              </div>
                            )}
                          </div>

                          {order.status === "pending" && !isExpired && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(order.id_data);
                              }}
                              className="mt-2 w-full text-xs font-medium text-[#55B4E5] hover:text-white bg-white hover:bg-[#55B4E5] border border-[#55B4E5] rounded-lg py-1.5 transition-colors"
                            >
                              Bayar Sekarang
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {pendingOrders.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={handleViewAllOrders}
                className="w-full text-center text-sm font-medium text-[#55B4E5] hover:text-[#55B4E5]/80 transition-colors"
              >
                Lihat Semua Pesanan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
