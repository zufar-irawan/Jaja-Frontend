
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getUserProfile, type UserProfile } from "@/utils/userService";
import { logout } from "@/utils/authService";
import { useCartStore } from "@/store/cartStore";
import { performGlobalSearch, type SearchResults, type Product, type Category as SearchCategory, } from "@/utils/productService";
import { ShoppingCart, Mail, Bell, ChevronDown, Menu, X, User, Package, LogOut, ChevronRight, Search, Store, Grid, TrendingUp, Loader2 } from "lucide-react";

interface Category {
  id_kategori: number;
  kategori: string;
  slug_kategori: string;
  children?: Category[];
}

const cleanCategoryData = (categoriesToClean: any[]): Category[] => {
  if (!Array.isArray(categoriesToClean)) {
    return [];
  }
  return categoriesToClean.map((category: any) => {
    const newCategory: Partial<Category> = {
      id_kategori: category.id_kategori,
      kategori: category.kategori,
      slug_kategori: category.slug_kategori,
    };
    if (category.children) {
      newCategory.children = cleanCategoryData(category.children);
    }
    return newCategory as Category;
  });
};

export default function JajaNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<
    number[]
  >([]);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResults>({
    products: [],
    stores: [],
    categories: [],
    totalProducts: 0,
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCartCount = useCartStore((state) => state.fetchCartCount);
  const router = useRouter();

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults({
        products: [],
        stores: [],
        categories: [],
        totalProducts: 0,
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async () => {
    setIsSearchLoading(true);
    try {
      const results = await performGlobalSearch(searchQuery, 5);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setIsLoadingUser(true);
        const result = await getUserProfile();
        if (result.success && result.data) {
          setUserProfile(result.data);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setIsLoggedIn(false);
        setUserProfile(null);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const res = await axios.get(
          "https://kb8334ks-3000.asse.devtunnels.ms/main/kategories/mega-menu"
        );
        const cleanedData = cleanCategoryData(res.data);
        setCategories(cleanedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (category: Category) => {
    setShowCategoryMenu(false);
    setIsMenuOpen(false);
    setHoveredCategory(null);
    router.push(`/category/${category.slug_kategori}`);
  };

  const toggleMobileCategory = (categoryId: number) => {
    setExpandedMobileCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUserProfile(null);
      setShowUserMenu(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleCartClick = () => {
    router.push("/Cart");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults({
      products: [],
      stores: [],
      categories: [],
      totalProducts: 0,
    });
  };

  const handleViewAllSearch = () => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getUserInitials = () => {
    if (!userProfile) return "?";
    if (userProfile.first_name)
      return userProfile.first_name.charAt(0).toUpperCase();
    if (userProfile.nama_lengkap)
      return userProfile.nama_lengkap.charAt(0).toUpperCase();
    if (userProfile.email) return userProfile.email.charAt(0).toUpperCase();
    return "?";
  };

  const getUserDisplayName = () => {
    if (!userProfile) return "User";
    if (userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (userProfile.nama_lengkap) return userProfile.nama_lengkap;
    if (userProfile.username) return userProfile.username;
    if (userProfile.first_name) return userProfile.first_name;
    return "User";
  };

  const renderSubcategories = (children: Category[], level = 0) => {
    if (!children || children.length === 0) return null;
    return (
      <div className={`space-y-0.5 ${level > 0 ? "ml-4" : ""}`}>
        {children.map((child) => (
          <div key={child.id_kategori}>
            <button
              onClick={() => handleCategoryClick(child)}
              className={`w-full text-left px-4 py-2.5 transition-all flex items-center justify-between group ${level === 0
                  ? "text-sm font-medium text-gray-700 hover:text-[#55B4E5] hover:bg-[#55B4E5]/5"
                  : "text-xs text-gray-600 hover:text-[#55B4E5] hover:bg-[#55B4E5]/5"
                } rounded-lg`}
            >
              <span className="flex items-center">
                {level > 0 && <span className="mr-2 text-gray-400">•</span>}
                {child.kategori}
              </span>
            </button>
            {child.children &&
              child.children.length > 0 &&
              renderSubcategories(child.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  const hasSearchResults =
    searchResults.stores.length > 0 ||
    searchResults.categories.length > 0;

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-[#55B4E5] transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => router.push("/")}
            >
              <img
                src="/images/logo.webp"
                alt="Jaja.id Logo"
                className="h-17 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </div>

          {/* DESKTOP SEARCH - WITH CATEGORY DROPDOWN */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8" ref={searchRef}>
            <div className="relative w-full">
              {/* Category Dropdown Button */}
              <div className="absolute left-0 top-0 bottom-0 flex items-center z-20">
                <button
                  onClick={() => {
                    setShowCategoryMenu(!showCategoryMenu);
                    setIsSearchOpen(false);
                  }}
                  onMouseEnter={() => setShowCategoryMenu(true)}
                  className="flex items-center space-x-2 px-4 py-3 border-r border-gray-200 hover:bg-gray-50 transition-colors rounded-l-full group"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#55B4E5]">
                    Kategori
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 group-hover:text-[#55B4E5] transition-transform ${showCategoryMenu ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {/* Category Menu Dropdown */}
                {showCategoryMenu && (
                  <div
                    onMouseLeave={() => {
                      setShowCategoryMenu(false);
                      setHoveredCategory(null);
                    }}
                    className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-9999"
                  >
                    {isLoadingCategories ? (
                      <div className="px-8 py-8 text-center w-64">
                        <div className="inline-block w-8 h-8 border-4 border-[#55B4E5] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 text-sm mt-2">
                          Memuat kategori...
                        </p>
                      </div>
                    ) : categories.length > 0 ? (
                      <div className="flex">
                        <div className="w-72 py-2 bg-gray-50/50">
                          {categories.map((category) => (
                            <button
                              key={category.id_kategori}
                              onClick={() => handleCategoryClick(category)}
                              onMouseEnter={() =>
                                setHoveredCategory(category.id_kategori)
                              }
                              className={`w-full text-left px-5 py-3.5 transition-all flex items-center justify-between group border-l-4 ${hoveredCategory === category.id_kategori
                                  ? "bg-white border-[#55B4E5] text-[#55B4E5] shadow-sm"
                                  : "border-transparent text-gray-700 hover:bg-white/80"
                                }`}
                            >
                              <span className="font-medium text-sm">
                                {category.kategori}
                              </span>
                              {category.children &&
                                category.children.length > 0 && (
                                  <ChevronRight
                                    className={`w-4 h-4 transition-all ${hoveredCategory === category.id_kategori
                                        ? "text-[#55B4E5] translate-x-0.5"
                                        : "text-gray-400"
                                      }`}
                                  />
                                )}
                            </button>
                          ))}
                        </div>

                        <div className="w-80 bg-white">
                          {hoveredCategory ? (
                            (() => {
                              const activeCategory = categories.find(
                                (cat) => cat.id_kategori === hoveredCategory
                              );
                              if (
                                !activeCategory ||
                                !activeCategory.children ||
                                activeCategory.children.length === 0
                              ) {
                                return (
                                  <div className="flex items-center justify-center h-full text-center py-12 px-6">
                                    <div>
                                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Package className="w-8 h-8 text-gray-400" />
                                      </div>
                                      <p className="text-gray-400 text-sm">
                                        Tidak ada subkategori
                                      </p>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <div className="py-4 px-3 max-h-[480px] overflow-y-auto">
                                  <div className="mb-4 px-2">
                                    <h3 className="font-bold text-gray-900 text-base">
                                      {activeCategory.kategori}
                                    </h3>
                                    <div className="h-0.5 w-12 bg-[#55B4E5] rounded-full mt-2"></div>
                                  </div>
                                  {renderSubcategories(activeCategory.children)}
                                </div>
                              );
                            })()
                          ) : (
                            <div className="flex items-center justify-center h-full text-center py-12 px-6">
                              <div>
                                <div className="w-16 h-16 bg-linear-to-br from-[#55B4E5]/20 to-[#FBB338]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <Menu className="w-8 h-8 text-[#55B4E5]" />
                                </div>
                                <p className="text-gray-500 text-sm font-medium">
                                  Pilih kategori
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                  Arahkan mouse ke kategori di kiri
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="px-8 py-8 text-center w-64">
                        <p className="text-gray-500 text-sm">
                          Tidak ada kategori tersedia
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setIsSearchOpen(true);
                  setShowCategoryMenu(false);
                }}
                placeholder="Cari produk dan toko di jaja"
                className="w-full pl-36 pr-14 py-3 border-2 border-gray-200 rounded-full focus:border-[#55B4E5] focus:ring-4 focus:ring-[#55B4E5]/20 outline-none transition-all placeholder:text-gray-400"
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Search Button */}
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white p-2.5 rounded-full transition-all hover:scale-110 shadow-md hover:shadow-lg">
                <Search className="w-5 h-5" />
              </button>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[600px] overflow-y-auto z-60 animate-in fade-in slide-in-from-top-2 duration-200">
                  {isSearchLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[#55B4E5] animate-spin" />
                    </div>
                  ) : !hasSearchResults ? (
                    <div className="py-12 text-center">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">
                        Tidak ada hasil ditemukan
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Coba kata kunci lain atau periksa ejaan
                      </p>
                    </div>
                  ) : (
                    <div className="py-3">
                      {/* Products Section */}
                      {searchResults.products.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 px-5 py-2 bg-gray-50">
                            <Package className="w-4 h-4 text-[#55B4E5]" />
                            <h3 className="font-bold text-gray-700 text-sm">
                              Produk
                            </h3>
                            <span className="text-xs text-gray-500">
                              ({searchResults.products.length})
                            </span>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {searchResults.products.map((product: Product) => (
                              <a
                                key={product.id_produk}
                                href={`/Product/${product.slug_produk}`}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-[#55B4E5]/5 transition-colors group cursor-pointer"
                                onClick={() => setIsSearchOpen(false)}
                              >
                                <img
                                  src={
                                    product.covers?.[0]?.foto ||
                                    "/api/placeholder/60/60"
                                  }
                                  alt={product.nama_produk}
                                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 text-sm line-clamp-1 group-hover:text-[#55B4E5] transition-colors">
                                    {highlightText(
                                      product.nama_produk,
                                      searchQuery
                                    )}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-[#55B4E5] text-sm">
                                      {formatPrice(product.harga)}
                                    </span>
                                    {product.diskon > 0 && (
                                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                                        -{product.diskon}%
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {product.tokos?.nama_toko}
                                  </p>
                                </div>
                                {product.avg_rating != null && (
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-semibold text-gray-700">
                                      {Number(product.avg_rating).toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stores Section */}
                      {searchResults.stores.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 px-5 py-2 bg-gray-50">
                            <Store className="w-4 h-4 text-[#FBB338]" />
                            <h3 className="font-bold text-gray-700 text-sm">
                              Toko
                            </h3>
                            <span className="text-xs text-gray-500">
                              ({searchResults.stores.length})
                            </span>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {searchResults.stores.map(
                              (store: Product["tokos"]) => (
                                <a
                                  key={store.id_toko}
                                  href={`/Toko/${store.slug_toko}`}
                                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#FBB338]/5 transition-colors group cursor-pointer"
                                  onClick={() => setIsSearchOpen(false)}
                                >
                                  <img
                                    src={store.foto || "/api/placeholder/50/50"}
                                    alt={store.nama_toko}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-800 text-sm group-hover:text-[#FBB338] transition-colors">
                                      {highlightText(
                                        store.nama_toko,
                                        searchQuery
                                      )}
                                    </p>
                                    {store.wilayah && (
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {store.wilayah.kelurahan_desa}
                                      </p>
                                    )}
                                    {store.toko_pilihan === "Y" && (
                                      <span className="inline-flex items-center gap-1 text-xs bg-linear-to-r from-[#55B4E5] to-[#FBB338] text-white px-2 py-0.5 rounded-full mt-1">
                                        <TrendingUp className="w-3 h-3" />
                                        Toko Pilihan
                                      </span>
                                    )}
                                  </div>
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Categories Section */}
                      {searchResults.categories.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 px-5 py-2 bg-gray-50">
                            <Grid className="w-4 h-4 text-purple-500" />
                            <h3 className="font-bold text-gray-700 text-sm">
                              Kategori
                            </h3>
                            <span className="text-xs text-gray-500">
                              ({searchResults.categories.length})
                            </span>
                          </div>
                          <div className="divide-y divide-gray-100">
                            {searchResults.categories.map(
                              (category: SearchCategory) => (
                                <a
                                  key={category.id_kategori}
                                  href={`/category/${category.slug_kategori}`}
                                  className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-colors group cursor-pointer"
                                  onClick={() => setIsSearchOpen(false)}
                                >
                                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                                    <Grid className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <p className="font-medium text-gray-800 text-sm group-hover:text-purple-600 transition-colors">
                                    {highlightText(
                                      category.kategori,
                                      searchQuery
                                    )}
                                  </p>
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* View All Button */}
                      {hasSearchResults && (
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                          <button
                            onClick={handleViewAllSearch}
                            className="w-full py-2.5 bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
                          >
                            Lihat Semua Hasil untuk "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            {isLoadingUser ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isLoggedIn && userProfile ? (
              <>
                <button
                  onClick={handleCartClick}
                  className="relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  {cartCount >= 0 && (
                    <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button className="hidden md:block relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group">
                  <Mail className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    0
                  </span>
                </button>

                <button className="hidden md:block relative p-2 hover:bg-[#55B4E5]/10 rounded-full transition-all group">
                  <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#55B4E5] transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                    0
                  </span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-full transition-all group border-2 border-transparent hover:border-[#55B4E5]/20"
                  >
                    {userProfile.foto_profil ? (
                      <img
                        src={userProfile.foto_profil}
                        alt={getUserDisplayName()}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-linear-to-br from-[#55B4E5] via-[#55B4E5] to-[#FBB338] rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                        {getUserInitials()}
                      </div>
                    )}
                    <span className="hidden lg:block font-semibold text-gray-700 group-hover:text-[#55B4E5] transition-colors">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-60">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-800">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userProfile.email}
                        </p>
                      </div>

                      <button
                        onClick={() => router.push(`/clientArea/profile`)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] transition-all group"
                      >
                        <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Akun Saya</span>
                      </button>

                      <button
                        onClick={() => router.push(`/clientArea/orders`)}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] transition-all group"
                      >
                        <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Pesanan Saya</span>
                      </button>

                      <div className="border-t border-gray-100 my-2"></div>

                      <button
                        onClick={handleLogout}
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
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push("/auth/login")}
                  className="px-4 py-2 text-[#55B4E5] font-semibold hover:bg-[#55B4E5]/10 rounded-lg transition-all border border-[#55B4E5]/30 hover:border-[#55B4E5]/50"
                >
                  Masuk
                </button>
                <button
                  onClick={() => router.push("/auth/register")}
                  className="px-4 py-2 bg-linear-to-r from-[#55B4E5] to-[#55B4E5]/90 hover:from-[#55B4E5]/90 hover:to-[#55B4E5] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchOpen(true);
                setShowCategoryMenu(false);
              }}
              placeholder="Cari produk dan toko di jaja"
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-full focus:border-[#55B4E5] focus:ring-4 focus:ring-[#55B4E5]/20 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Categories */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
            {isLoadingCategories ? (
              <div className="px-4 py-6 text-center">
                <div className="inline-block w-6 h-6 border-3 border-[#55B4E5] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-sm mt-2">Memuat kategori...</p>
              </div>
            ) : (
              categories.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2">
                    Semua Kategori
                  </p>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.id_kategori}
                        className="bg-white rounded-xl overflow-hidden border border-gray-200"
                      >
                        <div className="flex items-center">
                          <button
                            onClick={() => handleCategoryClick(category)}
                            className="flex-1 text-left px-4 py-3.5 hover:bg-gray-50 transition-all"
                          >
                            <span className="font-semibold text-gray-800 text-sm">
                              {category.kategori}
                            </span>
                          </button>

                          {category.children &&
                            category.children.length > 0 && (
                              <button
                                onClick={() =>
                                  toggleMobileCategory(category.id_kategori)
                                }
                                className="px-4 py-3.5 text-gray-500 hover:text-[#55B4E5] hover:bg-gray-50 transition-all"
                              >
                                <ChevronDown
                                  className={`w-5 h-5 transition-transform duration-200 ${expandedMobileCategories.includes(
                                    category.id_kategori
                                  )
                                      ? "rotate-180"
                                      : ""
                                    }`}
                                />
                              </button>
                            )}
                        </div>

                        {category.children &&
                          category.children.length > 0 &&
                          expandedMobileCategories.includes(
                            category.id_kategori
                          ) && (
                            <div className="bg-gray-50 px-3 py-3 border-t border-gray-200">
                              {renderSubcategories(category.children)}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {isLoggedIn && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] rounded-xl transition-all">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Pesan</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    0
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#55B4E5]/10 hover:text-[#55B4E5] rounded-xl transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifikasi</span>
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                    0
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {(showUserMenu || showCategoryMenu || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-transparent"
          onClick={() => {
            setShowUserMenu(false);
            setShowCategoryMenu(false);
            setIsSearchOpen(false);
          }}
        ></div>
      )}
    </nav>
  );
}
