"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Tag,
  ChevronRight,
  MapPin,
  Truck,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  reviewCheckout,
  processCheckout,
  processPayment,
} from "@/utils/checkoutActions";
import { getCart } from "@/utils/cartActions";
import {
  formatCurrency,
  validateCheckoutData,
  groupItemsByStore,
  calculateItemTotal,
  type ShippingOption,
} from "@/utils/checkoutService";
import type { CartItem } from "@/utils/cartService";
import AddressSection from "./AddressSection";
import Swal from "sweetalert2";

interface AppliedVoucher {
  code: string;
  discount: number;
  type: "fixed" | "percentage";
}

interface OrderResult {
  order_id: string;
  total: number;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  ``;
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [shippingOptions, setShippingOptions] = useState<Record<number, any>>(
    {},
  );
  const [selectedShipping, setSelectedShipping] = useState<
    Record<number, ShippingOption>
  >({});
  const [addressForm, setAddressForm] = useState({
    nama_penerima: "",
    telp_penerima: "",
    alamat_lengkap: "",
  });
  const [customerNote, setCustomerNote] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("setiap saat");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(
    null,
  );
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const cartResponse = await getCart();
      if (cartResponse.success && cartResponse.data?.items) {
        const selected = cartResponse.data.items.filter(
          (item) => item.status_pilih,
        );

        if (selected.length === 0) {
          await Swal.fire({
            icon: "warning",
            title: "Keranjang Kosong",
            text: "Tidak ada item yang dipilih untuk checkout",
            confirmButtonColor: "#55B4E5",
          });
          router.push("/Cart");
          return;
        }


        setCartItems(cartResponse.data.items as CartItem[]);
        setSelectedItems(selected as CartItem[]);

        const groupedByStore = groupItemsByStore(selected as CartItem[]);
        setShippingOptions(groupedByStore);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data checkout",
        confirmButtonColor: "#55B4E5",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShippingSelect = (
    storeId: number,
    courier: string,
    service: string,
    cost: number,
  ) => {
    setSelectedShipping((prev) => ({
      ...prev,
      [storeId]: { storeId, courier, service, cost, etd: "2-3 hari" },
    }));
  };

  const handleApplyVoucher = () => {
    if (voucherCode.toUpperCase() === "DISKON10") {
      setAppliedVoucher({
        code: voucherCode,
        discount: 10000,
        type: "fixed",
      });
      Swal.fire({
        icon: "success",
        title: "Voucher Applied!",
        text: "Diskon Rp 10.000 berhasil diterapkan",
        confirmButtonColor: "#55B4E5",
        timer: 2000,
      });
      setVoucherCode("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Voucher",
        text: "Kode voucher tidak valid",
        confirmButtonColor: "#55B4E5",
      });
    }
  };

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((sum, item) => {
      return sum + calculateItemTotal(item);
    }, 0);

    const shippingCost = Object.values(selectedShipping).reduce(
      (sum, shipping) => {
        return sum + (shipping.cost || 0);
      },
      0,
    );

    const discount = appliedVoucher?.discount || 0;
    const tax = Math.round((subtotal - discount) * 0.1);
    const total = subtotal + shippingCost + tax - discount;

