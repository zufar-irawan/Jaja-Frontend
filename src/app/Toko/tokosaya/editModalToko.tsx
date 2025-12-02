"use client";

import { useEffect, useMemo, useState } from "react";
import { parseBukaTokoData } from "@/utils/tokoService";
import type { MyTokoDetail } from "@/utils/tokoService";

interface EditModalTokoProps {
    open: boolean;
    onClose: () => void;
    data?: Partial<MyTokoDetail>;
    onSubmit?: (payload: StorePayload) => Promise<void> | void;
}

export type StorePayload = {
    nama_toko: string;
    deskripsi_toko: string;
    greating_message: string;
    alamat_toko: string;
    alamat_google: string;
    latitude: string;
    longitude: string;
    provinsi: number;
    kota_kabupaten: number;
    kecamatan: number;
    kelurahan: number;
    kode_pos: string;
    free_ongkir: boolean;
    min_free_ongkir: number;
    pilihan_kurir: string[];
    kurir_service: Record<string, string[]>;
    data_buka_toko: {
        days: string;
        time_open: string;
        time_close: string;
    };
    data_libur_toko: string | null;
};

const defaultPayload: StorePayload = {
    nama_toko: "ZATA.TECH Premium Store",
    deskripsi_toko:
        "Spesialis iPhone, Samsung & Gadget Original 100% Garansi Resmi",
    greating_message: "Terima kasih sudah berkunjung! Ada yang bisa kami bantu?",
    alamat_toko: "Jl. Puri Harapan Jaya No.88, Bekasi Barat",
    alamat_google:
        "Jl. Puri Harapan Jaya, RT.005/RW.012, Pejuang, Medan Satria, Kota Bekasi",
    latitude: "-6.234567",
    longitude: "106.789012",
    provinsi: 12,
    kota_kabupaten: 150,
    kecamatan: 1501,
    kelurahan: 150101,
    kode_pos: "17215",
    free_ongkir: true,
    min_free_ongkir: 200000,
    pilihan_kurir: ["jne", "jnt", "sicepat", "anteraja", "ninja"],
    kurir_service: {
        jne: ["REG", "YES"],
        jnt: ["EZ"],
        sicepat: ["BEST", "REG"],
        anteraja: ["Reguler"],
        ninja: ["Reguler"],
    },
    data_buka_toko: {
        days: "monday,tuesday,wednesday,thursday,friday,saturday,sunday",
        time_open: "08:00",
        time_close: "22:00",
    },
    data_libur_toko: null,
};

const courierOptions = ["jne", "jnt", "sicepat", "anteraja", "ninja"] as const;

const splitCourierString = (value: string | undefined | null): string[] => {
    if (!value) return [];
    return value
        .split(":")
        .map((item) => item.trim())
        .filter(Boolean);
};

const normalizePilihanKurir = (
    value: MyTokoDetail["pilihan_kurir"] | undefined,
): string[] => {
    if (Array.isArray(value)) {
        return value;
    }

    return splitCourierString(typeof value === "string" ? value : undefined);
};

const normalizeKurirService = (
    value: MyTokoDetail["kurir_service"] | undefined,
): StorePayload["kurir_service"] => {
    if (!value) {
        return defaultPayload.kurir_service;
    }

    const candidate = value as unknown;
    if (typeof candidate === "string") {
        try {
            const parsed = JSON.parse(candidate);
            if (parsed && typeof parsed === "object") {
                return parsed as StorePayload["kurir_service"];
            }
        } catch (error) {
            console.warn("Failed to parse kurir_service string", error);
        }
        return defaultPayload.kurir_service;
    }

    return value;
};

const normalizeSchedule = (
    value: MyTokoDetail["data_buka_toko"] | undefined,
): StorePayload["data_buka_toko"] => {
    if (!value) {
        return defaultPayload.data_buka_toko;
    }

    if (typeof value === "string") {
        return (
            parseBukaTokoData(value) ?? {
                ...defaultPayload.data_buka_toko,
            }
        );
    }

    return value;
};

