import { Wallet } from "lucide-react"

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
        <div className="flex flex-col py-6 px-6 w-50 justify-center items-center bg-white rounded-lg shadow-md">
            {item.icon}

            <p className="text-gray-900 text-center items-center text-lg">
                {item.title}
            </p>

            <p className="text-blue-400 text-center items-center text-3xl">
                {item.value}
            </p>
        </div>
    )
}