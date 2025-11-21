'use client';

import React, { useState, useEffect, use } from 'react';
import { Search, MapPin, X, SlidersHorizontal, ChevronDown, Sparkles, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { searchProducts, getCategoryBySlug, type Product, type SearchProductsParams, type Category } from '@/utils/productService';
import ProductCard from '@/components/ProductCard';

const DynamicCategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const categorySlug = params.slug as string;
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const itemsPerPage = 15;

  useEffect(() => {
    if (categorySlug) {
          fetchProducts();
    }
  }, [categorySlug, selectedCondition, selectedStock, selectedSort, currentPage, searchQuery]);

  useEffect(() => {
    if (!categorySlug) return;
  
    const timeoutId = setTimeout(() => {
    setCurrentPage(1);
    fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const category = await getCategoryBySlug(categorySlug);
      if (category) {
        setCategoryInfo(category);
      }

      const searchParams: SearchProductsParams = {
        limit: itemsPerPage,
        page: currentPage,
        stok: selectedStock === 'pre-order' ? 'preorder' : selectedStock === 'ready' ? 'ready' : undefined,
        kondisi: selectedCondition === 'baru' ? 'baru' : selectedCondition === 'bekas' ? 'bekas' : undefined,
        id_kategori: category?.id_kategori,
      };

      if (selectedSort === 'Nama (A-Z)') searchParams.sort = 'name_asc';
      else if (selectedSort === 'Nama (Z-A)') searchParams.sort = 'name_desc';
      else if (selectedSort === 'Harga Terendah') searchParams.sort = 'price_asc';
      else if (selectedSort === 'Harga Tertinggi') searchParams.sort = 'price_desc';
      else if (selectedSort === 'Terbaru') searchParams.sort = 'newest';
      else if (selectedSort === 'Ulasan Tertinggi') searchParams.sort = 'rating_desc';

      if (searchQuery) {
        searchParams.nama_produk = searchQuery;
      }

      const response = await searchProducts(searchParams);

      if (response.success) {
        let filteredProducts = response.data;

        if (selectedLocation) {
          filteredProducts = filteredProducts.filter(product => 
            product.tokos?.wilayah?.kelurahan_desa.toLowerCase().includes(selectedLocation.toLowerCase())
          );
        }

        setProducts(filteredProducts);
        setTotalProducts(response.meta.total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCondition('');
    setSelectedStock('');
    setSelectedSort('');
    setSelectedLocation('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCondition, selectedStock, selectedSort, selectedLocation].filter(Boolean).length;

  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const showingFrom = totalProducts === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, totalProducts);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (slug: string) => {
    router.push(`/Product/${slug}`);
  };

  const FilterSection = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Search within category */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Cari Produk
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dalam kategori ini..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Lokasi */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Lokasi
        </label>
        <div className="relative">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition-all appearance-none cursor-pointer hover:border-gray-200"
          >
            <option value="">- Pilih Lokasi -</option>
            <option value="Jakarta Timur">Jakarta Timur</option>
            <option value="Jakarta Barat">Jakarta Barat</option>
            <option value="Jakarta Selatan">Jakarta Selatan</option>
            <option value="Jakarta Utara">Jakarta Utara</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Kondisi */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Kondisi
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['baru', 'bekas'].map((condition) => (
            <label
              key={condition}
              className={`relative flex items-center justify-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all ${
                selectedCondition === condition
                  ? 'bg-linear-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
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
        <label className="block text-sm font-semibold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
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
                  ? 'bg-linear-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
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
        <label className="block text-sm font-semibold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Urutkan
        </label>
        <div className="space-y-2">
          {['Terlaris', 'Terbaru', 'Nama (A-Z)', 'Nama (Z-A)', 'Harga Terendah', 'Harga Tertinggi', 'Ulasan Tertinggi'].map((option) => (
            <label
              key={option}
              className={`flex items-center cursor-pointer px-4 py-3 rounded-xl transition-all ${
                selectedSort === option
                  ? 'bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white shadow-lg shadow-[#55B4E5]/50'
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-[#55B4E5]/10 to-[#FBB338]/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent">
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

          {/* Mobile Filter Modal */}
          {showFilter && (
            <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent">
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
                      className="flex-1 px-6 py-4 bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white rounded-2xl hover:shadow-lg hover:shadow-[#55B4E5]/50 transition-all font-semibold"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-2 capitalize">
                  {categoryInfo?.kategori || categorySlug.replace(/-/g, ' ')}
                </h1>
                <p className="text-gray-600 font-medium">
                  {isLoading ? 'Memuat...' : `${totalProducts} produk ditemukan`}
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-200 hover:border-[#55B4E5] transition-all"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-medium">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-[#55B4E5] animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Memuat produk...</p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100">
                <div className="text-gray-300 mb-6">
                  <Package className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Produk tidak ditemukan</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Coba ubah filter atau kata kunci pencarian Anda untuk hasil yang lebih baik
                </p>
                <button
                  onClick={resetFilters}
                  className="px-8 py-4 bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white rounded-2xl hover:shadow-lg hover:shadow-[#55B4E5]/50 transition-all font-semibold"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id_produk}
                      item={{
                        id: product.id_produk,
                        name: product.nama_produk,
                        price: product.harga,
                        image: product.covers?.[0]?.foto || '',
                        address: product.tokos?.wilayah?.kelurahan_desa || product.tokos?.nama_toko || '',
                        slug: product.slug_produk
                      }}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{showingFrom}-{showingTo}</span> of <span className="font-semibold">{totalProducts}</span>
                    </p>

                    <div className="flex items-center gap-1">
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCategoryPage;