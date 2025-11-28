import React, { useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  Phone,
  Navigation,
} from "lucide-react";

// Mock data untuk demo - nanti akan diganti dengan data dari API
const mockTrackingData = {
  success: true,
  message: "Tracking data retrieved successfully",
  data: {
    awb: "MT685U91",
    courier: "Wahana",
    status: "DELIVERED",
    current_location: "Jakarta Pusat",
    estimated_delivery: "2024-11-29",
    receiver_name: "John Doe",
    receiver_phone: "081234567890",
    history: [
      {
        date: "2024-11-28",
        time: "14:30",
        status: "DELIVERED",
        location: "Jakarta Pusat",
        description: "Paket telah diterima oleh penerima",
        receiver: "John Doe",
      },
      {
        date: "2024-11-28",
        time: "09:15",
        status: "OUT_FOR_DELIVERY",
        location: "Jakarta Pusat - Hub",
        description: "Paket dalam pengiriman oleh kurir",
        courier_name: "Budi Santoso",
      },
      {
        date: "2024-11-27",
        time: "20:45",
        status: "IN_TRANSIT",
        location: "Bekasi - Transit Hub",
        description: "Paket tiba di hub transit",
      },
      {
        date: "2024-11-27",
        time: "15:20",
        status: "PICKED_UP",
        location: "Tangerang - Origin",
        description: "Paket telah diambil oleh kurir",
      },
      {
        date: "2024-11-27",
        time: "10:00",
        status: "PROCESSED",
        location: "Warehouse Tangerang",
        description: "Paket telah diproses di gudang",
      },
    ],
  },
};

