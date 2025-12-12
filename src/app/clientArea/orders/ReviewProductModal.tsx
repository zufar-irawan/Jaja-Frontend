"use client";

import { useState } from "react";
import {
  X,
  Star,
  Upload,
  Image as ImageIcon,
  Loader2,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { submitReview } from "./reviewActions";

interface ReviewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  transactionId: number;
  productName: string;
  productImage?: string;
  onSuccess?: () => void;
}

const ReviewProductModal: React.FC<ReviewProductModalProps> = ({
  isOpen,
  onClose,
  productId,
  transactionId,
  productName,
  productImage,
  onSuccess,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [fotoDepan, setFotoDepan] = useState<File | null>(null);
  const [fotoBelakang, setFotoBelakang] = useState<File | null>(null);
  const [fotoKanan, setFotoKanan] = useState<File | null>(null);
  const [fotoKiri, setFotoKiri] = useState<File | null>(null);
  const [previewDepan, setPreviewDepan] = useState<string | null>(null);
  const [previewBelakang, setPreviewBelakang] = useState<string | null>(null);
  const [previewKanan, setPreviewKanan] = useState<string | null>(null);
  const [previewKiri, setPreviewKiri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRatingText = (ratingValue: number) => {
    switch (ratingValue) {
      case 1:
        return "Sangat Buruk";
      case 2:
        return "Buruk";
      case 3:
        return "Cukup";
      case 4:
        return "Baik";
      case 5:
        return "Sangat Baik";
      default:
        return "Pilih Rating";
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "depan" | "belakang" | "kanan" | "kiri",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Format Tidak Valid",
        text: "Hanya file gambar yang diperbolehkan",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Terlalu Besar",
        text: "Ukuran gambar maksimal 5MB",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;

      switch (type) {
        case "depan":
          setFotoDepan(file);
          setPreviewDepan(preview);
          break;
        case "belakang":
          setFotoBelakang(file);
          setPreviewBelakang(preview);
          break;
        case "kanan":
          setFotoKanan(file);
          setPreviewKanan(preview);
          break;
        case "kiri":
          setFotoKiri(file);
          setPreviewKiri(preview);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: "depan" | "belakang" | "kanan" | "kiri") => {
    switch (type) {
      case "depan":
        setFotoDepan(null);
        setPreviewDepan(null);
        break;
      case "belakang":
        setFotoBelakang(null);
        setPreviewBelakang(null);
        break;
      case "kanan":
        setFotoKanan(null);
        setPreviewKanan(null);
        break;
      case "kiri":
        setFotoKiri(null);
        setPreviewKiri(null);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Rating Diperlukan",
        text: "Mohon pilih rating untuk produk ini",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    if (!comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Ulasan Diperlukan",
        text: "Mohon tulis ulasan Anda tentang produk ini",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    if (comment.trim().length < 10) {
      Swal.fire({
        icon: "warning",
        title: "Ulasan Terlalu Pendek",
        text: "Mohon tulis ulasan minimal 10 karakter",
        confirmButtonColor: "#55B4E5",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitReview({
        id_data: transactionId,
        id_produk: productId,
        rating,
        comment,
        foto_depan: fotoDepan,
        foto_belakang: fotoBelakang,
        foto_kanan: fotoKanan,
        foto_kiri: fotoKiri,
      });

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Review Berhasil Dikirim!",
          text: "Terima kasih atas ulasan Anda",
          timer: 2000,
          showConfirmButton: false,
        });

        // Reset form
        setRating(0);
        setComment("");
        setFotoDepan(null);
        setFotoBelakang(null);
        setFotoKanan(null);
        setFotoKiri(null);
        setPreviewDepan(null);
        setPreviewBelakang(null);
        setPreviewKanan(null);
        setPreviewKiri(null);

        onSuccess?.();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Mengirim Review",
          text: response.message || "Terjadi kesalahan saat mengirim review",
          confirmButtonColor: "#55B4E5",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Gagal mengirim review. Silakan coba lagi.",
        confirmButtonColor: "#55B4E5",
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
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Beri Rating & Ulasan
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Bagikan pengalaman Anda dengan produk ini
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 sm:p-2 hover:bg-white/80 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="shrink-0 p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3 sm:gap-4">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2">
                {productName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Produk ID: {productId}
              </p>
            </div>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Rating Produk <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isSubmitting}
                      className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                    >
                      <Star
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  {rating > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-gray-800">
                        {rating}.0
                      </span>
                      <span className="text-base sm:text-lg font-medium text-gray-600">
                        - {getRatingText(rating)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm sm:text-base text-gray-500">
                      Klik bintang untuk memberi rating
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2"
              >
                Ulasan Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ceritakan pengalaman Anda dengan produk ini... (minimal 10 karakter)"
                className="w-full p-3 sm:p-4 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent resize-none"
                rows={5}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {comment.length < 10 ? (
                    <span className="text-orange-500">
                      Minimal 10 karakter ({10 - comment.length} lagi)
                    </span>
                  ) : (
                    <span className="text-green-500">
                      ✓ Panjang ulasan sudah cukup
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">{comment.length}/500</p>
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Foto Produk (Opsional)
              </label>
              <p className="text-xs text-gray-500 mb-3 sm:mb-4">
                Tambahkan foto untuk membuat ulasan lebih menarik. Maksimal 5MB
                per foto.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Front Photo */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Foto Depan
                  </label>
                  {previewDepan ? (
                    <div className="relative group">
                      <img
                        src={previewDepan}
                        alt="Depan"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("depan")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "depan")}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Back Photo */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Foto Belakang
                  </label>
                  {previewBelakang ? (
                    <div className="relative group">
                      <img
                        src={previewBelakang}
                        alt="Belakang"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("belakang")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "belakang")}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Right Photo */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Foto Kanan
                  </label>
                  {previewKanan ? (
                    <div className="relative group">
                      <img
                        src={previewKanan}
                        alt="Kanan"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("kanan")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "kanan")}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Left Photo */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Foto Kiri
                  </label>
                  {previewKiri ? (
                    <div className="relative group">
                      <img
                        src={previewKiri}
                        alt="Kiri"
                        className="w-full h-28 sm:h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("kiri")}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] hover:bg-gray-50 transition-colors">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "kiri")}
                        disabled={isSubmitting}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-800">
                <p className="font-medium mb-1">Tips Menulis Ulasan:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Jelaskan kualitas dan kesesuaian produk</li>
                  <li>Ceritakan pengalaman penggunaan Anda</li>
                  <li>Sertakan foto untuk review yang lebih menarik</li>
                  <li>Ulasan Anda akan membantu pembeli lain</li>
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
            form="review-form"
            onClick={handleSubmit}
            disabled={
              isSubmitting || rating === 0 || comment.trim().length < 10
            }
            className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 rounded-lg hover:from-[#55B4E5]/90 hover:to-[#55B4E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Kirim Ulasan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewProductModal;