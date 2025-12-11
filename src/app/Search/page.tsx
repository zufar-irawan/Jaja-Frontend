"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  searchProducts,
  type Product,
  type SearchProductsParams,
  getAllCategories,
  type Category,
} from "@/utils/productService";
import ProductCard from "@/components/ProductCard";
import { Filter, X, Loader2, Package, AlertCircle } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    undefined,
  );
  const [selectedCondition, setSelectedCondition] = useState<
    "baru" | "bekas" | undefined
  >(undefined);
  const [selectedStock, setSelectedStock] = useState<
    "ready" | "preorder" | undefined
  >(undefined);
  const [sortBy, setSortBy] = useState<SearchProductsParams["sort"]>("newest");

  const query = searchParams.get("q") || "";
  const categorySlug = searchParams.get("category") || "";
  const limit = 20;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (query || categorySlug) {
      performSearch();
    }
  }, [
    query,
    categorySlug,
    currentPage,
    selectedCategory,
    selectedCondition,
    selectedStock,
    sortBy,
  ]);

  const fetchCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      setCategories(allCategories);

      // If category slug is provided, find and set the category ID
      if (categorySlug) {
        const category = findCategoryBySlug(allCategories, categorySlug);
        if (category) {
          setSelectedCategory(category.id_kategori);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const findCategoryBySlug = (
    categories: Category[],
    slug: string,
  ): Category | null => {
    for (const category of categories) {
      if (category.slug_kategori === slug) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryBySlug(category.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: SearchProductsParams = {
        nama_produk: query || undefined,
        id_kategori: selectedCategory,
        limit,
        page: currentPage,
        kondisi: selectedCondition,
        stok: selectedStock,
        sort: sortBy,
      };

      const response = await searchProducts(params);

      if (response.success) {
        setProducts(response.data);
        setTotalProducts(response.meta.total);
      } else {
        setError("Gagal memuat produk");
      }
    } catch (error) {
      console.error("Search error:", error);
      setError("Terjadi kesalahan saat mencari produk");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(
      categoryId === selectedCategory ? undefined : categoryId,
    );
    setCurrentPage(1);
  };

  const handleConditionChange = (condition: "baru" | "bekas") => {
    setSelectedCondition(
      condition === selectedCondition ? undefined : condition,
    );
    setCurrentPage(1);
  };

  const handleStockChange = (stock: "ready" | "preorder") => {
    setSelectedStock(stock === selectedStock ? undefined : stock);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SearchProductsParams["sort"]) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedCondition(undefined);
    setSelectedStock(undefined);
    setSortBy("newest");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / limit);
  const hasActiveFilters =
    selectedCategory ||
    selectedCondition ||
    selectedStock ||
    sortBy !== "newest";

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg border ${
              currentPage === page
                ? "bg-orange-500 text-white border-orange-500"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  const renderCategories = (categoryList: Category[], level: number = 0) => {
    return categoryList.map((category) => (
      <div key={category.id_kategori}>
        <label
          className={`flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded px-2 ${
            level > 0 ? "ml-4" : ""
          }`}
        >
          <input
            type="checkbox"
            checked={selectedCategory === category.id_kategori}
            onChange={() => handleCategoryChange(category.id_kategori)}
            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">{category.kategori}</span>
        </label>
        {category.children && category.children.length > 0 && (
          <div className="ml-4">
            {renderCategories(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Hasil Pencarian: "${query}"` : "Semua Produk"}
              </h1>
              {!loading && (
                <p className="text-sm text-gray-600 mt-1">
                  Ditemukan {totalProducts.toLocaleString("id-ID")} produk
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter size={20} />
              <span>Filter</span>
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filter</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">{renderFilterContent()}</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20">
              {renderFilterContent()}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      handleSortChange(
                        e.target.value as SearchProductsParams["sort"],
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                    <option value="name_asc">Nama A-Z</option>
                    <option value="name_desc">Nama Z-A</option>
                    <option value="rating_desc">Rating Tertinggi</option>
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-orange-500" size={40} />
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Terjadi Kesalahan
                </h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={performSearch}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Coba Lagi
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Produk Tidak Ditemukan
                </h3>
                <p className="text-gray-600">
                  {query
                    ? `Tidak ada hasil untuk "${query}". Coba kata kunci lain atau ubah filter pencarian.`
                    : "Tidak ada produk yang sesuai dengan filter yang dipilih."}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id_produk}
                      item={{
                        id: product.id_produk,
                        name: product.nama_produk,
                        price: product.harga,
                        image:
                          product.covers?.[0]?.thumbnail ||
                          product.covers?.[0]?.foto ||
                          "",
                        address:
                          product.tokos?.wilayah?.kelurahan_desa ||
                          product.tokos?.alamat_toko ||
                          "",
                        slug: product.slug_produk,
                        free_ongkir: product.free_ongkir,
                        avg_rating: product.avg_rating,
                      }}
                    />
                  ))}
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  function renderFilterContent() {
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Filter</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-orange-500 hover:text-orange-600"
            >
              Reset
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Kategori</h4>
          <div className="max-h-64 overflow-y-auto">
            {categories.length > 0 ? (
              renderCategories(categories)
            ) : (
              <p className="text-sm text-gray-500">Memuat kategori...</p>
            )}
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Condition Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Kondisi</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-2">
              <input
                type="checkbox"
                checked={selectedCondition === "baru"}
                onChange={() => handleConditionChange("baru")}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Baru</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-2">
              <input
                type="checkbox"
                checked={selectedCondition === "bekas"}
                onChange={() => handleConditionChange("bekas")}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Bekas</span>
            </label>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Stock Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Ketersediaan</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-2">
              <input
                type="checkbox"
                checked={selectedStock === "ready"}
                onChange={() => handleStockChange("ready")}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Ready Stock</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-2">
              <input
                type="checkbox"
                checked={selectedStock === "preorder"}
                onChange={() => handleStockChange("preorder")}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Pre-Order</span>
            </label>
          </div>
        </div>
      </>
    );
  }
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