const OrderTrackingSection = () => {
  const [showAllHistory, setShowAllHistory] = useState(false);
  const trackingData = mockTrackingData.data;

  // Status configuration
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bgColor: string; label: string; icon: any }> = {
      DELIVERED: {
        color: "#28a745",
        bgColor: "#28a74520",
        label: "Terkirim",
        icon: CheckCircle,
      },
      OUT_FOR_DELIVERY: {
        color: "#55B4E5",
        bgColor: "#55B4E520",
        label: "Dalam Pengiriman",
        icon: Truck,
      },
      IN_TRANSIT: {
        color: "#FBB338",
        bgColor: "#FBB33820",
        label: "Dalam Perjalanan",
        icon: Navigation,
      },
      PICKED_UP: {
        color: "#8B5CF6",
        bgColor: "#8B5CF620",
        label: "Diambil Kurir",
        icon: Package,
      },
      PROCESSED: {
        color: "#6c757d",
        bgColor: "#6c757d20",
        label: "Diproses",
        icon: Clock,
      },
    };
    return configs[status] || configs.PROCESSED;
  };

  const currentStatusConfig = getStatusConfig(trackingData.status);
  const StatusIcon = currentStatusConfig.icon;

  // Show only last 3 history items if not expanded
  const displayHistory = showAllHistory
    ? trackingData.history
    : trackingData.history.slice(0, 3);

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                }}
              >
                <Truck size={24} style={{ color: "#55B4E5" }} />
                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  Lacak Pesanan
                </h2>
              </div>
              <p style={{ fontSize: "13px", color: "#6c757d", margin: 0 }}>
                Pantau status pengiriman paket Anda secara real-time
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 20px",
                backgroundColor: currentStatusConfig.bgColor,
                borderRadius: "8px",
              }}
            >
              <StatusIcon size={20} style={{ color: currentStatusConfig.color }} />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: currentStatusConfig.color,
                }}
              >
                {currentStatusConfig.label}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "20px",
          }}
        >
          {/* Left Column - Tracking Timeline */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
                paddingBottom: "16px",
                borderBottom: "2px solid #55B4E5",
              }}
            >
              <MapPin size={20} style={{ color: "#55B4E5" }} />
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#333",
                  margin: 0,
                }}
              >
                Riwayat Tracking
              </h3>
            </div>

            {/* Timeline */}
            <div style={{ position: "relative" }}>
              {displayHistory.map((item, index) => {
                const statusConfig = getStatusConfig(item.status);
                const ItemIcon = statusConfig.icon;
                const isLast = index === displayHistory.length - 1;

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: isLast ? 0 : "24px",
                      position: "relative",
                    }}
                  >
                    {/* Timeline Line */}
                    {!isLast && (
                      <div
                        style={{
                          position: "absolute",
                          left: "19px",
                          top: "40px",
                          width: "2px",
                          height: "calc(100% + 24px)",
                          backgroundColor: "#e9ecef",
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: statusConfig.bgColor,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        zIndex: 1,
                        border: `3px solid white`,
                        boxShadow: `0 0 0 2px ${statusConfig.color}`,
                      }}
                    >
                      <ItemIcon size={18} style={{ color: statusConfig.color }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingTop: "2px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            color: statusConfig.color,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {statusConfig.label}
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#333",
                          margin: "0 0 6px 0",
                        }}
                      >
                        {item.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          flexWrap: "wrap",
                          marginBottom: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Calendar size={12} style={{ color: "#6c757d" }} />
                          <span style={{ fontSize: "11px", color: "#6c757d" }}>
                            {item.date}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock size={12} style={{ color: "#6c757d" }} />
                          <span style={{ fontSize: "11px", color: "#6c757d" }}>
                            {item.time}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          marginBottom: "6px",
                        }}
                      >
                        <MapPin size={12} style={{ color: "#6c757d" }} />
                        <span style={{ fontSize: "11px", color: "#6c757d" }}>
                          {item.location}
                        </span>
                      </div>

                      {item.receiver && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            borderLeft: "3px solid #28a745",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <User size={12} style={{ color: "#28a745" }} />
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#28a745",
                              }}
                            >
                              Diterima oleh: {item.receiver}
                            </span>
                          </div>
                        </div>
                      )}

                      {item.courier_name && (
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "8px 12px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "6px",
                            borderLeft: "3px solid #55B4E5",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Truck size={12} style={{ color: "#55B4E5" }} />
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: "600",
                                color: "#55B4E5",
                              }}
                            >
                              Kurir: {item.courier_name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More/Less Button */}
            {trackingData.history.length > 3 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "12px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#55B4E5",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#55B4E5";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.color = "#55B4E5";
                }}
              >
                {showAllHistory ? (
                  <>
                    <ChevronUp size={16} />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Lihat Riwayat Lengkap ({trackingData.history.length} aktivitas)
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right Column - Shipping Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Shipping Details Card */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                <Package size={20} style={{ color: "#55B4E5" }} />
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  Informasi Pengiriman
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Nomor Resi
                  </label>
                  <div
                    style={{
                      padding: "10px 12px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#333",
                        letterSpacing: "1px",
                      }}
                    >
                      {trackingData.awb}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(trackingData.awb);
                        alert("Nomor resi berhasil disalin!");
                      }}
                      style={{
                        padding: "4px 12px",
                        backgroundColor: "#55B4E5",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      SALIN
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6c757d",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Kurir
                  </label>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                      margin: 0,
                    }}
                  >
                    {trackingData.courier}
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
                      marginBottom: "6px",
                    }}
                  >
                    Lokasi Terakhir
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={14} style={{ color: "#55B4E5" }} />
                    <span style={{ fontSize: "13px", color: "#333" }}>
                      {trackingData.current_location}
                    </span>
                  </div>
                </div>

                {trackingData.estimated_delivery && (
                  <div>
                    <label
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#6c757d",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Estimasi Tiba
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Calendar size={14} style={{ color: "#FBB338" }} />
                      <span style={{ fontSize: "13px", color: "#333" }}>
                        {trackingData.estimated_delivery}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Receiver Info Card */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  Info Penerima
                </h3>
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
                      marginBottom: "6px",
                    }}
                  >
                    Nama Penerima
                  </label>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#333",
                      margin: 0,
                    }}
                  >
                    {trackingData.receiver_name}
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
                      marginBottom: "6px",
                    }}
                  >
                    No. Telepon
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Phone size={14} style={{ color: "#55B4E5" }} />
                    <span style={{ fontSize: "13px", color: "#333" }}>
                      {trackingData.receiver_phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div
              style={{
                backgroundColor: "#FFF9E6",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #FBB338",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <AlertCircle size={20} style={{ color: "#FBB338", flexShrink: 0 }} />
                <div>
                  <h4
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#333",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Butuh Bantuan?
                  </h4>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6c757d",
                      margin: "0 0 10px 0",
                      lineHeight: "1.5",
                    }}
                  >
                    Jika ada kendala dengan pengiriman, hubungi customer service kami
                  </p>
                  <button
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#FBB338",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Hubungi CS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingSection;