"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Building, House, Star } from "lucide-react";
import type { Address } from "@/utils/userService";
import { deleteAddress, setPrimaryAddress } from "@/utils/userService";

interface AddressListCardProps {
  alamat: Address;
  onEdit: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect?: (alamat: Address) => void;
  onDeleted?: () => Promise<void> | void;
}

export default function AddressListCard({
  alamat,
  onEdit,
  onOpen,
  onSelect,
  onDeleted,
}: AddressListCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    const result = await Swal.fire({
      title: "Hapus alamat ini?",
      text: "Alamat akan dihapus permanen dan tidak bisa dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    const response = await deleteAddress(alamat.id_alamat);
    setIsDeleting(false);

    if (response.success) {
      await Swal.fire(
        "Berhasil",
        response.message || "Alamat berhasil dihapus",
        "success",
      );
      if (onDeleted) await onDeleted();
    } else {
      await Swal.fire(
        "Gagal",
        response.message || "Alamat gagal dihapus",
        "error",
      );
    }
  };

  const handleSetPrimary = async () => {
    if (isSettingPrimary || alamat.status_utama === "Y") return;

    const result = await Swal.fire({
      title: "Jadikan alamat utama?",
      text: "Alamat ini akan dijadikan alamat utama Anda.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, jadikan utama",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsSettingPrimary(true);
    const response = await setPrimaryAddress(alamat.id_alamat);
    setIsSettingPrimary(false);

    if (response.success) {
      await Swal.fire(
        "Berhasil",
        response.message || "Alamat utama berhasil diubah",
        "success",
      );
      if (onDeleted) await onDeleted();
    } else {
      await Swal.fire(
        "Gagal",
        response.message || "Gagal mengubah alamat utama",
        "error",
      );
    }
  };

  return (
    <div className="w-full">
      <div className="group w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-linear-to-r from-gray-50 to-gray-100/50 px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSetPrimary}
              disabled={isSettingPrimary || alamat.status_utama === "Y"}
              className={`rounded-lg p-2 transition-all ${
                alamat.status_utama === "Y"
                  ? "bg-yellow-100 text-yellow-600 cursor-default"
                  : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={
                alamat.status_utama === "Y"
                  ? "Alamat Utama"
                  : "Klik untuk jadikan alamat utama"
              }
            >
              <Star
                size={24}
                className={`transition-all ${
                  alamat.status_utama === "Y" ? "fill-yellow-600" : "fill-none"
                }`}
              />
            </button>

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {alamat.nama}
                {alamat.status_utama === "Y" && (
                  <span className="ml-2 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    Utama
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500">
                Ditambahkan {alamat.created_date}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 p-5">
          {/* Address Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-3 flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Alamat Lengkap
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {alamat.alamat_lengkap}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Nomor Telepon
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {alamat.no_telepon}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4">
          <button
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
            onClick={() => {
              if (onSelect) onSelect(alamat);
              onOpen(true);
              onEdit(true);
            }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>

          <button
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-600 hover:shadow disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
