import { getTokoDashboard } from "@/utils/tokoService";

export default async function TokosayaPage() {
  const dataDashboard = await getTokoDashboard();
  console.log(dataDashboard);

  const TrackingOrder = [
    { label: "Pesanan Baru", value: 10 },
    { label: "Berlangsung", value: 5 },
    { label: "Dikirim", value: 4 },
    { label: "Pesanan Selesai", value: 22 },
  ];

  return (
    <div className="flex flex-col flex-1 gap-6 w-full">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Dashboard Toko
        </h2>

        <p className="text-gray-600">Kelola toko kamu di sini!</p>
      </div>

      <div className="flex gap-4">
        {TrackingOrder.map((t, index) => (
          <div
            key={index}
            className="flex flex-col w-full justify-center rounded-lg bg-white p-4 shadow-md border border-gray-100"
          >
            <h3 className="text-md font-bold text-gray-900/50 mb-1 text-center">
              {t.label}
            </h3>

            <h2 className="text-xl font-bold text-gray-900 text-center">
              {String(t.value)}
            </h2>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col w-full p-4 rounded-xl bg-white shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Penjualan tahun ini
          </h3>

          {/* Buat diagram penjualan */}
        </div>

        <div className="flex flex-col w-full p-4 rounded-xl bg-white shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Pesanan yang berlangsung
          </h3>

          {/* Buat list pesanan disini pliss */}
        </div>
      </div>
    </div>
  );
}
