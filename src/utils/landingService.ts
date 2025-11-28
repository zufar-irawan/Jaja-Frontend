import api from "./api"

export const LANDING_BANNER_BASE_URL = "https://nimda.jaja.id/asset/front/images/file/"

export interface LandingBanner {
    id_data: number
    nama_file: string
}

export interface LandingCategory {
    id_kategori: number
    kategori: string
    slug_kategori: string
    icon: string | null
}

export interface LandingPromo {
    id_promo: number
    kode_promo: string
    judul_promo: string
    nominal_diskon: string
}

export interface LandingMostViewedProduct {
    id_produk: number
    nama_produk: string
    slug_produk: string
    jumlah_view: number
}

export interface LandingData {
    banners: LandingBanner[]
    categories: LandingCategory[]
    promos: LandingPromo[]
    most_viewed_products: LandingMostViewedProduct[]
}

export interface LandingResponse {
    message: string
    status: number
    totalData: {
        banners: number
        categories: number
        promos: number
        most_viewed_products: number
    }
    data: LandingData
}

export async function getLanding(): Promise<LandingResponse | null> {
    try {
        const response = await api.get("/main/landing/home")
        return response.data
    } catch (error) {
        console.error("Failed to fetch landing data", error)
        return null
    }
}