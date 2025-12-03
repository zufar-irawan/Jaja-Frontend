"use client";

import { SquarePen, Wallet, Package2, Truck, MapPinCheck } from "lucide-react";
import DashboardCard from "./DashboardCard";
import ClientSidebar from "./ClientSidebar";
import { useEffect, useState, useCallback } from "react";
import ProfileEditModal from "./profile/profileEditModal";
import { getUserProfile, type UserProfile } from "@/utils/userService";
import { ClientAreaProvider } from "./ClientAreaContext";

export default function ClientAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [editProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>();

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await getUserProfile();

      if (result.success && result.data) {
        setUser(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const headerCard = [
    {
      title: "Belum bayar",
      value: 0,
      icon: (
        <Wallet
          color="#000000"
          size={28}
          strokeWidth={1.5}
          className="sm:w-8 sm:h-8 md:w-10 md:h-10"
        />
      ),
    },
    {
      title: "Diproses",
      value: 0,
      icon: (
        <Package2
          color="#000000"
          size={28}
          strokeWidth={1.5}
          className="sm:w-8 sm:h-8 md:w-10 md:h-10"
        />
      ),
    },
    {
      title: "Dikirim",
      value: 0,
      icon: (
        <Truck
          color="#000000"
          size={28}
          strokeWidth={1.5}
          className="sm:w-8 sm:h-8 md:w-10 md:h-10"
        />
      ),
    },
    {
      title: "Selesai",
      value: 0,
      icon: (
        <MapPinCheck
          color="#000000"
          size={28}
          strokeWidth={1.5}
          className="sm:w-8 sm:h-8 md:w-10 md:h-10"
        />
      ),
    },
  ];

  return (
    <ClientAreaProvider value={{ user, isLoading, refetch: fetchUserProfile }}>
      <div className="flex flex-col">
        <header className="flex w-full wave wave-svg flex-col items-center justify-center gap-4 px-3 py-6 text-gray-800 sm:gap-6 sm:px-8 sm:py-8 lg:px-20">
          <div className="flex w-full max-w-4xl flex-col sm:flex-row sm:flex-wrap items-center justify-between gap-4 sm:gap-6 rounded-2xl border-2 border-white/20 bg-white/30 p-4 sm:p-5 backdrop-blur-2xl">
            <div className="flex w-full flex-1 items-center justify-start gap-3">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-500 text-3xl sm:text-4xl lg:text-5xl text-gray-50 border-2 border-gray-200 shrink-0">
                {isLoading
                  ? "?"
                  : (
                      user?.first_name?.charAt(0) ||
                      user?.last_name?.charAt(0) ||
                      user?.nama_lengkap?.charAt(0) ||
                      ""
                    ).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-lg sm:text-xl font-semibold truncate">
                  {isLoading ? "Sabar tungguin..." : user?.nama_lengkap}
                </p>

                <p className="text-sm sm:text-base lg:text-lg text-gray-800/60 truncate">
                  {isLoading ? "Sabar tungguin..." : user?.email}
                </p>

                {/* Koin Display */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-amber-500 rounded-full blur-sm opacity-75"></div>
                    <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 border-2 border-yellow-200 shadow-lg">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-900"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-600 to-amber-600">
                      {isLoading
                        ? "..."
                        : (user?.koin ?? 0).toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-yellow-700/80">
                      Koin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full sm:w-auto justify-center sm:justify-end">
              <button
                className="rounded-full border border-blue-400/30 p-2.5 sm:p-3 text-gray-800 transition-all hover:border-blue-400 hover:text-blue-500"
                onClick={() => setEditProfile(true)}
              >
                <SquarePen className="w-6 h-6 sm:w-[30px] sm:h-[30px]" />
              </button>
            </div>
          </div>

          <div className="flex w-full max-w-4xl flex-col gap-3 px-2 text-gray-50">
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
              Aktivitas
            </p>

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

        {editProfile && <ProfileEditModal onClose={setEditProfile} />}
      </div>
    </ClientAreaProvider>
  );
}
