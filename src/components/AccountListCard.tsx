import {
  deleteRekening,
  setPrimaryRekening,
  type Rekening,
} from "@/utils/userService";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Star } from "lucide-react";

interface AccountListCardProps {
  rekening: Rekening;
  onEdit: (rekening: Rekening) => void;
  onDeleted?: () => void;
  onPrimaryChanged?: () => void;
}

export default function AccountListCard({
  rekening,
  onEdit,
  onDeleted,
  onPrimaryChanged,
}: AccountListCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [settingPrimary, setSettingPrimary] = useState(false);

  const cardClassName = useMemo(() => {
    const base =
      "group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md";
    return rekening.is_primary
      ? `${base} border-blue-400 ring-2 ring-blue-100`
      : `${base} border-gray-200`;
  }, [rekening.is_primary]);

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(rekening.account).catch(() => null);
  };

  const handleDelete = async () => {
    if (deleting) return;
    const confirm = await Swal.fire({
      title: "Hapus rekening?",
      text: `Rekening ${rekening.bank_name} a.n ${rekening.name} akan dihapus permanen`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    setDeleting(true);
    const response = await deleteRekening(rekening.id_data);
    setDeleting(false);

    if (response.success) {
      await Swal.fire(
        "Berhasil",
        response.message || "Rekening berhasil dihapus",
        "success",
      );
      onDeleted?.();
    } else {
      await Swal.fire(
        "Gagal",
        response.message || "Rekening gagal dihapus",
        "error",
      );
    }
  };

  const handleSetPrimary = async () => {
    if (rekening.is_primary || settingPrimary) return;
    const confirm = await Swal.fire({
      title: "Jadikan rekening utama?",
      text: `Rekening ${rekening.bank_name} a.n ${rekening.name} akan digunakan sebagai rekening utama`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, jadikan utama",
      cancelButtonText: "Batal",
    });
    if (!confirm.isConfirmed) return;

    setSettingPrimary(true);
    const response = await setPrimaryRekening(rekening.id_data);
    setSettingPrimary(false);

    if (response.success) {
      await Swal.fire(
        "Berhasil",
        response.message || "Rekening utama diperbarui",
        "success",
      );
      onPrimaryChanged?.();
    } else {
      await Swal.fire(
        "Gagal",
        response.message || "Rekening utama gagal diubah",
        "error",
      );
    }
  };

  return (
    <div className={cardClassName}>
      {/* Card Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-blue-100/50 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSetPrimary}
              disabled={settingPrimary || rekening.is_primary}
              className={`rounded-lg p-2 transition-all ${
                rekening.is_primary
                  ? "bg-yellow-100 text-yellow-600 cursor-default"
                  : "bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
              title={
                rekening.is_primary
                  ? "Rekening Utama"
                  : "Klik untuk jadikan rekening utama"
              }
            >
              <Star
                size={24}
                className={`transition-all ${
                  rekening.is_primary ? "fill-yellow-600" : "fill-none"
                }`}
              />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bank</p>
              <p className="text-xl font-bold text-gray-800">
                {rekening.bank_name}
                {rekening.is_primary && (
                  <span className="ml-2 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    Utama
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-500">{rekening.alias_name}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              onClick={() => onEdit(rekening)}
            >
              Edit
            </button>
            <button
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Nomor Rekening
            </p>
            <p className="text-2xl font-bold tracking-wide text-gray-800">
              {rekening.account}
            </p>
          </div>
          <button
            className="rounded-md bg-gray-200 p-2 transition-colors hover:bg-gray-300"
            onClick={handleCopyAccount}
            title="Salin nomor rekening"
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Atas Nama
          </p>
          <p className="text-lg font-semibold text-gray-800">{rekening.name}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Kantor Cabang
            </p>
            <p className="text-sm font-medium text-gray-800">
              {rekening.branch_office}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Kota
            </p>
            <p className="text-sm font-medium text-gray-800">{rekening.city}</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        <p
          className={`flex items-center gap-2 text-xs ${rekening.verified ? "text-green-600" : "text-gray-500"}`}
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          {rekening.verified ? "Rekening terverifikasi" : "Menunggu verifikasi"}
        </p>
      </div>
    </div>
  );
}
