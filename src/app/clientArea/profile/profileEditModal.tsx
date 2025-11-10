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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => onClose(false)}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
                        <p className="text-sm text-gray-600 mt-1">Perbarui informasi personal Anda</p>
                    </div>
                    <button
                        onClick={() => onClose(false)}
                        className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all"
                        aria-label="Tutup modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Left Section - Form */}
                    <form
                        id="profile-edit-form"
                        className="flex-1 px-8 py-6 space-y-6"
                        onSubmit={handleSubmit}
                    >
                        {/* Biodata Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Biodata
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                        Nama Depan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="Masukkan nama depan"
                                        value={formData.first_name}
                                        onChange={handleInputChange("first_name")}
                                        disabled={isLoading || loading}
                                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                        Nama Belakang
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Masukkan nama belakang"
                                        value={formData.last_name}
                                        onChange={handleInputChange("last_name")}
                                        disabled={isLoading || loading}
                                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                                    Tanggal Lahir
                                </label>
                                <input
                                    id="birthDate"
                                    type="date"
                                    value={formData.tgl_lahir}
                                    onChange={handleInputChange("tgl_lahir")}
                                    disabled={isLoading || loading}
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <div className="flex gap-6 mt-3">
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
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Pria</span>
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
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Wanita</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Nomor HP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+62 812-3456-7890"
                                    value={formData.telepon}
                                    onChange={handleInputChange("telepon")}
                                    disabled={isLoading || loading}
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                        </div>
                    </form>

                    {/* Right Section - Profile Picture */}
                    <div className="lg:w-80 bg-linear-to-br from-gray-50 to-blue-50 border-l border-gray-200 px-8 py-6 flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center w-full">
                            <p className="text-sm font-medium text-gray-700 mb-4">Foto Profil</p>

                            {/* Profile Picture Preview */}
                            <div className="relative mb-6">
                                <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 text-6xl font-bold shadow-xl ring-4 ring-white">
                                    {isLoading ? '?' : user?.first_name.charAt(0)}
                                </div>
                            </div>

                            {/* Upload Button */}
                            <button
                                type="button"
                                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-blue-400 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Foto
                            </button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                JPG, PNG atau GIF<br />
                                Maksimal 5MB
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        Batalkan
                    </button>
                    <button
                        type="submit"
                        form="profile-edit-form"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    )
}