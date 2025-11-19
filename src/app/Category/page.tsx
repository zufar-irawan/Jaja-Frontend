'use client';

import React, { useState } from 'react';
import { Search, MapPin, X, SlidersHorizontal, Grid3x3, LayoutList, ChevronDown, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  badge?: string;
  condition?: string;
  stock?: string;
}

const CategoryPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const allProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 12 - 64 GB',
      price: 'Rp7.749.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&h=500&fit=crop',
      badge: 'Pre Order',
      condition: 'baru',
      stock: 'pre-order'
    },
    {
      id: 2,
      title: 'We Are Nowhere and It\'s Wow',
      price: 'Rp60.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 3,
      title: 'Na Willa dan Rumah dalam Gang',
      price: 'Rp65.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 4,
      title: 'Na Willa',
      price: 'Rp60.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 5,
      title: 'Lusifer! Lusifer!',
      price: 'Rp75.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 6,
      title: 'Semasa',
      price: 'Rp55.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 7,
      title: 'Cerita Cerita Jakarta',
      price: 'Rp68.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 8,
      title: 'Sobat Manusia',
      price: 'Rp72.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1510172951991-856a654063f9?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 9,
      title: 'MacBook Air M1 - 256GB',
      price: 'Rp12.500.000',
      location: 'Kota Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=500&fit=crop',
      badge: 'Pre Order',
      condition: 'baru',
      stock: 'pre-order'
    },
    {
      id: 10,
      title: 'Samsung Galaxy S21',
      price: 'Rp8.999.000',
      location: 'Kota Jakarta Barat',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 11,
      title: 'iPad Pro 11 inch',
      price: 'Rp11.200.000',
      location: 'Kota Jakarta Utara',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 12,
      title: 'Sony WH-1000XM4 Headphones',
      price: 'Rp4.500.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 13,
      title: 'Canon EOS M50 Mark II',
      price: 'Rp9.800.000',
      location: 'Kota Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1606980707986-8f7d66e2c4b3?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 14,
      title: 'Nintendo Switch OLED',
      price: 'Rp5.200.000',
      location: 'Kota Jakarta Barat',
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=500&fit=crop',
      badge: 'Pre Order',
      condition: 'baru',
      stock: 'pre-order'
    },
    {
      id: 15,
      title: 'Apple Watch Series 7',
      price: 'Rp6.500.000',
      location: 'Kota Jakarta Utara',
      image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 16,
      title: 'Mechanical Keyboard RGB',
      price: 'Rp1.200.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 17,
      title: 'Logitech MX Master 3',
      price: 'Rp1.500.000',
      location: 'Kota Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 18,
      title: 'Samsung 4K Monitor 27"',
      price: 'Rp3.800.000',
      location: 'Kota Jakarta Barat',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 19,
      title: 'JBL Flip 5 Speaker',
      price: 'Rp1.800.000',
      location: 'Kota Jakarta Utara',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 20,
      title: 'DJI Mini 3 Pro Drone',
      price: 'Rp9.500.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=500&fit=crop',
      badge: 'Pre Order',
      condition: 'baru',
      stock: 'pre-order'
    },
    {
      id: 21,
      title: 'GoPro Hero 11 Black',
      price: 'Rp7.200.000',
      location: 'Kota Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1606941369936-677cda1bdd9e?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 22,
      title: 'Xiaomi Mi Band 7',
      price: 'Rp450.000',
      location: 'Kota Jakarta Barat',
      image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    },
    {
      id: 23,
      title: 'Kindle Paperwhite',
      price: 'Rp2.100.000',
      location: 'Kota Jakarta Utara',
      image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=500&fit=crop',
      condition: 'bekas',
      stock: 'ready'
    },
    {
      id: 24,
      title: 'AirPods Pro 2nd Gen',
      price: 'Rp3.800.000',
      location: 'Kota Jakarta Timur',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=500&fit=crop',
      condition: 'baru',
      stock: 'ready'
    }
  ];

  const filteredProducts = allProducts.filter(product => {
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCondition && product.condition !== selectedCondition) {
      return false;
    }
    if (selectedStock && product.stock !== selectedStock) {
      return false;
    }
    if (selectedLocation && product.location.toLowerCase() !== selectedLocation.toLowerCase()) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/\D/g, ''));
    const priceB = parseInt(b.price.replace(/\D/g, ''));
    
    switch (selectedSort) {
      case 'Nama (A-Z)':
        return a.title.localeCompare(b.title);
      case 'Nama (Z-A)':
        return b.title.localeCompare(a.title);
      case 'Harga Terendah':
        return priceA - priceB;
      case 'Harga Tertinggi':
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSelectedCondition('');
    setSelectedStock('');
    setSelectedSort('');
    setSelectedLocation('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCondition, selectedStock, selectedSort, selectedLocation].filter(Boolean).length;

  // Pagination calculations
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);
  const showingFrom = totalItems === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalItems);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const FilterSection = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Lokasi */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Lokasi
        </label>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition-all appearance-none cursor-pointer hover:border-gray-200"
          >
            <option value="">- Pilih Lokasi -</option>
            <option value="Kota Jakarta Timur">Jakarta Timur</option>
            <option value="Kota Jakarta Barat">Jakarta Barat</option>
            <option value="Kota Jakarta Selatan">Jakarta Selatan</option>
            <option value="Kota Jakarta Utara">Jakarta Utara</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Kondisi */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Kondisi
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['baru', 'bekas'].map((condition) => (
            <label
              key={condition}
              className={`relative flex items-center justify-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all ${
                selectedCondition === condition
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 border-gray-200 hover:border-[#55B4E5] text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'condition-mobile' : 'condition'}
                value={condition}
                checked={selectedCondition === condition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="hidden"
              />
              <span className="font-medium capitalize">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Stock
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'pre-order', label: 'Pre Order' },
            { value: 'ready', label: 'Ready' }
          ].map((stock) => (
            <label
              key={stock.value}
              className={`relative flex items-center justify-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all ${
                selectedStock === stock.value
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 border-gray-200 hover:border-[#55B4E5] text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'stock-mobile' : 'stock'}
                value={stock.value}
                checked={selectedStock === stock.value}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="hidden"
              />
              <span className="font-medium">{stock.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Urutkan */}
      <div>
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Urutkan
        </label>
        <div className="space-y-2">
          {['Terlaris', 'Terbaru', 'Nama (A-Z)', 'Nama (Z-A)', 'Harga Terendah', 'Harga Tertinggi', 'Ulasan Tertinggi'].map((option) => (
            <label
              key={option}
              className={`flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all ${
                selectedSort === option
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'sort-mobile' : 'sort'}
                value={option}
                checked={selectedSort === option}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="hidden"
              />
              <span className="font-medium">{option}</span>
              {selectedSort === option && <Sparkles className="ml-auto w-4 h-4" />}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#55B4E5]/10 to-[#FBB338]/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar - Modern Glass Card */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent">
                  Filter
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              <FilterSection />
            </div>
          </div>

          {/* Mobile Filter Modal - Modern Slide */}
          {showFilter && (
            <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent">
                      Filter
                    </h2>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <FilterSection mobile />

                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-semibold"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-[#55B4E5] to-[#FBB338] text-white rounded-2xl hover:shadow-lg hover:shadow-[#55B4E5]/50 transition-all font-semibold"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid/List */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-2">
                Semua Produk
              </h1>
              <p className="text-gray-600 font-medium">
                {sortedProducts.length} produk ditemukan
              </p>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100">
                <div className="text-gray-300 mb-6">
                  <Search className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Produk tidak ditemukan</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Coba ubah filter atau kata kunci pencarian Anda untuk hasil yang lebih baik
                </p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-gradient-to-r from-[#55B4E5] to-[#FBB338] text-white rounded-2xl hover:shadow-lg hover:shadow-[#55B4E5]/50 transition-all font-semibold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
                : "grid grid-cols-1 gap-6"
              }>
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.badge && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FBB338] to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] text-lg group-hover:text-[#55B4E5] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xl font-bold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-4">
                        {product.price}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0 text-[#55B4E5]" />
                        <span className="truncate font-medium">{product.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between">
                {/* Showing text */}
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{showingFrom}-{showingTo}</span> of <span className="font-semibold">{totalItems}</span>
                </p>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1">
                  {/* Previous Page */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  {getPaginationRange().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page as number)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-[#55B4E5] text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Next Page */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg transition-all ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;