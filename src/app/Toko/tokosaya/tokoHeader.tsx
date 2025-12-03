import {
  Store,
  MapPin,
  Clock,
  Star,
  Package,
  Award,
  TrendingUp,
  Truck,
  BadgeCheck,
} from "lucide-react";
import ExpandableDescription from "../[slug]/ExpandableDescription";
import StoreActionPanel from "./StoreActionPanel";
import type {
  MyTokoDetail,
  TokoStats,
  BukaTokoData,
} from "@/utils/tokoService";

type TokoHeaderProps = {
  tokoData: MyTokoDetail;
  stats: TokoStats;
  totalProducts: number;
  bukaToko: BukaTokoData | null;
  isOpen: boolean;
  kurirList: string[];
  storePhotoUrl: string;
};

export default function TokoHeader({
  tokoData,
  stats,
  totalProducts,
  bukaToko,
  isOpen,
  kurirList,
  storePhotoUrl,
}: TokoHeaderProps) {
  const safeAverageRating = Number(stats?.averageRating ?? 0).toFixed(1);
  const safeTotalReviews = Number(stats?.totalReviews ?? 0).toLocaleString();
  const safeTotalSold = Number(stats?.totalSold ?? 0);
  const safeAlamatToko = tokoData.alamat_toko?.split("\n")[0] ?? "";

  return (
    <div className="bg-linear-to-r from-[#55B4E5] via-[#4DA8DC] to-[#FBB338] border-b-4 border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden">
              {tokoData.foto ? (
                <img
                  src={storePhotoUrl}
                  alt={tokoData.nama_toko}
                  className="w-full h-full rounded-3xl object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#55B4E5] to-[#FBB338] rounded-3xl flex items-center justify-center">
                  <Store className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            {tokoData.toko_pilihan === "Y" && (
              <div className="absolute -bottom-2 -right-2 bg-[#FBB338] rounded-2xl px-3 py-1.5 shadow-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-white">
                {tokoData.nama_toko}
              </h1>
              {tokoData.toko_pilihan === "Y" && (
                <span className="px-4 py-1.5 bg-[#FBB338] text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4" />
                  Toko Pilihan
                </span>
              )}
              {tokoData.kategori_seller && (
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full capitalize">
                  {tokoData.kategori_seller} Seller
                </span>
              )}
              {isOpen && (
                <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full">
                  Buka
                </span>
              )}
            </div>

            <p className="text-white/90 text-sm mb-2">
              {tokoData.greating_message || tokoData.deskripsi_toko}
            </p>

            <ExpandableDescription
              text={tokoData.deskripsi_toko ?? ""}
              maxLength={150}
            />

            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <Star className="w-5 h-5 fill-[#FBB338] text-[#FBB338]" />
                  <span className="ml-2 font-bold text-white">
                    {safeAverageRating}
                  </span>
                </div>
                <span className="text-sm text-white/80">
                  ({safeTotalReviews} ulasan)
                </span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <Package className="w-5 h-5" />
                <span className="font-semibold">{totalProducts}+</span>
                <span className="text-sm text-white/80">Produk</span>
              </div>

              <div className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">
                  {(safeTotalSold / 1000).toFixed(1)}k+
                </span>
                <span className="text-sm text-white/80">Terjual</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  {safeAlamatToko}
                </span>
              </div>
              {bukaToko && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {bukaToko.time_open} - {bukaToko.time_close}
                  </span>
                </div>
              )}
              {kurirList.length > 0 && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Truck className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    {kurirList.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>

          <StoreActionPanel store={tokoData} />
        </div>
      </div>
    </div>
  );
}
