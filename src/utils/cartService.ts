//TYPES
export interface CartItem {
    id_cart: number
    id_customer: number
    id_produk: number
    id_toko: number
    qty: number
    id_variasi?: number
    model_variasi?: string
    warna_variasi?: string
    ukuran_variasi?: string
    produk_cover?: string
    pesan_customer?: string
    greeting_card_gift?: string
    status_pilih: boolean | string
    created_at: string
    updated_at: string
    harga?: number
    diskon?: number
    berat?: string
    produk_slug?: string              
    produk?: string | {           
        id_produk: number
        nama_produk: string
        harga: number
        diskon?: number
        stok: number
        slug_produk: string
        foto_produk?: string
        berat?: string
        kondisi?: string
    }         
    variasi?: {
        id_variasi: number
        nama_variasi: string
        harga_variasi?: number
        stok_variasi?: number
    }
    toko?: {
        id_toko: number
        nama_toko: string
        slug_toko: string
        alamat_toko?: string
    }
}

export interface CartResponse {
    success: boolean
    message?: string
    data?: {
        items: CartItem[]
        pagination?: {
            page: number
            limit: number
            total: number
            totalPages: number
        }
    }
}

export interface AddCartData {
    id_produk: number
    qty?: number
    id_variasi?: number
    model_variasi?: string
    warna_variasi?: string
    ukuran_variasi?: string
    produk_cover?: string
    toko?: string
    pesan_customer?: string
    greeting_card_gift?: string
    harga?: number
    diskon?: number
}

export interface CartTotals {
    selectedItems: CartItem[]
    selectedCount: number
    totalItems: number
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
}

// ==================== HELPER FUNCTIONS (CLIENT-SIDE) ====================
export function getProductPrice(item: CartItem): number {
    if(item.harga !== undefined && item.harga !== null) {
      return item.harga
    }
    if(item.variasi?.harga_variasi) {
      return item.variasi.harga_variasi;
    }
    if(typeof item.produk === 'object' && item.produk?.harga) {
      if(item.produk.diskon && item.produk.diskon > 0) {
        const discount = item.produk.diskon / 100;
        return Math.round(item.produk.harga * (1 - discount));
      }
      return item.produk.harga;
    }
    return 0;
}

export function getProductImageUrl(item: CartItem): string {
    if (item.produk_cover) {
        return item.produk_cover
    }
    
    if (typeof item.produk === 'object' && item.produk && item.produk.foto_produk) {
        if (!item.produk.foto_produk.startsWith('http')) {
            return `https://kb8334ks-3000.asse.devtunnels.ms${item.produk.foto_produk}`
        }
        return item.produk.foto_produk
    }
    
    return 'https://via.placeholder.com/100?text=No+Image'
}

export function calculateCartTotals(
    items: CartItem[], 
    shippingCost: number = 0,
    discount: number = 0,
    taxRate: number = 0.1
): CartTotals {
    const selectedItems = items.filter(item => item.status_pilih)
    
    const subtotal = selectedItems.reduce((sum, item) => {
        const price = getProductPrice(item)
        return sum + (price * item.qty)
    }, 0)
    
    const tax = Math.round(subtotal * taxRate)
    const total = subtotal + shippingCost + tax - discount
    
    return {
        selectedItems,
        selectedCount: selectedItems.length,
        totalItems: items.length,
        subtotal,
        shipping: shippingCost,
        tax,
        discount,
        total
    }
}

export function validateCartData(data: AddCartData): { valid: boolean; error?: string } {
    if (!data.id_produk || data.id_produk <= 0) {
        return { valid: false, error: 'ID Produk tidak valid' }
    }
    
    if (data.qty && data.qty <= 0) {
        return { valid: false, error: 'Jumlah harus lebih dari 0' }
    }
    
    return { valid: true }
}

export function groupCartItemsByStore(items: CartItem[]): Record<number, CartItem[]> {
    return items.reduce((acc, item) => {
        const storeId = item.id_toko
        if (!acc[storeId]) {
            acc[storeId] = []
        }
        acc[storeId].push(item)
        return acc
    }, {} as Record<number, CartItem[]>)
}

export function isItemInStock(item: CartItem): boolean {
    const availableStock = item.variasi?.stok_variasi ?? (typeof item.produk === 'object' && item.produk ? item.produk.stok : undefined) ?? 0
    return availableStock >= item.qty
}

export function getOutOfStockItems(items: CartItem[]): CartItem[] {
    return items.filter(item => !isItemInStock(item))
}

export function formatCurrency(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`
}

export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

export function getStoreName(item: CartItem): string {
    return item.toko?.nama_toko || 'Toko'
}

export function getProductName(item: CartItem): string {
    if (typeof item.produk === 'object' && item.produk) {
        return item.produk.nama_produk
    }
    if (typeof item.produk === 'string') {
        return item.produk
    }
    return 'Produk'
}

export function areAllItemsSelected(items: CartItem[]): boolean {
    return items.length > 0 && items.every(item => item.status_pilih)
}

export function getTotalWeight(items: CartItem[]): number {
    return items
        .filter(item => item.status_pilih)
        .reduce((total, item) => {
            const weight = parseInt((typeof item.produk === 'object' && item.produk?.berat) || '0')
            return total + (weight * item.qty)
        }, 0)
}

