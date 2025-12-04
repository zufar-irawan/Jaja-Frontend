import {
  ShoppingBag,
  Box,
  Tag,
  Award,
  LayoutGrid,
  Trash2,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface ManagementMenuItem {
  title: string;
  link: string;
  icon: LucideIcon;
  danger?: boolean;
  primary?: boolean;
}

const managementMenu: ManagementMenuItem[] = [
  {
    title: "Pesanan",
    link: "/pesanan",
    icon: ShoppingBag,
  },
  {
    title: "Kelola Produk",
    link: "/produk",
    icon: Box,
  },
  {
    title: "Voucher Toko",
    link: "/voucher",
    icon: Tag,
  },
  {
    title: "Kelola Brand",
    link: "/brand",
    icon: Award,
  },
  {
    title: "Kelola Etalase",
    link: "/etalase",
    icon: LayoutGrid,
  },
  {
    title: "Hapus Toko",
    link: "/hapus-toko",
    icon: Trash2,
    danger: true,
  },
];

export default function ManagementSidebar() {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden sticky top-8">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
          <h2 className="text-xl font-bold text-white mb-1">Manajemen Toko</h2>
          <p className="text-sm text-blue-100">
            Akses cepat ke pengaturan penting toko kamu
          </p>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          {managementMenu.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.title}
                href={`/Toko/tokosaya${item.link}`}
                className={`
                  group flex items-center gap-3 w-full rounded-xl px-4 py-3.5
                  border transition-all duration-200 ease-in-out
                  ${
                    item.primary
                      ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:shadow-md"
                      : item.danger
                        ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 hover:shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-md"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-lg
                  transition-colors duration-200
                  ${
                    item.primary
                      ? "bg-blue-100 group-hover:bg-blue-200"
                      : item.danger
                        ? "bg-red-100 group-hover:bg-red-200"
                        : "bg-white group-hover:bg-gray-100"
                  }
                `}
                >
                  {IconComponent && (
                    <IconComponent
                      className={`w-5 h-5 ${
                        item.primary
                          ? "text-blue-600"
                          : item.danger
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{item.title}</div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${
                    item.primary
                      ? "text-blue-400"
                      : item.danger
                        ? "text-red-400"
                        : "text-gray-400"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