    return { subtotal, shippingCost, discount, tax, total };
  };

  const handleCheckout = async () => {
    const validation = validateCheckoutData({
      alamat_pengiriman: addressForm.alamat_lengkap,
      nama_penerima: addressForm.nama_penerima,
      telp_penerima: addressForm.telp_penerima,
      selectedShipping: Object.values(selectedShipping),
    });

    if (!validation.valid) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: validation.error,
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    const storeIds = Object.keys(shippingOptions);
    const hasAllShipping = storeIds.every(
      (storeId) => selectedShipping[Number(storeId)],
    );

    if (!hasAllShipping) {
      Swal.fire({
        icon: "warning",
        title: "Pengiriman Belum Dipilih",
        text: "Pilih metode pengiriman untuk semua toko",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    try {
      setProcessing(true);
      const checkoutData = {
        alamat_pengiriman: addressForm.alamat_lengkap,
        nama_penerima: addressForm.nama_penerima,
        telp_penerima: addressForm.telp_penerima,
        selectedShipping: Object.values(selectedShipping),
        waktu_pengiriman: deliveryTime,
        diskon_voucher_toko: appliedVoucher?.discount || 0,
        pesan_customer: customerNote || "",
      };

      console.log("Checkout data:", checkoutData);

      const checkoutResponse = await processCheckout(checkoutData);
      if (!checkoutResponse.success || !checkoutResponse.data) {
        throw new Error(checkoutResponse.message || "Checkout gagal");
      }

      const { order_ids, total_tagihan } = checkoutResponse.data;

      const paymentData = {
        order_ids: Array.isArray(order_ids) ? order_ids.join(",") : order_ids,
        total_tagihan,
      };

      const paymentResponse = await processPayment(paymentData);
      if (!paymentResponse.success) {
        throw new Error(paymentResponse.message || "Payment gagal");
      }

      setOrderResult({
        order_id: paymentData.order_ids,
        total: total_tagihan,
      });

      setStep(2);

      await Swal.fire({
        icon: "success",
        title: "Checkout Berhasil!",
        text: "Pesanan Anda sedang diproses",
        confirmButtonColor: "#55B4E5",
        timer: 2000,
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      Swal.fire({
        icon: "error",
        title: "Checkout Gagal",
        text: error.message || "Terjadi kesalahan saat checkout",
        confirmButtonColor: "#55B4E5",
      });
    } finally {
      setProcessing(false);
    }
  };

  const totals = calculateTotals();

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
          <p style={{ marginTop: "16px", color: "#6c757d" }}>
            Memuat checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {step === 2 ? (
          // Success State
          <div
            style={{
              height: "calc(100vh - 40px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "40px 60px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                maxWidth: "500px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  backgroundColor: "#55B4E5",
                  margin: "0 auto 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={40} style={{ color: "white" }} />
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                Pesanan Berhasil!
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6c757d",
                  marginBottom: "24px",
                }}
              >
                Terima kasih telah berbelanja di jaja.id
              </p>
              <div
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#6c757d",
                      marginBottom: "4px",
                    }}
                  >
                    Nomor Pesanan
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#FBB338",
                    }}
                  >
                    {orderResult?.order_id || "#JAJA-12345"}
                  </p>
                </div>
                <div
                  style={{ height: "1px", backgroundColor: "#dee2e6" }}
                ></div>
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#6c757d",
                      marginBottom: "4px",
                    }}
                  >
                    Total Pembayaran
                  </p>
                  <p
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#55B4E5",
                    }}
                  >
                    {formatCurrency(orderResult?.total || totals.total)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#55B4E5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 400px",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {/* Column 1 - Items & Address */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Order Items */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "18px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "14px",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #55B4E5",
                  }}
                >
                  <Package size={18} style={{ color: "#55B4E5" }} />
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Item Pesanan ({selectedItems.length})
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {(
                    Object.values(groupItemsByStore(selectedItems)) as {
                      id_toko: number;
                      nama_toko: string;
                      items: CartItem[];
                    }[]
                  ).map((store) => (
                    <div key={store.id_toko} style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "#6c757d",
                          marginBottom: "8px",
                          paddingLeft: "8px",
                        }}
                      >
                        🏪 {store.nama_toko}
                      </div>
                      {store.items.map((item: CartItem) => (
                        <div
                          key={item.id_cart}
                          style={{
                            display: "flex",
                            gap: "10px",
                            padding: "10px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            alignItems: "center",
                            marginBottom: "6px",
                          }}
                        >
                          <div
                            style={{
                              width: "45px",
                              height: "45px",
                              backgroundColor: "white",
                              borderRadius: "5px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={
                                (typeof item.produk === "object" &&
                                  item.produk?.foto_produk) ||
                                item.produk_cover ||
                                "https://via.placeholder.com/45"
                              }
                              alt={
                                (typeof item.produk === "object" &&
                                  item.produk?.nama_produk) ||
                                ""
                              }
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                              style={{
                                fontSize: "11px",
                                fontWeight: "500",
                                marginBottom: "2px",
                                color: "#333",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {(typeof item.produk === "object" &&
                                item.produk?.nama_produk) ||
                                ""}
                            </h3>
                            <div style={{ fontSize: "9px", color: "#6c757d" }}>
                              {item.model_variasi && `${item.model_variasi} • `}
                              Qty: {item.qty}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#55B4E5",
                              flexShrink: 0,
                            }}
                          >
                            {formatCurrency(calculateItemTotal(item))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <AddressSection
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                customerNote={customerNote}
                setCustomerNote={setCustomerNote}
              />
            </div>

            {/* Column 2 - Shipping Options */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {(
                Object.values(groupItemsByStore(selectedItems)) as {
                  id_toko: number;
                  nama_toko: string;
                  items: CartItem[];
                }[]
              ).map((store) => (
                <div
                  key={store.id_toko}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "18px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                      paddingBottom: "10px",
                      borderBottom: "2px solid #55B4E5",
                    }}
                  >
                    <Truck size={18} style={{ color: "#55B4E5" }} />
                    <h2
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      Pengiriman - {store.nama_toko}
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {["jne", "jnt", "sicepat"].map((courier) => (
                      <label
                        key={courier}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px",
                          border:
                            selectedShipping[store.id_toko]?.courier === courier
                              ? "2px solid #55B4E5"
                              : "1px solid #dee2e6",
                          borderRadius: "6px",
                          cursor: "pointer",
                          backgroundColor:
                            selectedShipping[store.id_toko]?.courier === courier
                              ? "#f0f9ff"
                              : "transparent",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <input
                            type="radio"
                            name={`shipping-${store.id_toko}`}
                            checked={
                              selectedShipping[store.id_toko]?.courier ===
                              courier
                            }
                            onChange={() =>
                              handleShippingSelect(
                                store.id_toko,
                                courier,
                                "REG",
                                15000,
                              )
                            }
                            style={{ accentColor: "#55B4E5" }}
                          />
                          <div>
                            <div
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                              }}
                            >
                              {courier}
                            </div>
                            <div style={{ fontSize: "9px", color: "#6c757d" }}>
                              REG - 2-3 hari
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#55B4E5",
                          }}
                        >
                          {formatCurrency(15000)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Voucher Section */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "18px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    paddingBottom: "10px",
                    borderBottom: "2px solid #FBB338",
                  }}
                >
                  <Tag size={18} style={{ color: "#FBB338" }} />
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Voucher
                  </h2>
                </div>

                {appliedVoucher ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px",
                      backgroundColor: "#FBB338",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "white",
                      }}
                    >
                      <Check size={14} />
                      <span style={{ fontSize: "11px", fontWeight: "600" }}>
                        {appliedVoucher.code}
                      </span>
                    </div>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        padding: "2px",
                        display: "flex",
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input
                      type="text"
                      placeholder="Kode voucher (coba: DISKON10)"
                      value={voucherCode}
                      onChange={(e) =>
                        setVoucherCode(e.target.value.toUpperCase())
                      }
                      style={{
                        flex: 1,
                        padding: "8px 10px",
                        border: "1px solid #dee2e6",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    />
                    <button
                      onClick={handleApplyVoucher}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#FBB338",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "11px",
                      }}
                    >
                      Pakai
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Column 3 - Order Summary */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                position: "sticky",
                top: "20px",
                alignSelf: "start",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#333",
                  borderBottom: "3px solid #55B4E5",
                  paddingBottom: "10px",
                }}
              >
                Ringkasan Pesanan
              </h2>

              <div
                style={{
                  marginBottom: "14px",
                  padding: "12px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "11px", color: "#6c757d" }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600" }}>
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontSize: "11px", color: "#6c757d" }}>
                      Diskon
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#FBB338",
                      }}
                    >
                      -{formatCurrency(totals.discount)}
                    </span>
                  </div>
                )}

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "11px", color: "#6c757d" }}>
                    Ongkir
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600" }}>
                    {formatCurrency(totals.shippingCost)}
                  </span>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "11px", color: "#6c757d" }}>
                    Pajak (10%)
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: "600" }}>
                    {formatCurrency(totals.tax)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  padding: "14px 0",
                  borderTop: "2px solid #e9ecef",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  Total
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#FBB338",
                  }}
                >
                  {formatCurrency(totals.total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: processing ? "#ccc" : "#55B4E5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: processing ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {processing ? (
                  <>
                    <Loader2
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Memproses...
                  </>
                ) : (
                  <>
                    Bayar Sekarang
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

              <div
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #e9ecef",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#6c757d",
                    marginBottom: "8px",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  METODE PEMBAYARAN
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "5px 7px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    💳 Card
                  </div>
                  <div
                    style={{
                      padding: "5px 7px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    GoPay
                  </div>
                  <div
                    style={{
                      padding: "5px 7px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    OVO
                  </div>
                  <div
                    style={{
                      padding: "5px 7px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    Dana
                  </div>
                  <div
                    style={{
                      padding: "5px 7px",
                      border: "1px solid #dee2e6",
                      borderRadius: "4px",
                      fontSize: "9px",
                      color: "#6c757d",
                      fontWeight: "500",
                    }}
                  >
                    ShopePay
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
