// app/page.tsx
import ProductCard from "@/components/ProductCard";
import RecommendedProductsSection from "@/components/RecommendedProductsSection";
import Link from "next/link";
import {
  getFeaturedProducts,
  getTopProducts,
  getRecommendedProducts,
} from "@/utils/productService";
import {
  BookOpen,
  Gamepad2,
  Dumbbell,
  Music,
  Gift,
  Receipt,
  Shirt,
  Gavel,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";

export default async function Home() {
  const [featuredProducts, topProducts, recommendedProducts] =
    await Promise.all([
      getFeaturedProducts(8),
      getTopProducts(6),
      getRecommendedProducts(100),
    ]);

  const categories = [
    { name: "Books", slug: "novel", Icon: BookOpen },
    { name: "Toys", slug: "action-figure", Icon: Gamepad2 },
    { name: "Sports", slug: "sport-tools", Icon: Dumbbell },
    { name: "Musics", slug: "music-tools", Icon: Music },
    { name: "Voucher", slug: "voucher", Icon: Receipt },
    { name: "Gift", slug: "gift", Icon: Gift },
    { name: "Physical Voucher", slug: "physical-voucher", Icon: Receipt },
    { name: "Fashion", slug: "fashion", Icon: Shirt },
    { name: "Lelang", slug: "mobil", Icon: Gavel },
    { name: "Digital", slug: "Digital", Icon: Smartphone },
    { name: "Lainnya", slug: "lainnya", Icon: MoreHorizontal },
  ];

  return (
    <div className="flex flex-col gap-y-10">
      {/* Hero Banner */}
      <section className="flex w-full min-h-80 items-center justify-center bg-gray-900 px-4 text-center text-3xl text-gray-50 sm:min-h-[360px] sm:px-8 sm:text-4xl lg:min-h-[400px] lg:px-20 lg:text-5xl">
        Welcome to JajaID!
      </section>

      {/* Category Section */}
      <section className="flex w-full flex-col gap-y-5 px-4 sm:px-8 lg:px-20 xl:px-40">
        <header className="py-5 text-lg text-gray-900 sm:text-2xl lg:text-4xl">
          Kategori pilihan
        </header>

        <div className="flex w-full px-3 py-4 rounded-lg bg-white shadow-md items-center gap-6 overflow-hidden">
          {categories.map((item, index) => (
            <Link
              key={index}
              href={`/Category/${item.slug}`}
              className="flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 min-w-[100px] sm:min-w-[120px] cursor-pointer"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                <item.Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-700" />
              </div>
              <p className="py-1 text-xs text-center text-gray-900 sm:text-sm lg:text-base">
                {item.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Product */}
      <section className="w-full flex flex-col py-10 px-4 sm:px-10 lg:px-40 wave wave-svg">
        <header className="w-full flex flex-col gap-y-2 pt-5 font-bold mb-4">
          <p className="text-2xl text-gray-50 sm:text-3xl lg:text-4xl">
            Produk terbaru dari Jaja!
          </p>

          {/* <p className="mb-2 flex justify-end pr-5 text-sm text-blue-100 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p> */}
        </header>

        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-8">
          {/* Div Cover */}
          <div className="hidden h-175 w-full max-w-sm flex-col items-center justify-center rounded-lg bg-linear-to-t from-blue-500 to-blue-800 shadow-lg md:flex lg:max-w-none lg:w-130">
            <p className="rounded-full bg-white px-5 py-10 text-center text-2xl font-bold text-blue-400">
              Jaja
              <span className="text-orange-400">ID</span>
            </p>
          </div>

          {/* Product Item grid */}
          <div className="w-full grid grid-cols-2 gap-2 sm:grid-cols-3 lg:ml-5 lg:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] lg:gap-2">
            {featuredProducts.map((product) => (
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

      {/* TOP PRODUCT */}
      <section className="w-full flex flex-col gap-y-5 py-15 px-4 sm:px-10 lg:px-40">
        <header className="flex w-full flex-col gap-y-2 font-bold">
          <p className="text-2xl text-gray-900 sm:text-3xl lg:text-4xl">
            Produk paling laris!
          </p>

          {/* <p className="mb-2 flex justify-end pr-5 text-sm text-blue-900 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p> */}
        </header>

        <div className="flex flex-row gap-x-3 overflow-x-auto pb-2 sm:gap-x-4">
          {topProducts.map((product) => (
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