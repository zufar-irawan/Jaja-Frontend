"use client";

import { CirclePlus } from "lucide-react";
import AddressListCard from "@/components/AddressListCard";
import { useEffect, useState } from "react";
import EditAddressModal from "./EditAddressModal";
import { getAddresses } from "@/utils/userService";
import type { Address } from "@/utils/userService";

export default function AddressPage() {
  const [modalEditAddress, setModalEditAddress] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = async () => {
    setIsLoading(true);
    await getAddresses()
      .then((res) => {
        if (res.success && res.data) {
          setAddresses(res.data as Address[]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const fetchAddress = async () => await fetchAddresses();

    fetchAddress();
  }, []);

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex flex-row w-full justify-between border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Alamat Kamu</h1>

        <button
          className="bg-blue-400 px-4 rounded-lg py-2 flex text-gray-50 gap-2 shadow-md transition-all duration-100 hover:-translate-y-0.5"
          onClick={() => {
            setSelectedAddress(null);
            setModalEditAddress(true);
            setIsEdit(false);
          }}
        >
          <CirclePlus /> Tambah Alamat Baru
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : addresses.length > 0 ? (
          addresses.map((item: Address, index: number) => (
            <AddressListCard
              key={index}
              alamat={item}
              onEdit={setIsEdit}
              onOpen={setModalEditAddress}
              onSelect={setSelectedAddress}
              onDeleted={fetchAddresses}
            />
          ))
        ) : (
          <p className="text-xl text-gray-800">Belum ada alamat tersimpan.</p>
        )}
      </div>

      {modalEditAddress && (
        <EditAddressModal
          onClose={setModalEditAddress}
          isEdit={isEdit}
          address={selectedAddress ?? undefined}
          onSaved={fetchAddresses}
        />
      )}
    </div>
  );
}
