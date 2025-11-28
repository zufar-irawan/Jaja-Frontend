'use client'

import { Ticket } from "lucide-react";
import type { LandingPromo } from "@/utils/landingService";

interface VoucherTicketProps {
    promo: LandingPromo;
    className?: string;
}

export default function VoucherTicket({ promo, className = "" }: VoucherTicketProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(promo.kode_promo);
        // Optional: Add toast notification here
    };

    return (
        <div
            className={`group relative flex min-w-[280px] flex-col overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-white shadow-md transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl sm:min-w-[320px] ${className}`}
        >
            {/* Decorative circles for ticket effect */}
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-gray-50"></div>
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-gray-50"></div>

            <div className="flex flex-col gap-4 p-5">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                        <Ticket size={20} className="text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Voucher Promo
                    </span>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {promo.judul_promo}
                    </h3>
                </div>

                {/* Discount */}
                <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-500">Diskon</span>
                    <span className="text-2xl font-bold text-orange-500">
                        {promo.nominal_diskon}
                    </span>
                </div>

                {/* Voucher Code */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2">
                        <p className="text-center font-mono text-sm font-bold text-gray-800">
                            {promo.kode_promo}
                        </p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
                    >
                        Salin
                    </button>
                </div>

                {/* Optional terms hint */}
                <p className="text-xs text-gray-400">
                    Syarat dan ketentuan berlaku
                </p>
            </div>
        </div>
    );
}
