"use client";

import React, { useState, useEffect } from "react";
import { X, Tag, Gift } from "lucide-react";
import {
  getMyVouchers,
  getAvailableVouchers,
  claimVoucher,
} from "@/utils/voucherActions";
import type { VoucherData } from "@/utils/voucherService";
import Swal from "sweetalert2";

interface VoucherSectionProps {
  voucherCodeToko: string;
  setVoucherCodeToko: (code: string) => void;
  voucherCodeJaja: string;
  setVoucherCodeJaja: (code: string) => void;
  appliedVoucherToko: {
    code: string;
    discount: number;
    type: string;
    message?: string;
  } | null;
  appliedVoucherJaja: {
    code: string;
    discount: number;
    type: string;
    message?: string;
  } | null;
  onApplyVoucherToko: () => void;
  onRemoveVoucherToko: () => void;
  onApplyVoucherJaja: () => void;
  onRemoveVoucherJaja: () => void;
  voucherMessageToko?: string;
  voucherMessageJaja?: string;
  storeIdFromCart?: number; // ID toko dari cart items
  storeNameFromCart?: string; // Nama toko dari cart items
}

const VoucherSection: React.FC<VoucherSectionProps> = ({
  voucherCodeToko,
  setVoucherCodeToko,
  voucherCodeJaja,
  setVoucherCodeJaja,
  appliedVoucherToko,
  appliedVoucherJaja,
  onApplyVoucherToko,
  onRemoveVoucherToko,
  onApplyVoucherJaja,
  onRemoveVoucherJaja,
  voucherMessageToko,
  voucherMessageJaja,
  storeIdFromCart,
  storeNameFromCart,
}) => {
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [myVouchers, setMyVouchers] = useState<VoucherData[]>([]);
  const [availableVouchers, setAvailableVouchers] = useState<VoucherData[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  const fetchVouchers = async () => {
    setLoadingVouchers(true);
    try {
      const [myVouchersRes, availableVouchersRes] = await Promise.all([
        getMyVouchers(),
        getAvailableVouchers(),
      ]);

      if (myVouchersRes.success && myVouchersRes.data) {
        setMyVouchers(myVouchersRes.data);
      }

      if (availableVouchersRes.success && availableVouchersRes.data) {
        setAvailableVouchers(availableVouchersRes.data);
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoadingVouchers(false);
    }
  };

  const handleClaimVoucher = async (code: string) => {
    try {
      const result = await claimVoucher(code);

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: result.message || "Voucher berhasil diklaim",
          confirmButtonColor: "#55B4E5",
          timer: 2000,
        });
        fetchVouchers();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: result.message || "Gagal mengklaim voucher",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error claiming voucher:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat mengklaim voucher",
        confirmButtonColor: "#55B4E5",
      });
    }
  };

  const handleUseVoucher = (
    code: string,
    dari: string,
    voucherStoreId?: number,
  ) => {
    if (dari === "toko") {
      // Check if voucher is for the same store
      if (
        voucherStoreId &&
        storeIdFromCart &&
        voucherStoreId !== storeIdFromCart
      ) {
        Swal.fire({
          icon: "error",
          title: "Voucher Tidak Dapat Digunakan",
          text: "Voucher ini hanya bisa digunakan untuk toko yang sesuai.",
          confirmButtonColor: "#55B4E5",
        });
        return;
      }
      setVoucherCodeToko(code);
      setShowVoucherModal(false);
      // Auto apply after selecting
      setTimeout(() => {
        onApplyVoucherToko();
      }, 100);
    } else if (dari === "jaja") {
      setVoucherCodeJaja(code);
      setShowVoucherModal(false);
      // Auto apply after selecting
      setTimeout(() => {
        onApplyVoucherJaja();
      }, 100);
    }
  };

  useEffect(() => {
    if (showVoucherModal) {
      fetchVouchers();
    }
  }, [showVoucherModal]);

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: "1px solid #dee2e6",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6c757d",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Voucher
          </p>
          <button
            onClick={() => setShowVoucherModal(true)}
            style={{
              padding: "6px 12px",
              backgroundColor: "#55B4E5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Tag size={12} />
            Lihat Voucher
          </button>
        </div>

        {/* Voucher Toko */}
        <div style={{ marginBottom: "12px" }}>
          <p
            style={{
              fontSize: "10px",
              color: "#6c757d",
              marginBottom: "6px",
              fontWeight: "500",
            }}
          >
            Voucher Toko
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Kode voucher toko"
              value={voucherCodeToko}
              onChange={(e) => setVoucherCodeToko(e.target.value.toUpperCase())}
              disabled={!!appliedVoucherToko}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: appliedVoucherToko ? "#f5f5f5" : "white",
              }}
            />
            {!appliedVoucherToko ? (
              <button
                onClick={onApplyVoucherToko}
                disabled={!voucherCodeToko.trim()}
                style={{
                  padding: "8px 14px",
                  backgroundColor: voucherCodeToko.trim()
                    ? "#FBB338"
                    : "#e0e0e0",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: voucherCodeToko.trim() ? "pointer" : "not-allowed",
                  fontWeight: "600",
                  fontSize: "11px",
                }}
              >
                Gunakan
              </button>
            ) : (
              <button
                onClick={onRemoveVoucherToko}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "11px",
                }}
              >
                Hapus
              </button>
            )}
          </div>
          {voucherMessageToko && (
            <p
              style={{
                fontSize: "10px",
                color: "#10B981",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>✓</span> {voucherMessageToko}
            </p>
          )}
        </div>

        {/* Voucher Jaja */}
        <div>
          <p
            style={{
              fontSize: "10px",
              color: "#6c757d",
              marginBottom: "6px",
              fontWeight: "500",
            }}
          >
            Voucher Jaja
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Kode voucher Jaja"
              value={voucherCodeJaja}
              onChange={(e) => setVoucherCodeJaja(e.target.value.toUpperCase())}
              disabled={!!appliedVoucherJaja}
              style={{
                flex: 1,
                padding: "8px",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                fontSize: "11px",
                fontFamily: "Poppins, sans-serif",
                backgroundColor: appliedVoucherJaja ? "#f5f5f5" : "white",
              }}
            />
            {!appliedVoucherJaja ? (
              <button
                onClick={onApplyVoucherJaja}
                disabled={!voucherCodeJaja.trim()}
                style={{
                  padding: "8px 14px",
                  backgroundColor: voucherCodeJaja.trim()
                    ? "#FBB338"
                    : "#e0e0e0",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: voucherCodeJaja.trim() ? "pointer" : "not-allowed",
                  fontWeight: "600",
                  fontSize: "11px",
                }}
              >
                Gunakan
              </button>
            ) : (
              <button
                onClick={onRemoveVoucherJaja}
                style={{
                  padding: "8px 14px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "11px",
                }}
              >
                Hapus
              </button>
            )}
          </div>
          {voucherMessageJaja && (
            <p
              style={{
                fontSize: "10px",
                color: "#10B981",
                marginTop: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>✓</span> {voucherMessageJaja}
            </p>
          )}
        </div>
      </div>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowVoucherModal(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                Voucher Tersedia
              </h3>
              <button
                onClick={() => setShowVoucherModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {loadingVouchers ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#6c757d",
                }}
              >
                <p>Memuat voucher...</p>
              </div>
            ) : (
              <>
                {/* My Vouchers */}
                {myVouchers.length > 0 && (
                  <div style={{ marginBottom: "20px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: "#333",
                      }}
                    >
                      Voucher Saya
                    </h4>
                    {myVouchers.map((voucher) => {
                      const code = voucher.kode_voucher || voucher.kode || "";
                      const title = voucher.judul_promo || voucher.judul || "";
                      const discount = voucher.persentase_diskon
                        ? `${voucher.persentase_diskon}%`
                        : voucher.nominal_diskon
                          ? `Rp ${voucher.nominal_diskon.toLocaleString("id-ID")}`
                          : voucher.diskon || "";
                      const dari = voucher.dari || "";
                      const berakhir = voucher.berakhir || "";
                      const voucherStoreName = voucher.nama_toko || "";
                      const voucherStoreId = voucher.id_toko;

                      // Check if voucher can be used for current store
                      const isStoreVoucher = dari === "toko";
                      const canUseVoucher =
                        !isStoreVoucher ||
                        !storeIdFromCart ||
                        !voucherStoreId ||
                        voucherStoreId === storeIdFromCart;

                      return (
                        <div
                          key={voucher.id_promo || voucher.id}
                          style={{
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            opacity: canUseVoucher ? 1 : 0.5,
                            backgroundColor: canUseVoucher
                              ? "white"
                              : "#f5f5f5",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginBottom: "4px",
                              }}
                            >
                              <Gift size={14} color="#FBB338" />
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#333",
                                }}
                              >
                                {code}
                              </span>
                              <span
                                style={{
                                  fontSize: "9px",
                                  padding: "2px 6px",
                                  backgroundColor:
                                    dari === "toko" ? "#FBB338" : "#55B4E5",
                                  color: "white",
                                  borderRadius: "4px",
                                }}
                              >
                                {dari === "toko" ? "Toko" : "Jaja"}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#666",
                                margin: "4px 0",
                              }}
                            >
                              {title}
                            </p>
                            {isStoreVoucher && voucherStoreName && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#FBB338",
                                  margin: "2px 0",
                                  fontWeight: "600",
                                }}
                              >
                                📍 Berlaku di: {voucherStoreName}
                              </p>
                            )}
                            <p
                              style={{
                                fontSize: "10px",
                                color: "#999",
                                margin: 0,
                              }}
                            >
                              Diskon: {discount} • Berlaku hingga:{" "}
                              {new Date(berakhir).toLocaleDateString("id-ID")}
                            </p>
                            {!canUseVoucher && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#dc3545",
                                  margin: "4px 0",
                                  fontStyle: "italic",
                                }}
                              >
                                ⚠️ Hanya untuk {voucherStoreName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              handleUseVoucher(code, dari, voucherStoreId)
                            }
                            disabled={!canUseVoucher}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: canUseVoucher
                                ? "#10B981"
                                : "#ccc",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: canUseVoucher ? "pointer" : "not-allowed",
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            {canUseVoucher ? "Pakai" : "Tidak Bisa"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Available Vouchers */}
                {availableVouchers.length > 0 && (
                  <div>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: "#333",
                      }}
                    >
                      Voucher Tersedia
                    </h4>
                    {availableVouchers.map((voucher) => {
                      const code = voucher.kode || "";
                      const title = voucher.judul || "";
                      const discount = voucher.diskon || "";
                      const dari = voucher.dari || "";
                      const berakhir = voucher.berakhir || "";
                      const sudahKlaim = voucher.sudah_klaim || false;
                      const bisaLangsungPakai =
                        voucher.bisa_langsung_pakai || false;
                      const voucherStoreName = voucher.nama_toko || "";
                      const voucherStoreId = voucher.id_toko;

                      // Check if voucher can be used for current store
                      const isStoreVoucher = dari === "toko";
                      const canUseVoucher =
                        !isStoreVoucher ||
                        !storeIdFromCart ||
                        !voucherStoreId ||
                        voucherStoreId === storeIdFromCart;

                      return (
                        <div
                          key={voucher.id}
                          style={{
                            border: "1px solid #dee2e6",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: sudahKlaim ? "#f9f9f9" : "white",
                            opacity: canUseVoucher ? 1 : 0.5,
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginBottom: "4px",
                              }}
                            >
                              <Tag size={14} color="#FBB338" />
                              <span
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#333",
                                }}
                              >
                                {code}
                              </span>
                              <span
                                style={{
                                  fontSize: "9px",
                                  padding: "2px 6px",
                                  backgroundColor:
                                    dari === "toko" ? "#FBB338" : "#55B4E5",
                                  color: "white",
                                  borderRadius: "4px",
                                }}
                              >
                                {dari === "toko" ? "Toko" : "Jaja"}
                              </span>
                            </div>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "#666",
                                margin: "4px 0",
                              }}
                            >
                              {title}
                            </p>
                            {isStoreVoucher && voucherStoreName && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#FBB338",
                                  margin: "2px 0",
                                  fontWeight: "600",
                                }}
                              >
                                📍 Berlaku di: {voucherStoreName}
                              </p>
                            )}
                            <p
                              style={{
                                fontSize: "10px",
                                color: "#999",
                                margin: 0,
                              }}
                            >
                              Diskon: {discount} • Berlaku hingga:{" "}
                              {new Date(berakhir).toLocaleDateString("id-ID")}
                            </p>
                            {!canUseVoucher && (
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: "#dc3545",
                                  margin: "4px 0",
                                  fontStyle: "italic",
                                }}
                              >
                                ⚠️ Hanya untuk {voucherStoreName}
                              </p>
                            )}
                          </div>
                          {sudahKlaim ? (
                            <span
                              style={{
                                fontSize: "10px",
                                color: "#999",
                                fontStyle: "italic",
                              }}
                            >
                              Sudah Diklaim
                            </span>
                          ) : bisaLangsungPakai ? (
                            <button
                              onClick={() =>
                                handleUseVoucher(code, dari, voucherStoreId)
                              }
                              disabled={!canUseVoucher}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: canUseVoucher
                                  ? "#10B981"
                                  : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: canUseVoucher
                                  ? "pointer"
                                  : "not-allowed",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {canUseVoucher ? "Pakai" : "Tidak Bisa"}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleClaimVoucher(code)}
                              disabled={!canUseVoucher}
                              style={{
                                padding: "6px 12px",
                                backgroundColor: canUseVoucher
                                  ? "#FBB338"
                                  : "#ccc",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: canUseVoucher
                                  ? "pointer"
                                  : "not-allowed",
                                fontSize: "10px",
                                fontWeight: "600",
                              }}
                            >
                              {canUseVoucher ? "Klaim" : "Tidak Bisa"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {myVouchers.length === 0 && availableVouchers.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "30px",
                      color: "#999",
                    }}
                  >
                    <p>Tidak ada voucher tersedia saat ini</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VoucherSection;
