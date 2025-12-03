import React from "react";
import Link from "next/link";

export default function NoStoreFallback() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Kamu belum punya toko
        </h1>
        <p className="text-gray-600 mb-6">
          Buka tokomu terlebih dahulu untuk mengakses halaman ini dan mulai
          mengelola produkmu.
        </p>
        <Link
          href="/Toko/buka-toko"
          className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#55B4E5] to-[#FBB338] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          Buka Toko Sekarang
        </Link>
      </div>
    </div>
  );
}
