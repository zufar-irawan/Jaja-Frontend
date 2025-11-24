"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  User,
  Clock,
  FileText,
  MapPin,
  Truck,
  CreditCard,
  Loader2,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getTransactionDetail } from "@/utils/checkoutActions";
import { formatCurrency } from "@/utils/checkoutService";
import type { TransactionData } from "@/utils/checkoutService";
import Swal from "sweetalert2";

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<TransactionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  useEffect(() => {
    if (orderData?.batas_pembayaran) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const deadline = new Date(orderData.batas_pembayaran).getTime();
        const distance = deadline - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        } else {
          setTimeRemaining({
            hours: Math.floor(distance / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [orderData]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getTransactionDetail(orderId);
      
      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: response.message || "Tidak dapat memuat detail pesanan",
          confirmButtonColor: "#55B4E5",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat memuat data",
        confirmButtonColor: "#55B4E5",
      });
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderData) return;

    try {
      // Redirect to payment gateway or show payment options
      await Swal.fire({
        icon: "info",
        title: "Pilih Metode Pembayaran",
        text: "Anda akan diarahkan ke halaman pembayaran",
        confirmButtonColor: "#55B4E5",
      });
      // Here you would redirect to payment page
      // router.push(`/payment/${orderData.order_id}`);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Batalkan Pesanan?",
      text: "Pesanan yang dibatalkan tidak dapat dikembalikan",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      // Implement cancel order API call
      await Swal.fire({
        icon: "success",
        title: "Pesanan Dibatalkan",
        text: "Pesanan Anda telah dibatalkan",
        confirmButtonColor: "#55B4E5",
      });
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "Poppins, sans-serif",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2
            size={48}
            style={{
              margin: "0 auto",
              color: "#55B4E5",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ marginTop: "16px", color: "#6c757d", fontSize: "14px" }}>
            Memuat detail pesanan...
          </p>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const statusColor =
    orderData.status_transaksi === "Menunggu Pembayaran"
      ? "#FBB338"
      : orderData.status_transaksi === "Diproses"
        ? "#55B4E5"
        : orderData.status_transaksi === "Selesai"
          ? "#28a745"
          : "#dc3545";

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Payment Deadline Banner */}
      {orderData.status_transaksi === "Menunggu Pembayaran" && (
        <div
          style={{
            background: "linear-gradient(135deg, #FBB338 0%, #F59E0B 100%)",
            padding: "12px 0",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              padding: "0 20px",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Batas Pembayaran
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "h", value: timeRemaining.hours },
                { label: "m", value: timeRemaining.minutes },
                { label: "s", value: timeRemaining.seconds },
              ].map((time, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "6px 10px",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#333",
                    }}
                  >
                    {time.value.toString().padStart(2, "0")}
                  </div>
                  <div style={{ fontSize: "9px", color: "#6c757d" }}>
                    {time.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          backgroundColor: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => router.back()}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                color: "#6c757d",
              }}
            >
              <ChevronLeft size={24} />
            </button>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#55B4E5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCart style={{ color: "white" }} size={20} />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "2px",
                }}
              >
                Detail Pesanan
              </h1>
              <p style={{ fontSize: "11px", color: "#6c757d" }}>
                {orderData.order_id}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status Pesanan
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: statusColor,
                }}
              >
                {orderData.status_transaksi}
              </p>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: `${statusColor}20`,
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Clock style={{ color: statusColor }} size={24} />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Total Item
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#333",
                }}
              >
                {orderData.details.length} Produk
              </p>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#8B5CF620",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Package style={{ color: "#8B5CF6" }} size={24} />
            </div>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "16px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#6c757d",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Tanggal Pesanan
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#333",
                }}
              >
                {orderData.created_date} {orderData.created_time}
              </p>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#55B4E520",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileText style={{ color: "#55B4E5" }} size={24} />
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 400px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Customer Info */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "2px solid #55B4E5",
              }}
            >
              <User size={20} style={{ color: "#55B4E5" }} />
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
                Informasi Pelanggan
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Nama
                </label>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                  {orderData.nama_penerima}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Telepon
                </label>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                  {orderData.telp_penerima}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Alamat Pengiriman
                </label>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#333",
                    lineHeight: "1.5",
                  }}
                >
                  {orderData.alamat_pengiriman}
                </p>
              </div>

              {orderData.pesan_customer && (
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Catatan
                  </label>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#333",
                      fontStyle: "italic",
                    }}
                  >
                    {orderData.pesan_customer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "2px solid #55B4E5",
              }}
            >
              <Truck size={20} style={{ color: "#55B4E5" }} />
              <h2 style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}>
                Informasi Pengiriman
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Kurir
                </label>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>
                  {orderData.pengiriman || "Belum dipilih"}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Ongkos Kirim
                </label>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                  {formatCurrency(Number(orderData.biaya_ongkir))}
                </p>
              </div>

              <div>
                <label
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#6c757d",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Waktu Pengiriman
                </label>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                  {orderData.waktu_pengiriman}
                </p>
              </div>

              {orderData.tgl_pengiriman && (
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Tanggal Pengiriman
                  </label>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>
                    {orderData.tgl_pengiriman}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              position: "sticky",
              top: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#333",
                borderBottom: "3px solid #55B4E5",
                paddingBottom: "10px",
              }}
            >
              Ringkasan Pembayaran
            </h2>

            <div
              style={{
                marginBottom: "16px",
                padding: "14px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Subtotal ({orderData.details.length} item)
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(
                    orderData.details.reduce((sum, item) => sum + item.total, 0)
                  )}
                </span>
              </div>

              {orderData.diskon_voucher_toko > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#6c757d" }}>
                    Diskon Voucher
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#FBB338",
                    }}
                  >
                    -{formatCurrency(orderData.diskon_voucher_toko)}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>Ongkir</span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(Number(orderData.biaya_ongkir))}
                </span>
              </div>

              {orderData.biaya_asuransi > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: "#6c757d" }}>
                    Biaya Asuransi
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600" }}>
                    {formatCurrency(orderData.biaya_asuransi)}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                padding: "14px 0",
                borderTop: "2px solid #e9ecef",
                borderBottom: "2px solid #e9ecef",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "600" }}>Total</span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#FBB338",
                }}
              >
                {formatCurrency(Number(orderData.total_tagihan))}
              </span>
            </div>

            {orderData.status_transaksi === "Menunggu Pembayaran" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  onClick={handlePayment}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#55B4E5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <CreditCard size={18} />
                  Pilih Pembayaran
                </button>

                <button
                  onClick={handleCancelOrder}
                  style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "white",
                    color: "#dc3545",
                    border: "2px solid #dc3545",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Batalkan Pesanan
                </button>
              </div>
            )}

            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid #e9ecef",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "#6c757d",
                  marginBottom: "10px",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                METODE PEMBAYARAN TERSEDIA
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {["💳 Card", "GoPay", "OVO", "Dana", "ShopePay"].map((method) => (
                  <div
                    key={method}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #dee2e6",
                      borderRadius: "5px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #55B4E5",
            }}
          >
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
              Item Pesanan
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e9ecef" }}>
                  <th
                    style={{
                      textAlign: "left",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      padding: "12px 8px",
                    }}
                  >
                    Produk
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      padding: "12px 8px",
                    }}
                  >
                    Harga
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      padding: "12px 8px",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      padding: "12px 8px",
                    }}
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.details.map((item) => (
                  <tr
                    key={item.id_detail}
                    style={{ borderBottom: "1px solid #f8f9fa" }}
                  >
                    <td style={{ padding: "16px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          {item.foto_produk ? (
                            <img
                              src={item.foto_produk}
                              alt={item.nama_produk}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Package style={{ color: "#6c757d" }} size={24} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#333",
                              marginBottom: "4px",
                            }}
                          >
                            {item.nama_produk}
                          </p>
                          <p style={{ fontSize: "10px", color: "#6c757d" }}>
                            {item.nama_toko}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "12px",
                        color: "#6c757d",
                        padding: "16px 8px",
                      }}
                    >
                      {formatCurrency(Number(item.harga_aktif))}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6c757d",
                        padding: "16px 8px",
                      }}
                    >
                      {item.qty}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#333",
                        padding: "16px 8px",
                      }}
                    >
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Timeline */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #55B4E5",
            }}
          >
            <Clock size={20} style={{ color: "#55B4E5" }} />
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
              Timeline Pesanan
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#28a745",
                  borderRadius: "50%",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  Waktu Pemesanan
                </p>
                <p style={{ fontSize: "11px", color: "#6c757d" }}>
                  {orderData.created_date} {orderData.created_time}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: orderData.tgl_pembayaran
                    ? "#28a745"
                    : "#dee2e6",
                  borderRadius: "50%",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  Waktu Pembayaran
                </p>
                <p style={{ fontSize: "11px", color: "#6c757d" }}>
                  {orderData.tgl_pembayaran && orderData.jam_pembayaran
                    ? `${orderData.tgl_pembayaran} ${orderData.jam_pembayaran}`
                    : "Menunggu pembayaran"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor:
                    orderData.details[0]?.date_time_pengiriman
                      ? "#28a745"
                      : "#dee2e6",
                  borderRadius: "50%",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  Waktu Pengiriman
                </p>
                <p style={{ fontSize: "11px", color: "#6c757d" }}>
                  {orderData.details[0]?.date_time_pengiriman ||
                    "Belum dikirim"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor:
                    orderData.details[0]?.date_time_pesanan_diterima
                      ? "#28a745"
                      : "#dee2e6",
                  borderRadius: "50%",
                  marginTop: "4px",
                  flexShrink: 0,
                }}
              ></div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  Pesanan Selesai
                </p>
                <p style={{ fontSize: "11px", color: "#6c757d" }}>
                  {orderData.details[0]?.date_time_pesanan_diterima ||
                    "Belum selesai"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;