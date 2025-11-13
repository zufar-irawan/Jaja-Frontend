//TYPES
import type { CartItem } from './cartService';

export interface AddressData {
  id_alamat: number
  nama_penerima: string
  telp_penerima: string
  alamat_lengkap: string
  provinsi: string
  kota: string
  kecamatan: string
  kode_pos: string
  catatan?: string
}

export interface ShippingOption {
  storeId: number
  service: string
  courier: string
  cost: number
  etd: string
}

export interface ReviewCheckoutData {
  id_alamat: number
  shippingType: string
  is_gift: boolean
  isCoin: boolean
}

export interface ReviewCheckoutResponse {
  success: boolean
  message?: string
  data?: {
    items: CartItem[]
    address: AddressData
    shipping: ShippingOption[]
    summary: {
      subtotal: number
      shipping: number
      tax: number
      discount: number
      total: number
    }
  }
}


export interface CheckoutData {
  alamat_pengiriman: string
  nama_penerima: string
  telp_penerima: string
  selectedShipping: ShippingOption[]
  waktu_pengiriman: string
  diskon_voucher_toko: number
  pesan_customer?: string
}

export interface CheckoutResponse {
  success: boolean
  message?: string
  data?: {
    order_ids: string[]
    total_tagihan: number
    redirect_url?: string
  }
}

export interface PaymentData {
  order_ids: string
  total_tagihan: number
}

export interface PaymentResponse {
  success: boolean
  message?: string
  data?: {
    payment_url: string
    order_id: string
    status: string
  }
}

// HELPER FUNCTIONS
export function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatPhoneNumber(phone: string): string {
  // Format to +62xxx
  if (phone.startsWith('0')) {
    return '+62' + phone.substring(1)
  }
  if (!phone.startsWith('+')) {
    return '+62' + phone
  }
  return phone
}

export function validateCheckoutData(data: Partial<CheckoutData>): { valid: boolean; error?: string } {
  if (!data.alamat_pengiriman || data.alamat_pengiriman.trim() === '') {
    return { valid: false, error: 'Alamat pengiriman harus diisi' }
  }
  
  if (!data.nama_penerima || data.nama_penerima.trim() === '') {
    return { valid: false, error: 'Nama penerima harus diisi' }
  }
  
  if (!data.telp_penerima || data.telp_penerima.trim() === '') {
    return { valid: false, error: 'Nomor telepon harus diisi' }
  }
  
  if (!data.selectedShipping || data.selectedShipping.length === 0) {
    return { valid: false, error: 'Pilih metode pengiriman' }
  }
  
  return { valid: true }
}

export function groupItemsByStore(items: CartItem[]) {
  return items.reduce((acc, item) => {
    const storeId = item.toko?.id_toko;
    if (storeId === undefined) return acc;

    if (!acc[storeId]) {
      acc[storeId] = {
        id_toko: storeId,
        nama_toko: item.toko?.nama_toko || 'Toko Tidak Diketahui',
        items: []
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<number, { id_toko: number; nama_toko: string; items: CartItem[] }>);
}


export function calculateItemTotal(item: CartItem): number {
  const price = (typeof item.produk === 'object' ? item.produk.harga : item.harga) || 0;
  const discount = (typeof item.produk === 'object' ? item.produk.diskon : item.diskon) || 0;
  const finalPrice = price - (price * discount / 100);
  return finalPrice * item.qty;
}