export default function ProfilePage() {
    return (
        <div className="gap-4 flex flex-col w-full">
            <h1 className="text-3xl font-bold text-gray-800">
                Profil
            </h1>

            <div className="flex flex-row justify-between w-full items-center">

                <div className="flex flex-col gap-2 w-full pr-5">
                    <h2 className="text-xl text-gray-600">Biodata</h2>

                    <div className="flex gap-10">
                        <div className="flex flex-col gap-4 text-gray-900">
                            <div className="flex gap-5">
                                Nama
                            </div>

                            <div className="flex gap-5">
                                Tanggal Lahir
                            </div>

                            <div className="flex gap-5">
                                Jenis Kelamin
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 text-gray-800/60">
                            <div className="flex gap-5">
                                User
                            </div>

                            <div className="flex gap-5">
                                19/02/1995
                            </div>

                            <div className="flex gap-5">
                                Pria
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-300" />

                    <h2 className="text-xl text-gray-600">Info Kontak</h2>

                    <div className="flex gap-18">
                        <div className="flex flex-col gap-4 text-gray-900">
                            <div className="flex gap-5">
                                Email
                            </div>

                            <div className="flex gap-5">
                                Nomor HP
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 text-gray-800/60">
                            <div className="flex gap-5">
                                User@example.com
                            </div>

                            <div className="flex gap-5">
                                62811176787
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full flex-1/2 justify-center items-center px-8">
                    <p className="w-50 h-50 flex justify-center items-center text-center bg-gray-100 text-4xl text-gray-800">U</p>

                    <button className="mt-4 w-full rounded-full border-2 border-blue-400/50 px-5 py-3 text-gray-800 transition-all hover:border-blue-400 hover:text-blue-500">
                        Ganti Foto
                    </button>

                    <button className="mt-4 w-full rounded-full border-2 border-blue-400/50 px-5 py-3 text-gray-800 transition-all hover:border-blue-400 hover:text-blue-500">
                        Edit Profil
                    </button>
                </div>
            </div>
        </div >
    )
}