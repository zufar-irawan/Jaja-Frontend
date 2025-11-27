'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';

export default function ProductFilter() {
  const [selectedFilters, setSelectedFilters] = useState({
    kondisi: '',
    stock: '',
    sortBy: '',
    location: '',
    search: ''
  });

  // Mobile filter state
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev] === value ? '' : value
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      kondisi: '',
      stock: '',
      sortBy: '',
      location: '',
      search: ''
    });
  };

  const activeFilterCount = Object.values(selectedFilters).filter(v => v).length;

  const FilterSection = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Cari Produk
        </label>
        <div className="relative">
          <input
            type="text"
            value={selectedFilters.search}
            onChange={(e) => setSelectedFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari dalam toko ini..."
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#55B4E5] focus:border-transparent transition-all"
          />
          {selectedFilters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Lokasi
        </label>
        <div className="relative">
          <select
            value={selectedFilters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
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
        <label className="block text-sm font-semibold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent mb-3">
          Kondisi
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['baru', 'bekas'].map((condition) => (
            <label
              key={condition}
              className={`relative flex items-center justify-center cursor-pointer px-4 py-3 rounded-xl border-2 transition-all ${
                selectedFilters.kondisi === condition
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 border-gray-200 hover:border-[#55B4E5] text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'condition-mobile' : 'condition'}
                value={condition}
                checked={selectedFilters.kondisi === condition}
                onChange={(e) => handleFilterChange('kondisi', e.target.value)}
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
                selectedFilters.stock === stock.value
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] border-transparent text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 border-gray-200 hover:border-[#55B4E5] text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'stock-mobile' : 'stock'}
                value={stock.value}
                checked={selectedFilters.stock === stock.value}
                onChange={(e) => handleFilterChange('stock', e.target.value)}
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
                selectedFilters.sortBy === option
                  ? 'bg-gradient-to-r from-[#55B4E5] to-[#FBB338] text-white shadow-lg shadow-[#55B4E5]/50'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name={mobile ? 'sort-mobile' : 'sort'}
                value={option}
                checked={selectedFilters.sortBy === option}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="hidden"
              />
              <span className="font-medium">{option}</span>
              {selectedFilters.sortBy === option && <Sparkles className="ml-auto w-4 h-4" />}
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 shrink-0">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 p-6 sticky top-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#55B4E5] to-[#FBB338] bg-clip-text text-transparent">
              Filter
            </h2>
            {activeFilterCount > 0 && (
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

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilter(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#55B4E5] to-[#4DA8DC] text-white rounded-xl shadow-md hover:shadow-lg transition-all w-full justify-center relative"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="font-semibold">Filter & Urutkan</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Modal */}
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
    </>
  );
}