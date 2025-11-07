'use client'

import { useState } from "react";
import ProfileEditModal from "./profileEditModal";
import ProfileImageModal from "./profileImageModal";
import { useClientArea } from "../ClientAreaContext";

export default function ProfilePage() {
    const [modalEditProfile, setModalEditProfile] = useState(false);
    const [modalEditImage, setModalEditImage] = useState(false);

    const { user, isLoading } = useClientArea()

    return (
        <div className="flex flex-col w-full gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Profil
                </h1>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section - Profile Info */}
                    <div className="flex-1 p-8">
                        {/* Biodata Section */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Biodata
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-start">
                                    <span className="text-sm font-medium text-gray-500 w-36">Nama</span>
                                    <span className="text-sm text-gray-900 font-medium">{isLoading ? 'Sabar tungguin...' : user?.nama_lengkap}</span>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-sm font-medium text-gray-500 w-36">Tanggal Lahir</span>
                                    <span className="text-sm text-gray-900">{isLoading ? 'Sabar tungguin...' : (user?.tgl_lahir || '-')}</span>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-sm font-medium text-gray-500 w-36">Jenis Kelamin</span>
                                    <span className="text-sm text-gray-900">{isLoading ? 'Sabar tungguin...' : (user?.jenis_kelamin || '-')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-8"></div>

                        {/* Contact Info Section */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Info Kontak
                            </h2>

                            <div className="space-y-5">
                                <div className="flex items-start">
                                    <span className="text-sm font-medium text-gray-500 w-36">Email</span>
                                    <span className="text-sm text-gray-900">{isLoading ? 'Sabar tungguin...' : user?.email}</span>
                                </div>

                                <div className="flex items-start">
                                    <span className="text-sm font-medium text-gray-500 w-36">Nomor HP</span>
                                    <span className="text-sm text-gray-900">{isLoading ? 'Sabar tungguin...' : user?.telepon}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Profile Picture & Actions */}
                    <div className="lg:w-80 bg-linear-to-br from-blue-50 to-indigo-50 border-l border-gray-200 p-8 flex flex-col items-center justify-center">
                        <div className="flex flex-col items-center w-full max-w-xs">
                            {/* Profile Picture */}
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-5xl font-bold shadow-lg ring-4 ring-white">
                                    {isLoading ? '?' : user?.first_name.charAt(0)}
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{isLoading ? '?' : user?.first_name}</h3>
                                <p className="text-sm text-gray-600">{isLoading ? '?' : user?.email}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 w-full">
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                    onClick={() => setModalEditProfile(true)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    Edit Profil
                                </button>

                                <button
                                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 border-2 border-gray-300 hover:border-blue-400 flex items-center justify-center gap-2"
                                    onClick={() => setModalEditImage(true)}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Ganti Foto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalEditProfile && (
                <ProfileEditModal onClose={setModalEditProfile} />
            )}

            {modalEditImage && (
                <ProfileImageModal onClose={setModalEditImage} />
            )}
        </div>
    )
}