import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { addRekening, editRekening, type AddRekeningData, type Rekening } from "@/utils/userService";

const emptyForm: AddRekeningData = {
    name: "",
    bank_code: "",
    bank_name: "",
    account: "",
    alias_name: "",
    branch_office: "",
    city: ""
}

interface BankModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    rekening?: Rekening | null;
    onSuccess?: () => void;
}

export default function BankModal({ onClose, isEdit, rekening, onSuccess }: BankModalProps) {
    const bankOptions = [
        { code: "014", name: "PT. BANK CENTRAL ASIA Tbk." },
        { code: "008", name: "PT. BANK MANDIRI (Persero) Tbk." },
        { code: "009", name: "PT. BANK NEGARA INDONESIA (Persero) Tbk." },
        { code: "002", name: "PT. BANK RAKYAT INDONESIA (Persero) Tbk." },
        { code: "022", name: "PT. BANK CIMB NIAGA Tbk." },
        { code: "011", name: "PT. BANK DANAMON INDONESIA Tbk." },
        { code: "013", name: "PT. BANK PERMATA Tbk." },
        { code: "200", name: "PT. BANK TABUNGAN NEGARA (Persero) Tbk." },
        { code: "custom", name: "Lainnya (isi manual)" }
    ]

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isCustomBank, setIsCustomBank] = useState(false)
    const [form, setForm] = useState<AddRekeningData>({ ...emptyForm })

    // Close modal on Escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (isEdit && rekening) {
            setForm({
                name: rekening.name || "",
                bank_code: rekening.bank_code || "",
                bank_name: rekening.bank_name || "",
                account: rekening.account || "",
                alias_name: rekening.alias_name || "",
                branch_office: rekening.branch_office || "",
                city: rekening.city || "",
            })
            const exists = bankOptions.some((bank) => bank.code === rekening.bank_code)
            setIsCustomBank(!exists)
        } else {
            setForm({ ...emptyForm })
            setIsCustomBank(false)
        }
    }, [isEdit, rekening])

    const handleInputChange = (field: keyof AddRekeningData) => (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleBankChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = event.target.value
        if (selectedCode === "custom") {
            setIsCustomBank(true)
            setForm(prev => ({ ...prev, bank_code: "", bank_name: "" }))
            return
        }

        setIsCustomBank(false)
        const selectedBank = bankOptions.find(bank => bank.code === selectedCode)
        setForm(prev => ({
            ...prev,
            bank_code: selectedBank?.code || "",
            bank_name: selectedBank?.name || ""
        }))
    }

    const validateForm = () => {
        if (!form.name.trim()) return "Nama pemilik rekening wajib diisi"
        if (!form.bank_name.trim() || !form.bank_code.trim()) return "Silakan pilih atau isi nama bank dan kode bank"
        if (!form.account.trim()) return "Nomor rekening wajib diisi"
        if (!form.alias_name.trim()) return "Nama alias rekening wajib diisi"
        if (!form.branch_office.trim()) return "Kantor cabang wajib diisi"
        if (!form.city.trim()) return "Kota/kabupaten wajib diisi"
        return null
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (loading) return
        const validationMessage = validateForm()
        if (validationMessage) {
            setError(validationMessage)
            return
        }

        setError(null)
        setLoading(true)

        try {
            const payload: AddRekeningData = {
                ...form,
                name: form.name.trim(),
                alias_name: form.alias_name.trim(),
                account: form.account.trim(),
                branch_office: form.branch_office.trim(),
                city: form.city.trim(),
                bank_name: form.bank_name.trim(),
                bank_code: form.bank_code.trim()
            }
            const result = (isEdit && rekening)
                ? await editRekening(rekening.id_data, payload)
                : await addRekening(payload)
            if (!result.success) {
                setError(result.message || "Gagal menyimpan rekening")
                return
            }
            onSuccess?.()
            onClose(false)
        } catch (err) {
            console.error("Failed to add rekening", err)
            setError("Terjadi kesalahan saat menyimpan rekening")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-white sm:bg-black/50 sm:backdrop-blur-sm">
            {/* Backdrop (desktop only) */}
            <div className="absolute inset-0 hidden sm:block" onClick={() => onClose(false)}></div>

            {/* Modal Content */}
            <div className="relative z-10 flex min-h-full w-full flex-col bg-white rounded-none shadow-none sm:h-auto sm:max-w-2xl sm:rounded-2xl sm:shadow-2xl sm:max-h-[90vh] sm:overflow-hidden">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-8 sm:py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{isEdit ? 'Edit Rekening' : 'Tambah Rekening Baru'}</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Lengkapi informasi rekening bank Anda</p>
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
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <form
                        id="bank-form"
                        onSubmit={handleSubmit}
                        className="px-4 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-5"
                    >
                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-700">
                                {error}
                            </div>
                        )}
                        {/* Bank Name */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label htmlFor="bankName" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                </svg>
                                Nama Bank <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="bankName"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
                                onChange={handleBankChange}
                                value={isCustomBank ? 'custom' : form.bank_code || ''}
                                disabled={loading}
                            >
                                <option value="">Pilih bank</option>
                                {bankOptions.map((bank) => (
                                    <option key={bank.code} value={bank.code}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isCustomBank && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="customBankName" className="text-xs sm:text-sm font-medium text-gray-700">Nama Bank Custom <span className="text-red-500">*</span></label>
                                    <input
                                        id="customBankName"
                                        type="text"
                                        value={form.bank_name}
                                        onChange={handleInputChange('bank_name')}
                                        placeholder="Contoh: PT. BANK ABC"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="customBankCode" className="text-xs sm:text-sm font-medium text-gray-700">Kode Bank Custom <span className="text-red-500">*</span></label>
                                    <input
                                        id="customBankCode"
                                        type="text"
                                        value={form.bank_code}
                                        onChange={handleInputChange('bank_code')}
                                        placeholder="Contoh: 123"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Account Holder Name */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label htmlFor="accountHolder" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Nama Pemilik Rekening <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="accountHolder"
                                type="text"
                                placeholder="Masukkan nama sesuai rekening"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                value={form.name}
                                onChange={handleInputChange('name')}
                                disabled={loading}
                            />
                            <p className="text-xs text-gray-500 mt-1">Pastikan nama sesuai dengan yang tertera di rekening bank</p>
                        </div>

                        {/* Alias Name */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label htmlFor="aliasName" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nama Alias Rekening <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="aliasName"
                                type="text"
                                placeholder="Contoh: BCA Pribadi"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                value={form.alias_name}
                                onChange={handleInputChange('alias_name')}
                                disabled={loading}
                            />
                        </div>

                        {/* Account Number */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <label htmlFor="accountNumber" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                                Nomor Rekening <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="accountNumber"
                                type="text"
                                placeholder="Masukkan nomor rekening"
                                className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                value={form.account}
                                onChange={handleInputChange('account')}
                                disabled={loading}
                            />
                        </div>

                        {/* Branch Office and City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-1.5 sm:space-y-2">
                                <label htmlFor="branchOffice" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Kantor Cabang
                                </label>
                                <input
                                    id="branchOffice"
                                    type="text"
                                    placeholder="Contoh: Sudirman"
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    value={form.branch_office}
                                    onChange={handleInputChange('branch_office')}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-1.5 sm:space-y-2">
                                <label htmlFor="city" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
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
                                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    value={form.city}
                                    onChange={handleInputChange('city')}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div
                    className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 px-4 py-3 sm:px-8 sm:py-5 border-t border-gray-200 bg-gray-50"
                    style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
                >
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all h-9 sm:h-auto"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="bank-form"
                        disabled={loading}
                        className="px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-auto whitespace-nowrap disabled:opacity-60"
                    >
                        <svg className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {loading ? 'Menyimpan...' : 'Simpan Rekening'}
                    </button>
                </div>
            </div>
        </div>
    )
}