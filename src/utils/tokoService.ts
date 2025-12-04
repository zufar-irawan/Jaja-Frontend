import { SearchProductsParams, SearchProductsResponse } from "./productService";
import api from "./api";

import {
  OpenStorePayload,
  BasicStoreResponse,
  BasicApiResponse,
  TokoDetail,
  TokoDetailResponse,
  BukaTokoData,
  CreateTokoPayload,
  MyTokoDetail,
  MyTokoResponse,
  MyTokoProductsResponse,
  MyTokoProductParams,
  PesananResponse,
  DashboardData,
} from "./type/tokoInterface";

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
    const response = await api.get<MyTokoResponse>("/seller/v2/toko/detail");

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

export async function getTokoDashboard(): Promise<DashboardData | null> {
  try {
    // Get all pesanan data
    const response = await api.get<PesananResponse>("/seller/v2/pesanan");

    if (!response.data?.success || !response.data?.data) {
      console.warn("getTokoDashboard response not successful", response.data);
      return null;
    }

    const allPesanan = response.data.data;

    // 1. PesananPerbulan - array of 12 months
    const PesananPerbulan = new Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    allPesanan.forEach((pesanan) => {
      const pesananDate = new Date(pesanan.created_date);
      if (pesananDate.getFullYear() === currentYear) {
        const month = pesananDate.getMonth();
        PesananPerbulan[month]++;
      }
    });

    // 2. PesananBaru - orders with status "Menunggu Pembayaran" or "belum dibayar"
    const PesananBaru = allPesanan.filter(
      (pesanan) =>
        pesanan.status_transaksi === "Menunggu Pembayaran" ||
        pesanan.status_transaksi === "belum dibayar",
    ).length;

    // 3. PesananBerlangsung - orders with status "Paid"
    const PesananBerlangsung = allPesanan.filter(
      (pesanan) => pesanan.status_transaksi === "Paid",
    );
    const JumlahBerlangsung = PesananBerlangsung.length;

    // 4. Dikirim - orders with details status_pesanan "dikirim"
    const Dikirim = allPesanan.filter((pesanan) =>
      pesanan.details?.some((detail) => detail.status_pesanan === "dikirim"),
    );
    const JumlahDikirim = Dikirim.length;

    // 5. PesananSelesai - orders with status "Selesai" or details status_pesanan "selesai"
    const PesananSelesai = allPesanan.filter(
      (pesanan) =>
        pesanan.status_transaksi === "Selesai" ||
        pesanan.details?.some((detail) => detail.status_pesanan === "selesai"),
    ).length;

    return {
      PesananPerbulan,
      PesananBaru,
      PesananBerlangsung,
      JumlahBerlangsung,
      Dikirim,
      JumlahDikirim,
      PesananSelesai,
    };
  } catch (error: any) {
    console.error("getTokoDashboard error:", {
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

export function parseBukaTokoData(dataString: string): BukaTokoData | null {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error("Error parsing buka toko data:", error);
    return null;
  }
}

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
  if (
    !bukaTokoData ||
    !bukaTokoData.days ||
    !bukaTokoData.time_open ||
    !bukaTokoData.time_close
  )
    return false;

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
