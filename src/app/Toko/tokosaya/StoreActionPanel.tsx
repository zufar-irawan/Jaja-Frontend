"use client";

import Link from "next/link";
import { useState } from "react";
import type { MyTokoDetail, UpdateTokoPayload } from "@/utils/tokoService";
import { updateMyToko } from "@/utils/tokoActions";
import EditModalToko, { type StorePayload } from "./editModalToko";

interface StoreActionPanelProps {
    store: MyTokoDetail;
}

const serializePilihanKurir = (couriers: string[]): string =>
    couriers
        .map((courier) => courier.trim())
        .filter(Boolean)
        .join(":");

const buildSelectedServices = (form: StorePayload): Record<string, string[]> => {
    return form.pilihan_kurir.reduce<Record<string, string[]>>((acc, courier) => {
        const services = form.kurir_service[courier] ?? [];
        const sanitized = services.map((item) => item.trim()).filter(Boolean);

        if (sanitized.length) {
            acc[courier] = sanitized;
        }

        return acc;
    }, {});
};

const buildUpdatePayload = (form: StorePayload): UpdateTokoPayload => {
    const selectedServices = buildSelectedServices(form);

    return {
        nama_toko: form.nama_toko?.trim(),
        deskripsi_toko: form.deskripsi_toko?.trim(),
        greating_message: form.greating_message?.trim(),
        alamat_toko: form.alamat_toko?.trim(),
        alamat_google: form.alamat_google?.trim() || "",
        latitude: form.latitude ?? "",
        longitude: form.longitude ?? "",
        provinsi: form.provinsi,
        kota_kabupaten: form.kota_kabupaten,
        kecamatan: form.kecamatan,
        kelurahan: form.kelurahan,
        kode_pos: form.kode_pos,
        free_ongkir: form.free_ongkir ? "Y" : "T",
        min_free_ongkir: form.min_free_ongkir,
        pilihan_kurir: serializePilihanKurir(form.pilihan_kurir),
        kurir_service: Object.keys(selectedServices).length ? selectedServices : null,
        data_buka_toko: form.data_buka_toko,
        data_libur_toko: form.data_libur_toko?.trim() || null,
    };
};

export default function StoreActionPanel({ store }: StoreActionPanelProps) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (payload: StorePayload) => {
        setStatus(null);

        const updatePayload = buildUpdatePayload(payload);
        console.log("StoreActionPanel - Submitting payload:", updatePayload);

        try {
            const response = await updateMyToko(updatePayload);
            console.log("StoreActionPanel - Response received:", response);

            if (!response.success) {
                throw new Error(response.message || "Gagal memperbarui toko");
            }

            setStatus("Perubahan toko berhasil disimpan.");
            setOpen(false);
        } catch (error: any) {
            console.error("StoreActionPanel - Error caught:", error);
            const message = error?.message || "Gagal memperbarui toko.";
            setStatus(message);
            throw new Error(message);
        }
    };

    return (
        <>
            <div className="w-full lg:w-80 shrink-0">
                <div className="h-full rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl p-6 flex flex-col gap-4 text-white">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-1">
                            Aksi Cepat
                        </p>
                        <h3 className="text-2xl font-bold">Kelola Toko</h3>
                        <p className="text-sm text-white/80">
                            Update informasi toko, alamat, hingga jam operasional secara instan.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="w-full px-6 py-3 rounded-2xl font-semibold text-[#0E101A] bg-white shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-200"
                        >
                            Edit Toko
                        </button>
                        <Link
                            href={`/Toko/${store.slug_toko}`}
                            className="w-full inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold border-2 border-white/40 text-white hover:bg-white/10 transition-all duration-200"
                        >
                            Lihat Halaman Toko
                        </Link>
                    </div>

                    {status && (
                        <p className="text-xs font-medium text-white/90 bg-white/10 border border-white/20 rounded-2xl px-4 py-2">
                            {status}
                        </p>
                    )}
                </div>
            </div>

            <EditModalToko
                open={open}
                onClose={() => setOpen(false)}
                data={store}
                onSubmit={handleSubmit}
            />
        </>
    );
}
