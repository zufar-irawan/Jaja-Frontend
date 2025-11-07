import { useEffect } from "react";

interface BankModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
}

export default function BankModal({ onClose, isEdit }: BankModalProps) {
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
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Rekening' : 'Tambah Rekening Baru'}</h2>
                        <p className="text-sm text-gray-600 mt-1">Lengkapi informasi rekening bank Anda</p>
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
                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    <form className="px-8 py-6 space-y-5">
                        {/* Bank Name */}
                        <div className="space-y-2">
                            <label htmlFor="bankName" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                                Nama Bank <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="bankName"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
                            >
                                <option value="">Pilih bank</option>
                                <option value="bca">Bank Central Asia (BCA)</option>
                                <option value="mandiri">Bank Mandiri</option>
                                <option value="bni">Bank Negara Indonesia (BNI)</option>
                                <option value="bri">Bank Rakyat Indonesia (BRI)</option>
                                <option value="cimb">CIMB Niaga</option>
                                <option value="danamon">Bank Danamon</option>
                                <option value="permata">Bank Permata</option>
                                <option value="btn">Bank Tabungan Negara (BTN)</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>

                        {/* Account Holder Name */}
                        <div className="space-y-2">
                            <label htmlFor="accountHolder" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Nama Pemilik Rekening <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="accountHolder"
                                type="text"
                                placeholder="Masukkan nama sesuai rekening"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Pastikan nama sesuai dengan yang tertera di rekening bank</p>
                        </div>

                        {/* Account Number */}
                        <div className="space-y-2">
                            <label htmlFor="accountNumber" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                Nomor Rekening <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="accountNumber"
                                type="text"
                                placeholder="Masukkan nomor rekening"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>

                        {/* Branch Office and City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="branchOffice" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Kantor Cabang
                                </label>
                                <input
                                    id="branchOffice"
                                    type="text"
                                    placeholder="Contoh: Sudirman"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Kota/Kabupaten
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    placeholder="Contoh: Jakarta"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Rekening
                    </button>
                </div>
            </div>
        </div>
    )
}