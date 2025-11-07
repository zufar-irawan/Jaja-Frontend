'use client'

import React, { useState } from 'react'
import { Heart, Share2, Star, ShoppingCart, Plus, Minus, Shield } from 'lucide-react'
import Swal from 'sweetalert2'
import { addToCart } from '@/utils/cartActions'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatCurrency } from '@/utils/format'

interface Variant {
  name: string
  price: number
  originalPrice: number
  stock: number
  id?: number
}

interface RatingStats {
  total: number
}

interface ProductInfoProps {
  variants: Variant[]
  selectedVariant: string
  setSelectedVariant: (variant: string) => void
  quantity: number
  setQuantity: (quantity: number) => void
  ratingStats: RatingStats
  productName: string
  productWeight: string
  productCondition: string
  productStock: number
  productId: number
  productImage?: string
  storeName?: string
  productPrice: number
  productDiscount?: number
}

export default function ProductInfo({ 
  variants, 
  selectedVariant: initialSelectedVariant, 
  setSelectedVariant: externalSetSelectedVariant, 
  quantity: initialQuantity, 
  setQuantity: externalSetQuantity,
  ratingStats,
  productName,
  productWeight,
  productCondition,
  productStock,
  productId,
  productImage,
  storeName,
  productPrice,
  productDiscount = 0
}: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(initialSelectedVariant)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const router = useRouter()

  const currentVariant = variants.find(v => v.name === selectedVariant) || variants[0]
  const discount = Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)

  const handleVariantChange = (variantName: string) => {
    setSelectedVariant(variantName)
    externalSetSelectedVariant(variantName)
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
    externalSetQuantity(newQuantity)
  }

  const addToCartAndUpdate = useCartStore((state) => state.addToCartAndUpdate);

