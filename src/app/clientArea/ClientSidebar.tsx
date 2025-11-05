import { CircleUserRound, Package2, Settings } from "lucide-react"

export default function ClientSidebar() {

    const menuItems = [
        { title: 'Profil', icon: <CircleUserRound strokeWidth={1.5} size={40} /> },
        { title: 'Orders', icon: <Package2 strokeWidth={1.5} size={40} /> },
        { title: 'Settings', icon: <Settings strokeWidth={1.5} size={40} /> },
    ]

    return (
        <aside className="bg-white px-5 flex-1/4 flex py-8 rounded-lg shadow-lg">
            <nav className="w-full">
                <ul className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <li key={item.title} className="py-4 px-3 flex gap-2 border-b-2 border-gray-200/60 rounded-lg hover:bg-gray-100 hover:text-blue-400 items-center text-xl">
                            {item.icon} {item.title}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}