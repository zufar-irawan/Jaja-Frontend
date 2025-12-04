"use server"

import api from './api'
import type { CartResponse, AddCartData, CartItem } from './cartService'

export async function getCart(page: number = 1, limit: number = 100): Promise<CartResponse> {
    try {
        const response = await api.get('/main/cart/', {
            params: { page, limit }
        })

        console.log('Cart API Response:', response.data)

        let items: CartItem[] = []

        if (response.data.data) {
            items = Array.isArray(response.data.data)
                ? response.data.data
                : response.data.data.items || []
        } else if (Array.isArray(response.data)) {
            items = response.data
        }

        items = (items as any[]).map(item => {
            const tokoData = item.toko || item.nama_toko || 'Toko Tidak Diketahui';
            const tokoName = typeof tokoData === 'object' ? tokoData.nama_toko : tokoData;
            
            return {
                id_cart: item.id_cart,
                id_customer: item.id_customer,
                id_produk: item.id_produk,
                id_toko: item.id_toko,
                qty: item.qty,
                id_variasi: item.id_variasi,
                model_variasi: item.model_variasi,
                warna_variasi: item.warna_variasi,
                ukuran_variasi: item.ukuran_variasi,
                produk_cover: item.produk_cover,
                pesan_customer: item.pesan_customer,
                greeting_card_gift: item.greeting_card_gift,
                status_pilih: item.status_pilih === 'Y' || item.status_pilih === true,
                created_at: item.created_at,
                updated_at: item.updated_at,
                harga: item.harga,
                diskon: item.diskon,
                berat: item.berat,
                produk_slug: item.produk_slug,
                produk: typeof item.produk === 'object'
                    ? item.produk
                    : {
                        id_produk: item.id_produk,
                        nama_produk: item.produk || 'Produk Tidak Diketahui',
                        harga: item.harga || 0,
                        diskon: item.diskon || 0,
                        stok: item.stok || 0,
                        slug_produk: item.produk_slug || '',
                        foto_produk: item.produk_cover || '',
                        berat: item.berat || '0',
                        kondisi: 'Baru'
                    },
                toko: {
                    id_toko: item.id_toko,
                    nama_toko: tokoName,
                    slug_toko: ''
                },
                variasi: item.id_variasi
                    ? {
                        id_variasi: item.id_variasi,
                        nama_variasi: item.model_variasi || '',
                        harga_variasi: item.harga || 0,
                        stok_variasi: item.stok_variasi || 0
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

export async function addToCart(data: AddCartData): Promise<CartResponse> {
    try {
        console.log('Adding to cart:', data)

        const requestBody: any = {
            id_produk: data.id_produk,
            qty: data.qty || 1,
        }

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
        const err: any = new Error(error.response?.data?.message || 'Gagal menambahkan ke keranjang')
        err.response = error.response
        throw err
    }
}

export async function updateCartQuantity(id_cart: number, qty: number): Promise<CartResponse> {
    try {
        console.log('Updating cart quantity:', { id_cart, qty })

        const response = await api.put(`/main/cart/${id_cart}/qty`, { qty })
        
        console.log('Update quantity response:', response.data)
        
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

export async function toggleCartSelection(id_cart: number): Promise<CartResponse> {
    try {
        console.log('Toggling cart selection:', id_cart)

        const response = await api.put(`/main/cart/${id_cart}/toggle-select-product`)

        console.log('Toggle selection response:', response.data)

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

export async function deleteCartItem(id_cart: number): Promise<CartResponse> {
    try {
        console.log('Deleting cart item:', id_cart)

        const response = await api.delete(`/main/cart/${id_cart}`)

        console.log('Delete item response:', response.data)

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

export async function clearCart(): Promise<CartResponse> {
    try {
        console.log('Clearing cart')

        const response = await api.delete('/main/cart/clear')

        console.log('Clear cart response:', response.data)

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

// FIX: Add batch toggle with proper error handling
export async function batchToggleCartSelection(cart_ids: number[], select: boolean): Promise<CartResponse> {
    try {
        console.log('Batch toggling cart selection:', { cart_ids, select })
        
        const results = await Promise.allSettled(
            cart_ids.map(id => toggleCartSelection(id))
        )

        const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length
        const failedCount = results.length - successCount

        console.log(`Batch toggle completed: ${successCount} success, ${failedCount} failed`)

        return {
            success: failedCount === 0,
            message: failedCount === 0 
                ? 'Berhasil mengupdate semua pilihan' 
                : `Berhasil ${successCount} item, gagal ${failedCount} item`,
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