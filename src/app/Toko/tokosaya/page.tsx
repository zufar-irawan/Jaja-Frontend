import ManagementSidebar from "./sidebarToko";
import TokoHeader from "./tokoHeader";
import ProductCard from "@/components/ProductCard";
import {
  getMyToko,
  getMyTokoProducts,
  getTokoStats,
  getKurirList,
  getTokoPhotoUrl,
  isTokoOpen,
  parseBukaTokoData,
} from "@/utils/tokoService";
import NoStoreFallback from "./noStoreFallback";

const SELLER_PRODUCT_IMAGE_BASE_URL =
  "https://seller.jaja.id/asset/images/products/";

export default async function TokoSayaPage() {
  const tokoData = await getMyToko();

  if (!tokoData) {
    return <NoStoreFallback />;
  }

  const serializedSchedule =
    typeof tokoData.data_buka_toko === "string"
      ? tokoData.data_buka_toko
      : JSON.stringify(tokoData.data_buka_toko ?? {});

  const [productsResponse, stats] = await Promise.all([
    getMyTokoProducts({ limit: 20, status_produk: "live", draft: "T" }),
    getTokoStats(tokoData.slug_toko),
  ]);

  const kurirSource = Array.isArray(tokoData.pilihan_kurir)
    ? tokoData.pilihan_kurir.join(":")
    : tokoData.pilihan_kurir || "";
  const kurirList = kurirSource ? getKurirList(kurirSource) : [];

  const bukaToko = serializedSchedule
    ? parseBukaTokoData(serializedSchedule)
    : null;
  const isOpen = serializedSchedule ? isTokoOpen(serializedSchedule) : false;

  const storePhotoUrl = getTokoPhotoUrl(tokoData.foto || "");

  const products = productsResponse?.produk ?? [];
  const transformedProducts = products.map((product) => ({
    id: product.id_produk,
    name: product.nama_produk,
    price: product.harga,
    image: product.thumbnail
      ? `${SELLER_PRODUCT_IMAGE_BASE_URL}${product.thumbnail}`
      : "",
    address: tokoData.alamat_toko.split("\n")[0] ?? tokoData.alamat_toko,
    slug: product.slug_produk,
    free_ongkir: tokoData.free_ongkir,
  }));

  const totalProducts =
    productsResponse?.pagination?.total ?? stats.totalProducts ?? 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
      {/*Header*/}
      <TokoHeader
        tokoData={tokoData}
        stats={stats}
        totalProducts={totalProducts}
        bukaToko={bukaToko}
        isOpen={isOpen}
        kurirList={kurirList}
        storePhotoUrl={storePhotoUrl}
      />

      {/* body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <ManagementSidebar />

          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Produk Saya
              </h2>
              <p className="text-gray-600">
                Menampilkan {totalProducts}+ produk yang aktif di toko kamu
              </p>
            </div>

            {transformedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {transformedProducts.map((product) => (
                  <ProductCard key={product.id} item={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
                Belum ada produk yang ditayangkan.
              </div>
            )}

            {productsResponse &&
              productsResponse.pagination.total >
                productsResponse.produk.length && (
                <div className="text-center mt-12">
                  <button className="px-8 py-4 bg-white border-2 border-[#55B4E5] rounded-xl font-bold text-[#55B4E5] hover:bg-linear-to-r hover:from-[#55B4E5] hover:to-[#FBB338] hover:text-white hover:border-transparent transition-all duration-200 shadow-lg">
                    Muat Lebih Banyak Produk
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
