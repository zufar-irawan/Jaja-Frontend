"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getStoreProvinces,
    getStoreCities,
    getStoreDistricts,
    getStoreVillages,
    openStore,
    type ProvinceOption,
    type CityOption,
    type DistrictOption,
    type VillageOption,
    type OpenStorePayload,
} from "@/utils/tokoService";

interface FormState {
    nama_toko: string;
    deskripsi_toko: string;
    alamat_toko: string;
    provinsi: number | null;
    kota_kabupaten: number | null;
    kecamatan: number | null;
    kelurahan: number | null;
    kode_pos: string;
    skor: number;
}

const initialForm: FormState = {
    nama_toko: "",
    deskripsi_toko: "",
    alamat_toko: "",
    provinsi: null,
    kota_kabupaten: null,
    kecamatan: null,
    kelurahan: null,
    kode_pos: "",
    skor: 10,
};

export default function BukaTokoPage() {
    const [form, setForm] = useState<FormState>(initialForm);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
    const [cities, setCities] = useState<CityOption[]>([]);
    const [districts, setDistricts] = useState<DistrictOption[]>([]);
    const [villages, setVillages] = useState<VillageOption[]>([]);

    const [loadingLoc, setLoadingLoc] = useState({
        prov: false,
        city: false,
        dist: false,
        vill: false,
    });

    const canSubmit = useMemo(() => {
        return (
            !!form.nama_toko &&
            !!form.deskripsi_toko &&
            !!form.alamat_toko &&
            !!form.provinsi &&
            !!form.kota_kabupaten &&
            !!form.kecamatan &&
            !!form.kelurahan &&
            !!form.kode_pos
        );
    }, [form]);

    useEffect(() => {
        const loadProvinces = async () => {
            setLoadingLoc((prev) => ({ ...prev, prov: true }));
            try {
                const response = await getStoreProvinces(1, 200);
                if (response.success && response.data) {
                    setProvinces(response.data);
                }
            } finally {
                setLoadingLoc((prev) => ({ ...prev, prov: false }));
            }
        };

        void loadProvinces();
    }, []);

    const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onProvinceChange = async (value: string) => {
        const numericValue = Number(value);
        updateField("provinsi", Number.isNaN(numericValue) ? null : numericValue);
        updateField("kota_kabupaten", null);
        updateField("kecamatan", null);
        updateField("kelurahan", null);
        setCities([]);
        setDistricts([]);
        setVillages([]);

        if (!numericValue) return;

        setLoadingLoc((prev) => ({ ...prev, city: true }));
        try {
            const response = await getStoreCities(numericValue, 1, 200);
            if (response.success && response.data) {
                setCities(response.data);
            }
        } finally {
            setLoadingLoc((prev) => ({ ...prev, city: false }));
        }
    };

    const onCityChange = async (value: string) => {
        const numericValue = Number(value);
        updateField("kota_kabupaten", Number.isNaN(numericValue) ? null : numericValue);
        updateField("kecamatan", null);
        updateField("kelurahan", null);
        setDistricts([]);
        setVillages([]);

        if (!numericValue) return;

        setLoadingLoc((prev) => ({ ...prev, dist: true }));
        try {
            const response = await getStoreDistricts(numericValue, 1, 200);
            if (response.success && response.data) {
                setDistricts(response.data);
            }
        } finally {
            setLoadingLoc((prev) => ({ ...prev, dist: false }));
        }
    };

    const onDistrictChange = async (value: string) => {
        const numericValue = Number(value);
        updateField("kecamatan", Number.isNaN(numericValue) ? null : numericValue);
        updateField("kelurahan", null);
        setVillages([]);

        if (!numericValue) return;

        const selected = districts.find((dist) => dist.kecamatan_id === numericValue);
        const kecamatanKd = selected?.kecamatan_kd || String(value);

        setLoadingLoc((prev) => ({ ...prev, vill: true }));
        try {
            const response = await getStoreVillages(kecamatanKd, 1, 200);
            if (response.success && response.data) {
                setVillages(response.data);
            }
        } finally {
            setLoadingLoc((prev) => ({ ...prev, vill: false }));
        }
    };

    const onVillageChange = (value: string) => {
        const numericValue = Number(value);
        updateField("kelurahan", Number.isNaN(numericValue) ? null : numericValue);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit) {
            setError("Mohon lengkapi seluruh data");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        const payload: OpenStorePayload = {
            nama_toko: form.nama_toko,
            deskripsi_toko: form.deskripsi_toko,
            alamat_toko: form.alamat_toko,
            provinsi: form.provinsi ?? 0,
            kota_kabupaten: form.kota_kabupaten ?? 0,
            kecamatan: form.kecamatan ?? 0,
            kelurahan: form.kelurahan ?? 0,
            kode_pos: form.kode_pos,
            skor: form.skor,
        };

        try {
            const response = await openStore(payload);
            if (!response.success) {
                throw new Error(response.message || "Gagal membuka toko");
            }
            setMessage(response.message || "Toko berhasil dibuat");
            setForm(initialForm);
            setCities([]);
            setDistricts([]);
            setVillages([]);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat membuka toko");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-10">
            <header className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-500">
                    Buka Toko
                </p>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">
                    Mulai perjalanan tokomu di Jaja
                </h1>
                <p className="text-gray-600 mt-2">
                    Lengkapi informasi di bawah ini untuk mengaktifkan toko dan mulai berjualan.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-3xl bg-white p-6 shadow-lg"
            >
                {message && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
                        {error}
                    </div>
                )}

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Nama Toko</label>
                        <input
                            type="text"
                            value={form.nama_toko}
                            onChange={(e) => updateField("nama_toko", e.target.value)}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Contoh: ZATATECH Official"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Skor Awal</label>
                        <input
                            type="number"
                            min={0}
                            value={form.skor}
                            onChange={(e) => updateField("skor", Number(e.target.value) || 0)}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </section>

                <section className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi Toko</label>
                    <textarea
                        value={form.deskripsi_toko}
                        onChange={(e) => updateField("deskripsi_toko", e.target.value)}
                        className="min-h-[120px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Ceritakan keunggulan toko Anda"
                        required
                    />
                </section>

                <section className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Alamat Toko</label>
                    <textarea
                        value={form.alamat_toko}
                        onChange={(e) => updateField("alamat_toko", e.target.value)}
                        className="min-h-[100px] rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        placeholder="Isi alamat lengkap toko"
                        required
                    />
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Provinsi</label>
                        <select
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={form.provinsi ?? ""}
                            onChange={(e) => onProvinceChange(e.target.value)}
                            disabled={loadingLoc.prov}
                        >
                            <option value="">Pilih provinsi</option>
                            {provinces.map((prov) => (
                                <option key={prov.province_id} value={prov.province_id}>
                                    {prov.province}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                        <select
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={form.kota_kabupaten ?? ""}
                            onChange={(e) => onCityChange(e.target.value)}
                            disabled={!form.provinsi || loadingLoc.city}
                        >
                            <option value="">Pilih kota/kabupaten</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.type ? `${city.type} ${city.city_name}` : city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Kecamatan</label>
                        <select
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={form.kecamatan ?? ""}
                            onChange={(e) => onDistrictChange(e.target.value)}
                            disabled={!form.kota_kabupaten || loadingLoc.dist}
                        >
                            <option value="">Pilih kecamatan</option>
                            {districts.map((district) => (
                                <option key={district.kecamatan_id} value={district.kecamatan_id}>
                                    {district.kecamatan}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Kelurahan</label>
                        <select
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            value={form.kelurahan ?? ""}
                            onChange={(e) => onVillageChange(e.target.value)}
                            disabled={!form.kecamatan || loadingLoc.vill}
                        >
                            <option value="">Pilih kelurahan</option>
                            {villages.map((village) => (
                                <option key={village.kelurahan_id} value={village.kelurahan_id}>
                                    {village.kelurahan_desa}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Kode Pos</label>
                        <input
                            type="text"
                            value={form.kode_pos}
                            onChange={(e) => updateField("kode_pos", e.target.value)}
                            className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="17215"
                            maxLength={10}
                            required
                        />
                    </div>
                </section>

                <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-end">
                    <button
                        type="reset"
                        onClick={() => {
                            setForm(initialForm);
                            setCities([]);
                            setDistricts([]);
                            setVillages([]);
                        }}
                        className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={loading || !canSubmit}
                    >
                        {loading ? "Menyimpan..." : "Buka Toko"}
                    </button>
                </div>
            </form>
        </div>
    );
}