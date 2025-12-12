"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  User,
  Clock,
  FileText,
  Truck,
  CreditCard,
  Loader2,
  ChevronLeft,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Star,
  Trash2,
  MessageCircle,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import {
  getTransactionDetail,
  processPayment,
  cancelOrder,
  trackShipment,
  getComplainDetail,
  deleteComplain,
  deleteRating,
} from "@/utils/checkoutActions";
import { formatCurrency } from "@/utils/checkoutService";
import type { TransactionData } from "@/utils/checkoutService";
import Swal from "sweetalert2";
import { useOrderNotificationStore } from "@/store/orderNotificationStore";

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const idData = params.orderId as string;

  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderData, setOrderData] = useState<TransactionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [resiNumber, setResiNumber] = useState("");
  const [courierType, setCourierType] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loadingTracking, setLoadingTracking] = useState(false);
  const [complainData, setComplainData] = useState<any[]>([]);
  const [loadingComplain, setLoadingComplain] = useState(false);
  const [showComplainSection, setShowComplainSection] = useState(false);

  const markOrderAsPaid = useOrderNotificationStore(
    (state) => state.markOrderAsPaid,
  );
  const markOrderAsCancelled = useOrderNotificationStore(
    (state) => state.markOrderAsCancelled,
  );

  useEffect(() => {
    if (idData) {
      fetchOrderDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idData]);

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
      const response = await getTransactionDetail(idData);

      if (response.success && response.data) {
        setOrderData(response.data);

        // Fetch complain data after order data is loaded
        setTimeout(() => {
          fetchComplainData();
        }, 500);
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
      setProcessingPayment(true);

      const paymentResponse = await processPayment({
        order_id: orderData.order_id,
        total_tagihan: parseFloat(orderData.total_tagihan.toString()),
      });

      if (
        paymentResponse.success &&
        paymentResponse.provider_payload?.response?.payment?.url
      ) {
        const paymentUrl =
          paymentResponse.provider_payload.response.payment.url;
        markOrderAsPaid(idData);

        await Swal.fire({
          icon: "success",
          title: "Mengarahkan ke Pembayaran",
          text: "Anda akan diarahkan ke halaman pembayaran",
          confirmButtonColor: "#55B4E5",
          timer: 2000,
          showConfirmButton: false,
        });

        window.location.href = paymentUrl;
      } else {
        throw new Error(
          paymentResponse.message || "Gagal membuat link pembayaran",
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses pembayaran";

      await Swal.fire({
        icon: "error",
        title: "Pembayaran Gagal",
        text: errorMessage,
        confirmButtonColor: "#55B4E5",
      });
    } finally {
      setProcessingPayment(false);
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
      try {
        // Call cancel order API
        const response = await cancelOrder(Number(idData));

        if (response.success) {
          // Remove from notifications
          markOrderAsCancelled(idData);

          await Swal.fire({
            icon: "success",
            title: "Pesanan Dibatalkan",
            text: response.message || "Pesanan Anda telah dibatalkan",
            confirmButtonColor: "#55B4E5",
          });

          router.push("/clientArea/orders");
        } else {
          await Swal.fire({
            icon: "error",
            title: "Gagal Membatalkan Pesanan",
            text:
              response.message || "Terjadi kesalahan saat membatalkan pesanan",
            confirmButtonColor: "#55B4E5",
          });
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        await Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: "Gagal membatalkan pesanan. Silakan coba lagi.",
          confirmButtonColor: "#55B4E5",
        });
      }
    }
  };

  const handleTrackShipment = async () => {
    if (!resiNumber.trim() || !courierType.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Silakan masukkan nomor resi dan pilih kurir",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    try {
      setLoadingTracking(true);
      const response = await trackShipment(
        resiNumber,
        courierType.toLowerCase(),
      );

      if (response.success && response.data) {
        setTrackingData(response.data);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data tracking berhasil dimuat",
          confirmButtonColor: "#55B4E5",
          timer: 2000,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: response.message || "Gagal melacak pengiriman",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error tracking shipment:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat melacak pengiriman",
        confirmButtonColor: "#55B4E5",
      });
    } finally {
      setLoadingTracking(false);
    }
  };

  const fetchComplainData = async () => {
    if (!orderData?.details || orderData.details.length === 0) {
      console.log("No order details to fetch complains for");
      return;
    }

    try {
      setLoadingComplain(true);
      console.log("=== FETCHING COMPLAIN DATA ===");
      console.log("Order ID:", orderData.id_data);
      console.log(
        "Products:",
        orderData.details.map((d) => d.id_produk),
      );

      const complainPromises = orderData.details.map((detail) =>
        getComplainDetail(orderData.id_data, detail.id_produk),
      );

      const results = await Promise.all(complainPromises);
      console.log("Complain results:", results);

      const allComplains: any[] = [];
      results.forEach((result, index) => {
        console.log(`Result ${index}:`, result);
        if (result.success && result.data) {
          const complainData = result.data.history_komplain || [];
          console.log(`Complain data for result ${index}:`, complainData);

          complainData.forEach((complain: any) => {
            console.log("Processing complain:", complain);
            allComplains.push({
              id_komplain: complain.id,
              judul_komplain: complain.judul,
              jenis_komplain: complain.jenis_komplain || "-",
              komplain: complain.komplain || complain.deskripsi || "-",
              solusi: complain.solusi,
              status: complain.status,
              status_text: complain.status_text || "-",
              gambar1: complain.gambar?.[0] || null,
              gambar2: complain.gambar?.[1] || null,
              gambar3: complain.gambar?.[2] || null,
              video: complain.video,
              tanggal: complain.tanggal,
            });
          });
        }
      });

      console.log("Total complains found:", allComplains.length);
      console.log("Final complain data:", allComplains);

      setComplainData(allComplains);
      setShowComplainSection(allComplains.length > 0);
    } catch (error) {
      console.error("Error fetching complain data:", error);
    } finally {
      setLoadingComplain(false);
    }
  };

  const handleDeleteComplain = async (complainId: number) => {
    const Swal = (await import("sweetalert2")).default;

    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Komplain?",
      text: "Apakah Anda yakin ingin menghapus komplain ini?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteComplain(complainId);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Komplain berhasil dihapus",
          confirmButtonColor: "#55B4E5",
          timer: 2000,
        });
        fetchComplainData();
        fetchOrderDetail();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: response.message || "Gagal menghapus komplain",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error deleting complain:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menghapus komplain",
        confirmButtonColor: "#55B4E5",
      });
    }
  };

  const handleDeleteRating = async (idProduk: number) => {
    const Swal = (await import("sweetalert2")).default;

    const result = await Swal.fire({
      icon: "warning",
      title: "Hapus Review?",
      text: "Apakah Anda yakin ingin menghapus review ini?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteRating(orderData!.id_data, idProduk);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Review berhasil dihapus",
          confirmButtonColor: "#55B4E5",
          timer: 2000,
        });
        fetchOrderDetail();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: response.message || "Gagal menghapus review",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menghapus review",
        confirmButtonColor: "#55B4E5",
      });
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

  const isPaymentExpired = () => {
    if (!orderData?.batas_pembayaran) return false;
    const now = new Date().getTime();
    const deadline = new Date(orderData.batas_pembayaran).getTime();
    return now > deadline;
  };

  const paymentExpired = isPaymentExpired();

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
        <>
          {paymentExpired ? (
            <div
              style={{
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                padding: "16px 0",
                boxShadow: "0 4px 6px rgba(220, 53, 69, 0.3)",
              }}
            >
              <div
                style={{
                  maxWidth: "1400px",
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "0 20px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <Clock size={24} style={{ color: "white" }} />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "700",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  >
                    Waktu Pembayaran Habis
                  </span>
                </div>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                    margin: 0,
                    textAlign: "center",
                  }}
                >
                  Mohon maaf, batas waktu pembayaran untuk pesanan ini telah
                  berakhir.
                </p>
              </div>
            </div>
          ) : (
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
        </>
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
              padding: "20px",
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
              padding: "20px",
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
              padding: "20px",
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
            gridTemplateColumns: "1fr 400px",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          {/* Main Content - Left Side */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Top Row - Customer & Shipping Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {/* Customer Info */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  height: "fit-content",
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
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Informasi Pelanggan
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
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
                  height: "fit-content",
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
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Informasi Pengiriman
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
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
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
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
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: "500",
                          color: "#333",
                        }}
                      >
                        {orderData.tgl_pengiriman}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row - Order Items & Timeline */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                alignItems: "stretch",
              }}
            >
              {/* Order Items */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "20px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
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
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Item Pesanan
                  </h2>
                </div>

                <div style={{ overflowX: "auto", flex: 1 }}>
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
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
                                  <Package
                                    style={{ color: "#6c757d" }}
                                    size={24}
                                  />
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
                                <p
                                  style={{ fontSize: "10px", color: "#6c757d" }}
                                >
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
                  height: "100%",
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
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Timeline Pesanan
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
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
                        backgroundColor: orderData.details[0]
                          ?.date_time_pengiriman
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
                        backgroundColor: orderData.details[0]
                          ?.date_time_pesanan_diterima
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

              {/* Tracking Section */}
              {orderData.details[0]?.date_time_pengiriman && (
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
                    <Truck size={20} style={{ color: "#55B4E5" }} />
                    <h2
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      Lacak Pengiriman
                    </h2>
                  </div>

                  {/* Input Resi */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Nomor Resi
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nomor resi"
                      value={resiNumber}
                      onChange={(e) => setResiNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    />
                  </div>

                  {/* Select Kurir */}
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Pilih Kurir
                    </label>
                    <select
                      value={courierType}
                      onChange={(e) => setCourierType(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontFamily: "Poppins, sans-serif",
                        backgroundColor: "white",
                      }}
                    >
                      <option value="">Pilih Kurir</option>
                      <option value="jne">JNE</option>
                      <option value="jnt">J&T Express</option>
                      <option value="sicepat">SiCepat</option>
                      <option value="tiki">TIKI</option>
                      <option value="pos">POS Indonesia</option>
                      <option value="anteraja">AnterAja</option>
                      <option value="ninja">Ninja Express</option>
                    </select>
                  </div>

                  {/* Button Track */}
                  <button
                    onClick={handleTrackShipment}
                    disabled={
                      loadingTracking ||
                      !resiNumber.trim() ||
                      !courierType.trim()
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      backgroundColor:
                        loadingTracking ||
                        !resiNumber.trim() ||
                        !courierType.trim()
                          ? "#ccc"
                          : "#55B4E5",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor:
                        loadingTracking ||
                        !resiNumber.trim() ||
                        !courierType.trim()
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "600",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {loadingTracking ? (
                      <>
                        <Loader2
                          size={16}
                          style={{ animation: "spin 1s linear infinite" }}
                        />
                        Melacak...
                      </>
                    ) : (
                      <>
                        <MapPin size={16} />
                        Lacak Paket
                      </>
                    )}
                  </button>

                  {/* Tracking Result Stepper */}
                  {trackingData && (
                    <div
                      style={{
                        marginTop: "24px",
                        paddingTop: "24px",
                        borderTop: "1px solid #dee2e6",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333",
                          marginBottom: "16px",
                        }}
                      >
                        Status Pengiriman
                      </h3>

                      {/* Summary Info */}
                      <div
                        style={{
                          backgroundColor: "#f8f9fa",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        <div style={{ marginBottom: "8px" }}>
                          <span style={{ fontSize: "11px", color: "#6c757d" }}>
                            Status:{" "}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#55B4E5",
                            }}
                          >
                            {trackingData.summary?.status || "Dalam Pengiriman"}
                          </span>
                        </div>
                        {trackingData.summary?.waybill_number && (
                          <div style={{ marginBottom: "8px" }}>
                            <span
                              style={{ fontSize: "11px", color: "#6c757d" }}
                            >
                              No. Resi:{" "}
                            </span>
                            <span
                              style={{ fontSize: "11px", fontWeight: "600" }}
                            >
                              {trackingData.summary.waybill_number}
                            </span>
                          </div>
                        )}
                        {trackingData.summary?.courier_name && (
                          <div>
                            <span
                              style={{ fontSize: "11px", color: "#6c757d" }}
                            >
                              Kurir:{" "}
                            </span>
                            <span
                              style={{ fontSize: "11px", fontWeight: "600" }}
                            >
                              {trackingData.summary.courier_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tracking History Stepper */}
                      {trackingData.history &&
                        trackingData.history.length > 0 && (
                          <div style={{ position: "relative" }}>
                            {trackingData.history.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginBottom:
                                      index === trackingData.history.length - 1
                                        ? "0"
                                        : "16px",
                                    position: "relative",
                                  }}
                                >
                                  {/* Timeline Line */}
                                  {index !==
                                    trackingData.history.length - 1 && (
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: "9px",
                                        top: "24px",
                                        bottom: "-16px",
                                        width: "2px",
                                        backgroundColor: "#dee2e6",
                                      }}
                                    />
                                  )}

                                  {/* Status Dot */}
                                  <div
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: "50%",
                                      backgroundColor:
                                        index === 0 ? "#28a745" : "#55B4E5",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      flexShrink: 0,
                                      zIndex: 1,
                                    }}
                                  >
                                    <CheckCircle
                                      size={12}
                                      style={{ color: "white" }}
                                    />
                                  </div>

                                  {/* Content */}
                                  <div
                                    style={{ flex: 1, paddingBottom: "4px" }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {item.note ||
                                        item.description ||
                                        "Update Status"}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "11px",
                                        color: "#6c757d",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      {item.date || item.updated_at || "-"}
                                    </p>
                                    {item.location && (
                                      <p
                                        style={{
                                          fontSize: "10px",
                                          color: "#999",
                                        }}
                                      >
                                        📍 {item.location}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {/* No History */}
                      {(!trackingData.history ||
                        trackingData.history.length === 0) && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#6c757d",
                          }}
                        >
                          <Package
                            size={32}
                            style={{ opacity: 0.3, margin: "0 auto 8px" }}
                          />
                          <p style={{ fontSize: "12px" }}>
                            Belum ada riwayat pengiriman
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Complain & Review Section */}
              {orderData &&
                (showComplainSection ||
                  orderData.id_status === 9 ||
                  orderData.id_status === 7) && (
                  <div
                    style={{
                      backgroundColor: "white",
                      borderRadius: "10px",
                      padding: "20px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      marginTop: "20px",
                    }}
                  >
                    {/* Complain Section */}
                    {complainData.length > 0 && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "16px",
                            paddingBottom: "12px",
                            borderBottom: "2px solid #FFA500",
                          }}
                        >
                          <AlertTriangle
                            size={20}
                            style={{ color: "#FFA500" }}
                          />
                          <h2
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#333",
                            }}
                          >
                            Komplain Saya
                          </h2>
                        </div>

                        {loadingComplain ? (
                          <div style={{ textAlign: "center", padding: "20px" }}>
                            <Loader2
                              size={24}
                              style={{
                                animation: "spin 1s linear infinite",
                                color: "#55B4E5",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "16px",
                            }}
                          >
                            {complainData.map((complain, index) => (
                              <div
                                key={complain.id_komplain || index}
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "8px",
                                  padding: "16px",
                                  backgroundColor: "#fff9f0",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "start",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <div>
                                    <p
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      {complain.judul_komplain || "Komplain"}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "11px",
                                        color: "#6c757d",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      Status:{" "}
                                      {complain.status_text ||
                                        complain.status ||
                                        "-"}
                                    </p>
                                    <p
                                      style={{
                                        fontSize: "11px",
                                        color: "#6c757d",
                                      }}
                                    >
                                      Solusi: {complain.solusi || "-"}
                                    </p>
                                    {complain.tanggal && (
                                      <p
                                        style={{
                                          fontSize: "10px",
                                          color: "#999",
                                        }}
                                      >
                                        {new Date(
                                          complain.tanggal,
                                        ).toLocaleDateString("id-ID")}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteComplain(complain.id_komplain)
                                    }
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                    }}
                                  >
                                    <Trash2 size={12} />
                                    Hapus
                                  </button>
                                </div>
                                <div
                                  style={{
                                    padding: "12px",
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      color: "#333",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {complain.komplain || "Tidak ada deskripsi"}
                                  </p>
                                </div>
                                {complain.gambar1 && (
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "8px",
                                      marginTop: "8px",
                                    }}
                                  >
                                    {[
                                      complain.gambar1,
                                      complain.gambar2,
                                      complain.gambar3,
                                    ]
                                      .filter(Boolean)
                                      .map((img, idx) => (
                                        <img
                                          key={idx}
                                          src={img}
                                          alt={`Bukti ${idx + 1}`}
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            borderRadius: "6px",
                                            border: "1px solid #dee2e6",
                                          }}
                                        />
                                      ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    {/* Review Section */}
                    {orderData.id_status === 9 && orderData.details && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "16px",
                            marginTop: complainData.length > 0 ? "24px" : "0",
                            paddingBottom: "12px",
                            paddingTop: complainData.length > 0 ? "24px" : "0",
                            borderTop:
                              complainData.length > 0
                                ? "1px solid #e9ecef"
                                : "none",
                            borderBottom: "2px solid #FBB338",
                          }}
                        >
                          <Star size={20} style={{ color: "#FBB338" }} />
                          <h2
                            style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#333",
                            }}
                          >
                            Review Saya
                          </h2>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                          }}
                        >
                          {orderData.details
                            .filter((detail: any) => {
                              console.log(
                                `Checking review for product ${detail.id_produk}:`,
                                {
                                  rating_saya: detail.rating_saya,
                                  ulasan_saya: detail.ulasan_saya,
                                  type: typeof detail.rating_saya,
                                },
                              );
                              // rating_saya bisa berupa number atau null
                              return (
                                detail.rating_saya !== null &&
                                detail.rating_saya !== undefined &&
                                detail.rating_saya > 0
                              );
                            })
                            .map((detail: any) => (
                              <div
                                key={detail.id_detail}
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "8px",
                                  padding: "16px",
                                  backgroundColor: "#fffbf0",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "start",
                                    marginBottom: "12px",
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <p
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#333",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      {detail.nama_produk}
                                    </p>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "4px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={14}
                                          style={{
                                            fill:
                                              i < detail.rating_saya
                                                ? "#FBB338"
                                                : "none",
                                            color:
                                              i < detail.rating_saya
                                                ? "#FBB338"
                                                : "#ccc",
                                          }}
                                        />
                                      ))}
                                    </div>
                                    {detail.ulasan_saya && (
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          color: "#666",
                                          lineHeight: "1.5",
                                        }}
                                      >
                                        {detail.ulasan_saya}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteRating(detail.id_produk)
                                    }
                                    style={{
                                      padding: "6px 12px",
                                      backgroundColor: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "4px",
                                      marginLeft: "12px",
                                    }}
                                  >
                                    <Trash2 size={12} />
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            ))}
                          {(() => {
                            const hasReviews = orderData.details.some(
                              (d: any) =>
                                d.rating_saya !== null &&
                                d.rating_saya !== undefined &&
                                d.rating_saya > 0,
                            );
                            console.log("Has reviews:", hasReviews);
                            console.log(
                              "All details:",
                              orderData.details.map((d) => ({
                                id: d.id_produk,
                                rating: d.rating_saya,
                              })),
                            );
                            if (!hasReviews) {
                              return (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    color: "#6c757d",
                                  }}
                                >
                                  <Star
                                    size={32}
                                    style={{
                                      opacity: 0.3,
                                      margin: "0 auto 8px",
                                    }}
                                  />
                                  <p style={{ fontSize: "12px" }}>
                                    Belum ada review
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </>
                    )}
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
              height: "fit-content",
              display: "flex",
              flexDirection: "column",
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
              <CreditCard size={20} style={{ color: "#55B4E5" }} />
              <h2
                style={{ fontSize: "15px", fontWeight: "600", color: "#333" }}
              >
                Ringkasan Pembayaran
              </h2>
            </div>

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
                    orderData.details.reduce(
                      (sum, item) => sum + item.total,
                      0,
                    ),
                  )}
                </span>
              </div>

              {orderData.diskon_voucher_toko > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Ongkir
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(Number(orderData.biaya_ongkir))}
                </span>
              </div>

              {orderData.biaya_asuransi > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={handlePayment}
                  disabled={processingPayment || paymentExpired}
                  style={{
                    width: "100%",
                    padding: "13px",
                    backgroundColor:
                      processingPayment || paymentExpired ? "#ccc" : "#55B4E5",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor:
                      processingPayment || paymentExpired
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: "600",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    opacity: paymentExpired ? 0.6 : 1,
                  }}
                >
                  {paymentExpired ? (
                    <>
                      <Clock size={16} />
                      Waktu Pembayaran Habis
                    </>
                  ) : processingPayment ? (
                    <>
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} />
                      Bayar Sekarang
                    </>
                  )}
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
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
