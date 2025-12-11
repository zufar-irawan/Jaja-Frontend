'use client'

import { useState } from "react";
import { Ticket, Clock, Store, Tag, Check, Copy } from "lucide-react";
import type { Voucher } from "@/utils/voucherService";
import { formatVoucherDiscount, formatVoucherMinBelanja, isVoucherExpired, getVoucherTypeColor, getVoucherDisplayName, getVoucherCode } from "@/utils/voucherService";
import { claimVoucher } from "@/utils/voucherActions";

interface VoucherListCardProps {
  voucher: Voucher;
  showClaimButton?: boolean;
  onVoucherClaimed?: (voucherCode: string) => void;
  onVoucherSelect?: (voucher: Voucher) => void;
  isSelected?: boolean;
  className?: string;
}

export default function VoucherListCard({
  voucher,
  showClaimButton = false,
  onVoucherClaimed,
  onVoucherSelect,
  isSelected = false,
  className = ""
}: VoucherListCardProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(voucher.sudah_klaim);
  const [copiedCode, setCopiedCode] = useState(false);

  const voucherCode = getVoucherCode(voucher);
  const displayName = getVoucherDisplayName(voucher);
  const isExpired = voucher.berakhir ? isVoucherExpired(voucher.berakhir) : false;
  const typeColor = getVoucherTypeColor(voucher.kategori || '');

  const handleClaim = async () => {
    if (!voucherCode || isClaiming || isClaimed) return;

    setIsClaiming(true);
    try {
      const response = await claimVoucher({ kode_voucher: voucherCode });

      if (response.success) {
        setIsClaimed(true);
        onVoucherClaimed?.(voucherCode);
      } else {
        alert(response.message || "Gagal mengklaim voucher");
      }
    } catch (error) {
      console.error("Error claiming voucher:", error);
      alert("Terjadi kesalahan saat mengklaim voucher");
    } finally {
      setIsClaiming(false);
    }
  };

  const handleCopyCode = async () => {
    if (!voucherCode) return;

    try {
      await navigator.clipboard.writeText(voucherCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      console.error("Failed to copy voucher code:", error);
    }
  };

  const handleSelect = () => {
    if (!isExpired && !showClaimButton) {
      onVoucherSelect?.(voucher);
    }
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-400 bg-blue-50'
          : isExpired
          ? 'border-gray-200 bg-gray-50 opacity-60'
          : 'border-gray-200 hover:border-gray-300'
      } ${onVoucherSelect && !isExpired && !showClaimButton ? 'cursor-pointer' : ''} ${className}`}
      onClick={handleSelect}
    >
      {/* Voucher Type Badge */}
      <div className="absolute right-3 top-3 z-10">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: typeColor }}
        >
          {voucher.kategori || 'Voucher'}
        </span>
      </div>

      {/* Banner Image */}
      {voucher.banner && (
        <div className="h-24 w-full overflow-hidden">
          <img
            src={voucher.banner}
            alt={displayName}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-orange-100 p-2 flex-shrink-0">
            <Ticket size={20} className="text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
              {displayName}
            </h3>
            {voucher.dari && (
              <div className="flex items-center gap-1 mt-1">
                {voucher.dari === 'toko' ? (
                  <Store size={12} className="text-gray-500" />
                ) : (
                  <Tag size={12} className="text-gray-500" />
                )}
                <span className="text-xs text-gray-500">
                  {voucher.dari === 'toko' ? voucher.nama_toko || 'Toko' : 'Jaja'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Discount */}
        <div className="flex items-baseline gap-2">
          <span className="text-xs text-gray-500">Diskon</span>
          <span className="text-xl font-bold text-orange-500">
            {formatVoucherDiscount(voucher)}
          </span>
        </div>

        {/* Min Purchase */}
        {voucher.min_belanja && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Min. belanja:</span>
            <span className="font-medium">
              {formatVoucherMinBelanja(voucher.min_belanja)}
            </span>
          </div>
        )}

        {/* Voucher Code */}
        {voucherCode && !showClaimButton && (
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2">
              <p className="text-center font-mono text-sm font-bold text-gray-800">
                {voucherCode}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyCode();
              }}
              className="rounded-lg bg-gray-600 p-2 text-white transition-colors hover:bg-gray-700"
              title="Salin kode"
            >
              {copiedCode ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}

        {/* Expiry Date */}
        {voucher.berakhir && (
          <div className="flex items-center gap-2 text-xs">
            <Clock size={12} className={isExpired ? "text-red-500" : "text-gray-500"} />
            <span className={isExpired ? "text-red-500 font-medium" : "text-gray-600"}>
              {isExpired ? 'Sudah kedaluwarsa' : `Berlaku hingga ${new Date(voucher.berakhir).toLocaleDateString('id-ID')}`}
            </span>
          </div>
        )}

        {/* Action Button */}
        {showClaimButton && (
          <div className="mt-2 flex justify-end">
            {isClaimed ? (
              <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Check size={16} />
                Sudah diklaim
              </span>
            ) : isExpired ? (
              <span className="text-sm text-red-500 font-medium">
                Kedaluwarsa
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClaim();
                }}
                disabled={isClaiming}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isClaiming ? 'Mengklaim...' : 'Klaim'}
              </button>
            )}
          </div>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute inset-0 rounded-xl border-2 border-blue-400 bg-blue-50/20 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
