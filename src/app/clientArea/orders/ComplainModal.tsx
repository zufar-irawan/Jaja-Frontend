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

    // Validate file size (max 5MB for images, 10MB for video)
    const maxSize = type === "video" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: `Ukuran file maksimal ${type === "video" ? "10MB" : "5MB"}`,
      });
      return;
    }

    // Validate file type
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-20 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Buat Komplain</h2>
            <p className="text-sm text-gray-500 mt-1">Invoice: {invoice}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{productName}</p>
              <p className="text-sm text-gray-500">ID Produk: {productId}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Jenis Komplain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Komplain <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
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
                  className={`p-3 rounded-lg border-2 transition-all ${
                    jenisKomplain === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Judul Komplain */}
          <div>
            <label
              htmlFor="judulKomplain"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Judul Komplain <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="judulKomplain"
              value={judulKomplain}
              onChange={(e) => setJudulKomplain(e.target.value)}
              placeholder="Contoh: Barang Rusak & Tidak Bisa Nyala"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deskripsi Komplain <span className="text-red-500">*</span>
            </label>
            <textarea
              id="komplain"
              value={komplain}
              onChange={(e) => setKomplain(e.target.value)}
              placeholder="Jelaskan detail masalah yang Anda alami..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {komplain.length}/500 karakter
            </p>
          </div>

          {/* Solusi yang Diinginkan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Solusi yang Diinginkan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
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
                  className={`p-3 rounded-lg border-2 transition-all ${
                    solusi === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Bukti */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Bukti <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload foto/video bukti (minimal 1 foto). Maks 5MB per gambar,
              10MB untuk video
            </p>

            <div className="grid grid-cols-2 gap-4">
              {/* Gambar 1 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Gambar 1 <span className="text-red-500">*</span>
                </label>
                {previewGambar1 ? (
                  <div className="relative">
                    <img
                      src={previewGambar1}
                      alt="Preview 1"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("gambar1")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
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
                  <div className="relative">
                    <img
                      src={previewGambar2}
                      alt="Preview 2"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("gambar2")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
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
                  <div className="relative">
                    <img
                      src={previewGambar3}
                      alt="Preview 3"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("gambar3")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
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
                  <div className="relative">
                    <video
                      src={previewVideo}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("video")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Video className="w-8 h-8 text-gray-400 mb-2" />
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Perhatian:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Pastikan bukti yang Anda upload jelas dan sesuai</li>
                <li>Komplain akan diproses maksimal 2x24 jam</li>
                <li>Anda akan mendapat notifikasi tentang status komplain</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Kirim Komplain</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplainModal;
