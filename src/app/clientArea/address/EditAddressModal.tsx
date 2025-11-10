import { useEffect, useMemo, useState } from "react";
import type { Address, City, District, Province, Village, CreateAddressData } from "@/utils/userService";
import { createAddress, getCities, getDistricts, getProvinces, getVillages, setPrimaryAddress, updateAddress } from "@/utils/userService";

export interface EditAddressModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit: boolean;
    address?: Address;
    onSaved?: () => void | Promise<void>;
}

export default function EditAddressModal({ onClose, isEdit, address, onSaved }: EditAddressModalProps) {
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [form, setForm] = useState<{
        nama: string
        no_telepon: string
        alamat_lengkap: string
        label: string
        nama_alamat: string
        provinsi_id: number | null
        provinsi: string
        kota_id: number | null
        kota: string
        kecamatan_id: number | null
        kecamatan: string
        kelurahan_id: number | null
        kelurahan: string
        kode_pos: string
    }>({
        nama: "",
        no_telepon: "",
        alamat_lengkap: "",
        label: "home",
        nama_alamat: "",
        provinsi_id: null,
        provinsi: "",
        kota_id: null,
        kota: "",
        kecamatan_id: null,
        kecamatan: "",
        kelurahan_id: null,
        kelurahan: "",
        kode_pos: "",
    })

    const [makePrimary, setMakePrimary] = useState(false)

    // Location data
    const [provinces, setProvinces] = useState<Province[]>([])
    const [cities, setCities] = useState<City[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [villages, setVillages] = useState<Village[]>([])
    const [loadingLoc, setLoadingLoc] = useState({ prov: false, city: false, dist: false, vill: false })

    const hasRegionSelected = useMemo(() => ({
        province: !!form.provinsi_id,
        city: !!form.kota_id,
        district: !!form.kecamatan_id,
        village: !!form.kelurahan_id,
    }), [form])

    // Prefill when editing
    useEffect(() => {
        const init = async () => {
            setLoadingLoc(prev => ({ ...prev, prov: true }))
            try {
                const provRes = await getProvinces(1, 200)
                if (provRes.success && provRes.data) setProvinces(provRes.data)
            } finally {
                setLoadingLoc(prev => ({ ...prev, prov: false }))
            }

            if (isEdit && address) {
                // Set base fields
                setForm(prev => ({
                    ...prev,
                    nama: address.nama,
                    no_telepon: address.no_telepon,
                    alamat_lengkap: address.alamat_lengkap,
                    label: address.label || "home",
                    nama_alamat: address.nama_alamat,
                    provinsi_id: address.provinsi_id,
                    provinsi: address.provinsi,
                    kota_id: address.kota_id,
                    kota: address.kota,
                    kecamatan_id: address.kecamatan_id,
                    kecamatan: address.kecamatan,
                    kelurahan_id: address.kelurahan_id,
                    kelurahan: address.kelurahan,
                    kode_pos: address.kode_pos || "",
                }))

                // Load cascades
                if (address.provinsi_id) {
                    setLoadingLoc(prev => ({ ...prev, city: true }))
                    try {
                        const cityRes = await getCities(address.provinsi_id, 1, 200)
                        if (cityRes.success && cityRes.data) setCities(cityRes.data)
                    } finally {
                        setLoadingLoc(prev => ({ ...prev, city: false }))
                    }
                }
                if (address.kota_id) {
                    setLoadingLoc(prev => ({ ...prev, dist: true }))
                    try {
                        const distRes = await getDistricts(address.kota_id, 1, 200)
                        if (distRes.success && distRes.data) setDistricts(distRes.data)
                    } finally {
                        setLoadingLoc(prev => ({ ...prev, dist: false }))
                    }
                }
                if (address.kecamatan_id) {
                    setLoadingLoc(prev => ({ ...prev, vill: true }))
                    try {
                        const villRes = await getVillages(String(address.kecamatan_id), 1, 200)
                        if (villRes.success && villRes.data) setVillages(villRes.data)
                    } finally {
                        setLoadingLoc(prev => ({ ...prev, vill: false }))
                    }
                }
                setMakePrimary(!!address.is_primary)
            }
        }
        init()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Handlers
    const updateField = (key: keyof typeof form, value: any) => setForm(prev => ({ ...prev, [key]: value }))

    const onProvinceChange = async (kd: number) => {
        const selected = provinces.find(p => Number(p.provinsi_kd) === Number(kd))
        updateField('provinsi_id', Number(kd))
        updateField('provinsi', selected?.provinsi_nm || "")
        // reset deeper
        updateField('kota_id', null)
        updateField('kota', "")
        updateField('kecamatan_id', null)
        updateField('kecamatan', "")
        updateField('kelurahan_id', null)
        updateField('kelurahan', "")
        setCities([]); setDistricts([]); setVillages([])
        setLoadingLoc(prev => ({ ...prev, city: true }))
        try {
            const res = await getCities(Number(kd), 1, 200)
            if (res.success && res.data) setCities(res.data)
        } finally {
            setLoadingLoc(prev => ({ ...prev, city: false }))
        }
    }

    const onCityChange = async (kd: number) => {
        const selected = cities.find(c => Number(c.kota_kd) === Number(kd))
        updateField('kota_id', Number(kd))
        updateField('kota', selected?.kota_nm || "")
        updateField('kecamatan_id', null)
        updateField('kecamatan', "")
        updateField('kelurahan_id', null)
        updateField('kelurahan', "")
        setDistricts([]); setVillages([])
        setLoadingLoc(prev => ({ ...prev, dist: true }))
        try {
            const res = await getDistricts(Number(kd), 1, 200)
            if (res.success && res.data) setDistricts(res.data)
        } finally {
            setLoadingLoc(prev => ({ ...prev, dist: false }))
        }
    }

    const onDistrictChange = async (kd: string | number) => {
        const strKd = String(kd)
        const selected = districts.find(d => String(d.kecamatan_kd) === strKd)
        updateField('kecamatan_id', Number(strKd))
        updateField('kecamatan', selected?.kecamatan_nm || "")
        updateField('kelurahan_id', null)
        updateField('kelurahan', "")
        setVillages([])
        setLoadingLoc(prev => ({ ...prev, vill: true }))
        try {
            const res = await getVillages(strKd, 1, 200)
            if (res.success && res.data) setVillages(res.data)
        } finally {
            setLoadingLoc(prev => ({ ...prev, vill: false }))
        }
    }

    const onVillageChange = (kd: string | number) => {
        const strKd = String(kd)
        const selected = villages.find(v => String(v.kelurahan_kd) === strKd)
        updateField('kelurahan_id', Number(strKd))
        updateField('kelurahan', selected?.kelurahan_nm || "")
    }

    const validate = () => {
        if (!form.nama) return "Nama penerima wajib diisi"
        if (!form.no_telepon) return "Nomor telepon wajib diisi"
        if (!form.alamat_lengkap) return "Detail alamat wajib diisi"
        if (!form.provinsi_id) return "Provinsi wajib dipilih"
        if (!form.kota_id) return "Kota wajib dipilih"
        if (!form.kode_pos) return "Kode pos wajib diisi"
        return null
    }

    const toPayload = (): CreateAddressData => ({
        label: form.label,
        nama: form.nama,
        no_telepon: form.no_telepon,
        alamat_lengkap: form.alamat_lengkap,
        provinsi_id: Number(form.provinsi_id),
        provinsi: form.provinsi,
        kota_id: Number(form.kota_id),
        kota: form.kota,
        kecamatan_id: Number(form.kecamatan_id || 0),
        kecamatan: form.kecamatan,
        kelurahan_id: Number(form.kelurahan_id || 0),
        kelurahan: form.kelurahan,
        kode_pos: form.kode_pos,
        alamat_koordinat: undefined,
        latitude: undefined,
        longitude: undefined,
        nama_alamat: form.nama_alamat || form.label,
    })

    const extractIdFromResponse = (resData: any): number | null => {
        if (!resData) return null
        // Try common shapes
        if (typeof resData === 'object') {
            if ('id_alamat' in resData && typeof resData.id_alamat === 'number') return resData.id_alamat
            if ('data' in resData && resData.data && typeof resData.data.id_alamat === 'number') return resData.data.id_alamat
        }
        return null
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        const msg = validate()
        if (msg) {
            setError(msg)
            return
        }
        setSaving(true)
        setError(null)
        try {
            let idForPrimary: number | null = null
            const payload = toPayload()
            if (isEdit && address) {
                const res = await updateAddress(address.id_alamat, payload)
                if (!res.success) throw new Error(res.message || 'Gagal memperbarui alamat')
                idForPrimary = address.id_alamat
            } else {
                const res = await createAddress(payload)
                if (!res.success) throw new Error(res.message || 'Gagal menambahkan alamat')
                idForPrimary = extractIdFromResponse(res.data)
            }

            if (makePrimary && idForPrimary) {
                await setPrimaryAddress(idForPrimary)
            }

            // Refresh list
            await onSaved?.()
            onClose(false)
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat menyimpan alamat')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={() => onClose(false)}></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Alamat' : 'Tambah Alamat'}</h1>
                        <p className="text-sm text-gray-600 mt-1">Lengkapi informasi alamat pengiriman Anda</p>
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
                    <form id="addressForm" onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
                        {/* Feedback */}
                        {error && (
                            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Recipient Name */}
                        <div className="space-y-2">
                            <label htmlFor="recipientName" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Nama Penerima <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="recipientName"
                                type="text"
                                placeholder="Masukkan nama penerima"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                value={form.nama}
                                onChange={(e) => updateField('nama', e.target.value)}
                            />
                        </div>

                        {/* Phone Number and Address Alias */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Nomor Telepon <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    value={form.no_telepon}
                                    onChange={(e) => updateField('no_telepon', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="alias" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nama Alamat
                                </label>
                                <input
                                    id="alias"
                                    type="text"
                                    placeholder="Contoh: Rumah, Kantor"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    value={form.nama_alamat}
                                    onChange={(e) => updateField('nama_alamat', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Province and City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="province" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Provinsi <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="province"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                    value={form.provinsi_id ?? ''}
                                    onChange={(e) => onProvinceChange(Number(e.target.value))}
                                >
                                    <option value="" disabled>{loadingLoc.prov ? 'Memuat...' : 'Pilih provinsi'}</option>
                                    {provinces.map(p => (
                                        <option key={p.provinsi_kd} value={p.provinsi_kd}>{p.provinsi_nm}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Kota <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="city"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                    value={form.kota_id ?? ''}
                                    onChange={(e) => onCityChange(Number(e.target.value))}
                                    disabled={!hasRegionSelected.province}
                                >
                                    <option value="" disabled>{loadingLoc.city ? 'Memuat...' : 'Pilih kota'}</option>
                                    {cities.map(c => (
                                        <option key={c.kota_kd} value={c.kota_kd}>{c.kota_nm}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* District and Village */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="district" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    Kecamatan
                                </label>
                                <select
                                    id="district"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                    value={form.kecamatan_id ?? ''}
                                    onChange={(e) => onDistrictChange(e.target.value)}
                                    disabled={!hasRegionSelected.city}
                                >
                                    <option value="" disabled>{loadingLoc.dist ? 'Memuat...' : 'Pilih kecamatan'}</option>
                                    {districts.map(d => (
                                        <option key={d.kecamatan_kd} value={d.kecamatan_kd}>{d.kecamatan_nm}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="village" className="text-sm font-medium text-gray-700 flex items-center">
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                    Kelurahan
                                </label>
                                <select
                                    id="village"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
                                    value={form.kelurahan_id ?? ''}
                                    onChange={(e) => onVillageChange(e.target.value)}
                                    disabled={!hasRegionSelected.district}
                                >
                                    <option value="" disabled>{loadingLoc.vill ? 'Memuat...' : 'Pilih kelurahan'}</option>
                                    {villages.map(v => (
                                        <option key={v.kelurahan_kd} value={v.kelurahan_kd}>{v.kelurahan_nm}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Address Detail */}
                        <div className="space-y-2">
                            <label htmlFor="addressDetail" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Detail Alamat <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="addressDetail"
                                rows={3}
                                placeholder="Masukkan detail alamat lengkap (nama jalan, nomor rumah, RT/RW, dll)"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                value={form.alamat_lengkap}
                                onChange={(e) => updateField('alamat_lengkap', e.target.value)}
                            />
                        </div>

                        {/* Postal Code */}
                        <div className="space-y-2">
                            <label htmlFor="postalCode" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                                Kode Pos <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="postalCode"
                                type="text"
                                placeholder="Masukkan kode pos"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                value={form.kode_pos}
                                onChange={(e) => updateField('kode_pos', e.target.value)}
                            />
                        </div>

                        {/* Address Type */}
                        <div className="space-y-2">
                            <label htmlFor="addressType" className="text-sm font-medium text-gray-700 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                Tipe Alamat <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="addressType"
                                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white cursor-pointer"
                                value={form.label}
                                onChange={(e) => updateField('label', e.target.value)}
                            >
                                <option value="home">🏠 Rumah</option>
                                <option value="office">🏢 Kantor</option>
                                <option value="apartment">🏬 Apartemen</option>
                            </select>
                        </div>

                        {/* Primary Address Checkbox */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <label htmlFor="alamatutama" className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="alamatutama"
                                    id="alamatutama"
                                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    checked={makePrimary}
                                    onChange={(e) => setMakePrimary(e.target.checked)}
                                />
                                <div className="ml-3">
                                    <span className="text-sm font-medium text-gray-900 block">Jadikan Alamat Utama</span>
                                    <span className="text-xs text-gray-600 mt-1 block">Alamat ini akan menjadi alamat pengiriman default Anda</span>
                                </div>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        onClick={() => onClose(false)}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
                        disabled={saving}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="addressForm"
                        className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-70"
                        disabled={saving}
                    >
                        <svg className={`w-5 h-5 ${saving ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {saving ? 'Menyimpan...' : 'Simpan Alamat'}
                    </button>
                </div>
            </div>
        </div>
    )
}