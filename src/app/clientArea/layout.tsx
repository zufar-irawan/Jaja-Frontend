'use client'

import { SquarePen, Wallet, Package2, Truck, MapPinCheck } from "lucide-react"
import DashboardCard from "./DashboardCard"
import ClientSidebar from "./ClientSidebar"
import { useEffect, useState, useCallback } from "react"
import ProfileEditModal from "./profile/profileEditModal"
import { getUserProfile, type UserProfile } from "@/utils/userService"
import { ClientAreaProvider } from "./ClientAreaContext"

export default function ClientAreaLayout(
    { children }: { children: React.ReactNode }
) {
    const [editProfile, setEditProfile] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState<UserProfile>()

    const fetchUserProfile = useCallback(async () => {
        try {
            setIsLoading(true)

            const result = await getUserProfile()

            if (result.success && result.data) {
                setUser(result.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUserProfile()
    }, [fetchUserProfile])

    const headerCard = [
        { title: 'Belum bayar', value: 0, icon: (<Wallet color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Diproses', value: 0, icon: (<Package2 color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Dikirim', value: 0, icon: (<Truck color="#000000" size={40} strokeWidth={1.5} />) },
        { title: 'Selesai', value: 0, icon: (<MapPinCheck color="#000000" size={40} strokeWidth={1.5} />) },
    ]

    return (
        <ClientAreaProvider value={{ user, isLoading, refetch: fetchUserProfile }} >
            <div className="flex flex-col">
                <header className="flex w-full wave wave-svg flex-col items-center justify-center gap-6 px-4 py-8 text-gray-800 sm:gap-8 sm:px-8 lg:px-20">
                    <div className="flex w-full max-w-4xl flex-wrap items-center justify-between gap-6 rounded-2xl border-2 border-white/20 bg-white/30 p-5 backdrop-blur-2xl">

                        <div className="flex w-full flex-1 items-center justify-start gap-3 sm:w-auto">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-5xl text-blue-500 sm:h-24 sm:w-24">
                                {isLoading ? '?' : user?.first_name.charAt(0)}
                            </div>

                            <div className="">
                                <p className="text-xl font-semibold sm:text-xl">{isLoading ? 'Sabar tungguin...' : user?.nama_lengkap}</p>

                                <p className="text-base text-gray-800/60 sm:text-lg">{isLoading ? 'Sabar tungguin...' : user?.email}</p>
                            </div>
                        </div>

                        <div className="flex w-full justify-end sm:w-auto">
                            <button className="rounded-full border border-blue-400/30 p-3 text-gray-800 transition-all hover:border-blue-400 hover:text-blue-500"
                                onClick={() => setEditProfile(true)}>
                                <SquarePen size={30} />
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full max-w-4xl flex-col gap-3 px-2 text-gray-50">
                        <p className="text-xl font-semibold sm:text-2xl">Aktivitas</p>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {headerCard.map((item, index) => (
                                <DashboardCard key={index} item={item} />
                            ))}
                        </div>
                    </div>

                </header>

                <main className="flex w-full flex-col gap-6 px-4 py-8 sm:px-8 lg:flex-row lg:gap-6 lg:px-20">
                    <div className="w-full max-w-xs lg:max-w-sm">
                        <ClientSidebar />
                    </div>

                    <div className="flex w-full rounded-lg bg-white px-6 py-8 shadow-md sm:px-8 lg:px-10">
                        {children}
                    </div>
                </main>

                {editProfile && (
                    <ProfileEditModal onClose={setEditProfile} />
                )}
            </div>
        </ClientAreaProvider>

    )
}