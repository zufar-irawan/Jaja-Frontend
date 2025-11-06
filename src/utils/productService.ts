// utils/services/productService.ts
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
        nama_toko: string
        slug_toko: string
        foto: string
        alamat_toko?: string
        wilayah?: {
            kelurahan_desa: string
        }
    }
    kategori?: {
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
            limit,
            stok: 'ready'
        })
        return response.data
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