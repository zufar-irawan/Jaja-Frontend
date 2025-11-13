"use server"

import api from './api'
import type { CartResponse, AddCartData, CartItem } from './cartService'

/**
 * Get Cart Items
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 100)
 * @returns Cart response with items array
 */
export async function getCart(page: number = 1, limit: number = 100): Promise<CartResponse> {
    try {
        const response = await api.get('/main/cart/', {
            params: { page, limit }
        })

        console.log('Cart API Response:', response.data)

        // Handle different response structures
        let items: CartItem[] = []

        if (response.data.data) {
            items = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data.items || []
        } else if (Array.isArray(response.data)) {
            items = response.data
        }

        // Ensure each item has proper structure and defaults
        items = (items as any[]).map(item => {
            const { toko, ...rest } = item;
            return {
                ...rest,
                status_pilih: item.status_pilih === 'Y',
                produk: typeof item.produk === 'object'
                    ? item.produk
                    : {
                        id_produk: item.id_produk,
                        nama_produk: item.produk || 'Produk Tidak Diketahui',
                        harga: item.harga || 0,
                        diskon: item.diskon || 0,
                        stok: 0,
                        slug_produk: item.produk_slug || '',
                        foto_produk: item.produk_cover || '',
                        berat: item.berat || '0',
                        kondisi: 'Baru'
                    },
                toko: {
                    id_toko: item.id_toko,
                    nama_toko: toko || 'Toko Tidak Diketahui',
                    slug_toko: ''
                },
                variasi: item.id_variasi
                    ? {
                        id_variasi: item.id_variasi,
                        nama_variasi: item.model_variasi || '',
                        harga_variasi: 0,
                        stok_variasi: 0
                    }
                    : undefined
            }
        })

        return {
            success: true,
            data: {
                items: items,
                pagination: response.data.pagination
            }
        }
    } catch (error: any) {
        console.error('Get cart error:', error.response?.data || error)
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengambil data keranjang',
            data: {
                items: []
            }
        }
    }
}

/**
 * Add Item to Cart
 * @param data - Product data to add to cart
 * @returns Cart response
 */
export async function addToCart(data: AddCartData): Promise<CartResponse> {
    try {
        console.log('Adding to cart:', data)

        // Prepare the request body - only include fields that have values
        const requestBody: any = {
            id_produk: data.id_produk,
            qty: data.qty || 1,
        }

        // Add optional fields only if they exist
        if (data.id_variasi) requestBody.id_variasi = data.id_variasi
        if (data.model_variasi) requestBody.model_variasi = data.model_variasi
        if (data.warna_variasi) requestBody.warna_variasi = data.warna_variasi
        if (data.ukuran_variasi) requestBody.ukuran_variasi = data.ukuran_variasi
        if (data.produk_cover) requestBody.produk_cover = data.produk_cover
        if (data.toko) requestBody.toko = data.toko
        if (data.pesan_customer) requestBody.pesan_customer = data.pesan_customer
        if (data.greeting_card_gift) requestBody.greeting_card_gift = data.greeting_card_gift
        if (data.harga) requestBody.harga = data.harga
        if (data.diskon) requestBody.diskon = data.diskon

        console.log('Adding to cart:', data)
        console.log('Request body being sent:', requestBody)
        const response = await api.post('/main/cart/add', requestBody)

        console.log('Add to cart response:', response.data)

        return {
            success: true,
            message: response.data.message || 'Berhasil menambahkan ke keranjang',
            data: response.data.data
        }
    } catch (error: any) {
        console.error('Add to cart error:', error.response?.data || error)

        // Re-throw error with status for auth check
        const err: any = new Error(error.response?.data?.message || 'Gagal menambahkan ke keranjang')
        err.response = error.response
        throw err
    }
}

/**
 * Update Cart Item Quantity
 * @param id_cart - Cart item ID
 * @param qty - New quantity
 * @returns Cart response
 */
export async function updateCartQuantity(id_cart: number, qty: number): Promise<CartResponse> {
    try {
        console.log('Updating cart quantity:', { id_cart, qty })

        const response = await api.put(`/main/cart/${id_cart}/qty`, { qty })

        return {
            success: true,
            message: response.data.message || 'Berhasil mengupdate jumlah',
            data: response.data.data
        }
    } catch (error: any) {
        console.error('Update cart quantity error:', error.response?.data || error)
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengupdate jumlah'
        }
    }
}

/**
 * Toggle Cart Item Selection
 * @param id_cart - Cart item ID
 * @returns Cart response
 */
export async function toggleCartSelection(id_cart: number): Promise<CartResponse> {
    try {
        console.log('Toggling cart selection:', id_cart)

        const response = await api.put(`/main/cart/${id_cart}/toggle-select-product`)

        return {
            success: true,
            message: response.data.message || 'Berhasil mengupdate pilihan',
            data: response.data.data
        }
    } catch (error: any) {
        console.error('Toggle cart selection error:', error.response?.data || error)
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengupdate pilihan'
        }
    }
}

/**
 * Delete Cart Item
 * @param id_cart - Cart item ID
 * @returns Cart response
 */
export async function deleteCartItem(id_cart: number): Promise<CartResponse> {
    try {
        console.log('Deleting cart item:', id_cart)

        const response = await api.delete(`/main/cart/${id_cart}`)

        return {
            success: true,
            message: response.data.message || 'Berhasil menghapus item',
            data: response.data.data
        }
    } catch (error: any) {
        console.error('Delete cart item error:', error.response?.data || error)
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal menghapus item'
        }
    }
}

/**
 * Clear All Cart Items
 * @returns Cart response
 */
export async function clearCart(): Promise<CartResponse> {
    try {
        console.log('Clearing cart')

        const response = await api.delete('/main/cart/clear')

        return {
            success: true,
            message: response.data.message || 'Berhasil mengosongkan keranjang',
            data: response.data.data
        }
    } catch (error: any) {
        console.error('Clear cart error:', error.response?.data || error)
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal mengosongkan keranjang'
        }
    }
}

/**
 * Batch Toggle Cart Selections (for Select All feature)
 * @param cart_ids - Array of cart item IDs
 * @param select - Whether to select or deselect
 * @returns Cart response
 */
export async function batchToggleCartSelection(cart_ids: number[], select: boolean): Promise<CartResponse> {
    try {
        const results = await Promise.all(
            cart_ids.map(id => toggleCartSelection(id))
        )

        const allSuccess = results.every(r => r.success)

        return {
            success: allSuccess,
            message: allSuccess ? 'Berhasil mengupdate semua pilihan' : 'Beberapa item gagal diupdate',
            data: { items: [] }
        }
    } catch (error: any) {
        console.error('Batch toggle error:', error)
        return {
            success: false,
            message: 'Gagal mengupdate pilihan'
        }
    }
}