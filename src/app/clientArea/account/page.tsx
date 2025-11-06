import AccountListCard from "@/components/AccountListCard"
import { CirclePlus } from "lucide-react"

export default function AccountPage() {
    const rekening = [
        {
            bank: "Bank Central Asia (BCA)",
            nomor_rekening: "1234567890",
            atas_nama: "John Doe"
        },
        {
            bank: "Bank Mandiri",
            nomor_rekening: "0987654321",
            atas_nama: "Jane Smith"
        }
    ]

    return (
        <div className="flex flex-col w-full gap-4">
            <h1 className="text-3xl w-full font-bold text-gray-800 border-b border-gray-300 pb-4">
                Rekening Kamu
            </h1>

            <div className="mx-auto w-full max-w-2xl space-y-4">
                {rekening ? (
                    <>
                        {rekening.map((item: any, index: number) => (
                            <AccountListCard key={index} rekening={item} />
                        ))}

                        <button className="mt-2 w-full rounded-lg bg-blue-400 px-4 py-2 text-sm font-medium text-gray-50 transition-all hover:-translate-y-1 shadow-md">
                            + Tambah Rekening
                        </button>
                    </>
                ) : (
                    <button className="group flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-8 py-16 transition-all hover:border-blue-400 hover:bg-blue-50/50">
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
        </div>
    )
}