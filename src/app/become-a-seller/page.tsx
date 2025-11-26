"use client";

import { useEffect, useState } from "react";
import { Store, MessageSquare, FileText, MapPin } from "lucide-react";
import Swal from "sweetalert2";
import {
    City,
    District,
    Province,
    Village,
    getCities,
    getDistricts,
    getProvinces,
    getVillages,
} from "@/utils/userService";

const toArray = <T,>(payload: any): T[] => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
};

const getCityLabel = (city: City) => `${city.type ? `${city.type} ` : ""}${city.city_name}`.trim();

const initialFormState = {
    nama_toko: "",
    greeting_message: "",
    deskripsi_toko: "",
    alamat_toko: "",
    provinsi: "",
    kota_kabupaten: "",
    kecamatan: "",
    kelurahan: "",
    kode_pos: "",
};

export default function BecomeASellerPage() {
    const [formData, setFormData] = useState({ ...initialFormState });

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
    const [locationLoading, setLocationLoading] = useState({
        province: false,
        city: false,
        district: false,
        village: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        const loadProvinces = async () => {
            setLocationLoading((prev) => ({ ...prev, province: true }));
            try {
                const response = await getProvinces(1, 200);
                if (response.success && response.data) {
                    setProvinces(toArray<Province>(response.data));
                }
            } finally {
                setLocationLoading((prev) => ({ ...prev, province: false }));
            }
        };

        void loadProvinces();
    }, []);

    const resetBelowProvince = () => {
        setCities([]);
        setDistricts([]);
        setVillages([]);
        setSelectedProvinceId(null);
        setSelectedCityId(null);
        setSelectedDistrictId(null);
        setFormData((prev) => ({
            ...prev,
            kota_kabupaten: "",
            kecamatan: "",
            kelurahan: "",
        }));
    };

    const resetBelowCity = () => {
        setDistricts([]);
        setVillages([]);
        setSelectedCityId(null);
        setSelectedDistrictId(null);
        setFormData((prev) => ({
            ...prev,
            kecamatan: "",
            kelurahan: "",
        }));
    };

    const resetBelowDistrict = () => {
        setVillages([]);
        setSelectedDistrictId(null);
        setFormData((prev) => ({
            ...prev,
            kelurahan: "",
        }));
    };

    const handleProvinceSelect = async (value: string) => {
        if (!value) {
            setFormData((prev) => ({ ...prev, provinsi: "" }));
            resetBelowProvince();
            return;
        }

        setFormData((prev) => ({
            ...prev,
            provinsi: value,
            kota_kabupaten: "",
            kecamatan: "",
            kelurahan: "",
        }));
        setCities([]);
        setDistricts([]);
        setVillages([]);
        const selected = provinces.find((prov) => prov.province === value);
        const provinceId = selected ? Number(selected.province_id) : null;
        setSelectedProvinceId(provinceId);
        setSelectedCityId(null);
        setSelectedDistrictId(null);

        if (!provinceId) return;

        setLocationLoading((prev) => ({ ...prev, city: true }));
        try {
            const response = await getCities(provinceId, 1, 200);
            if (response.success && response.data) {
                setCities(toArray<City>(response.data));
            }
        } finally {
            setLocationLoading((prev) => ({ ...prev, city: false }));
        }
    };

    const handleCitySelect = async (value: string) => {
        if (!value) {
            setFormData((prev) => ({ ...prev, kota_kabupaten: "" }));
            resetBelowCity();
            return;
        }

        setFormData((prev) => ({
            ...prev,
            kota_kabupaten: value,
            kecamatan: "",
            kelurahan: "",
        }));
        setDistricts([]);
        setVillages([]);
        const selected = cities.find((city) => getCityLabel(city) === value);
        const cityId = selected ? Number(selected.city_id) : null;
        setSelectedCityId(cityId);
        setSelectedDistrictId(null);

        if (!cityId) return;

        setLocationLoading((prev) => ({ ...prev, district: true }));
        try {
            const response = await getDistricts(cityId, 1, 200);
            if (response.success && response.data) {
                setDistricts(toArray<District>(response.data));
            }
        } finally {
            setLocationLoading((prev) => ({ ...prev, district: false }));
        }
    };

    const handleDistrictSelect = async (value: string) => {
        if (!value) {
            setFormData((prev) => ({ ...prev, kecamatan: "" }));
            resetBelowDistrict();
            return;
        }

        setFormData((prev) => ({
            ...prev,
            kecamatan: value,
            kelurahan: "",
        }));
        setVillages([]);
        const selected = districts.find((district) => district.kecamatan === value);
        const districtId = selected ? Number(selected.kecamatan_id) : null;
        setSelectedDistrictId(districtId);

        if (!selected || !selected.kecamatan_kd) return;

        setLocationLoading((prev) => ({ ...prev, village: true }));
        try {
            const response = await getVillages(selected.kecamatan_kd, 1, 200);
            if (response.success && response.data) {
                setVillages(toArray<Village>(response.data));
            }
        } finally {
            setLocationLoading((prev) => ({ ...prev, village: false }));
        }
    };

    const handleVillageSelect = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            kelurahan: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                nama_toko: formData.nama_toko,
                greating_message: formData.greeting_message,
                deskripsi_toko: formData.deskripsi_toko,
                alamat_toko: formData.alamat_toko,
                provinsi: formData.provinsi,
                kota_kabupaten: formData.kota_kabupaten,
                kecamatan: formData.kecamatan,
                kelurahan: formData.kelurahan,
                kode_pos: formData.kode_pos,
            };

            const response = await fetch("/api/seller/create-toko", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));
            const isSuccess = response.ok && result?.success;
            const successMessage = result?.message || "Toko berhasil dibuat";
            const errorMessage = result?.message || "Toko gagal dibuat";

            if (isSuccess) {
                await Swal.fire(
                    "Berhasil",
                    successMessage,
                    "success",
                );
                setFormData({ ...initialFormState });
                setCities([]);
                setDistricts([]);
                setVillages([]);
                setSelectedProvinceId(null);
                setSelectedCityId(null);
                setSelectedDistrictId(null);
            } else {
                await Swal.fire(
                    "Gagal",
                    errorMessage,
                    "error",
                );
            }
        } catch (error: any) {
            await Swal.fire(
                "Terjadi Kesalahan",
                error?.message || "Gagal membuat toko",
                "error",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <Store className="w-12 h-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Menjadi Seller</h1>
                    <p className="text-gray-600">
                        Lengkapi informasi toko Anda untuk mulai berjualan di JajaID
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="nama_toko"
                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                            >
                                <Store className="w-4 h-4 mr-2 text-gray-500" />
                                Nama Toko
                            </label>
                            <input
                                type="text"
                                id="nama_toko"
                                name="nama_toko"
                                value={formData.nama_toko}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Masukkan nama toko Anda"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="greeting_message"
                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                            >
                                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                                Greeting Message
                            </label>
                            <input
                                type="text"
                                id="greeting_message"
                                name="greeting_message"
                                value={formData.greeting_message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Pesan sambutan untuk pelanggan"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="deskripsi_toko"
                                className="flex items-center text-sm font-medium text-gray-700 mb-2"
                            >
                                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                Deskripsi Toko
                            </label>
                            <textarea
                                id="deskripsi_toko"
                                name="deskripsi_toko"
                                rows={4}
                                value={formData.deskripsi_toko}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all resize-none"
                                placeholder="Ceritakan tentang toko Anda"
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                                Alamat Toko
                            </h3>
                        </div>

                        <div>
                            <label
                                htmlFor="alamat_toko"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Alamat Lengkap
                            </label>
                            <textarea
                                id="alamat_toko"
                                name="alamat_toko"
                                rows={3}
                                value={formData.alamat_toko}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all resize-none"
                                placeholder="Jalan, nomor rumah, RT/RW"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="provinsi" className="block text-sm font-medium text-gray-700 mb-2">
                                    Provinsi
                                </label>
                                <select
                                    id="provinsi"
                                    name="provinsi"
                                    value={formData.provinsi}
                                    onChange={(e) => handleProvinceSelect(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all bg-white"
                                >
                                    <option value="">
                                        {locationLoading.province ? "Memuat..." : "Pilih provinsi"}
                                    </option>
                                    {provinces.map((province) => (
                                        <option key={province.province_id} value={province.province}>
                                            {province.province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="kota_kabupaten"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Kota/Kabupaten
                                </label>
                                <select
                                    id="kota_kabupaten"
                                    name="kota_kabupaten"
                                    value={formData.kota_kabupaten}
                                    onChange={(e) => handleCitySelect(e.target.value)}
                                    required
                                    disabled={!selectedProvinceId}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="">
                                        {locationLoading.city ? "Memuat..." : "Pilih kota/kabupaten"}
                                    </option>
                                    {cities.map((city) => {
                                        const label = getCityLabel(city);
                                        return (
                                            <option key={city.city_id} value={label}>
                                                {label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="kecamatan"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Kecamatan
                                </label>
                                <select
                                    id="kecamatan"
                                    name="kecamatan"
                                    value={formData.kecamatan}
                                    onChange={(e) => handleDistrictSelect(e.target.value)}
                                    required
                                    disabled={!selectedCityId}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="">
                                        {locationLoading.district ? "Memuat..." : "Pilih kecamatan"}
                                    </option>
                                    {districts.map((district) => (
                                        <option key={district.kecamatan_id} value={district.kecamatan}>
                                            {district.kecamatan}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="kelurahan"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Kelurahan
                                </label>
                                <select
                                    id="kelurahan"
                                    name="kelurahan"
                                    value={formData.kelurahan}
                                    onChange={(e) => handleVillageSelect(e.target.value)}
                                    required
                                    disabled={!selectedDistrictId}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="">
                                        {locationLoading.village ? "Memuat..." : "Pilih kelurahan"}
                                    </option>
                                    {villages.map((village) => (
                                        <option key={village.kelurahan_id} value={village.kelurahan_desa}>
                                            {village.kelurahan_desa}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="kode_pos"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Kode Pos
                            </label>
                            <input
                                type="text"
                                id="kode_pos"
                                name="kode_pos"
                                value={formData.kode_pos}
                                onChange={handleChange}
                                required
                                maxLength={5}
                                pattern="[0-9]{5}"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-transparent transition-all"
                                placeholder="12345"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Mendaftarkan..." : "Daftar Sekarang"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}