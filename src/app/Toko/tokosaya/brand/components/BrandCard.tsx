import { Award, Calendar, User, Star, Tag } from "lucide-react";
import Link from "next/link";
import { MyTokoBrand } from "@/utils/type/tokoInterface";
import Image from "next/image";

interface BrandCardProps {
  brand: MyTokoBrand;
}

const KATEGORI_ICON_BASE_URL = "https://seller.jaja.id/asset/images/kategori/";

export default function BrandCard({ brand }: BrandCardProps) {
  const formattedDate = new Date(brand.created_date).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <Link
      href={`/Toko/tokosaya/brand/${brand.id_brand}`}
      className="group block"
    >
      <div className="relative bg-linear-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl overflow-hidden">
        {/* Top Badge */}
        {brand.top && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-linear-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-white" />
              Top Brand
            </div>
          </div>
        )}

        {/* Brand Icon with Gradient Background */}
        <div className="relative h-32 bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <Award className="w-16 h-16 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300" />

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Brand Name */}
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {brand.nama_brand}
          </h3>

          {/* Category Info */}
          {brand.kategori_info && (
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  {brand.kategori_info.parent_info && (
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {brand.kategori_info.parent_info.kategori} •{" "}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {brand.kategori_info.icon && (
                      <div className="w-5 h-5 relative shrink-0">
                        <Image
                          src={`${KATEGORI_ICON_BASE_URL}${brand.kategori_info.icon}`}
                          alt={brand.kategori_info.kategori}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                      {brand.kategori_info.kategori}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Creator Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="line-clamp-1">{brand.created_by.nama_user}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </Link>
  );
}
