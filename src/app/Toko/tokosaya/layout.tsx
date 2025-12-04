import TokoHeader from "./components/tokoHeader";
import ManagementSidebar from "./components/sidebarToko";
import NoStoreFallback from "./components/noStoreFallback";

import {
  getMyToko,
  getMyTokoProducts,
  getTokoStats,
  getKurirList,
  getTokoPhotoUrl,
  isTokoOpen,
  parseBukaTokoData,
} from "@/utils/tokoService";

export default async function TokoSayaRoot({
  children,
}: {
  children: React.ReactNode;
}) {
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

          {children}
        </div>
      </div>
    </div>
  );
}
