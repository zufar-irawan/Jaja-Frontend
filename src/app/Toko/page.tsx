'use client';

import React, { useState } from 'react';
import { Store, MapPin, Clock, Star, Package, MessageCircle, Share2, Heart, Award, TrendingUp, Truck, Search, Filter, ChevronDown, Grid, List, ShoppingCart, Zap, BadgeCheck, Users } from 'lucide-react';

interface TokoData {
  id_toko: number;
  nama_toko: string;
  slug_toko: string;
  foto: string;
  greating_message: string;
  deskripsi_toko: string;
  alamat_toko: string;
  kota_kabupaten: number;
  provinsi: number;
  kode_pos: string;
  toko_pilihan: string;
  kategori_seller: string;
  skor: number;
  pilihan_kurir: string;
  data_buka_toko: string;
  created_date: string;
}

const ShopDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'reviews'>('home');
  const [isFollowing, setIsFollowing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tokoData: TokoData = {
    id_toko: 569,
    nama_toko: "General Trading - Eureka",
    slug_toko: "general-trading-eureka",
    foto: "20240703668501a1b2ce7.jpeg",
    greating_message: "Hallo Selamat Datang Di Toko General Trading !",
    deskripsi_toko: "Menjual semua kebutuhan sekolah dari mulai ATK sampai Peralatan Office",
    alamat_toko: "Jl. H. Baping Raya No.100\nCiracas Jakarta Timur ",
    kota_kabupaten: 154,
    provinsi: 6,
    kode_pos: "13740",
    toko_pilihan: "Y",
    kategori_seller: "Bronze",
    skor: 0,
    pilihan_kurir: "jne:jnt:sicepat",
    data_buka_toko: "{\"days\":\"monday,tuesday,wednesday,thursday,friday,saturday\",\"time_open\":\"00:00\",\"time_close\":\"23:59\",\"time_zone\":\"wib\"}",
    created_date: "2024-06-26"
  };

  const bukaToko = JSON.parse(tokoData.data_buka_toko);
  const kurirList = tokoData.pilihan_kurir.split(':').map(k => k.toUpperCase());
  
  const daysIndo: { [key: string]: string } = {
    monday: 'Sen',
    tuesday: 'Sel', 
    wednesday: 'Rab',
    thursday: 'Kam',
    friday: 'Jum',
    saturday: 'Sab',
    sunday: 'Min'
  };

  const operationalDays = bukaToko.days.split(',').map((d: string) => daysIndo[d]).join(', ');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-orange-50">
      {/* Modern Minimalist Header */}
      <div className="bg-gradient-to-r from-[#55B4E5] via-[#4DA8DC] to-[#FBB338] border-b-4 border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Shop Avatar & Badge */}
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl">
                <div className="w-full h-full bg-gradient-to-br from-[#55B4E5] to-[#FBB338] rounded-3xl flex items-center justify-center">
                  <Store className="w-16 h-16 text-white" />
                </div>
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
              </div>
              
              <p className="text-white/90 text-sm mb-2">{tokoData.greating_message}</p>
              <p className="text-white/80 text-lg mb-4 max-w-2xl">{tokoData.deskripsi_toko}</p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-[#FBB338] text-[#FBB338]" />
                    <span className="ml-2 font-bold text-white">4.8</span>
                  </div>
                  <span className="text-sm text-white/80">(2.5k ulasan)</span>
                </div>
                
                <div className="flex items-center gap-2 text-white">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">150+</span>
                  <span className="text-sm text-white/80">Produk</span>
                </div>

                <div className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">5k+</span>
                  <span className="text-sm text-white/80">Terjual</span>
                </div>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Jakarta Timur</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{bukaToko.time_open} - {bukaToko.time_close}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Truck className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">{kurirList.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col gap-3 lg:w-48">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isFollowing 
                    ? 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30' 
                    : 'bg-white text-[#55B4E5] hover:shadow-xl shadow-lg'
                }`}
              >
                {isFollowing ? '✓ Mengikuti' : '+ Ikuti Toko'}
              </button>
              
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat
              </button>

              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl font-semibold text-white hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-lg z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex">
              {[
                { id: 'home', label: 'Beranda', icon: Store },
                { id: 'products', label: 'Produk', icon: Package },
                { id: 'reviews', label: 'Ulasan', icon: Star }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? 'text-[#55B4E5]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#55B4E5] to-[#FBB338] rounded-t-lg"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
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
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#55B4E5]' : 'text-gray-500'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#55B4E5]' : 'text-gray-500'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Semua Produk</h2>
          <p className="text-gray-600">Menampilkan 150+ produk tersedia</p>
        </div>
        
        {/* Products Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5' : 'flex flex-col gap-4'}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-5' : ''}`}>
              <div className={`bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden ${viewMode === 'list' ? 'flex flex-1' : ''}`}>
                {/* Image */}
                <div className={`relative bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                  <Package className="w-20 h-20 text-gray-300 group-hover:text-[#55B4E5] transition-all duration-300 group-hover:scale-110" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {i % 3 === 0 && (
                      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg">
                        -20%
                      </span>
                    )}
                    {i % 4 === 0 && (
                      <span className="px-3 py-1 bg-[#FBB338] text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Terlaris
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                </div>

                {/* Info */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                  <div>
                    <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 font-semibold group-hover:text-[#55B4E5] transition-colors">
                      Produk ATK Kebutuhan Sekolah Premium #{i}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-xl font-bold text-gray-900">Rp 25.000</p>
                      {i % 3 === 0 && (
                        <p className="text-sm text-gray-400 line-through">Rp 31.250</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-[#FBB338] text-[#FBB338]" />
                        <span className="text-sm font-semibold text-gray-900">4.8</span>
                        <span className="text-xs text-gray-400">(120)</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">450 terjual</span>
                    </div>

                    {viewMode === 'list' && (
                      <button className="w-full py-2.5 bg-gradient-to-r from-[#55B4E5] to-[#4DA8DC] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Tambah ke Keranjang
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-white border-2 border-[#55B4E5] rounded-xl font-bold text-[#55B4E5] hover:bg-gradient-to-r hover:from-[#55B4E5] hover:to-[#FBB338] hover:text-white hover:border-transparent transition-all duration-200 shadow-lg">
            Muat Lebih Banyak Produk
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;