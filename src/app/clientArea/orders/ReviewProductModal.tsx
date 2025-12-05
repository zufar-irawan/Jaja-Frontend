"use client";

import React, { useState } from "react";
import { X, Star, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
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
  const [previewDepan, setPreviewDepan] = useState<string>("");
  const [previewBelakang, setPreviewBelakang] = useState<string>("");
  const [previewKanan, setPreviewKanan] = useState<string>("");
  const [previewKiri, setPreviewKiri] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "depan" | "belakang" | "kanan" | "kiri",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          icon: "error",
          title: "Invalid File",
          text: "Please upload an image file",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Too Large",
          text: "Image size must be less than 5MB",
        });
        return;
      }

      // Set file and preview
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
    }
  };

  const removeImage = (type: "depan" | "belakang" | "kanan" | "kiri") => {
    switch (type) {
      case "depan":
        setFotoDepan(null);
        setPreviewDepan("");
        break;
      case "belakang":
        setFotoBelakang(null);
        setPreviewBelakang("");
        break;
      case "kanan":
        setFotoKanan(null);
        setPreviewKanan("");
        break;
      case "kiri":
        setFotoKiri(null);
        setPreviewKiri("");
        break;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Rating Required",
        text: "Please select a rating",
      });
      return;
    }

    if (!comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Comment Required",
        text: "Please write your review",
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
        Swal.fire({
          icon: "success",
          title: "Review Submitted!",
          text: "Thank you for your review",
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
        setPreviewDepan("");
        setPreviewBelakang("");
        setPreviewKanan("");
        setPreviewKiri("");

        onClose();
        if (onSuccess) onSuccess();
      } else {
        // Handle error response (including 400 errors)
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: response.message || "Failed to submit review",
        });
      }
    } catch (error) {
      console.error("Error submitting review:", error);

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Review Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800 line-clamp-2">
                {productName}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Product ID: {productId}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-lg font-semibold text-gray-700">
                  {rating}.0
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Photos (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Front Photo */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Front View
                </label>
                <div className="relative">
                  {previewDepan ? (
                    <div className="relative group">
                      <img
                        src={previewDepan}
                        alt="Front"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => removeImage("depan")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "depan")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Back Photo */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Back View
                </label>
                <div className="relative">
                  {previewBelakang ? (
                    <div className="relative group">
                      <img
                        src={previewBelakang}
                        alt="Back"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => removeImage("belakang")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "belakang")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Right Photo */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Right View
                </label>
                <div className="relative">
                  {previewKanan ? (
                    <div className="relative group">
                      <img
                        src={previewKanan}
                        alt="Right"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => removeImage("kanan")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "kanan")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Left Photo */}
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  Left View
                </label>
                <div className="relative">
                  {previewKiri ? (
                    <div className="relative group">
                      <img
                        src={previewKiri}
                        alt="Left"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        onClick={() => removeImage("kiri")}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#55B4E5] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "kiri")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Max file size: 5MB per image
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 flex gap-3 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 text-white font-semibold rounded-lg hover:from-[#55B4E5]/90 hover:to-[#55B4E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewProductModal;
