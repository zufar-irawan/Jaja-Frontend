"use client";

import { useState } from "react";
import {
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Image as ImageIcon,
  Video,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { createComplain } from "@/utils/checkoutActions";

interface ComplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
  invoice: string;
  productImage?: string;
  onSuccess?: () => void;
}

const ComplainModal: React.FC<ComplainModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  invoice,
  productImage,
  onSuccess,
}) => {
  const [jenisKomplain, setJenisKomplain] = useState<
    "barang" | "pengiriman" | "lainnya"
  >("barang");
  const [judulKomplain, setJudulKomplain] = useState("");
  const [komplain, setKomplain] = useState("");
  const [solusi, setSolusi] = useState<"refund" | "change" | "other">("change");

  const [gambar1, setGambar1] = useState<File | null>(null);
  const [gambar2, setGambar2] = useState<File | null>(null);
  const [gambar3, setGambar3] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [previewGambar1, setPreviewGambar1] = useState<string | null>(null);
  const [previewGambar2, setPreviewGambar2] = useState<string | null>(null);
  const [previewGambar3, setPreviewGambar3] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "gambar1" | "gambar2" | "gambar3" | "video",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === "video" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: `Ukuran file maksimal ${type === "video" ? "10MB" : "5MB"}`,
      });
      return;
    }

    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        Swal.fire({
          icon: "error",
          title: "Format Tidak Valid",
          text: "Hanya file video yang diperbolehkan",
        });
        return;
      }
    } else {
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Format Tidak Valid",
          text: "Hanya file gambar yang diperbolehkan",
        });
        return;
      }
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;

      switch (type) {
        case "gambar1":
          setGambar1(file);
          setPreviewGambar1(preview);
          break;
        case "gambar2":
          setGambar2(file);
          setPreviewGambar2(preview);
          break;
        case "gambar3":
          setGambar3(file);
          setPreviewGambar3(preview);
          break;
        case "video":
          setVideo(file);
          setPreviewVideo(preview);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type: "gambar1" | "gambar2" | "gambar3" | "video") => {
    switch (type) {
      case "gambar1":
        setGambar1(null);
        setPreviewGambar1(null);
        break;
      case "gambar2":
        setGambar2(null);
        setPreviewGambar2(null);
        break;
      case "gambar3":
        setGambar3(null);
        setPreviewGambar3(null);
        break;
      case "video":
        setVideo(null);
        setPreviewVideo(null);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!judulKomplain.trim()) {
      Swal.fire({
        icon: "error",
        title: "Judul Komplain Kosong",
        text: "Mohon isi judul komplain",
      });
      return;
    }

    if (!komplain.trim()) {
      Swal.fire({
        icon: "error",
        title: "Deskripsi Komplain Kosong",
        text: "Mohon jelaskan komplain Anda",
      });
      return;
    }

    if (!gambar1) {
      Swal.fire({
        icon: "error",
        title: "Gambar Bukti Diperlukan",
        text: "Mohon upload minimal 1 gambar bukti",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createComplain({
        invoice,
        id_produk: productId,
        jenis_komplain: jenisKomplain,
        judul_komplain: judulKomplain,
        komplain,
        solusi,
        gambar1: gambar1 || undefined,
        gambar2: gambar2 || undefined,
        gambar3: gambar3 || undefined,
        video: video || undefined,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Komplain Berhasil Dikirim!",
          text: "Komplain Anda sedang diproses oleh seller",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form
        setJenisKomplain("barang");
        setJudulKomplain("");
        setKomplain("");
        setSolusi("change");
        setGambar1(null);
        setGambar2(null);
        setGambar3(null);
        setVideo(null);
        setPreviewGambar1(null);
        setPreviewGambar2(null);
        setPreviewGambar3(null);
        setPreviewVideo(null);

        onSuccess?.();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Komplain",
          text: response.message || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      console.error("Error submitting complain:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Gagal mengirim komplain. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/50 sm:backdrop-blur-sm">
      {/* Backdrop (desktop only) */}
      <div 
        className="absolute inset-0 hidden sm:block" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 flex w-full flex-col bg-white rounded-none shadow-none sm:max-w-3xl sm:rounded-2xl sm:shadow-2xl sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Buat Komplain</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Invoice: {invoice}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/80 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="shrink-0 p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm sm:text-base text-gray-900 line-clamp-2">{productName}</p>
              <p className="text-xs sm:text-sm text-gray-500">ID Produk: {productId}</p>
            </div>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
            {/* Jenis Komplain */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Jenis Komplain <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: "barang", label: "Masalah Barang" },
                  { value: "pengiriman", label: "Masalah Pengiriman" },
                  { value: "lainnya", label: "Lainnya" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setJenisKomplain(
                        option.value as "barang" | "pengiriman" | "lainnya",
                      )
                    }
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                      jenisKomplain === option.value
                        ? "border-[#55B4E5] bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Judul Komplain */}
            <div>
              <label
                htmlFor="judulKomplain"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Judul Komplain <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="judulKomplain"
                value={judulKomplain}
                onChange={(e) => setJudulKomplain(e.target.value)}
                placeholder="Contoh: Barang Rusak & Tidak Bisa Nyala"
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent"
                disabled={isSubmitting}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {judulKomplain.length}/100 karakter
              </p>
            </div>

            {/* Deskripsi Komplain */}
            <div>
              <label
                htmlFor="komplain"
                className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
              >
                Deskripsi Komplain <span className="text-red-500">*</span>
              </label>
              <textarea
                id="komplain"
                value={komplain}
                onChange={(e) => setKomplain(e.target.value)}
                placeholder="Jelaskan detail masalah yang Anda alami..."
                rows={5}
                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent resize-none"
                disabled={isSubmitting}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {komplain.length}/500 karakter
              </p>
            </div>

            {/* Solusi yang Diinginkan */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Solusi yang Diinginkan <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: "refund", label: "Pengembalian Dana" },
                  { value: "change", label: "Tukar Barang" },
                  { value: "other", label: "Lainnya" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSolusi(option.value as "refund" | "change" | "other")
                    }
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                      solusi === option.value
                        ? "border-[#55B4E5] bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Bukti */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Upload Bukti <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload foto/video bukti (minimal 1 foto). Maks 5MB per gambar,
                10MB untuk video
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Gambar 1 */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Gambar 1 <span className="text-red-500">*</span>
                  </label>
                  {previewGambar1 ? (
                    <div className="relative group">
                      <img
                        src={previewGambar1}
                        alt="Preview 1"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("gambar1")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-500">Upload Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "gambar1")}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>

                {/* Gambar 2 */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Gambar 2
                  </label>
                  {previewGambar2 ? (
                    <div className="relative group">
                      <img
                        src={previewGambar2}
                        alt="Preview 2"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("gambar2")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-500">Upload Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "gambar2")}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>

                {/* Gambar 3 */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Gambar 3
                  </label>
                  {previewGambar3 ? (
                    <div className="relative group">
                      <img
                        src={previewGambar3}
                        alt="Preview 3"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("gambar3")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-500">Upload Gambar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "gambar3")}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>

                {/* Video */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Video (Opsional)
                  </label>
                  {previewVideo ? (
                    <div className="relative group">
                      <video
                        src={previewVideo}
                        className="w-full h-28 sm:h-32 object-cover rounded-lg"
                        controls
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("video")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <Video className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" />
                      <span className="text-xs text-gray-500">Upload Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, "video")}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-yellow-800">
                <p className="font-medium mb-1">Perhatian:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Pastikan bukti yang Anda upload jelas dan sesuai</li>
                  <li>Komplain akan diproses maksimal 2x24 jam</li>
                  <li>Anda akan mendapat notifikasi tentang status komplain</li>
                </ul>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-[#55B4E5] to-[#55B4E5]/90 rounded-lg hover:from-[#55B4E5]/90 hover:to-[#55B4E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Kirim Komplain</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplainModal;