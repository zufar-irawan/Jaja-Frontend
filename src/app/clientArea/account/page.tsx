'use client'

import AccountListCard from "@/components/AccountListCard"
import { getListRekening, type Rekening } from "@/utils/userService"
import { CirclePlus } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import BankModal from "./BankModal";

export default function AccountPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [rekeningList, setRekeningList] = useState<Rekening[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedRekening, setSelectedRekening] = useState<Rekening | null>(null)

    const fetchRekening = useCallback(async () => {
        setLoading(true)
        setError(null)
        const response = await getListRekening()
        if (response.success && response.data) {
            setRekeningList(response.data)
        } else {
            setRekeningList([])
            setError(response.message || 'Gagal mengambil daftar rekening')
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchRekening()
    }, [fetchRekening])

    const handleAddClick = () => {
        setIsEdit(false)
        setSelectedRekening(null)
        setIsModalOpen(true)
    }

    const handleEditClick = (rekening: Rekening) => {
        setSelectedRekening(rekening)
        setIsEdit(true)
        setIsModalOpen(true)
    }

    return (
        <div className="flex flex-col w-full gap-4">
            <h1 className="text-3xl w-full font-bold text-gray-800 border-b border-gray-300 pb-4">
                Rekening Kamu
            </h1>

            <div className="mx-auto w-full max-w-2xl space-y-4">
                {loading && (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-gray-500">
                        Memuat daftar rekening...
                    </div>
                )}

                {!loading && error && (
                    <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 px-6 py-6 text-center">
                        <p className="text-sm font-medium text-red-700">{error}</p>
                        <button
                            onClick={fetchRekening}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 shadow hover:bg-red-100"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!loading && !error && rekeningList.length > 0 && (
                    <>
                        {rekeningList.map((item) => (
                            <AccountListCard
                                key={item.id_data}
                                rekening={item}
                                onEdit={handleEditClick}
                                onDeleted={fetchRekening}
                                onPrimaryChanged={fetchRekening}
                            />
                        ))}

                        <button className="mt-2 w-full rounded-lg bg-blue-400 px-4 py-2 text-sm font-medium text-gray-50 transition-all hover:-translate-y-1 shadow-md"
                            onClick={handleAddClick}>
                            + Tambah Rekening
                        </button>
                    </>
                )}

                {!loading && !error && rekeningList.length === 0 && (
                    <button className="group flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-8 py-16 transition-all hover:border-blue-400 hover:bg-blue-50/50"
                        onClick={handleAddClick}>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-500 shadow-md transition-transform group-hover:scale-102 group-hover:bg-blue-500 group-hover:text-white">
                            <CirclePlus size={40} strokeWidth={2} />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-700 group-hover:text-blue-600">
                                Tambah Rekening
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                Klik untuk menambahkan rekening bank Anda
                            </p>
                        </div>
                    </button>
                )}
            </div>

            {isModalOpen && (
                <BankModal
                    onClose={setIsModalOpen}
                    isEdit={isEdit}
                    rekening={selectedRekening}
                    onSuccess={() => {
                        fetchRekening()
                        setSelectedRekening(null)
                        setIsEdit(false)
                    }}
                />
            )}
        </div>
    )
}