import React from 'react';
import { Store, MapPin, Clock, Star, Package, MessageCircle, Share2, Heart, Award, TrendingUp, Truck, Search, Filter, ChevronDown, Grid, List, ShoppingCart, Zap, BadgeCheck } from 'lucide-react';
import { getTokoBySlug, getTokoProducts, getOperationalDays, getKurirList, getTokoPhotoUrl, isTokoOpen, getTokoStats, parseBukaTokoData } from '@/utils/tokoService';
import { notFound } from 'next/navigation';
import TokoClientComponent from './TokoClientComponent';
import ProductCard from '@/components/ProductCard';

interface TokoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TokoPage({ params }: TokoPageProps) {
  const { slug } = await params;
  console.log('🔍 TokoPage - Received slug:', slug);

  const [tokoData, productsResponse, stats] = await Promise.all([
    getTokoBySlug(slug),
    getTokoProducts(slug, { limit: 20, stok: 'ready', sort: 'newest' }),
    getTokoStats(slug)
  ]);

  // Jika toko tidak ditemukan
  if (!tokoData) {
    notFound();
  }

  const bukaToko = parseBukaTokoData(tokoData.data_buka_toko);
  const kurirList = getKurirList(tokoData.pilihan_kurir);
  const operationalDays = getOperationalDays(tokoData.data_buka_toko);
  const isOpen = isTokoOpen(tokoData.data_buka_toko);
  const storePhotoUrl = getTokoPhotoUrl(tokoData.foto);

  // Transform products data to match ProductCard format
  const transformedProducts = productsResponse.data.map((product) => ({
    id: product.id_produk,
    name: product.nama_produk,
    price: product.harga,
    image: product.covers && product.covers.length > 0 ? product.covers[0].foto : '',
    address: product.tokos?.wilayah?.kelurahan_desa || tokoData.alamat_toko.split('\n')[0],
    slug: product.slug_produk
  }));

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-orange-50">
      {/* Modern Minimalist Header */}
      <div className="bg-linear-to-r from-[#55B4E5] via-[#4DA8DC] to-[#FBB338] border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Shop Avatar & Badge */}
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
              {tokoData.toko_pilihan === 'Y' && (
                <div className="absolute -bottom-2 -right-2 bg-[#FBB338] rounded-2xl px-3 py-1.5 shadow-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Shop Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-white">{tokoData.nama_toko}</h1>
                {tokoData.toko_pilihan === 'Y' && (
                  <span className="px-4 py-1.5 bg-[#FBB338] text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4" />
                    Toko Pilihan
                  </span>
                )}
                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full capitalize">
                  {tokoData.kategori_seller} Seller
                </span>
                {isOpen && (
                  <span className="px-4 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-full">
                    🟢 Buka
                  </span>
                )}
              </div>
              
              <p className="text-white/90 text-sm mb-2">{tokoData.greating_message}</p>
              <p className="text-white/80 text-lg mb-4 max-w-2xl">{tokoData.deskripsi_toko}</p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-[#FBB338] text-[#FBB338]" />
                    <span className="ml-2 font-bold text-white">{stats.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-white/80">({stats.totalReviews.toLocaleString()} ulasan)</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">{stats.totalProducts}+</span>
                  <span className="text-sm text-white/80">Produk</span>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{(stats.totalSold / 1000).toFixed(1)}k+</span>
                  <span className="text-sm text-white/80">Terjual</span>
                </div>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{tokoData.alamat_toko.split('\n')[0]}</span>
                </div>
                {bukaToko && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      {bukaToko.time_open} - {bukaToko.time_close}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Truck className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{kurirList.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <TokoClientComponent />
          </div>
        </div>
      </div>

      {/* Main Content with Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari produk di toko ini..."
                className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                <Filter className="w-5 h-5" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <select className="px-5 py-3.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer transition-all appearance-none bg-white pr-10">
                <option>Terbaru</option>
                <option>Terlaris</option>
                <option>Harga Terendah</option>
                <option>Harga Tertinggi</option>
              </select>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button className="p-2 rounded-lg transition-all bg-white shadow-sm text-[#55B4E5]">
                  <Grid className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg transition-all text-gray-500">
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Semua Produk</h2>
          <p className="text-gray-600">Menampilkan {productsResponse.meta.total}+ produk tersedia</p>
        </div>
        
        {/* Products Grid - Using ProductCard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} item={product} />
          ))}
        </div>

        {/* Load More */}
        {productsResponse.meta.total > productsResponse.data.length && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white border-2 border-[#55B4E5] rounded-xl font-bold text-[#55B4E5] hover:bg-linear-to-r hover:from-[#55B4E5] hover:to-[#FBB338] hover:text-white hover:border-transparent transition-all duration-200 shadow-lg">
              Muat Lebih Banyak Produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}