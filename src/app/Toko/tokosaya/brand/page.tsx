import Link from "next/link";
import { Plus } from "lucide-react";
import NoStoreFallback from "../components/noStoreFallback";
import BrandCard from "./components/BrandCard";
import { getMyToko, getMyTokoBrand } from "@/utils/tokoService";

export default async function BrandPage() {
  const tokoData = await getMyToko();

  if (!tokoData) {
    return <NoStoreFallback />;
  }

  const brandResponse = await getMyTokoBrand();
  console.log("Brand Response:", brandResponse);
  const brands = brandResponse?.brands ?? [];
  console.log("Brands array:", brands);

  return (
    <div className="flex-1">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Kelola Brand
          </h2>
          <p className="text-gray-600">
            Menampilkan {brands.length} brand yang terdaftar di toko kamu
          </p>
        </div>
        <Link
          href="/Toko/tokosaya/brand/new"
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Brand</span>
        </Link>
      </div>

      {brands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id_brand} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Belum ada brand
              </h3>
              <p className="text-gray-500 mb-4">
                Mulai tambahkan brand untuk produk-produk di toko kamu
              </p>
              <Link
                href="/Toko/tokosaya/brand/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Brand Pertama</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