const handleAddToCart = async () => {
  try {
    setIsAddingToCart(true)

    const cartData = {
      id_produk: productId,
      qty: quantity,
      id_variasi: currentVariant.id,
      model_variasi: selectedVariant !== 'Standard' ? selectedVariant : undefined,
      produk_cover: productImage || '',
      toko: storeName || '',
      nama_produk: productName,
      harga: currentVariant.price,
      diskon: productDiscount
    }

    await addToCartAndUpdate(cartData); // ✅ langsung update badge navbar tanpa refresh

    // SweetAlert tetap sama
    const result = await Swal.fire({
      icon: 'success',
      title: '<span style="color: #1a1a1a; font-family: Poppins, sans-serif;">Berhasil Ditambahkan!</span>',
      html: `
        <div style="text-align: left; padding: 0 20px; font-family: 'Poppins', sans-serif;">
          <div style="display: flex; gap: 16px; align-items: start; padding: 16px; background: #f8f9fa; border-radius: 12px; margin-bottom: 16px;">
            <img src="${productImage || '/placeholder.png'}" alt="${productName}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;" />
            <div style="flex: 1;">
              <p style="margin: 0 0 8px 0; color: #333; font-weight: 600; font-size: 14px;">
                ${productName}
              </p>
              ${selectedVariant !== 'Standard' ? `<p style="color: #6c757d; font-size: 12px; margin: 0 0 4px 0;">Variasi: ${selectedVariant}</p>` : ''}
              <p style="color: #6c757d; font-size: 12px; margin: 0;">Jumlah: ${quantity} item</p>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: linear-gradient(135deg, #55B4E5 0%, #3b9ed9 100%); border-radius: 8px;">
            <span style="color: white; font-size: 13px; font-weight: 500;">Total Harga:</span>
            <span style="color: white; font-weight: 700; font-size: 18px;">${formatCurrency(currentVariant.price * quantity)}</span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-shopping-cart"></i> Lihat Keranjang',
      cancelButtonText: 'Lanjut Belanja',
      confirmButtonColor: '#55B4E5',
      cancelButtonColor: '#6c757d',
    })

    if (result.isConfirmed) {
      router.push('/Cart')
    }

  } catch (error) {
    console.error(error)
  } finally {
    setIsAddingToCart(false)
  }
}
  const handleBuyNow = async () => {
    try {
      setIsAddingToCart(true)

      const cartData = {
        id_produk: productId,
        qty: quantity,
        id_variasi: currentVariant.id,
        model_variasi: selectedVariant !== 'Standard' ? selectedVariant : undefined,
        produk_cover: productImage || '',
        toko: storeName || '',
        nama_produk: productName,
        harga: currentVariant.price,
        diskon: productDiscount
      }

      const response = await addToCart(cartData)

      if (response.success) {
        router.push('/Cart')
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.message || 'Gagal memproses pesanan',
          confirmButtonColor: '#55B4E5'
        })
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'Login Diperlukan',
          text: 'Anda harus login terlebih dahulu',
          showCancelButton: true,
          confirmButtonText: 'Login Sekarang',
          cancelButtonText: 'Batal',
          confirmButtonColor: '#55B4E5',
          cancelButtonColor: '#6c757d'
        })

        if (result.isConfirmed) {
          router.push('/auth/login')
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Terjadi Kesalahan',
          text: 'Tidak dapat memproses pesanan. Silakan coba lagi.',
          confirmButtonColor: '#55B4E5'
        })
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)',
      height: '484px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#1a1a1a',
          marginBottom: '12px',
          marginTop: 0,
          letterSpacing: '-0.5px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          {productName}
        </h2>

        {/* Rating */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          borderRadius: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            backgroundColor: '#fff',
            borderRadius: '6px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>4.5</span>
            <Star size={14} fill="#FBB338" stroke="#FBB338" />
          </div>
          <div style={{ height: '16px', width: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{ratingStats.total} Penilaian</span>
          <div style={{ height: '16px', width: '1px', backgroundColor: '#e5e7eb' }} />
          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>1.2k Terjual</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: '16px' }}>
          {discount > 0 && (
            <div style={{ 
              fontSize: '14px', 
              color: '#9ca3af',
              textDecoration: 'line-through',
              marginBottom: '4px',
              fontWeight: '500'
            }}>
              {formatCurrency(currentVariant.originalPrice)}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
              {formatCurrency(currentVariant.price)}
            </div>
            {discount > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', 
                color: 'white',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '700',
                boxShadow: '0 2px 8px rgba(238, 90, 111, 0.3)'
              }}>
                {discount}%
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        {variants.length > 1 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              Pilih Variasi :
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {variants.map((variant) => (
                <button
                  key={variant.name}
                  onClick={() => handleVariantChange(variant.name)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: selectedVariant === variant.name ? '#55B4E5' : '#f9fafb',
                    color: selectedVariant === variant.name ? 'white' : '#374151',
                    border: selectedVariant === variant.name ? '2px solid #55B4E5' : '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedVariant === variant.name ? '0 2px 8px rgba(85, 180, 229, 0.3)' : 'none'
                  }}
                >
                  {variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Info */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            marginBottom: '8px'
          }}>
            <div>
              <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Kondisi : </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', textTransform: 'capitalize' }}>
                {productCondition}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: '#7f8c8d' }}>Berat : </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{productWeight}g</span>
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
            Stok tersisa <span style={{ fontWeight: '600', color: '#e74c3c' }}>{productStock} buah</span>
          </div>
        </div>

        {/* Action Buttons & Quantity */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              backgroundColor: 'white',
              border: '2px solid #55B4E5',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <Heart size={16} stroke="#55B4E5" />
            </button>
            <button style={{
              backgroundColor: 'white',
              border: '2px solid #55B4E5',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <Share2 size={16} stroke="#55B4E5" />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#1a1a1a',
              marginBottom: '8px'
            }}>
              Kuantitas :
            </label>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              border: '2px solid #FBB338',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <button 
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: quantity <= 1 ? 0.5 : 1
                }}
              >
                <Minus size={14} stroke="#FBB338" />
              </button>
              <span style={{ 
                padding: '0 16px',
                fontWeight: '600',
                color: '#1a1a1a',
                fontSize: '14px'
              }}>{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(Math.min(productStock, quantity + 1))}
                disabled={quantity >= productStock}
                style={{
                  backgroundColor: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: quantity >= productStock ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: quantity >= productStock ? 0.5 : 1
                }}
              >
                <Plus size={14} stroke="#FBB338" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{ marginTop: 'auto' }}>
        {/* Warranty Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0'
        }}>
          <Shield size={16} stroke="#27ae60" />
          <span style={{ fontSize: '13px', color: '#7f8c8d' }}>
            <strong style={{ color: '#27ae60' }}>Produk Original</strong> dengan Jaminan Kualitas
          </span>
        </div>

        {/* Buy Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleBuyNow}
            disabled={isAddingToCart || productStock === 0}
            style={{
              flex: 1,
              background: productStock === 0 ? '#cccccc' : 'linear-gradient(135deg, #FBB338 0%, #f59e0b 100%)',
              border: 'none',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: productStock === 0 || isAddingToCart ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: productStock === 0 ? 'none' : '0 4px 12px rgba(251, 179, 56, 0.3)',
              opacity: isAddingToCart ? 0.7 : 1
            }}
          >
            {isAddingToCart ? 'Memproses...' : productStock === 0 ? 'Stok Habis' : 'Beli Langsung'}
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || productStock === 0}
            style={{
              flex: 1,
              background: productStock === 0 ? '#cccccc' : 'linear-gradient(135deg, #55B4E5 0%, #3b9ed9 100%)',
              border: 'none',
              color: 'white',
              padding: '14px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: productStock === 0 || isAddingToCart ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.3s ease',
              boxShadow: productStock === 0 ? 'none' : '0 4px 12px rgba(85, 180, 229, 0.3)',
              opacity: isAddingToCart ? 0.7 : 1
            }}
          >
            {isAddingToCart ? (
              <>Menambahkan...</>
            ) : (
              <>
                <ShoppingCart size={16} />
                + Keranjang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}