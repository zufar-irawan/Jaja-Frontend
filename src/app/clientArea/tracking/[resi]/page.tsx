"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  ArrowLeft,
  Calendar,
  User,
  Building2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { trackShipment } from "@/utils/checkoutActions";

type ManifestItem = {
  manifest_code: string;
  manifest_description: string;
  manifest_date: string;
  manifest_time: string;
  city_name: string;
};

type TrackingData = {
  delivered: boolean;
  summary: {
    courier_code: string;
    courier_name: string;
    waybill_number: string;
    service_code: string;
    waybill_date: string;
    shipper_name: string;
    receiver_name: string;
    origin: string;
    destination: string;
    status: string;
  };
  details: {
    waybill_number: string;
    waybill_date: string;
    waybill_time: string;
    weight: string;
    origin: string;
    destination: string;
    shipper_name: string;
    shipper_address1: string;
    shipper_address2: string;
    shipper_address3: string;
    shipper_city: string;
    receiver_name: string;
    receiver_address1: string;
    receiver_address2: string;
    receiver_address3: string;
    receiver_city: string;
  };
  delivery_status: {
    status: string;
    pod_receiver: string;
    pod_date: string;
    pod_time: string;
  };
  manifest: ManifestItem[];
};

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const resi = params.resi as string;

  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  // Data testing dari body API (untuk testing frontend)
  const TESTING_DATA: { resi: string; courier: string } = {
    resi: "MT685U91",
    courier: "wahana",
  };

  useEffect(() => {
    fetchTrackingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resi]);

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Gunakan data testing untuk saat ini
      const response = await trackShipment(
        TESTING_DATA.resi,
        TESTING_DATA.courier,
      );

      if (response.success && response.data) {
        setTrackingData(response.data.data);
      } else {
        setError(response.message || "Gagal melacak pengiriman");
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setError("Terjadi kesalahan saat melacak pengiriman");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string, time?: string) => {
    try {
      const dateObj = new Date(`${date}${time ? ` ${time}` : ""}`);
      return dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...(time && { hour: "2-digit", minute: "2-digit" }),
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-[#55B4E5] animate-spin mb-4" />
            <p className="text-gray-600 font-medium text-lg">
              Melacak pengiriman...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#55B4E5] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-red-100">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Gagal Melacak Pengiriman
              </h2>
              <p className="text-gray-600 text-center mb-6">
                {error || "Nomor resi tidak ditemukan"}
              </p>
              <button
                onClick={fetchTrackingData}
                className="px-6 py-3 bg-[#55B4E5] text-white rounded-xl font-semibold hover:bg-[#55B4E5]/90 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { delivered, summary, details, delivery_status, manifest } =
    trackingData;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#55B4E5] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali</span>
        </button>

        {/* Status Card */}
        <div
          className={`rounded-3xl shadow-xl p-8 mb-6 ${
            delivered
              ? "bg-linear-to-r from-green-500 to-emerald-600"
              : "bg-linear-to-r from-blue-500 to-cyan-600"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {delivered ? (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Truck className="w-9 h-9 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {delivered
                    ? "Paket Telah Diterima"
                    : "Paket Dalam Perjalanan"}
                </h1>
                <p className="text-white/90 text-lg">
                  {summary.status || "Status tidak tersedia"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-white" />
                <p className="text-white/80 text-sm font-medium">Nomor Resi</p>
              </div>
              <p className="text-white font-bold text-xl">
                {summary.waybill_number}
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-white" />
                <p className="text-white/80 text-sm font-medium">Kurir</p>
              </div>
              <p className="text-white font-bold text-xl">
                {summary.courier_name}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Info - Only show if delivered */}
        {delivered && delivery_status && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Informasi Penerimaan
                </h3>
                <p className="text-sm text-gray-500">
                  Paket telah diterima oleh penerima
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Diterima Oleh</p>
                  <p className="font-semibold text-gray-800">
                    {delivery_status.pod_receiver}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Waktu Penerimaan</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(
                      delivery_status.pod_date,
                      delivery_status.pod_time,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipper & Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipper */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pengirim</h3>
                <p className="text-sm text-gray-500">Informasi Toko</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-semibold text-gray-800">
                    {summary.shipper_name || details.shipper_name}
                  </p>
                </div>
              </div>

              {summary.origin && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Asal</p>
                    <p className="font-semibold text-gray-800">
                      {summary.origin}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Receiver */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Penerima</h3>
                <p className="text-sm text-gray-500">Informasi Pembeli</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Nama</p>
                  <p className="font-semibold text-gray-800">
                    {summary.receiver_name || details.receiver_name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tujuan</p>
                  <p className="font-semibold text-gray-800">
                    {summary.destination || details.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Timeline - Collapsible */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 mb-6">
          <button
            onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
            className="w-full flex items-center justify-between hover:bg-gray-50 rounded-xl p-4 -m-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-800">
                  Riwayat Pengiriman
                </h3>
                <p className="text-sm text-gray-500">
                  Timeline perjalanan paket ({manifest.length} checkpoint)
                </p>
              </div>
            </div>
            {isTimelineExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-400 shrink-0" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400 shrink-0" />
            )}
          </button>

          {!isTimelineExpanded && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-700 text-center">
                Klik untuk melihat detail riwayat pengiriman lengkap
              </p>
            </div>
          )}

          {isTimelineExpanded && (
            <div className="relative mt-6">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#55B4E5] via-blue-300 to-gray-200" />

              {/* Timeline Items */}
              <div className="space-y-6">
                {manifest.map((item, index) => {
                  const isFirst = index === 0;
                  const isLast = index === manifest.length - 1;

                  return (
                    <div key={index} className="relative flex gap-6">
                      {/* Timeline Dot */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isFirst
                              ? "bg-linear-to-br from-[#55B4E5] to-blue-600 shadow-lg shadow-blue-300"
                              : isLast
                                ? "bg-linear-to-br from-gray-300 to-gray-400"
                                : "bg-white border-4 border-[#55B4E5]"
                          }`}
                        >
                          {isFirst ? (
                            delivered ? (
                              <CheckCircle className="w-6 h-6 text-white" />
                            ) : (
                              <Truck className="w-6 h-6 text-white" />
                            )
                          ) : isLast ? (
                            <Package className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-3 h-3 bg-[#55B4E5] rounded-full" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className={`flex-1 pb-6 ${
                          isFirst
                            ? "bg-linear-to-r from-blue-50 to-transparent p-4 rounded-2xl -ml-2"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4
                            className={`font-bold ${
                              isFirst
                                ? "text-[#55B4E5] text-lg"
                                : "text-gray-800 text-base"
                            }`}
                          >
                            {item.manifest_description}
                          </h4>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.manifest_date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(item.manifest_time)}</span>
                          </div>
                        </div>

                        {item.city_name && (
                          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{item.city_name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">
                Catatan Penting
              </p>
              <p className="text-sm text-blue-700">
                Data tracking diupdate secara berkala oleh kurir. Jika ada
                keterlambatan informasi, mohon hubungi pihak kurir atau penjual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