export default function EditModalToko({ open, onClose, data, onSubmit }: EditModalTokoProps) {
    const hydratedDefault = useMemo<StorePayload>(() => {
        if (!data) return defaultPayload;

        return {
            ...defaultPayload,
            ...data,
            nama_toko: data.nama_toko ?? defaultPayload.nama_toko,
            deskripsi_toko: data.deskripsi_toko ?? defaultPayload.deskripsi_toko,
            greating_message: data.greating_message ?? "",
            alamat_toko: data.alamat_toko ?? defaultPayload.alamat_toko,
            alamat_google: data.alamat_google ?? "",
            latitude: data.latitude ?? "",
            longitude: data.longitude ?? "",
            provinsi: data.provinsi ?? defaultPayload.provinsi,
            kota_kabupaten: data.kota_kabupaten ?? defaultPayload.kota_kabupaten,
            kecamatan: data.kecamatan ?? defaultPayload.kecamatan,
            kelurahan: data.kelurahan ?? defaultPayload.kelurahan,
            kode_pos: data.kode_pos ?? defaultPayload.kode_pos,
            free_ongkir: (data.free_ongkir ?? "T") === "Y",
            min_free_ongkir: data.min_free_ongkir ?? defaultPayload.min_free_ongkir,
            pilihan_kurir: normalizePilihanKurir(data.pilihan_kurir),
            kurir_service: normalizeKurirService(data.kurir_service),
            data_buka_toko: normalizeSchedule(data.data_buka_toko),
            data_libur_toko: data.data_libur_toko ?? null,
        } as StorePayload;
    }, [data]);

    const [form, setForm] = useState<StorePayload>(hydratedDefault);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        setForm(hydratedDefault);
    }, [hydratedDefault]);

    if (!open) return null;

    const updateField = <K extends keyof StorePayload>(key: K, value: StorePayload[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleCourier = (courier: string) => {
        setForm((prev) => {
            const exists = prev.pilihan_kurir.includes(courier);
            return {
                ...prev,
                pilihan_kurir: exists
                    ? prev.pilihan_kurir.filter((item) => item !== courier)
                    : [...prev.pilihan_kurir, courier],
            };
        });
    };

    const updateCourierServices = (courier: string, value: string) => {
        const services = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        setForm((prev) => ({
            ...prev,
            kurir_service: {
                ...prev.kurir_service,
                [courier]: services,
            },
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            await onSubmit?.(form);
            setMessage("Perubahan toko berhasil disimpan.");
        } catch (error: any) {
            console.error("Failed to update store", error);
            setMessage(error?.message || "Gagal menyimpan perubahan.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit Profil Toko</h2>
                        <p className="text-sm text-gray-500">
                            Perbarui informasi toko kamu kapan saja.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Tutup modal"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
                    {message && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                            {message}
                        </div>
                    )}

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nama Toko</label>
                            <input
                                type="text"
                                value={form.nama_toko}
                                onChange={(e) => updateField("nama_toko", e.target.value)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Pesan Sambutan</label>
                            <input
                                type="text"
                                value={form.greating_message}
                                onChange={(e) => updateField("greating_message", e.target.value)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Deskripsi Toko</label>
                        <textarea
                            value={form.deskripsi_toko}
                            onChange={(e) => updateField("deskripsi_toko", e.target.value)}
                            className="min-h-[120px] rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            required
                        />
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Alamat Toko</label>
                            <textarea
                                value={form.alamat_toko}
                                onChange={(e) => updateField("alamat_toko", e.target.value)}
                                className="min-h-[100px] rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Alamat Google</label>
                            <textarea
                                value={form.alamat_google}
                                onChange={(e) => updateField("alamat_google", e.target.value)}
                                className="min-h-[100px] rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Latitude</label>
                            <input
                                type="text"
                                value={form.latitude}
                                onChange={(e) => updateField("latitude", e.target.value)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Longitude</label>
                            <input
                                type="text"
                                value={form.longitude}
                                onChange={(e) => updateField("longitude", e.target.value)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        {["provinsi", "kota_kabupaten", "kecamatan", "kelurahan"].map((key) => (
                            <div key={key} className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">{key.replace("_", " ")}</label>
                                <input
                                    type="number"
                                    value={form[key as keyof StorePayload] as number}
                                    onChange={(e) =>
                                        updateField(key as keyof StorePayload, Number(e.target.value) || 0)
                                    }
                                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Kode Pos</label>
                            <input
                                type="text"
                                value={form.kode_pos}
                                onChange={(e) => updateField("kode_pos", e.target.value)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            />
                        </div>
                    </section>

                    <section className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Free Ongkir</label>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.free_ongkir}
                                        onChange={(e) => updateField("free_ongkir", e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    Aktifkan free ongkir
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Min. Free Ongkir</label>
                            <input
                                type="number"
                                value={form.min_free_ongkir}
                                onChange={(e) => updateField("min_free_ongkir", Number(e.target.value) || 0)}
                                className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                min={0}
                                step={1000}
                            />
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Pilihan Kurir</h3>
                        <div className="flex flex-wrap gap-3">
                            {courierOptions.map((courier) => (
                                <label
                                    key={courier}
                                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${{
                                        true: "border-blue-200 bg-blue-50 text-blue-700",
                                        false: "border-gray-200 text-gray-600 hover:border-gray-300",
                                    }[String(form.pilihan_kurir.includes(courier)) as "true" | "false"]}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={form.pilihan_kurir.includes(courier)}
                                        onChange={() => toggleCourier(courier)}
                                    />
                                    {courier.toUpperCase()}
                                </label>
                            ))}
                        </div>

                        <div className="mt-4 space-y-3">
                            {form.pilihan_kurir.map((courier) => (
                                <div key={courier} className="flex flex-col gap-2 rounded-2xl border border-gray-200 p-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Layanan {courier.toUpperCase()}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Pisahkan dengan koma contoh REG, YES"
                                        value={form.kurir_service[courier]?.join(", ") || ""}
                                        onChange={(e) => updateCourierServices(courier, e.target.value)}
                                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Jam Operasional</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Hari Operasional</label>
                                <input
                                    type="text"
                                    value={form.data_buka_toko.days}
                                    onChange={(e) =>
                                        updateField("data_buka_toko", {
                                            ...form.data_buka_toko,
                                            days: e.target.value,
                                        })
                                    }
                                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Buka</label>
                                <input
                                    type="time"
                                    value={form.data_buka_toko.time_open}
                                    onChange={(e) =>
                                        updateField("data_buka_toko", {
                                            ...form.data_buka_toko,
                                            time_open: e.target.value,
                                        })
                                    }
                                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-600">Tutup</label>
                                <input
                                    type="time"
                                    value={form.data_buka_toko.time_close}
                                    onChange={(e) =>
                                        updateField("data_buka_toko", {
                                            ...form.data_buka_toko,
                                            time_close: e.target.value,
                                        })
                                    }
                                    className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Data Libur Toko</label>
                        <input
                            type="text"
                            value={form.data_libur_toko ?? ""}
                            onChange={(e) => updateField("data_libur_toko", e.target.value || null)}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm"
                            placeholder="Contoh: 2024-12-25"
                        />
                    </section>

                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 md:flex-row md:items-center md:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            disabled={submitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
                            disabled={submitting}
                        >
                            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}