import { ShoppingBag, Box, Tag, Award, LayoutGrid, Trash2 } from "lucide-react";

const managementMenu = [
  {
    title: "Pesanan",
    description: "Kelola dan pantau pesanan masuk",
    icon: ShoppingBag,
    primary: true,
  },
  {
    title: "Kelola Produk",
    description: "Atur stok, harga, dan status produk",
    icon: Box,
  },
  {
    title: "Voucher Toko",
    description: "Buat promo khusus pelanggan setia",
    icon: Tag,
  },
  {
    title: "Kelola Brand",
    description: "Tata identitas dan koleksi brand",
    icon: Award,
  },
  {
    title: "Kelola Etalase",
    description: "Susun etalase agar mudah dijelajahi",
    icon: LayoutGrid,
  },
  {
    title: "Hapus Toko",
    description: "Nonaktifkan toko secara permanen",
    icon: Trash2,
    danger: true,
  },
];

export default function ManagementSidebar() {
  return (
    <div className="w-full lg:w-80 shrink-0">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Toko</h2>
          <p className="text-sm text-gray-500">
            Akses cepat ke pengaturan penting toko kamu.
          </p>
        </div>

        <div className="space-y-3">
          {managementMenu.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                className={`w-full rounded-2xl border px-4 py-3 text-left transition hover:shadow-md ${
                  item.primary
                    ? "border-[#55B4E5] bg-linear-to-r from-[#55B4E5] to-[#4DA8DC] text-white hover:shadow-xl"
                    : item.danger
                      ? "border-red-200 bg-red-50/80 text-red-600 hover:bg-red-50"
                      : "border-gray-200 bg-white/60 text-gray-800 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent
                      className={`w-5 h-5 ${
                        item.primary
                          ? "text-white"
                          : item.danger
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <p
                      className={`text-sm ${
                        item.primary
                          ? "text-white/90"
                          : item.danger
                            ? "text-red-500"
                            : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
