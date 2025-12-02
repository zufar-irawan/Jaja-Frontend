// TYPES
import type { CartItem } from "./cartService";

export interface AddressData {
  id_alamat: number;
  nama_penerima: string;
  telp_penerima: string;
  alamat_lengkap: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kode_pos: string;
  catatan?: string;
}

export interface ShippingOption {
  storeId: number;
  service: string;
  courier: string;
  cost: number;
  etd: string;
}

export interface ReviewCheckoutData {
  id_alamat: number;
  shippingType: string;
  is_gift: boolean;
  isCoin: boolean;
}

// Updated interface to match API response
export interface ReviewCheckoutResponse {
  success: boolean;
  code?: number;
  message?: string;
  data?: {
    address: {
      label: string;
      receiverName: string;
      phoneNumber: string;
      address: string;
      postalCode: string;
      latitude: string | null;
      longitude: string | null;
    };
    cart: Array<{
      store: {
        id: number;
      };
      totalBelanja: number;
      totalWeight: number;
      products: Array<{
        productId: number;
        cartId: number;
        name: string;
        image: string;
        badges: string[];
        variant: string | null;
        qty: number;
        weight: number;
        isDiscount: boolean;
        discount: number;
        price: number;
        priceCurrencyFormat: string;
        priceDiscount: number;
        priceDiscountCurrencyFormat: string;
        subTotal: number;
        subTotalCurrencyFormat: string;
      }>;
      voucherStore: Array<{
        id: number;
        code: string;
        discount: number;
      }>;
      voucherStoreSelected: {
        id: number;
        code: string;
        discount: number;
      } | null;
      shippingOptions: Array<{
        courier: string;
        service: string;
        description: string;
        price: number;
        priceCurrencyFormat: string;
        etd: string;
      }>;
      shippingSelected: {
        courier: string;
        service: string;
        price: number;
        etd: string;
      } | null;
      total: number;
      totalDiscount: number;
      voucherDiscount: number;
      totalCurrencyFormat: string;
      totalDiscountCurrencyFormat: string;
      voucherDiscountCurrencyFormat: string;
    }>;
    isGift: boolean;
    isCoin: boolean;
    totalAllProduct: number;
    voucherJaja: Array<{
      id: number;
      code: string;
      discount: number;
      description?: string;
      type?: string;
    }>;
    voucherJajaSelected: {
      id: number;
      code: string;
      discount: number;
      description?: string;
      type?: string;
    } | null;
    voucherDiscountJaja: number;
    voucherDiscountJajaCurrencyFormat: string;
    voucherJajaDesc: string;
    voucherJajaType: string;
    subTotal: number;
    subTotalCurrencyFormat: string;
    shippingCost: number;
    shippingCostCurrencyFormat: string;
    fee: number;
    feeCurrencyFormat: string;
    tax: number;
    taxFormat: string;
    taxAmount: number;
    taxAmountCurrencyFormat: string;
    coinRemaining: number;
    coinRemainingFormat: string;
    coinUsed: number;
    coinUsedFormat: string;
    total: number;
    totalCurrencyFormat: string;
    deliveryTimeOptions: Array<{
      value: string;
      label: string;
      metadata?: {
        minDate?: string;
        maxDate?: string;
      };
    }>;
  };
}

export interface CheckoutData {
  alamat_pengiriman: string;
  nama_penerima: string;
  telp_penerima: string;
  selectedShipping: Array<{
    storeId: number;
    service: string;
    courier: string;
  }>;
  waktu_pengiriman: string;
  diskon_voucher_toko: number;
  pesan_customer?: string;
}

export interface CheckoutResponse {
  success: boolean;
  message?: string;
  data?: {
    transaksi: {
      status_komplain: string;
      id_data: number;
      billing_id: string;
      faktur: string;
      id_toko: number;
      created_date: string;
      created_time: string;
      batas_pembayaran: string;
      nama_customer: string;
      waktu_pengiriman: string;
      tgl_pengiriman: string | null;
      status_transaksi: string;
      diskon_voucher_toko: number;
      biaya_asuransi: number;
      total_tagihan: number;
      total_pembayaran: number;
      id_customer: number;
      alamat_pengiriman: string;
      nama_penerima: string;
      telp_penerima: string;
      pengiriman: string;
      pesan_customer: string;
      biaya_ongkir: number;
      total_ongkir: number;
      notifikasi_admin: string;
      notifikasi_seller: string;
      notifikasi_buyer: string;
      terima_pesanan: string;
      order_id: string;
      invoice: string;
    };
    details: Array<{
      id_flashsale: number | null;
      id_lelang: number | null;
      nama_produk: string;
      qty: number;
      berat: number;
      harga_aktif: number;
      harga_awal: number;
      total: number;
      koin: number;
      ongkir: number;
      expedisi: string;
      waktu_kirim: string;
      nama_toko: string;
      sub_total: number;
      id_produk: number;
      id_kategori: number;
      id_variasi: number;
      id_toko: number;
      status_pesanan: string;
      notifikasi_admin: string;
      notifikasi_seller: string;
      notifikasi_buyer: string;
      produk_batal: string;
    }>;
    next_step?: string;
  };
}

export interface PaymentData {
  order_id: string;
  total_tagihan: number;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  provider_payload?: {
    message: string[];
    response: {
      payment: {
        payment_method_types: string[];
        payment_due_date: number;
        token_id: string;
        url: string;
        expired_date: string;
        expired_datetime: string;
        type: string;
      };
      order: {
        amount: string;
        invoice_number: string;
        currency: string;
        session_id: string;
      };
    };
  };
}

