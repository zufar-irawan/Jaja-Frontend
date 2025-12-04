import { SearchProductsParams, SearchProductsResponse } from "./productService";
import api from "./api";
import { AxiosError } from "axios";

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
  MyTokoBrandResponse,
  Kategori,
  MyTokoBrand,
} from "./type/tokoInterface";

// Helper function to check if error is AxiosError
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

// Helper function to get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const responseData = isAxiosError(error) ? error.response?.data : undefined;
    const status = isAxiosError(error) ? error.response?.status : undefined;

    console.error("openStore error:", {
      message: errorMessage,
      status,
      data: responseData,
    });

    return {
      success: false,
      message:
        (responseData as { message?: string })?.message || "Gagal membuka toko",
      data: responseData ?? errorMessage,
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    console.error("Error creating seller toko:", {
      message: errorMessage,
      status,
    });

    return {
      success: false,
      message:
        (responseData as { message?: string })?.message || "Gagal membuat toko",
      data: responseData,
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
  } catch (error: unknown) {
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const errorMessage = getErrorMessage(error);
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    const logPayload = {
      message: errorMessage,
      status,
      data: responseData,
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    console.error("getMyTokoProducts error:", {
      message: errorMessage,
      status,
      data: responseData,
    });

    return null;
  }
}

/**
 * Flatten nested kategori structure to array
 */
function flattenKategori(categories: Kategori[]): Kategori[] {
  const result: Kategori[] = [];

  function flatten(cats: Kategori[]) {
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children);
      }
    }
  }

  flatten(categories);
  return result;
}

/**
 * Get my toko brand with kategori info joined
 */
export async function getMyTokoBrand() {
  try {
    // Fetch both brand and kategori data in parallel
    const [brandResponse, kategoriResponse] = await Promise.all([
      api.get<MyTokoBrandResponse>("/seller/v2/brand"),
      api.get<Kategori[]>("/main/kategories/mega-menu"),
    ]);

    console.log("Brand Response:", JSON.stringify(brandResponse.data, null, 2));
    console.log(
      "Kategori Response (first 2 items):",
      JSON.stringify(kategoriResponse.data.slice(0, 2), null, 2),
    );

    if (!brandResponse.data?.success) {
      console.warn(
        "getMyTokoBrand response not successful",
        brandResponse.data,
      );
      return null;
    }

    // Get brands array from response
    const brands = brandResponse.data.brands ?? [];
    console.log("Brands found:", brands.length);

    const kategoriData = kategoriResponse.data ?? [];
    console.log("Raw kategori data length:", kategoriData.length);

    // Flatten nested kategori structure
    const flatKategori = flattenKategori(kategoriData);
    console.log("Flattened kategori length:", flatKategori.length);

    // Create kategori map for quick lookup
    const kategoriMap = new Map<number, Kategori>();
    flatKategori.forEach((kat) => {
      kategoriMap.set(kat.id_kategori, kat);
    });
    console.log("Kategori map size:", kategoriMap.size);

    // Join kategori info to each brand
    const brandsWithKategori: MyTokoBrand[] = brands.map(
      (brand: MyTokoBrand) => {
        console.log(
          `Processing brand: ${brand.nama_brand}, id_kategori: ${brand.id_kategori}`,
        );
        const kategori = kategoriMap.get(brand.id_kategori);

        if (kategori) {
          console.log(
            `Found kategori for brand ${brand.nama_brand}:`,
            kategori.kategori,
          );

          // Find parent info if exists
          let parent_info = undefined;
          if (kategori.id_parent && kategori.id_parent !== 0) {
            const parentKat = kategoriMap.get(kategori.id_parent);
            if (parentKat) {
              console.log(`Found parent kategori:`, parentKat.kategori);
              parent_info = {
                id_kategori: parentKat.id_kategori,
                kategori: parentKat.kategori,
                slug_kategori: parentKat.slug_kategori,
              };
            }
          }

          return {
            ...brand,
            kategori_info: {
              id_kategori: kategori.id_kategori,
              kategori: kategori.kategori,
              slug_kategori: kategori.slug_kategori,
              icon: kategori.icon,
              parent_info,
            },
          };
        } else {
          console.warn(
            `No kategori found for brand ${brand.nama_brand} with id_kategori: ${brand.id_kategori}`,
          );
        }

        return brand;
      },
    );

    console.log("Brands with kategori:", brandsWithKategori.length);

    return {
      success: true,
      brands: brandsWithKategori,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    console.error("getMyTokoBrand error:", {
      message: errorMessage,
      status,
      data: responseData,
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    console.error("getTokoDashboard error:", {
      message: errorMessage,
      status,
      data: responseData,
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const url = isAxiosError(error) ? error.config?.url : undefined;

    console.error("Error fetching toko detail:", {
      slug,
      error: errorMessage,
      status,
      url,
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
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    const status = isAxiosError(error) ? error.response?.status : undefined;
    const responseData = isAxiosError(error) ? error.response?.data : undefined;

    console.error("Error fetching toko products:", {
      error: errorMessage,
      status,
    });

    return {
      success: false,
      code: status || 500,
      message:
        (responseData as { message?: string })?.message ||
        "Error fetching products",
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
