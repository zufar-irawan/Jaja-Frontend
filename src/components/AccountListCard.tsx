interface AccountListCardProps {
    rekening: any;
    isEdit: React.Dispatch<React.SetStateAction<boolean>>;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AccountListCard({ rekening, isEdit, onOpen }: AccountListCardProps) {
    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            {/* Card Header */}
            <div className="border-b border-gray-100 bg-linear-to-r from-blue-50 to-blue-100/50 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Bank</p>
                            <p className="text-xl font-bold text-gray-800">{rekening.bank}</p>
                        </div>
                    </div>
                    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        onClick={() => {
                            isEdit(true);
                            onOpen(true);
                        }}>
                        Edit
                    </button>
                </div>
            </div>

            {rekening.bankUtama && (
                <div className="border border-gray-100 bg-green-100 p-4 text-green-800">
                    <p className="font-semibold">Rekening Utama</p>
                </div>
            )}

            {/* Card Body */}
            <div className="space-y-4 p-6">
                <div className="flex items-start justify-between rounded-lg bg-gray-50 p-4">
                    <div className="flex-1">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                            Nomor Rekening
                        </p>
                        <p className="text-2xl font-bold tracking-wide text-gray-800">
                            {rekening.nomor_rekening}
                        </p>
                    </div>
                    <button className="rounded-md bg-gray-200 p-2 transition-colors hover:bg-gray-300">
                        <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Atas Nama
                    </p>
                    <p className="text-lg font-semibold text-gray-800">{rekening.atas_nama}</p>
                </div>
            </div>

            {/* Card Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-3">
                <p className="flex items-center gap-2 text-xs text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Rekening terverifikasi
                </p>
            </div>
        </div >
    )
}