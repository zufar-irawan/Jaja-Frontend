import React from 'react';
import { Store, MapPin, Clock, Star, Package, Award, TrendingUp, Truck, BadgeCheck } from 'lucide-react';
import { getTokoBySlug, getTokoProducts, getOperationalDays, getKurirList, getTokoPhotoUrl, isTokoOpen, getTokoStats, parseBukaTokoData } from '@/utils/tokoService';
import { notFound } from 'next/navigation';
import TokoClientComponent from './TokoClientComponent';
import ProductCard from '@/components/ProductCard';
import ExpandableDescription from './ExpandableDescription';
import ProductFilter from './ProductFilter';

interface TokoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TokoPage({ params }: TokoPageProps) {
  const { slug } = await params;
  console.log('TokoPage - Received slug:', slug);

  const [tokoData, productsResponse, stats] = await Promise.all([
    getTokoBySlug(slug),
    getTokoProducts(slug, { limit: 20, stok: 'ready', sort: 'newest' }),
    getTokoStats(slug)
  ]);

  if (!tokoData) {
    notFound();
  }

  const bukaToko = parseBukaTokoData(tokoData.data_buka_toko);
  const kurirList = getKurirList(tokoData.pilihan_kurir);
  const operationalDays = getOperationalDays(tokoData.data_buka_toko);
  const isOpen = isTokoOpen(tokoData.data_buka_toko);
  const storePhotoUrl = getTokoPhotoUrl(tokoData.foto);
  const transformedProducts = productsResponse.data.map((product) => ({
    id: product.id_produk,
    name: product.nama_produk,
    price: product.harga,
    image: product.covers && product.covers.length > 0 ? product.covers[0].foto : '',
    address: product.tokos?.wilayah?.kelurahan_desa || tokoData.alamat_toko.split('\n')[0],
    slug: product.slug_produk
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50">
      {/* Modern Minimalist Header */}
      <div className="bg-gradient-to-r from-[#55B4E5] via-[#4DA8DC] to-[#FBB338] border-b-4 border-white/20">
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
                  <div className="w-full h-full bg-gradient-to-br from-[#55B4E5] to-[#FBB338] rounded-3xl flex items-center justify-center">
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
              
              {/* Expandable Description */}
              <ExpandableDescription 
                text={tokoData.deskripsi_toko} 
                maxLength={150}
              />

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

      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <ProductFilter />

          {/* Products Section */}
          <div className="flex-1">
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Semua Produk</h2>
              <p className="text-gray-600">Menampilkan {productsResponse.meta.total}+ produk tersedia</p>
            </div>
            
            {/* Products Grid - Using ProductCard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {transformedProducts.map((product) => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>

            {/* Load More */}
            {productsResponse.meta.total > productsResponse.data.length && (
              <div className="text-center mt-12">
                <button className="px-8 py-4 bg-white border-2 border-[#55B4E5] rounded-xl font-bold text-[#55B4E5] hover:bg-gradient-to-r hover:from-[#55B4E5] hover:to-[#FBB338] hover:text-white hover:border-transparent transition-all duration-200 shadow-lg">
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