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
  alamat_google?: string | null;
  latitude?: string | null;
  longitude?: string | null;
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

export interface UpdateTokoPayload {
  nama_toko?: string;
  deskripsi_toko?: string;
  greating_message?: string;
  alamat_toko?: string;
  alamat_google?: string;
  latitude?: string;
  longitude?: string;
  provinsi?: number;
  kota_kabupaten?: number;
  kecamatan?: number;
  kelurahan?: number;
  kode_pos?: string;
  free_ongkir?: boolean | "Y" | "T";
  min_free_ongkir?: number;
  pilihan_kurir?: string[] | string;
  kurir_service?: CourierServiceMap | string | null;
  data_buka_toko?:
    | {
        days: string;
        time_open: string;
        time_close: string;
      }
    | string;
  data_libur_toko?: string | null;
}

export interface UpdateTokoResponse {
  success: boolean;
  message?: string;
  toko?: MyTokoDetail;
}

// Pesanan/Order Interfaces
export interface PesananDetail {
  id_detail_pesanan: number;
  id_pesanan: number;
  id_produk: number;
  nama_produk: string;
  harga: number;
  jumlah: number;
  subtotal: number;
  status_pesanan: string;
  created_date: string;
}

export interface Pesanan {
  id_pesanan: number;
  id_user: number;
  id_toko: number;
  total_harga: number;
  status_transaksi: string;
  created_date: string;
  created_time: string;
  details: PesananDetail[];
}

export interface PesananResponse {
  success: boolean;
  message?: string;
  data: Pesanan[];
  pagination?: SellerPagination;
}

export interface DashboardData {
  PesananPerbulan: number[];
  PesananBaru: number;
  PesananBerlangsung: Pesanan[];
  JumlahBerlangsung: number;
  Dikirim: Pesanan[];
  JumlahDikirim: number;
  PesananSelesai: number;
}