// Transaction Detail Interfaces
export interface TransactionDetail {
  id_detail: number;
  id_data: number;
  id_flashsale: number | null;
  id_lelang: number | null;
  order_id: string;
  invoice: string;
  nama_produk: string;
  qty: string;
  berat: number;
  harga_aktif: string;
  harga_awal: string;
  total: number;
  koin: number;
  ongkir: number;
  expedisi: string;
  etd: string | null;
  waktu_kirim: string;
  tgl_kirim: string | null;
  deskripsi: string | null;
  nama_toko: string;
  logo_toko: string | null;
  status_pickup: string | null;
  status_pengiriman: string | null;
  sub_total: string;
  foto_produk: string | null;
  id_produk: number;
  id_kategori: number;
  id_variasi: number;
  id_toko: number;
  file_ebook: string | null;
  cetak_label: string;
  date_time_cetak_label: string | null;
  date_time_pengiriman: string | null;
  date_time_terima_expired: string | null;
  sudah_kirim: string;
  pesanan_diterima: string | null;
  date_time_pesanan_diterima: string | null;
  status_pesanan: string;
  id_customer: number | null;
  id_voucher_toko: number | null;
  id_package_toko: number | null;
  catatan_package_toko: string | null;
  pesan_customer_toko: string | null;
  greeting_card_gift: string | null;
  notifikasi_admin: string;
  notifikasi_seller: string;
  notifikasi_buyer: string;
  produk_batal: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionData {
  id_data: number;
  invoice: string;
  billing_id: string;
  faktur: string;
  id_toko: number;
  order_id: string;
  created_date: string;
  created_time: string;
  id_admin: number | null;
  nama_admin: string | null;
  batas_pembayaran: string;
  id_customer: number;
  nama_customer: string;
  id_voucher: number | null;
  kode_voucher: string | null;
  diskon_voucher: number | null;
  diskon_voucher_toko: number;
  id_voucher_toko: number | null;
  alamat_pengiriman: string;
  latitude_receiver: string | null;
  longitude_receiver: string | null;
  postal_code_receiver: string | null;
  nama_penerima: string;
  telp_penerima: string;
  code_pengiriman: string | null;
  type_pengiriman: string | null;
  pengiriman: string;
  desc_pengiriman: string | null;
  waktu_pengiriman: string;
  tgl_pengiriman: string | null;
  status_transaksi: string;
  pesan_customer: string;
  id_package: number | null;
  pesan_package: string | null;
  biaya_package: number | null;
  tgl_pembayaran: string | null;
  jam_pembayaran: string | null;
  metode_pembayaran: string | null;
  koin: number | null;
  biaya_asuransi: number;
  biaya_ongkir: string;
  total_tagihan: string;
  total_pembayaran: string;
  judul_promo: string | null;
  total_ongkir: string;
  link_qrcode: string | null;
  notifikasi_admin: string;
  notifikasi_seller: string;
  notifikasi_buyer: string;
  nama_pengirim_dropship: string | null;
  nomor_telepon_dropship: string | null;
  bank_id: number | null;
  bank_code: string | null;
  estimasi_pengiriman_kurir: string | null;
  status_pembatalan: string | null;
  alasan_pembatalan: string | null;
  alasan_tolak: string | null;
  terima_pesanan: string;
  kendala_toko: string | null;
  confirm_date: string | null;
  status_komplain: string;
  complain_date: string | null;
  resi_pengiriman?: string | null;
  kurir?: string | null;
  details: TransactionDetail[];
}

export interface TransactionResponse {
  success: boolean;
  message?: string;
  data?: TransactionData;
}

// HELPER FUNCTIONS
export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function formatPhoneNumber(phone: string): string {
  // Format to +62xxx
  if (phone.startsWith("0")) {
    return "+62" + phone.substring(1);
  }
  if (!phone.startsWith("+")) {
    return "+62" + phone;
  }
  return phone;
}

export function validateCheckoutData(data: Partial<CheckoutData>): {
  valid: boolean;
  error?: string;
} {
  if (!data.alamat_pengiriman || data.alamat_pengiriman.trim() === "") {
    return { valid: false, error: "Alamat pengiriman harus diisi" };
  }

  if (!data.nama_penerima || data.nama_penerima.trim() === "") {
    return { valid: false, error: "Nama penerima harus diisi" };
  }

  if (!data.telp_penerima || data.telp_penerima.trim() === "") {
    return { valid: false, error: "Nomor telepon harus diisi" };
  }

  if (!data.selectedShipping || data.selectedShipping.length === 0) {
    return { valid: false, error: "Pilih metode pengiriman" };
  }

  return { valid: true };
}

export function groupItemsByStore(items: CartItem[]) {
  return items.reduce(
    (acc, item) => {
      const storeId = item.toko?.id_toko;
      if (storeId === undefined) return acc;

      if (!acc[storeId]) {
        acc[storeId] = {
          id_toko: storeId,
          nama_toko: item.toko?.nama_toko || "Toko Tidak Diketahui",
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    },
    {} as Record<
      number,
      { id_toko: number; nama_toko: string; items: CartItem[] }
    >,
  );
}

export function calculateItemTotal(item: CartItem): number {
  const price =
    (typeof item.produk === "object" ? item.produk.harga : item.harga) || 0;
  const discount =
    (typeof item.produk === "object" ? item.produk.diskon : item.diskon) || 0;
  const finalPrice = price - (price * discount) / 100;
  return finalPrice * item.qty;
}
