// app/page.tsx
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import RecommendedProductsSection from "@/components/RecommendedProductsSection";
import Link from "next/link";
import {
  getFeaturedProducts,
  getTopProducts,
  getRecommendedProducts,
} from "@/utils/productService";
import { getLanding } from "@/utils/landingService";

export default async function Home() {
  const [landingData, featuredProducts, topProducts, recommendedProducts] =
    await Promise.all([
      getLanding(),
      getFeaturedProducts(6),
      getTopProducts(12),
      getRecommendedProducts(100),
    ]);

  const heroBanners = landingData?.data?.banners ?? [];
  const categories = (landingData?.data?.categories ?? []).slice(0, 12);

  return (
    <div className="flex flex-col gap-y-10">
      {/* Hero Banner */}

      <HeroCarousel banners={heroBanners} />

      {/* Category Section */}
      <section className="flex w-full flex-col gap-y-5 px-4 sm:px-8 lg:px-20 xl:px-40">
        <header className="py-5 text-lg text-gray-900 sm:text-2xl lg:text-4xl">
          Kategori pilihan
        </header>

        <div className="relative w-full">
          <div className="flex w-full gap-4 overflow-x-auto px-3 py-6 rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 shadow-lg scrollbar-hide scroll-smooth">
            {categories.map((item) => (
              <Link
                key={item.id_kategori}
                href={`/Category/${item.slug_kategori}`}
                className="group flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 min-w-[90px] sm:min-w-[110px] lg:min-w-[120px] cursor-pointer"
              >
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md transition-all group-hover:shadow-xl sm:h-20 sm:w-20 lg:h-24 lg:w-24 overflow-hidden">
                  {item.icon ? (
                    <img
                      src={`https://nimda.jaja.id/asset/front/images/file/${item.icon}`}
                      alt={item.kategori}
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400">
                      {item.kategori.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-xs text-center font-medium text-gray-800 sm:text-sm lg:text-base max-w-[90px] sm:max-w-[110px] lg:max-w-[120px] line-clamp-2">
                  {item.kategori}
                </p>
              </Link>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white to-transparent pointer-events-none" />
        </div>
      </section>

      {/* TOP Product */}
      <section className="w-full flex flex-col py-10 px-4 sm:px-10 lg:px-40 wave wave-svg">
        <header className="w-full flex flex-col gap-y-2 pt-5 font-bold mb-4">
          <p className="text-2xl text-gray-50 sm:text-3xl lg:text-4xl">
            Produk paling laris di Jaja!
          </p>

          {/* <p className="mb-2 flex justify-end pr-5 text-sm text-blue-100 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p> */}
        </header>

        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-8">
          {/* Div Cover */}
          {/* <div className="hidden h-175 w-full max-w-sm flex-col items-center justify-center rounded-lg bg-linear-to-t from-blue-500 to-blue-800 shadow-lg md:flex lg:max-w-none lg:w-130">
            <p className="rounded-full bg-white px-5 py-10 text-center text-2xl font-bold text-blue-400">
              Jaja
              <span className="text-orange-400">ID</span>
            </p>
          </div> */}

          {/* Product Item grid */}
          <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-3 lg:ml-5 lg:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] lg:gap-2">
            {topProducts.map((product) => (
              <ProductCard
                key={`featured-${product.id_produk}`}
                item={{
                  id: product.id_produk,
                  name: product.nama_produk,
                  price: product.harga,
                  image: product.covers?.[0]?.foto || "",
                  address: product.tokos.wilayah?.kelurahan_desa || "",
                  slug: product.slug_produk,
                  free_ongkir: product.free_ongkir || "",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT */}
      <section className="w-full flex flex-col gap-y-5 py-15 px-4 sm:px-10 lg:px-40">
        <header className="flex w-full flex-col gap-y-2 font-bold">
          <p className="text-2xl text-gray-900 sm:text-3xl lg:text-4xl">
            Produk terbaru
          </p>

          {/* <p className="mb-2 flex justify-end pr-5 text-sm text-blue-900 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p> */}
        </header>

        <div className="flex flex-row gap-x-3 overflow-x-auto pb-2 sm:gap-x-4">
          {featuredProducts.map((product) => (
            <div
              key={`top-${product.id_produk}`}
              className="min-w-[180px] sm:min-w-[200px]"
            >
              <ProductCard
                item={{
                  id: product.id_produk,
                  name: product.nama_produk,
                  price: product.harga,
                  image: product.covers?.[0]?.foto || "",
                  address: product.tokos.wilayah?.kelurahan_desa || "",
                  slug: product.slug_produk,
                  free_ongkir: product.free_ongkir || "",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* FOR YOU PRODUCTS */}
      <section className="flex w-full flex-col items-center gap-y-6 py-15 px-4 sm:px-8 lg:px-20 xl:px-40">
        <header className="text-center text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
          Mungkin kamu juga suka
        </header>

        <RecommendedProductsSection products={recommendedProducts} />
      </section>
    </div>
  );
}