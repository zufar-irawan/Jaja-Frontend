interface ProfileImageModalProps {
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ProfileImageModal({ onClose }: ProfileImageModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm justify-center items-center flex z-50">

            <div className="absolute inset-0" onClick={() => onClose(false)}></div>

            <div className="bg-gray-50 rounded-2xl relative z-10 overflow-hidden">
                <div className="px-5 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">Upload Foto Profil</h1>
                </div>

                <div className="p-5 space-y-5">
                    <p className="px-10 py-20 text-4xl bg-gray-200 rounded-full border border-gray-400 flex justify-center items-center">
                        U
                    </p>

                    <div className="space-y-2">
                        <button className="w-full flex justify-center items-center bg-blue-400 text-gray-50 rounded-lg py-2 transition-all hover:bg-blue-600">
                            Ganti Foto
                        </button>
                        <button className="w-full flex justify-center items-center bg-gray-200 border border-gray-300 text-gray-800 rounded-lg py-2 transition-all hover:bg-gray-300"
                            onClick={() => onClose(false)}>
                            Batalkan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}