'use client'

import { CirclePlus } from "lucide-react"
import AddressListCard from "@/components/AddressListCard"
import { useEffect, useState } from "react"
import EditAddressModal from "./EditAddressModal"
import { getAddresses } from "@/utils/userService"

export default function AddressPage() {
    const [modalEditAddress, setModalEditAddress] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const [addresses, setAddresses] = useState<any>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAddresses = async () => {
            await getAddresses()
                .then((res) => {
                    if (res.success && res.data) {
                        setAddresses(res.data)
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
        fetchAddresses()
    }, [])

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
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    addresses.length > 0 ? addresses.map((item: any, index: number) => (
                        <AddressListCard key={index} alamat={item} onEdit={setIsEdit} onOpen={setModalEditAddress} />
                    )) : (
                        <p className="text-xl text-gray-800">Belum ada alamat tersimpan.</p>
                    )
                )}
            </div>

            {modalEditAddress && (
                <EditAddressModal onClose={setModalEditAddress} isEdit={isEdit} />
            )}
        </div>
    )
}