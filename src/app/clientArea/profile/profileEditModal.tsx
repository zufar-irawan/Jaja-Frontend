import React, { useEffect, useState } from "react"
import { useClientArea } from "../ClientAreaContext";
import Swal from "sweetalert2";
import { updateUserProfile } from "@/utils/userService";

interface ProfileEditModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    let withoutPrefix = digits
    if (withoutPrefix.startsWith("62")) {
        withoutPrefix = withoutPrefix.slice(2)
    } else if (withoutPrefix.startsWith("0")) {
        withoutPrefix = withoutPrefix.slice(1)
    }
    return withoutPrefix ? `+62${withoutPrefix}` : "+62"
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
    const { user, isLoading, refetch } = useClientArea();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        nama_lengkap: "",
        username: "",
        telepon: "",
        jenis_kelamin: "",
        tgl_lahir: "",
    });

    useEffect(() => {
        if (!user) return;
        const normalizedGender = user.jenis_kelamin?.toLowerCase() || "";
        setFormData({
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            nama_lengkap: (user.nama_lengkap || `${user.first_name} ${user.last_name}`).trim(),
            username: (user.username || `${user.first_name}${user.last_name}`).replace(/\s+/g, "").toLowerCase(),
            telepon: normalizePhone(user.telepon ?? ""),
            jenis_kelamin: normalizedGender.includes("pria") || normalizedGender.startsWith("l") ? "pria"
                : normalizedGender.includes("wanita") || normalizedGender.startsWith("p") ? "wanita"
                    : normalizedGender,
            tgl_lahir: user.tgl_lahir ?? "",
        });
    }, [user]);

    const handleInputChange = (key: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (key === "telepon") {
            setFormData(prev => ({ ...prev, telepon: normalizePhone(event.target.value) }));
            return;
        }
        setFormData(prev => ({ ...prev, [key]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loading) return;
        setLoading(true);
        const payload = {
            ...formData,
            telepon: normalizePhone(formData.telepon),
        };

        try {
            const result = await updateUserProfile(payload);
            if (!result.success) {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: result.message || "Profil tidak dapat diperbarui.",
                    confirmButtonText: "Tutup",
                });
                return;
            }

            await refetch();
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Profil Anda telah diperbarui.",
                confirmButtonText: "Tutup",
            });
            onClose(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Terjadi kesalahan saat memperbarui profil.",
                confirmButtonText: "Tutup",
            });
        } finally {
            setLoading(false);
        }
    };

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/50 sm:backdrop-blur-sm">
            {/* Backdrop (desktop only) */}
            <div className="absolute inset-0 hidden sm:block" onClick={() => onClose(false)}></div>

            {/* Modal Content */}
            <div className="relative z-10 flex w-full flex-col bg-white rounded-none shadow-none sm:max-w-3xl sm:rounded-2xl sm:shadow-2xl sm:overflow-hidden">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-8 sm:py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Edit Profil</h1>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Perbarui informasi personal Anda</p>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all"
                        aria-label="Tutup modal"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto overscroll-contain">
                    {/* Left Section - Form */}
                    <form
                        id="profile-edit-form"
                        className="px-4 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6"
                        onSubmit={handleSubmit}
                    >
                        {/* Biodata Section */}
                        <div className="space-y-3 sm:space-y-4">
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Biodata
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="firstName" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Nama Depan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="Masukkan nama depan"
                                        value={formData.first_name}
                                        onChange={handleInputChange("first_name")}
                                        disabled={isLoading || loading}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="lastName" className="text-xs sm:text-sm font-medium text-gray-700">
                                        Nama Belakang
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Masukkan nama belakang"
                                        value={formData.last_name}
                                        onChange={handleInputChange("last_name")}
                                        disabled={isLoading || loading}
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <label htmlFor="birthDate" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="birthDate"
                                    type="date"
                                    value={formData.tgl_lahir}
                                    onChange={handleInputChange("tgl_lahir")}
                                    disabled={isLoading || loading}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <label className="text-xs sm:text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2 sm:mt-3">
                                    <label htmlFor="pria" className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            id="pria"
                                            name="jenis_kelamin"
                                            value="pria"
                                            checked={formData.jenis_kelamin === "pria"}
                                            onChange={handleInputChange("jenis_kelamin")}
                                            disabled={isLoading || loading}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900">Pria</span>
                                    </label>

                                    <label htmlFor="wanita" className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            id="wanita"
                                            name="jenis_kelamin"
                                            value="wanita"
                                            checked={formData.jenis_kelamin === "wanita"}
                                            onChange={handleInputChange("jenis_kelamin")}
                                            disabled={isLoading || loading}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-xs sm:text-sm text-gray-700 group-hover:text-gray-900">Wanita</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <label htmlFor="phone" className="text-xs sm:text-sm font-medium text-gray-700">
                                    Nomor HP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+62 812-3456-7890"
                                    value={formData.telepon}
                                    onChange={handleInputChange("telepon")}
                                    disabled={isLoading || loading}
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div
                    className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-5 border-t border-gray-200 bg-gray-50"
                >
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all h-9 sm:h-auto"
                    >
                        Batalkan
                    </button>
                    <button
                        type="submit"
                        form="profile-edit-form"
                        disabled={loading}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60 disabled:cursor-not-allowed h-9 sm:h-auto whitespace-nowrap"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    )
}