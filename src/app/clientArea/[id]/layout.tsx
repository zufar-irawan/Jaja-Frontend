import { SquarePen, Wallet, Package2, Truck, MapPinCheck } from "lucide-react"
import DashboardCard from "./DashboardCard"
import ClientSidebar from "./ClientSidebar"

export default function ClientAreaLayout(
    { children }: { children: React.ReactNode }
) {
    const headerCard = [
        { title: 'Belum bayar', value: 0, icon: (<Wallet color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Diproses', value: 0, icon: (<Package2 color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Dikirim', value: 0, icon: (<Truck color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Selesai', value: 0, icon: (<MapPinCheck color="#000000" size={40} strokeWidth={1.5} />) },
    ]

    return (
        <div>
            <header className="flex flex-col gap-8 w-full justify-center wave wave-svg text-gray-800">
                <div className="flex bg-white/30 border-2 border-white/20 backdrop-blur-2xl rounded-2xl p-5 justify-between w-[50%] mx-auto items-center h-fit">

                    <div className="flex gap-2 justify-center items-center">
                        <div className="flex bg-gray-200 text-blue-500 text-5xl rounded-full w-30 h-30 items-center justify-center">
                            U
                        </div>

                        <div className="items-center">
                            <p className="text-3xl">Username</p>

                            <p className="text-lg text-gray-800/60">Pelanggan</p>
                        </div>
                    </div>

                    <div className="text-gray-800 hover:text-gray-800/50">
                        <SquarePen size={30} />
                    </div>
                </div>

                <div className="flex flex-col w-[50%] mx-auto gap-2">
                    <p className="text-2xl font-semibold text-gray-50 text-start">Aktivitas</p>

                    <div className="flex flex-row gap-4">
                        {headerCard.map((item, index) => (
                            <DashboardCard key={index} item={item} />
                        ))}
                    </div>
                </div>

            </header>

            <main className="px-20 flex flex-row py-10 gap-5">
                <ClientSidebar />

                <div className="flex bg-white shadow-lg rounded-lg px-10 py-10 w-full">
                    {children}
                </div>
            </main>


        </div>
    )
}