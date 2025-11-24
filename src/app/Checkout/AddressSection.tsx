"use client";

import React, { useState, useEffect, } from "react";
import { MapPin, Plus, Edit2 } from "lucide-react";
import { getAddresses, type Address } from "@/utils/userService";
import { useRouter } from "next/navigation";

interface AddressSectionProps {
  addressForm: {
    nama_penerima: string;
    telp_penerima: string;
    alamat_lengkap: string;
  };
  setAddressForm: React.Dispatch<
    React.SetStateAction<{
      nama_penerima: string;
      telp_penerima: string;
      alamat_lengkap: string;
    }>
  >;
  customerNote: string;
  setCustomerNote: (note: string) => void;
}

// Save this as: app/Checkout/AddressSection.tsx
export default function AddressSection({
  addressForm,
  setAddressForm,
  customerNote,
  setCustomerNote,
}: AddressSectionProps) {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [showAddressList, setShowAddressList] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await getAddresses();
      if (response.success && response.data) {
        const addressList = response.data as Address[];
        setAddresses(addressList);

        // Auto-select primary address
        const primaryAddress = addressList.find((addr) => addr.is_primary);
        if (primaryAddress) {
          selectAddress(primaryAddress);
        } else if (addressList.length > 0) {
          selectAddress(addressList[0]);
        } else {
          setShowAddressList(false);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const selectAddress = (address: Address) => {
    setSelectedAddressId(address.id_alamat);

    const phoneNumber = address.no_telepon.startsWith("+62")
      ? address.no_telepon.slice(3)
      : address.no_telepon.startsWith("62")
        ? address.no_telepon.slice(2)
        : address.no_telepon;

    setAddressForm({
      nama_penerima: address.nama,
      telp_penerima: phoneNumber,
      alamat_lengkap: `${address.alamat_lengkap}, ${address.kelurahan || address.kelurahann}, ${address.kecamatan}, ${address.kota}, ${address.provinsi} ${address.kode_pos}`,
    });
    setShowAddressList(false);
  };

  const handleAddNewAddress = () => {
    router.push("/clientArea/address");
  };

  if (isLoadingAddresses) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "18px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <p style={{ fontSize: "11px", color: "#6c757d" }}>Memuat alamat...</p>
        </div>
      </div>
    );
  }

  // If no addresses, show add address prompt
  if (addresses.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "18px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          flex: 1,
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
          <MapPin size={18} style={{ color: "#55B4E5" }} />
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
            Alamat Pengiriman
          </h2>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MapPin size={28} style={{ color: "#6c757d" }} />
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "4px",
              }}
            >
              Belum Ada Alamat
            </p>
            <p style={{ fontSize: "10px", color: "#6c757d" }}>
              Tambahkan alamat pengiriman untuk melanjutkan
            </p>
          </div>
          <button
            onClick={handleAddNewAddress}
            style={{
              marginTop: "8px",
              padding: "10px 20px",
              backgroundColor: "#55B4E5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Plus size={16} />
            Tambah Alamat Baru
          </button>
        </div>
      </div>
    );
  }

  // If addresses exist, show selection UI
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "18px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        flex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          paddingBottom: "10px",
          borderBottom: "2px solid #55B4E5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <MapPin size={18} style={{ color: "#55B4E5" }} />
          <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
            Alamat Pengiriman
          </h2>
        </div>
        <button
          onClick={() => setShowAddressList(!showAddressList)}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: "600",
            cursor: "pointer",
            color: "#55B4E5",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Edit2 size={12} />
          {showAddressList ? "Tutup" : "Ganti Alamat"}
        </button>
      </div>

      {showAddressList ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {addresses.map((address) => (
            <div
              key={address.id_alamat}
              onClick={() => selectAddress(address)}
              style={{
                padding: "12px",
                border:
                  selectedAddressId === address.id_alamat
                    ? "2px solid #55B4E5"
                    : "1px solid #dee2e6",
                borderRadius: "6px",
                cursor: "pointer",
                backgroundColor:
                  selectedAddressId === address.id_alamat ? "#f0f9ff" : "white",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#333",
                    }}
                  >
                    {address.nama}
                  </span>
                  {address.label && (
                    <span
                      style={{
                        fontSize: "9px",
                        padding: "2px 6px",
                        backgroundColor: "#FBB338",
                        color: "white",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {address.label}
                    </span>
                  )}
                </div>
                {address.is_primary && (
                  <span
                    style={{
                      fontSize: "8px",
                      padding: "2px 6px",
                      backgroundColor: "#55B4E5",
                      color: "white",
                      borderRadius: "4px",
                      fontWeight: "600",
                    }}
                  >
                    UTAMA
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#6c757d",
                  marginBottom: "4px",
                }}
              >
                {address.no_telepon}
              </p>
              <p style={{ fontSize: "10px", color: "#333", lineHeight: "1.4" }}>
                {address.alamat_lengkap}
              </p>
              <p
                style={{ fontSize: "9px", color: "#6c757d", marginTop: "4px" }}
              >
                {address.kelurahan || address.kelurahann}, {address.kecamatan},{" "}
                {address.kota}, {address.provinsi} {address.kode_pos}
              </p>
            </div>
          ))}

          <button
            onClick={handleAddNewAddress}
            style={{
              padding: "12px",
              border: "2px dashed #55B4E5",
              borderRadius: "6px",
              backgroundColor: "transparent",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              color: "#55B4E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <Plus size={16} />
            Tambah Alamat Baru
          </button>
        </div>
      ) : (
        <>
          {/* Selected Address Display */}
          <div
            style={{
              padding: "12px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
              border: "1px solid #dee2e6",
              marginBottom: "12px",
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <span
                style={{ fontSize: "11px", fontWeight: "700", color: "#333" }}
              >
                {addressForm.nama_penerima}
              </span>
            </div>
            <p
              style={{
                fontSize: "10px",
                color: "#6c757d",
                marginBottom: "4px",
              }}
            >
              +62{addressForm.telp_penerima}
            </p>
            <p style={{ fontSize: "10px", color: "#333", lineHeight: "1.4" }}>
              {addressForm.alamat_lengkap}
            </p>
          </div>

          {/* Customer Note */}
          <div>
            <label
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#333",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Catatan untuk Kurir (Opsional)
            </label>
            <textarea
              placeholder="Contoh: Mohon hubungi saya sebelum datang"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                fontSize: "11px",
                resize: "none",
                fontFamily: "Poppins, sans-serif",
                minHeight: "70px",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
