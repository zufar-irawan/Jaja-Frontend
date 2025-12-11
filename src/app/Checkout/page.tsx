"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Package, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { reviewCheckout, processCheckout } from "@/utils/checkoutActions";
import { getCart } from "@/utils/cartActions";
import {
  formatCurrency,
  validateCheckoutData,
  type ShippingOption,
  type ReviewCheckoutResponse,
} from "@/utils/checkoutService";

import AddressSection from "./AddressSection";
import VoucherSection from "./VoucherSection";
import Swal from "sweetalert2";
import { useOrderNotificationStore } from "@/store/orderNotificationStore";

interface AppliedVoucher {
  code: string;
  discount: number;
  type: "store" | "jaja";
  message?: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewCheckoutResponse | null>(
    null,
  );
  const [selectedShipping, setSelectedShipping] = useState<
    Record<number, ShippingOption>
  >({});
  const [addressForm, setAddressForm] = useState({
    id_alamat: 0,
    nama_penerima: "",
    telp_penerima: "",
    alamat_lengkap: "",
  });
  const [customerNote, setCustomerNote] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("normal");
  const [voucherCodeToko, setVoucherCodeToko] = useState("");
  const [voucherCodeJaja, setVoucherCodeJaja] = useState("");
  const [appliedVoucherToko, setAppliedVoucherToko] =
    useState<AppliedVoucher | null>(null);
  const [appliedVoucherJaja, setAppliedVoucherJaja] =
    useState<AppliedVoucher | null>(null);

  const [productNames, setProductNames] = useState<Record<number, string>>({});

