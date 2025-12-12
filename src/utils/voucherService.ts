// Voucher Types
export interface VoucherData {
  id_promo?: number;
  id?: number;
  kode_voucher?: string;
  kode?: string;
  judul_promo?: string;
  judul?: string;
  banner_promo?: string | null;
  banner?: string | null;
  nominal_diskon?: number;
  persentase_diskon?: number;
  kategori?: string;
  tipe?: string;
  diskon?: string;
  min_belanja?: number | string;
  max_diskon?: number | null;
  berakhir?: string;
  dari?: string;
  nama_toko?: string;
  id_toko?: number;
  sudah_klaim?: boolean;
  bisa_langsung_pakai?: boolean;
}

export interface MyVouchersResponse {
  success: boolean;
  message?: string;
  data?: VoucherData[];
}

export interface AvailableVouchersResponse {
  success: boolean;
  message?: string;
  data?: VoucherData[];
}

export interface ClaimVoucherResponse {
  success: boolean;
  message: string;
  kode_voucher?: string;
}

// Helper Functions
export function formatVoucherDiscount(voucher: VoucherData): string {
  if (voucher.diskon) {
    return voucher.diskon;
  }

  if (voucher.persentase_diskon) {
    return `${voucher.persentase_diskon}%`;
  }

  if (voucher.nominal_diskon) {
    return `Rp ${voucher.nominal_diskon.toLocaleString("id-ID")}`;
  }

  return "Diskon";
}

export function formatMinBelanja(minBelanja: number | string): string {
  if (typeof minBelanja === "string") {
    return minBelanja;
  }

  if (minBelanja === 0) {
    return "Tanpa minimum belanja";
  }

  return `Min. belanja Rp ${minBelanja.toLocaleString("id-ID")}`;
}

export function isVoucherExpired(expiryDate: string): boolean {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return today > expiry;
}

export function formatExpiryDate(expiryDate: string): string {
  const date = new Date(expiryDate);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

export function getVoucherCode(voucher: VoucherData): string {
  return voucher.kode_voucher || voucher.kode || "";
}

export function getVoucherTitle(voucher: VoucherData): string {
  return voucher.judul_promo || voucher.judul || "Voucher";
}

export function getVoucherBanner(voucher: VoucherData): string | null {
  return voucher.banner_promo || voucher.banner || null;
}

export function getVoucherId(voucher: VoucherData): number | undefined {
  return voucher.id_promo || voucher.id;
}
