import React, { useEffect, useState } from "react"
import { useClientArea } from "../ClientAreaContext";

interface ProfileEditModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
    const { user, isLoading } = useClientArea();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (!user) return;
        const normalizedGender = user.jenis_kelamin?.toLowerCase() || "";
        setFormData({
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            birthDate: user.tgl_lahir ?? "",
            gender: normalizedGender.includes("pria") || normalizedGender.startsWith("l") ? "pria"
                : normalizedGender.includes("wanita") || normalizedGender.startsWith("p") ? "wanita"
                    : normalizedGender,
            email: user.email ?? "",
            phone: user.telepon ?? "",
        });
    }, [user]);

    const handleInputChange = (key: keyof typeof formData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [key]: event.target.value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("submit profile payload", formData);
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
                                        value={formData.firstName}
                                        onChange={handleInputChange("firstName")}
                                        disabled={isLoading}
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
                                        value={formData.lastName}
                                        onChange={handleInputChange("lastName")}
                                        disabled={isLoading}
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
                                    value={formData.birthDate}
                                    onChange={handleInputChange("birthDate")}
                                    disabled={isLoading}
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
                                            name="gender"
                                            value="pria"
                                            checked={formData.gender === "pria"}
                                            onChange={handleInputChange("gender")}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Pria</span>
                                    </label>

                                    <label htmlFor="wanita" className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            id="wanita"
                                            name="gender"
                                            value="wanita"
                                            checked={formData.gender === "wanita"}
                                            onChange={handleInputChange("gender")}
                                            disabled={isLoading}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Wanita</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Contact Info Section */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Informasi Kontak
                            </h2>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="contoh@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange("email")}
                                    disabled={isLoading}
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Nomor HP <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+62 812-3456-7890"
                                    value={formData.phone}
                                    onChange={handleInputChange("phone")}
                                    disabled={isLoading}
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
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
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