  const addPendingOrder = useOrderNotificationStore(
    (state) => state.addPendingOrder,
  );

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addressForm.id_alamat > 0) {
      fetchReviewCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressForm.id_alamat]);

  useEffect(() => {
    if (addressForm.id_alamat > 0 && Object.keys(selectedShipping).length > 0) {
      fetchReviewCheckout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShipping, appliedVoucherToko, appliedVoucherJaja]);

  const fetchReviewCheckout = async () => {
    if (addressForm.id_alamat === 0) return;

    try {
      console.log("=== FETCHING REVIEW CHECKOUT ===");
      console.log("Address ID:", addressForm.id_alamat);

      const selectedShippingArray = Object.entries(selectedShipping).map(
        ([storeId, shipping]) => ({
          storeId: parseInt(storeId),
          service: shipping.service,
        }),
      );

      const reviewResponse = await reviewCheckout({
        id_alamat: addressForm.id_alamat,
        shippingType: "jne",
        is_gift: false,
        isCoin: false,
        kode_voucher_toko: appliedVoucherToko?.code,
        kode_voucher_jaja: appliedVoucherJaja?.code,
        selectedShipping:
          selectedShippingArray.length > 0 ? selectedShippingArray : undefined,
      });

      console.log("Review checkout response:", reviewResponse);

      if (reviewResponse.success && reviewResponse.data) {
        // Deduplicate products in cart to prevent duplicate rendering
        const deduplicatedData = {
          ...reviewResponse.data,
          cart: reviewResponse.data.cart?.map((storeCart) => {
            // Track seen cartIds to remove duplicates
            const seenCartIds = new Set<number>();
            const uniqueProducts = storeCart.products.filter((product) => {
              if (seenCartIds.has(product.cartId)) {
                console.warn(
                  `Duplicate product found with cartId: ${product.cartId}`,
                );
                return false;
              }
              seenCartIds.add(product.cartId);
              return true;
            });

            return {
              ...storeCart,
              products: uniqueProducts,
            };
          }),
        };

        setReviewData({ success: true, data: deduplicatedData });
        console.log("Review data stored successfully with deduplication");
        console.log(
          "Unique products per store:",
          deduplicatedData.cart?.map((sc) => ({
            storeId: sc.store.id,
            productCount: sc.products.length,
          })),
        );
      } else {
        console.error("Review checkout failed:", reviewResponse.message);
        Swal.fire({
          icon: "warning",
          title: "Gagal Memuat Opsi Pengiriman",
          text: reviewResponse.message || "Tidak dapat memuat opsi pengiriman",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error in review checkout:", error);
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const cartResponse = await getCart();

      if (cartResponse.success && cartResponse.data?.items) {
        const selected = cartResponse.data.items.filter(
          (item) => item.status_pilih,
        );

        console.log("Selected items:", selected);
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

        const nameMapping: Record<number, string> = {};
        selected.forEach((item) => {
          console.log("Processing item:", {
            id_produk: item.id_produk,
            produk: item.produk,
            nama:
              typeof item.produk === "object" ? item.produk?.nama_produk : null,
          });

          if (typeof item.produk === "object" && item.produk?.nama_produk) {
            nameMapping[item.id_produk] = item.produk.nama_produk;
          }
        });

        console.log("=== PRODUCT NAME MAPPING ===");
        console.log(nameMapping);
        setProductNames(nameMapping);
      }
    } catch (error) {
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
    etd: string,
  ) => {
    const currentSelection = selectedShipping[storeId];
    if (
      currentSelection?.courier === courier.toLowerCase() &&
      currentSelection?.service === service.toUpperCase()
    ) {
      handleShippingUnselect(storeId);
      return;
    }
    console.log("Selecting shipping:", {
      storeId,
      courier,
      service,
      cost,
      etd,
    });
    setSelectedShipping((prev) => ({
      ...prev,
      [storeId]: {
        storeId,
        courier: courier.toLowerCase(),
        service: service.toUpperCase(),
        cost,
        etd,
      },
    }));
  };

  const handleShippingUnselect = (storeId: number) => {
    console.log("Unselecting shipping for store:", storeId);
    setSelectedShipping((prev) => {
      const newState = { ...prev };
      delete newState[storeId];
      return newState;
    });
  };

  const handleApplyVoucherToko = async () => {
    if (!voucherCodeToko.trim()) return;

    setAppliedVoucherToko({
      code: voucherCodeToko,
      discount: 0,
      type: "store",
    });

    // Trigger review checkout to validate voucher
    await fetchReviewCheckout();
  };

  const handleRemoveVoucherToko = () => {
    setAppliedVoucherToko(null);
    setVoucherCodeToko("");
    fetchReviewCheckout();
  };

  const handleApplyVoucherJaja = async () => {
    if (!voucherCodeJaja.trim()) return;

    setAppliedVoucherJaja({
      code: voucherCodeJaja,
      discount: 0,
      type: "jaja",
    });

    // Trigger review checkout to validate voucher
    await fetchReviewCheckout();
  };

  const handleRemoveVoucherJaja = () => {
    setAppliedVoucherJaja(null);
    setVoucherCodeJaja("");
    fetchReviewCheckout();
  };

  const calculateTotals = () => {
    if (reviewData?.data) {
      const subtotal = reviewData.data.subTotal || 0;
      const shippingCost = reviewData.data.shippingCost || 0;
      const fee = reviewData.data.fee || 0;

      // Get discount from cart voucher data
      const voucherDiscountToko =
        reviewData.data.cart?.[0]?.voucherDiscountToko || 0;
      const voucherDiscountJaja =
        reviewData.data.cart?.[0]?.voucherDiscountJaja || 0;
      const voucherDiscountOngkir =
        reviewData.data.cart?.[0]?.voucherDiscountOngkir || 0;
      const totalDiscount =
        voucherDiscountToko + voucherDiscountJaja + voucherDiscountOngkir;

      const total = reviewData.data.total || 0;

      return {
        subtotal,
        shippingCost,
        discount: totalDiscount,
        tax: 0,
        fee,
        total,
      };
    }

    return {
      subtotal: 0,
      shippingCost: 0,
      discount: 0,
      tax: 0,
      fee: 0,
      total: 0,
    };
  };

  const handleCheckout = async () => {
    console.log("=== STARTING CHECKOUT ===");
    console.log("Address Form:", addressForm);
    console.log("Selected Shipping:", selectedShipping);

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

    if (!reviewData || !reviewData.data?.cart) {
      Swal.fire({
        icon: "warning",
        title: "Data Tidak Lengkap",
        text: "Silakan pilih alamat pengiriman terlebih dahulu",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    const storeIds = reviewData.data.cart.map(
      (c: { store: { id: number } }) => c.store.id,
    );
    const hasAllShipping = storeIds.every(
      (storeId: number) => selectedShipping[storeId],
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

      let formattedPhone = addressForm.telp_penerima;
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+62" + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith("+62")) {
        formattedPhone = "+62" + formattedPhone;
      }

      console.log("=== PREPARING CHECKOUT DATA ===");

      const formattedShipping = Object.values(selectedShipping).map((ship) => ({
        storeId: Number(ship.storeId),
        service: ship.service.toUpperCase(),
        courier: ship.courier.toLowerCase(),
      }));

      console.log("Formatted shipping:", formattedShipping);

      const checkoutData = {
        alamat_pengiriman: addressForm.alamat_lengkap,
        nama_penerima: addressForm.nama_penerima,
        telp_penerima: formattedPhone,
        selectedShipping: formattedShipping,
        waktu_pengiriman: deliveryTime,
        diskon_voucher_toko:
          reviewData?.data?.cart?.[0]?.voucherDiscountToko || 0,
        pesan_customer: customerNote || "",
        ...(appliedVoucherToko?.code && {
          kode_voucher_toko: appliedVoucherToko.code,
        }),
        ...(appliedVoucherJaja?.code && {
          kode_voucher_jaja: appliedVoucherJaja.code,
        }),
      };

      console.log("=== FINAL CHECKOUT DATA ===");
      console.log(JSON.stringify(checkoutData, null, 2));

      const checkoutResponse = await processCheckout(checkoutData);

      console.log("Checkout response:", checkoutResponse);

      if (!checkoutResponse.success) {
        throw new Error(checkoutResponse.message || "Checkout gagal");
      }

      if (!checkoutResponse.data || !checkoutResponse.data.transaksi) {
        throw new Error("Data checkout tidak ditemukan");
      }

      const idData = checkoutResponse.data.transaksi.id_data;

      if (!idData) {
        throw new Error("ID transaksi tidak ditemukan dalam response");
      }

      const transaksi = checkoutResponse.data.transaksi;
      const products =
        reviewData?.data?.cart?.flatMap((storeCart) =>
          storeCart.products.map((product) => ({
            nama_produk:
              productNames[product.productId] || `Produk ${product.productId}`,
            qty: product.qty,
            harga: product.price || 0,
            gambar: product.image || "",
          })),
        ) || [];

      addPendingOrder({
        id_data: String(idData),
        order_number: transaksi.invoice || transaksi.order_id || String(idData),
        total: transaksi.total_tagihan || transaksi.total_pembayaran || 0,
        created_at:
          transaksi.created_date && transaksi.created_time
            ? `${transaksi.created_date} ${transaksi.created_time}`
            : new Date().toISOString(),
        batas_pembayaran: transaksi.batas_pembayaran,
        status: "pending",
        products: products,
      });

      await Swal.fire({
        icon: "success",
        title: "Checkout Berhasil!",
        text: "Pesanan Anda sedang diproses",
        confirmButtonColor: "#55B4E5",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push(`/Order/${idData}`);
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat checkout";
      Swal.fire({
        icon: "error",
        title: "Checkout Gagal",
        text: errorMessage,
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

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {/* Left Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Address Section */}
            <AddressSection
              addressForm={addressForm}
              setAddressForm={setAddressForm}
              customerNote={customerNote}
              setCustomerNote={setCustomerNote}
            />

            {/* Products by Store */}
            {reviewData?.data?.cart && reviewData.data.cart.length > 0 ? (
              reviewData.data.cart.map((storeCart) => (
                <div
                  key={storeCart.store.id}
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
                    <Package size={18} style={{ color: "#55B4E5" }} />
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      Produk dari Toko
                    </h3>
                  </div>

                  {/* Products List */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      marginBottom: "16px",
                    }}
                  >
                    {storeCart.products.map((product) => (
                      <div
                        key={`${storeCart.store.id}-product-${product.cartId}`}
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "10px",
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            backgroundColor: "#e9ecef",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={product.image || "/api/placeholder/60/60"}
                            alt={productNames[product.productId] || "Product"}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              marginBottom: "4px",
                              color: "#333",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {productNames[product.productId] ||
                              `Produk ${product.productId}`}
                          </p>
                          {product.variant && (
                            <p
                              style={{
                                fontSize: "10px",
                                color: "#6c757d",
                                marginBottom: "4px",
                              }}
                            >
                              {product.variant}
                            </p>
                          )}
                          <p style={{ fontSize: "10px", color: "#6c757d" }}>
                            {product.qty} x {product.priceCurrencyFormat}
                          </p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <p
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: "#55B4E5",
                            }}
                          >
                            {product.subTotalCurrencyFormat}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Options */}
                  <div>
                    <h4
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "10px",
                      }}
                    >
                      Pilih Pengiriman
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {storeCart.shippingOptions &&
                      storeCart.shippingOptions.length > 0 ? (
                        storeCart.shippingOptions?.map(
                          (option: {
                            courier: string;
                            service: string;
                            description: string;
                            price: number;
                            priceCurrencyFormat: string;
                            etd: string;
                          }) => (
                            <div
                              key={`${storeCart.store.id}-shipping-${option.courier}-${option.service}`}
                              onClick={() =>
                                handleShippingSelect(
                                  storeCart.store.id,
                                  option.courier,
                                  option.service,
                                  option.price,
                                  option.etd,
                                )
                              }
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "12px",
                                border:
                                  selectedShipping[storeCart.store.id]
                                    ?.service === option.service.toUpperCase()
                                    ? "2px solid #55B4E5"
                                    : "1px solid #dee2e6",
                                borderRadius: "6px",
                                cursor: "pointer",
                                backgroundColor:
                                  selectedShipping[storeCart.store.id]
                                    ?.service === option.service.toUpperCase()
                                    ? "#f0f9ff"
                                    : "white",
                                transition: "all 0.2s",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  flex: 1,
                                }}
                              >
                                <input
                                  type="radio"
                                  checked={
                                    selectedShipping[storeCart.store.id]
                                      ?.service === option.service.toUpperCase()
                                  }
                                  onChange={() => {}}
                                  style={{ accentColor: "#55B4E5" }}
                                />
                                <div style={{ flex: 1 }}>
                                  <p
                                    style={{
                                      fontSize: "11px",
                                      fontWeight: "600",
                                      color: "#333",
                                      textTransform: "uppercase",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {option.courier} - {option.service}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "10px",
                                      color: "#6c757d",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {option.description}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: "10px",
                                      color: "#6c757d",
                                    }}
                                  >
                                    Estimasi: {option.etd}
                                  </p>
                                </div>
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#55B4E5",
                                  textAlign: "right",
                                  marginLeft: "10px",
                                }}
                              >
                                {option.priceCurrencyFormat}
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <p
                          style={{
                            padding: "12px",
                            textAlign: "center",
                            color: "#6c757d",
                            fontSize: "11px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                          }}
                        >
                          Tidak ada opsi pengiriman tersedia
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "40px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#6c757d", fontSize: "12px" }}>
                  Pilih alamat untuk melihat produk dan opsi pengiriman
                </p>
              </div>
            )}

            {/* Delivery Time Options */}
            {reviewData?.data?.deliveryTimeOptions &&
              reviewData.data.deliveryTimeOptions.length > 0 && (
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "18px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: "#333",
                    }}
                  >
                    Waktu Pengiriman
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    {reviewData.data.deliveryTimeOptions.map(
                      (option: { value: string; label: string }) => (
                        <button
                          key={option.value}
                          onClick={() => setDeliveryTime(option.value)}
                          style={{
                            padding: "10px 16px",
                            border:
                              deliveryTime === option.value
                                ? "2px solid #55B4E5"
                                : "1px solid #dee2e6",
                            borderRadius: "6px",
                            fontSize: "11px",
                            color:
                              deliveryTime === option.value
                                ? "#55B4E5"
                                : "#333",
                            fontWeight:
                              deliveryTime === option.value ? "600" : "400",
                            backgroundColor:
                              deliveryTime === option.value
                                ? "#f0f9ff"
                                : "white",
                            cursor: "pointer",
                          }}
                        >
                          {option.label}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Right Column - Summary */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "18px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              position: "sticky",
              top: "20px",
              alignSelf: "start",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#333",
                borderBottom: "2px solid #55B4E5",
                paddingBottom: "10px",
              }}
            >
              Ringkasan Pesanan
            </h2>

            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Subtotal Produk
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Ongkos Kirim
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#55B4E5",
                  }}
                >
                  {formatCurrency(totals.shippingCost)}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Biaya Layanan
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(totals.fee)}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11px", color: "#6c757d" }}>
                  Pajak
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600" }}>
                  {formatCurrency(totals.tax)}
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
                      color: "#dc3545",
                    }}
                  >
                    -{formatCurrency(totals.discount)}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                padding: "12px 0",
                borderTop: "1px solid #dee2e6",
                borderBottom: "1px solid #dee2e6",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600" }}>Total</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#55B4E5",
                }}
              >
                {formatCurrency(totals.total)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || !reviewData}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: processing || !reviewData ? "#ccc" : "#55B4E5",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: processing || !reviewData ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
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
                  Lanjutkan Pembayaran
                  <ChevronRight size={16} />
                </>
              )}
            </button>

            {/* Voucher Section */}
            <VoucherSection
              voucherCodeToko={voucherCodeToko}
              setVoucherCodeToko={setVoucherCodeToko}
              voucherCodeJaja={voucherCodeJaja}
              setVoucherCodeJaja={setVoucherCodeJaja}
              appliedVoucherToko={appliedVoucherToko}
              appliedVoucherJaja={appliedVoucherJaja}
              onApplyVoucherToko={handleApplyVoucherToko}
              onRemoveVoucherToko={handleRemoveVoucherToko}
              onApplyVoucherJaja={handleApplyVoucherJaja}
              onRemoveVoucherJaja={handleRemoveVoucherJaja}
              voucherMessageToko={
                reviewData?.data?.cart?.[0]?.voucherMessageToko
              }
              voucherMessageJaja={
                reviewData?.data?.cart?.[0]?.voucherMessageJaja
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
