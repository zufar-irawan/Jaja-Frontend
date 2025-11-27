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
        { title: 'Belum bayar', value: 0, icon: (<Wallet color="#000000" size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />) },
        { title: 'Diproses', value: 0, icon: (<Package2 color="#000000" size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />) },
        { title: 'Dikirim', value: 0, icon: (<Truck color="#000000" size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />) },
        { title: 'Selesai', value: 0, icon: (<MapPinCheck color="#000000" size={28} strokeWidth={1.5} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />) },
    ]

    return (
        <ClientAreaProvider value={{ user, isLoading, refetch: fetchUserProfile }} >
            <div className="flex flex-col">
                <header className="flex w-full wave wave-svg flex-col items-center justify-center gap-4 px-3 py-6 text-gray-800 sm:gap-6 sm:px-8 sm:py-8 lg:px-20">
                    <div className="flex w-full max-w-4xl flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4 sm:gap-6 rounded-2xl border-2 border-white/20 bg-white/30 p-4 sm:p-5 backdrop-blur-2xl">

                        <div className="flex w-full flex-1 items-center justify-start gap-3">
                            <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-500 text-3xl sm:text-4xl lg:text-5xl text-gray-50 border-2 border-gray-200 shrink-0">
                                {isLoading ? '?' : user?.first_name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-lg sm:text-xl font-semibold truncate">{isLoading ? 'Sabar tungguin...' : user?.nama_lengkap}</p>

                                <p className="text-sm sm:text-base lg:text-lg text-gray-800/60 truncate">{isLoading ? 'Sabar tungguin...' : user?.email}</p>
                            </div>
                        </div>

                        <div className="flex w-full sm:w-auto justify-center sm:justify-end">
                            <button className="rounded-full border border-blue-400/30 p-2.5 sm:p-3 text-gray-800 transition-all hover:border-blue-400 hover:text-blue-500"
                                onClick={() => setEditProfile(true)}>
                                <SquarePen className="w-6 h-6 sm:w-[30px] sm:h-[30px]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex w-full max-w-4xl flex-col gap-3 px-2 text-gray-50">
                        <p className="text-lg sm:text-xl lg:text-2xl font-semibold">Aktivitas</p>

                        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 md:grid-cols-4">
                            {headerCard.map((item, index) => (
                                <DashboardCard key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </header>

                <main className="flex w-full flex-col gap-4 px-3 py-6 sm:px-8 sm:py-8 lg:flex-row lg:gap-6 lg:px-20">
                    <div className="w-full lg:w-auto lg:max-w-sm lg:shrink-0">
                        <ClientSidebar />
                    </div>

                    <div className="flex w-full rounded-lg bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10 shadow-md lg:flex-1">
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