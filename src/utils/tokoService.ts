import api, { sellerApi } from "./api";
import {
  Product,
  SearchProductsParams,
  SearchProductsResponse,
} from "./productService";

export interface ProvinceOption {
  province_id: number;
  province: string;
  province_kd: string;
}

export interface CityOption {
  city_id: number;
  province_id: number;
  province: string;
  city_name: string;
  city_kd: string;
  postal_code: number;
  type: string;
}

export interface DistrictOption {
  kecamatan_id: number;
  province_id: number;
  province: string;
  city_id: number;
  city: string;
  kecamatan: string;
  kecamatan_kd: string;
}

export interface VillageOption {
  kelurahan_id: number;
  kd_prop: string;
  propinsi: string;
  kd_kab_kota: string;
  kabupaten_kota: string;
  kd_kec: string;
  kecamatan: string;
  kd_kelurahan_desa: string;
  kelurahan_desa: string;
}

export interface OpenStorePayload {
  nama_toko: string;
  deskripsi_toko: string;
  alamat_toko: string;
  provinsi: number;
  kota_kabupaten: number;
  kecamatan: number;
  kelurahan: number;
  kode_pos: string;
  skor: number;
}

export interface BasicStoreResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

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

export interface CreateTokoPayload {
  nama_toko: string;
  greating_message: string;
  deskripsi_toko: string;
  alamat_toko: string;
  provinsi: string;
  kota_kabupaten: string;
  kecamatan: string;
  kelurahan: string;
  kode_pos: string;
}

export interface BasicApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface CourierServiceMap {
  [courier: string]: string[];
}

export interface MyTokoDetail {
  id_toko: number;
  nama_toko: string;
  slug_toko: string;
  foto?: string | null;
  foto_ktp: string | null;
  foto_npwp: string | null;
  deskripsi_toko: string;
  alamat_toko: string;
  provinsi: number;
  kota_kabupaten: number;
  kecamatan: number;
  kelurahan: number;
  kode_pos: string;
  pilihan_kurir: string[] | string;
  kurir_service: CourierServiceMap | null;
  free_ongkir: "Y" | "T";
  min_free_ongkir: number;
  status_legalitas: string | null;
  skor: number;
  data_buka_toko: string | BukaTokoData;
  data_libur_toko: string | null;
  kategori_seller?: string;
  greating_message?: string;
  toko_pilihan?: "Y" | "T";
}

export interface MyTokoResponse {
  success: boolean;
  message?: string;
  toko?: MyTokoDetail;
}

export interface MyTokoProduct {
  id_produk: number;
  nama_produk: string;
  slug_produk: string;
  harga: number;
  diskon: number;
  harga_setelah_diskon: number;
  stok: number;
  thumbnail: string | null;
  variasi_count: number;
  draft: "Y" | "T";
  status_produk: string;
  created_date: string;
}

export interface SellerPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface MyTokoProductsResponse {
  success: boolean;
  message?: string;
  pagination: SellerPagination;
  produk: MyTokoProduct[];
}

export interface MyTokoProductParams {
  page?: number;
  limit?: number;
  search?: string;
  status_produk?: string;
  draft?: "Y" | "T";
}

// Open store helpers
export async function getStoreProvinces(
  page: number = 1,
  limit: number = 40,
): Promise<BasicStoreResponse<ProvinceOption[]>> {
  try {
    const response = await api.get(
      `/main/location/provinces?page=${page}&limit=${limit}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengambil provinsi",
    };
  }
}

export async function getStoreCities(
  provinceId: number,
  page: number = 1,
  limit: number = 200,
): Promise<BasicStoreResponse<CityOption[]>> {
  try {
    const response = await api.get(
      `/main/location/cities?province_id=${provinceId}&page=${page}&limit=${limit}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengambil kota",
    };
  }
}

export async function getStoreDistricts(
  cityId: number,
  page: number = 1,
  limit: number = 200,
): Promise<BasicStoreResponse<DistrictOption[]>> {
  try {
    const response = await api.get(
      `/main/location/districts?city_id=${cityId}&page=${page}&limit=${limit}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengambil kecamatan",
    };
  }
}

export async function getStoreVillages(
  kecamatanKd: string,
  page: number = 1,
  limit: number = 200,
): Promise<BasicStoreResponse<VillageOption[]>> {
  try {
    const response = await api.get(
      `/main/location/villages?kecamatan_kd=${kecamatanKd}&page=${page}&limit=${limit}`,
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Gagal mengambil kelurahan",
    };
  }
}

export async function openStore(
  payload: OpenStorePayload,
): Promise<BasicStoreResponse> {
  try {
    const response = await api.post("/seller/v2/toko/open-store", payload);

    return {
      success: true,
      message: response.data?.message || "Berhasil membuka toko",
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    console.error("openStore error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return {
      success: false,
      message: error.response?.data?.message || "Gagal membuka toko",
      data: error.response?.data ?? error.message,
    };
  }
}

export async function createSellerToko(
  payload: CreateTokoPayload,
): Promise<BasicApiResponse> {
  try {
    const response = await api.post("/v1/seller/create-toko", payload);

    return {
      success: true,
      message: response.data?.message || "Toko berhasil dibuat",
      data: response.data?.data ?? response.data,
    };
  } catch (error: any) {
    console.error("Error creating seller toko:", {
      message: error.message,
      status: error.response?.status,
    });

    return {
      success: false,
      message: error.response?.data?.message || "Gagal membuat toko",
      data: error.response?.data,
    };
  }
}

export async function getMyToko(): Promise<MyTokoDetail | null> {
  try {
    const response = await api.get<MyTokoResponse>(
      "/seller/v2/toko/detail",
    );

    if (!response.data?.success) {
      console.warn("getMyToko response not successful", response.data);
      return null;
    }

    return response.data.toko ?? null;
  } catch (error: any) {
    const status = error?.response?.status;
    const logPayload = {
      message: error?.message,
      status,
      data: error?.response?.data,
    };

    if (status === 401) {
      console.warn("getMyToko unauthorized", logPayload);
      return null;
    }

    console.error("getMyToko error:", logPayload);
    return null;
  }
}

export async function getMyTokoProducts(
  params?: MyTokoProductParams,
): Promise<MyTokoProductsResponse | null> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status_produk)
      queryParams.append("status_produk", params.status_produk);
    if (params?.draft) queryParams.append("draft", params.draft);

    const suffix = queryParams.toString() ? `?${queryParams}` : "";

    const response = await api.get<MyTokoProductsResponse>(
      `/seller/v2/produk${suffix}`,
    );

    if (!response.data?.success) {
      console.warn("getMyTokoProducts response not successful", response.data);
      return null;
    }

    return response.data;
  } catch (error: any) {
    console.error("getMyTokoProducts error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return null;
  }
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
