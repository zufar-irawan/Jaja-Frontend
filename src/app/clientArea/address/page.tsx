'use client'

import { CirclePlus } from "lucide-react"
import AddressListCard from "@/components/AddressListCard"
import { useState } from "react"
import EditAddressModal from "./EditAddressModal"

export default function AddressPage() {
    const [modalEditAddress, setModalEditAddress] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const alamat = [
        {
            nama: "Rumah",
            alamat: "Jl. Merdeka No. 123, Jakarta",
            nomor_hp: "08123456789",
            tanggal: "20/07/2012",
            tipe: "home",
            alamatUtama: true
        },
        {
            nama: "Kantor",
            alamat: "Jl. Panorama No. 45, Bekasi",
            nomor_hp: "08123456789",
            tanggal: "20/12/2012",
            tipe: "office",
            alamatUtama: false
        }
    ]

    return (
        <div className="flex flex-col w-full gap-4">
            <div className="flex flex-row w-full justify-between border-b border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-900">Alamat Kamu</h1>

                <button className="bg-blue-400 px-4 rounded-lg py-2 flex text-gray-50 gap-2 shadow-md transition-all duration-100 hover:-translate-y-0.5"
                    onClick={() => { setModalEditAddress(true); setIsEdit(false) }}>
                    <CirclePlus /> Tambah Alamat Baru
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {alamat.map((item, index) => (
                    <AddressListCard key={index} alamat={item} onEdit={setIsEdit} onOpen={setModalEditAddress} />
                ))}
            </div>

            {modalEditAddress && (
                <EditAddressModal onClose={setModalEditAddress} isEdit={isEdit} />
            )}
        </div>
    )
}