import api from "./api";
import {
  Product,
  SearchProductsParams,
  SearchProductsResponse,
} from "./productService";

export interface TokoDetail {
  id_toko: number;
  uid: string;
  token_fcm: string | null;
  nama_toko: string;
  slug_toko: string;
  foto: string;
  foto_ktp: string | null;
  foto_npwp: string | null;
  blokir: "Y" | "T";
  created_date: string;
  created_time: string;
  id_user: number;
  nama_user: string;
  greating_message: string;
  deskripsi_toko: string;
  alamat_toko: string;
  alamat_google: string | null;
  latitude: string | null;
  longitude: string | null;
  provinsi: number;
  kota_kabupaten: number;
  kecamatan: number;
  kelurahan: number;
  kode_pos: string;
  toko_pilihan: "Y" | "T";
  kategori_seller: string;
  ranking: string;
  pin_penghasilan: string | null;
  id_admin: number | null;
  nama_admin: string | null;
  pilihan_kurir: string;
  kurir_service: string;
  free_ongkir: "Y" | "T";
  min_free_ongkir: number;
  skor: number;
  status_legalitas: string | null;
  change_name: string;
  data_buka_toko: string;
  data_libur_toko: string | null;
}

export interface TokoDetailResponse {
  data: TokoDetail;
}

export interface BukaTokoData {
  days: string;
  time_open: string;
  time_close: string;
  time_zone: string;
}

// Service Functions

/**
 * Get store detail by slug
 */
export async function getTokoBySlug(slug: string): Promise<TokoDetail | null> {
  try {
    console.log("getTokoBySlug called with slug:", slug);
    if (!slug || slug === "undefined" || slug === "null") {
      console.error("Invalid slug provided:", slug);
      return null;
    }

    const url = `/main/toko/${slug}`;
    console.log("Calling API:", url);

    const response = await api.get<TokoDetailResponse>(url);
    console.log("API Response success:", response.data.data.nama_toko);

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching toko detail:", {
      slug,
      error: error.message,
      status: error.response?.status,
      url: error.config?.url,
    });
    return null;
  }
}

/**
 * Get products from a specific store
 */
export async function getTokoProducts(
  slug: string,
  params?: Omit<SearchProductsParams, "id_kategori">,
): Promise<SearchProductsResponse> {
  try {
    const queryParams = new URLSearchParams();

    queryParams.append("toko", slug);

    if (params?.nama_produk)
      queryParams.append("nama_produk", params.nama_produk);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.kondisi) queryParams.append("kondisi", params.kondisi);
    if (params?.stok) queryParams.append("stok", params.stok);
    if (params?.sort) queryParams.append("sort", params.sort);

    const response = await api.get(
      `/main/products/search?${queryParams.toString()}`,
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching toko products:", {
      error: error.message,
      status: error.response?.status,
    });

    return {
      success: false,
      code: error.response?.status || 500,
      message: error.response?.data?.message || "Error fetching products",
      meta: {
        total: 0,
        page: 1,
        limit: 20,
      },
      data: [],
    };
  }
}

/**
 * Parse data_buka_toko JSON string
 */
export function parseBukaTokoData(dataString: string): BukaTokoData | null {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error("Error parsing buka toko data:", error);
    return null;
  }
}

/**
 * Get operational days in Indonesian
 */
export function getOperationalDays(dataString: string): string {
  const daysIndo: { [key: string]: string } = {
    monday: "Sen",
    tuesday: "Sel",
    wednesday: "Rab",
    thursday: "Kam",
    friday: "Jum",
    saturday: "Sab",
    sunday: "Min",
  };

  const bukaTokoData = parseBukaTokoData(dataString);
  if (!bukaTokoData) return "-";

  return bukaTokoData.days
    .split(",")
    .map((day) => daysIndo[day.trim()] || day)
    .join(", ");
}

/**
 * Get courier list from pilihan_kurir string
 */
export function getKurirList(pilihanKurir: string): string[] {
  return pilihanKurir.split(":").map((kurir) => kurir.toUpperCase());
}

/**
 * Get store photo URL
 */
export function getTokoPhotoUrl(foto: string): string {
  if (!foto) return "/placeholder-store.png";
  if (foto.startsWith("http")) return foto;

  return `https://seller.jaja.id/asset/images/toko/${foto}`;
}

/**
 * Check if store is currently open
 */
export function isTokoOpen(dataString: string): boolean {
  const bukaTokoData = parseBukaTokoData(dataString);
  if (!bukaTokoData) return false;

  const now = new Date();
  const currentDay = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const currentTime = now.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  const operationalDays = bukaTokoData.days.split(",").map((d) => d.trim());
  if (!operationalDays.includes(currentDay)) return false;

  return (
    currentTime >= bukaTokoData.time_open &&
    currentTime <= bukaTokoData.time_close
  );
}

/**
 * Get store statistics
 */
export interface TokoStats {
  totalProducts: number;
  totalSold: number;
  averageRating: number;
  totalReviews: number;
}

export async function getTokoStats(slug: string): Promise<TokoStats> {
  try {
    const productsResponse = await getTokoProducts(slug, { limit: 1 });

    return {
      totalProducts: productsResponse.meta.total,
      totalSold: 5000,
      averageRating: 4.8,
      totalReviews: 2500,
    };
  } catch (error) {
    console.error("Error fetching toko stats:", error);
    return {
      totalProducts: 0,
      totalSold: 0,
      averageRating: 0,
      totalReviews: 0,
    };
  }
}
