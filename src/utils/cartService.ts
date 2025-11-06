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
    toko?: string
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
    tokos?: {
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

/**
 * Get product price considering discount and variant
 * @param item - Cart item
 * @returns Final price after discount
 */
export function getProductPrice(item: CartItem): number {
    // Priority: variant price > product price
    const productPrice = typeof item.produk === 'object' && item.produk ? item.produk.harga : 0
    const basePrice = item.variasi?.harga_variasi || productPrice || 0
    
    // Apply discount if exists
    if (typeof item.produk === 'object' && item.produk && item.produk.diskon && item.produk.diskon > 0) {
        const discount = item.produk.diskon / 100
        return Math.round(basePrice * (1 - discount))
    }
    
    return basePrice
}

/**
 * Get product image URL with fallback
 * @param item - Cart item
 * @returns Image URL
 */
export function getProductImageUrl(item: CartItem): string {
    // Priority order for image
    if (item.produk_cover) {
        return item.produk_cover
    }
    
    if (typeof item.produk === 'object' && item.produk && item.produk.foto_produk) {
        // If it's a relative path, prepend base URL
        if (!item.produk.foto_produk.startsWith('http')) {
            return `https://kb8334ks-3000.asse.devtunnels.ms${item.produk.foto_produk}`
        }
        return item.produk.foto_produk
    }
    
    // Default placeholder
    return 'https://via.placeholder.com/100?text=No+Image'
}

/**
 * Calculate cart totals including tax, shipping, and discount
 * @param items - Array of cart items
 * @param shippingCost - Shipping cost (default: 0)
 * @param discount - Discount amount (default: 0)
 * @param taxRate - Tax rate as decimal (default: 0.1 for 10%)
 * @returns Cart totals object
 */
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

/**
 * Validate cart item before adding
 * @param data - Cart data to validate
 * @returns Validation result
 */
export function validateCartData(data: AddCartData): { valid: boolean; error?: string } {
    if (!data.id_produk || data.id_produk <= 0) {
        return { valid: false, error: 'ID Produk tidak valid' }
    }
    
    if (data.qty && data.qty <= 0) {
        return { valid: false, error: 'Jumlah harus lebih dari 0' }
    }
    
    return { valid: true }
}

/**
 * Group cart items by store
 * @param items - Array of cart items
 * @returns Object with store IDs as keys and items as values
 */
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

/**
 * Check if cart item is in stock
 * @param item - Cart item
 * @returns Boolean indicating stock availability
 */
export function isItemInStock(item: CartItem): boolean {
    const availableStock = item.variasi?.stok_variasi ?? (typeof item.produk === 'object' && item.produk ? item.produk.stok : undefined) ?? 0
    return availableStock >= item.qty
}

/**
 * Get out of stock items
 * @param items - Array of cart items
 * @returns Array of out of stock items
 */
export function getOutOfStockItems(items: CartItem[]): CartItem[] {
    return items.filter(item => !isItemInStock(item))
}

/**
 * Format currency to Indonesian Rupiah
 * @param amount - Amount to format
 * @returns Formatted string
 */
export function formatCurrency(amount: number): string {
    return `Rp ${amount.toLocaleString('id-ID')}`
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Price after discount
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0) return 0
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Get store name from cart item
 * @param item - Cart item
 * @returns Store name
 */
export function getStoreName(item: CartItem): string {
    return item.tokos?.nama_toko || item.toko || 'Toko'
}

/**
 * Get product name from cart item
 * @param item - Cart item
 * @returns Product name
 */
export function getProductName(item: CartItem): string {
    if (typeof item.produk === 'object' && item.produk) {
        return item.produk.nama_produk
    }
    if (typeof item.produk === 'string') {
        return item.produk
    }
    return 'Produk'
}

/**
 * Check if all items are selected
 * @param items - Array of cart items
 * @returns Boolean
 */
export function areAllItemsSelected(items: CartItem[]): boolean {
    return items.length > 0 && items.every(item => item.status_pilih)
}

/**
 * Get total weight of selected items
 * @param items - Array of cart items
 * @returns Total weight in grams
 */
export function getTotalWeight(items: CartItem[]): number {
    return items
        .filter(item => item.status_pilih)
        .reduce((total, item) => {
            const weight = parseInt((typeof item.produk === 'object' && item.produk?.berat) || '0')
            return total + (weight * item.qty)
        }, 0)
}