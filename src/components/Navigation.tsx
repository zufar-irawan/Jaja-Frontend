'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, Mail, Bell, ChevronDown, Menu, X, User, Package, LogOut } from 'lucide-react';

export default function JajaNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State untuk status login

  return (
    <nav className="bg-white shadow-lg relative z-50">
      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-[#55B4E5] transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center space-x-3 cursor-pointer group">
              <img 
                src="logo.webp" 
                alt="Jaja.id Logo" 
                className="h-17 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
              {/* Category Dropdown */}
              <div className="absolute left-0 top-0 bottom-0 flex items-center">
                <button className="flex items-center space-x-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors rounded-l-full group">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#55B4E5]">Kategori</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-[#55B4E5]" />
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Cari produk dan toko di jaja"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-36 pr-14 py-3 border-2 border-gray-200 rounded-full focus:border-[#55B4E5] focus:ring-4 focus:ring-[#55B4E5]/20 outline-none transition-all placeholder:text-gray-400"
              />
              
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white p-2.5 rounded-full transition-all hover:scale-110 shadow-md hover:shadow-lg">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search Icon - Mobile */}
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {isLoggedIn ? (
              // Menu untuk user yang sudah login
              <>
                {/* Cart */}
                <button className="relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group">
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                    0
                  </span>
                </button>

                {/* Messages */}
                <button className="hidden md:block relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group">
                  <Mail className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    0
                  </span>
                </button>

                {/* Notifications */}
                <button className="hidden md:block relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group">
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    0
                  </span>
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-full transition-all group border-2 border-transparent hover:border-[#55B4E5]/20"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#55B4E5] via-[#55B4E5] to-[#FBB338] rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                      G
                    </div>
                    <span className="hidden lg:block font-semibold text-gray-700 group-hover:text-[#55B4E5] transition-colors">
                      Ghea Ananda
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">Ghea Ananda</p>
                        <p className="text-sm text-gray-500">ghea@example.com</p>
                      </div>
                      
                      <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] transition-all group">
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Akun Saya</span>
                      </button>
                      
                      <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] transition-all group">
                        <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Pesanan Saya</span>
                      </button>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button 
                        onClick={() => {
                          setIsLoggedIn(false);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Tombol Login dan Daftar untuk user yang belum login
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="px-4 py-2 text-[#55B4E5] font-semibold hover:bg-[#55B4E5]/10 rounded-lg transition-all border border-[#55B4E5]/30 hover:border-[#55B4E5]/50"
                >
                  Masuk
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105">
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari produk dan toko di jaja"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-[#55B4E5] focus:ring-4 focus:ring-[#55B4E5]/20 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {isLoggedIn && (
              <>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] rounded-xl transition-all">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Pesan</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">0</span>
                </button>
                
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifikasi</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">0</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Background Overlay when dropdown is open */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
}