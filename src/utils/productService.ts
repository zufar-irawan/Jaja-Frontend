"use server"

import api from '@/utils/api'

// Types untuk Product
export interface Product {
    id_produk: number
    is_deleted?: boolean
    nama_produk: string
    harga: number
    diskon: number
    stok: number
    kondisi: string
    deskripsi: string
    merek?: number | string
    kode_sku?: string
    berat?: string
    ukuran_paket_panjang?: string
    ukuran_paket_lebar?: string
    ukuran_paket_tinggi?: string
    slug_produk: string
    avg_rating?: number
    tokos: {
        id_toko: number
        nama_toko: string
        slug_toko: string
        foto: string
        alamat_toko?: string
        toko_pilihan?: 'Y' | 'T'
        kategori_seller?: string
        ranking?: string
        wilayah?: {
            kelurahan_desa: string
        }
    }
    kategori?: {
        id_kategori: number
        kategori: string
        slug_kategori: string
    }
    covers?: {
        id_foto: number
        foto: string
        thumbnail: string
    }[]
}

export interface SearchProductsParams {
    nama_produk?: string
    id_kategori?: number
    limit?: number
    page?: number
    kondisi?: 'baru' | 'bekas'
    stok?: 'ready' | 'preorder'
    sort?: 'newest' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'rating_desc'
}

export interface SearchProductsResponse {
    success: boolean
    code: number
    message: string
    meta: {
        total: number
        page: number
        limit: number
    }
    data: Product[]
}

export interface ProductDetailResponse {
    success: boolean
    code: number
    message: string
    data: {
        product: Product & {
            ratings: any[]
        }
        otherProduct: Product[]
    }
}

export interface Category {
    id_kategori: number
    kategori: string
    slug_kategori: string
    id_parent: number
    icon?: string
    icon_apps?: string
    children?: Category[]
}

export interface SearchResults {
    products: Product[]
    stores: Product['tokos'][]
    categories: Category[]
    totalProducts: number
}

// Service Functions
export async function searchProducts(params: SearchProductsParams): Promise<SearchProductsResponse> {
    try {
        const queryParams = new URLSearchParams()

        // Add params ke query string
        if (params.nama_produk) queryParams.append('nama_produk', params.nama_produk)
        if (params.id_kategori) queryParams.append('id_kategori', params.id_kategori.toString())
        if (params.limit) queryParams.append('limit', params.limit.toString())
        if (params.page) queryParams.append('page', params.page.toString())
        if (params.kondisi) queryParams.append('kondisi', params.kondisi)
        if (params.stok) queryParams.append('stok', params.stok)
        if (params.sort) queryParams.append('sort', params.sort)

        const response = await api.get(`/main/products/search?${queryParams.toString()}`)
        return response.data
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

export async function getProductBySlug(slug: string): Promise<ProductDetailResponse> {
    try {
        const response = await api.get(`/main/products/${slug}`)
        return response.data
    } catch (error) {
        console.error('Error fetching product detail:', error)
        throw error
    }
}

// NEW: Get all categories
export async function getAllCategories(): Promise<Category[]> {
    try {
        const response = await api.get('/main/kategories/mega-menu')
        return response.data || []
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

// NEW: Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const allCategories = await getAllCategories()

        // Recursive function to find category by slug
        const findCategory = (categories: Category[]): Category | null => {
            for (const category of categories) {
                if (category.slug_kategori === slug) {
                    return category
                }
                if (category.children && category.children.length > 0) {
                    const found = findCategory(category.children)
                    if (found) return found
                }
            }
            return null
        }

        return findCategory(allCategories)
    } catch (error) {
        console.error('Error fetching category by slug:', error)
        return null
    }
}

// NEW: Search in categories recursively
export async function searchInCategories(
    categories: Category[],
    query: string
): Promise<Category[]> {
    const results: Category[] = []
    const lowerQuery = query.toLowerCase()

    const searchRecursive = (categoryList: Category[]) => {
        categoryList.forEach(cat => {
            if (cat.kategori.toLowerCase().includes(lowerQuery)) {
                results.push(cat)
            }
            if (cat.children && cat.children.length > 0) {
                searchRecursive(cat.children)
            }
        })
    }

    searchRecursive(categories)
    return results
}

// NEW: Perform global search (products, stores, categories)
export async function performGlobalSearch(
    query: string,
    limit: number = 5
): Promise<SearchResults> {
    try {
        const productResponse = await searchProducts({
            nama_produk: query,
            limit,
            stok: 'ready'
        })

        const allCategories = await getAllCategories()

        const matchedCategories = await searchInCategories(allCategories, query)

        const uniqueStores: Product['tokos'][] = []
        const storeIds = new Set<number>()

        if (productResponse.success && productResponse.data) {
            productResponse.data.forEach(product => {
                if (product.tokos && !storeIds.has(product.tokos.id_toko)) {
                    storeIds.add(product.tokos.id_toko)
                    uniqueStores.push(product.tokos)
                }
            })
        }

        return {
            products: productResponse.data || [],
            stores: uniqueStores.slice(0, 3),
            categories: matchedCategories.slice(0, 5),
            totalProducts: productResponse.meta?.total || 0
        }
    } catch (error) {
        console.error('Error performing global search:', error)
        return {
            products: [],
            stores: [],
            categories: [],
            totalProducts: 0
        }
    }
}

// Helper functions untuk use case spesifik
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
        const response = await searchProducts({
            limit,
            stok: 'ready',
            sort: 'newest'
        })
        return response.data
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

export async function getTopProducts(limit: number = 6): Promise<Product[]> {
    try {
        const response = await searchProducts({
            limit,
            stok: 'ready',
            sort: 'rating_desc'
        })
        return response.data
    } catch (error) {
        console.error('Error fetching top products:', error)
        return []
    }
}

export async function getRecommendedProducts(limit: number = 12): Promise<Product[]> {
    try {
        const response = await searchProducts({
            limit: limit, // fetch extra to allow randomization
            stok: 'ready'
        })

        const products = response.data || []

        // Shuffle using Fisher-Yates algorithm
        for (let i = products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[products[i], products[j]] = [products[j], products[i]]
        }

        return products.slice(0, limit)
    } catch (error) {
        console.error('Error fetching recommended products:', error)
        return []
    }
}

export async function searchProductsByCategory(
    categoryId: number,
    limit: number = 100
): Promise<Product[]> {
    try {
        const response = await searchProducts({
            id_kategori: categoryId,
            limit,
            stok: 'ready'
        })
        return response.data
    } catch (error) {
        console.error('Error searching products by category:', error)
        return []
    }
}