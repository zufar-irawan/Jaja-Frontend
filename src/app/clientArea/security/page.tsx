'use client'

import { KeyRound } from "lucide-react"
import { useState } from "react";
import ChangePassword from "./changePassword";

export default function SecurityPage() {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    return (
        <div className="w-full space-y-6">
            <h1 className="border-b border-gray-300 pb-4 text-3xl font-bold text-gray-800">
                Keamanan
            </h1>

            <div className="space-y-4">

                {/* Password Section */}
                <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                <KeyRound className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold text-gray-800">Password</h2>
                                <p className="text-sm text-gray-600">
                                    Terakhir diubah: 18/02/2019
                                </p>
                                <p className="text-xs text-gray-500">
                                    Gunakan password yang kuat untuk melindungi akun Anda
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Ganti Password
                        </button>
                    </div>
                </div>

            </div>

            {isChangePasswordOpen && <ChangePassword onClose={setIsChangePasswordOpen} />}
        </div>
    )
}