// app/page.tsx
import ProductCard from "@/components/ProductCard";
import RecommendedProductsSection from "@/components/RecommendedProductsSection";
import {
  getFeaturedProducts,
  getTopProducts,
  getRecommendedProducts,
} from "@/utils/productService";

export default async function Home() {
  const [featuredProducts, topProducts, recommendedProducts] =
    await Promise.all([
      getFeaturedProducts(8),
      getTopProducts(6),
      getRecommendedProducts(100),
    ]);

  const categories = [
    { name: "Musik", icon: "/category/Musik.png" },
    { name: "Seni", icon: "/category/Seni.png" },
    { name: "Game", icon: "/category/Game.png" },
    { name: "Buku", icon: "/category/Buku.png" },
    { name: "Berkebun", icon: "/category/Berkebun.png" },
    { name: "Mainan", icon: "/category/Mainan.png" },
    { name: "Olahraga", icon: "/category/Olahraga.png" },
    { name: "Elektronik", icon: "/category/Electronic.png" },
    { name: "Fotografi", icon: "/category/Fotografi.png" },
    { name: "Peliharaan", icon: "/category/Peliharaan.png" },
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

        <div className="flex w-full px-3 py-4 rounded-lg bg-white shadow-md items-center gap-9 overflow-x-auto">
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 transition-transform hover:scale-105 min-w-[100px] sm:min-w-[120px] cursor-pointer"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="py-1 text-xs text-center text-gray-900 sm:text-sm lg:text-base">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Product */}
      <section className="w-full flex flex-col py-10 px-4 sm:px-10 lg:px-40 wave wave-svg">
        <header className="w-full flex flex-col gap-y-2 pt-5 font-bold">
          <p className="text-2xl text-gray-50 sm:text-3xl lg:text-4xl">
            Produk terbaru dari Jaja!
          </p>

          <p className="mb-2 flex justify-end pr-5 text-sm text-blue-100 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p>
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

          <p className="mb-2 flex justify-end pr-5 text-sm text-blue-900 transition-transform hover:-translate-y-1 sm:text-base lg:text-xl cursor-pointer">
            Lihat lainnya
          </p>
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
