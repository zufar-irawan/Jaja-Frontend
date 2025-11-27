import { Wallet } from "lucide-react"
import React from "react"

interface DashboardCardProps {
    item: {
        title: string;
        value: number;
        icon: React.ReactNode;
    }
}

export default function DashboardCard(
    { item }: DashboardCardProps
) {
    return (
        <div className="flex flex-col py-3 px-2 sm:py-4 sm:px-4 md:py-6 md:px-6 justify-center items-center bg-white rounded-lg shadow-md">
            <div className="mb-1 sm:mb-2 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center">
                {item.icon}
            </div>

            <p className="text-gray-900 text-center text-xs sm:text-sm md:text-base lg:text-lg leading-tight">
                {item.title}
            </p>

            <p className="text-blue-400 text-center text-xl sm:text-2xl md:text-3xl font-semibold">
                {item.value}
            </p>
        </div>
    )
}