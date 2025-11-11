'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCart, updateCartQuantity, toggleCartSelection, deleteCartItem, clearCart } from '@/utils/cartActions';
import { getProductPrice, getProductImageUrl, calculateCartTotals, formatCurrency, type CartItem } from '@/utils/cartService';
import { useCartStore } from '@/store/cartStore';
import Swal from 'sweetalert2';

const ShoppingCartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuantities, setEditingQuantities] = useState<Record<number, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express' | 'free'>('standard');
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch cart data on mount
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCart();
      
      if (response.success && response.data?.items) {
        setCartItems(response.data.items);
      } else {
        setError(response.message || 'Gagal memuat keranjang');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Terjadi kesalahan saat memuat keranjang');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelection = async (id_cart: number) => {
    try {
      const response = await toggleCartSelection(id_cart);
      if (response.success) {
        setCartItems(items =>
          items.map(item =>
            item.id_cart === id_cart ? { ...item, status_pilih: !item.status_pilih } : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling selection:', error);
    }
  };

  const handleSelectAll = () => {
    const allSelected = cartItems.every(item => item.status_pilih);
    setCartItems(items =>
      items.map(item => ({ ...item, status_pilih: !allSelected }))
    );
  };

  const handleUpdateQuantity = async (id_cart: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await updateCartQuantity(id_cart, newQuantity);
      if (response.success) {
        setCartItems(items =>
          items.map(item =>
            item.id_cart === id_cart ? { ...item, qty: newQuantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const { fetchCartCount } = useCartStore();

const handleRemoveItem = async (id_cart: number) => {
  try {
    const confirm = await Swal.fire({
      title: 'Hapus produk ini?',
      text: 'Produk akan dihapus dari keranjang Anda.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (!confirm.isConfirmed) return;

    const response = await deleteCartItem(id_cart);

    if (response.success) {
      setCartItems(items => items.filter(item => item.id_cart !== id_cart));
      await fetchCartCount();
      await Swal.fire({
        title: 'Berhasil!',
        text: 'Produk telah dihapus dari keranjang.',
        icon: 'success',
        confirmButtonColor: '#55B4E5',
      });
    } else {
      await Swal.fire({
        title: 'Gagal',
        text: response.message || 'Terjadi kesalahan saat menghapus produk.',
        icon: 'error',
        confirmButtonColor: '#55B4E5',
      });
    }
  } catch (error) {
    console.error('Error removing item:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Terjadi kesalahan tak terduga.',
      icon: 'error',
      confirmButtonColor: '#55B4E5',
    });
  }
};

  const handleClearCart = async () => {
  const confirm = await Swal.fire({
    title: 'Kosongkan keranjang?',
    text: 'Semua produk akan dihapus dari keranjang Anda.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, kosongkan!',
    cancelButtonText: 'Batal',
  });

  if (!confirm.isConfirmed) return;

  try {
    const response = await clearCart();
    if (response.success) {
      setCartItems([]);
      await fetchCartCount(); 
      await Swal.fire({
        title: 'Keranjang dikosongkan!',
        text: 'Semua produk telah dihapus.',
        icon: 'success',
        confirmButtonColor: '#55B4E5',
      });
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    Swal.fire({
      title: 'Error!',
      text: 'Terjadi kesalahan saat mengosongkan keranjang.',
      icon: 'error',
      confirmButtonColor: '#55B4E5',
    });
  }
};



  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(100000);
      alert('Kupon berhasil diterapkan!');
    } else {
      alert('Kupon tidak valid');
    }
  };

  const shippingCost = cartItems.filter(item => item.status_pilih).length > 0 
    ? (deliveryType === 'standard' ? 50000 : deliveryType === 'express' ? 100000 : 0)
    : 0;

  const totals = calculateCartTotals(cartItems, shippingCost, discount);
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.status_pilih);

  if (loading) {
    return (
      <div style={{ 
        fontFamily: 'Poppins, sans-serif', 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} style={{ margin: '0 auto', color: '#55B4E5', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#6c757d' }}>Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        fontFamily: 'Poppins, sans-serif', 
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <ShoppingCart size={64} style={{ margin: '0 auto 16px', color: '#dc3545', opacity: 0.5 }} />
          <h2 style={{ color: '#333', marginBottom: '8px' }}>Oops!</h2>
          <p style={{ color: '#6c757d', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={fetchCartData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#55B4E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '16px' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <button
              onClick={() => router.push('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #dee2e6',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#6c757d',   
                marginBottom: '12px'
              }}
            >
              <ArrowLeft size={16} /> Kembali Belanja
            </button>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#333', margin: 0 }}>
              Keranjang Belanja ({cartItems.length})
            </h1>
          </div>
          
          {cartItems.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSelectAll}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '2px solid #55B4E5',
                  borderRadius: '6px',
                  color: '#55B4E5',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {allSelected ? '✓ Semua Dipilih' : 'Pilih Semua'}
              </button>
              <button
                onClick={handleClearCart}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'white',
                  border: '2px solid #dc3545',
                  borderRadius: '6px',
                  color: '#dc3545',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={14} /> Kosongkan
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Cart Items Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#6c757d' }}>
                <ShoppingCart size={64} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                <p style={{ fontSize: '16px', fontWeight: '500' }}>Keranjang Anda kosong</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>Mulai belanja sekarang!</p>
                <button
                  onClick={() => router.push('/')}
                  style={{
                    marginTop: '16px',
                    padding: '10px 24px',
                    backgroundColor: '#55B4E5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <>
                {cartItems.map(item => {
                  const price = getProductPrice(item);
                  const itemTotal = price * item.qty;
                  const imageUrl = getProductImageUrl(item);
                  const product = typeof item.produk === 'object' && item.produk ? item.produk : null;
                  const stock = item.variasi?.stok_variasi || product?.stok || 99;
                  
                  return (
                    <div key={item.id_cart} style={{ 
                      display: 'flex',
                      gap: '12px', 
                      padding: '16px', 
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      backgroundColor: item.status_pilih ? '#f0f8ff' : 'white'
                    }}>
                      
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={item.status_pilih === true || item.status_pilih === 'Y'}
                        onChange={() => handleToggleSelection(item.id_cart)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#55B4E5' }}
                      />

                      {/* Product Image */}
                      <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '6px', 
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img 
                          src={imageUrl} 
                          alt={product?.nama_produk || 'Nama Produk'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Product Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#333' }}>
                          {product?.nama_produk || 'Nama Produk'}
                        </h3>
                        {item.variasi?.nama_variasi && (
                          <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>
                            Variasi: {item.variasi.nama_variasi}
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#55B4E5' }}>
                              {formatCurrency(price)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6c757d' }}>
                              Stok: {stock}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              onClick={() => handleUpdateQuantity(item.id_cart, item.qty - 1)}
                              disabled={item.qty <= 1}
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                border: '1px solid #dee2e6', 
                                borderRadius: '5px', 
                                background: 'white', 
                                cursor: item.qty <= 1 ? 'not-allowed' : 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                opacity: item.qty <= 1 ? 0.5 : 1
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="number"
                              value={editingQuantities[item.id_cart] ?? item.qty}
                              onFocus={() => {
                                setEditingQuantities(prev => ({ ...prev, [item.id_cart]: String(item.qty) }));
                              }}
                              onChange={(e) => {
                                setEditingQuantities(prev => ({ ...prev, [item.id_cart]: e.target.value }));
                              }}
                              onBlur={() => {
                                const editedValue = editingQuantities[item.id_cart];
                                let newQuantity = parseInt(editedValue, 10);
                      
                                if (isNaN(newQuantity) || newQuantity < 1) {
                                  newQuantity = 1;
                                } else if (newQuantity > stock) {
                                  newQuantity = stock;
                                }
                      
                                // Clean up the editing state
                                setEditingQuantities(prev => {
                                  const next = { ...prev };
                                  delete next[item.id_cart];
                                  return next;
                                });
                                
                                // Only update if the quantity is different
                                if (newQuantity !== item.qty) {
                                  handleUpdateQuantity(item.id_cart, newQuantity);
                                }
                              }}
                              style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                width: '50px',
                                textAlign: 'center',
                                border: '1px solid #dee2e6',
                                borderRadius: '5px',
                                appearance: 'textfield',
                              }}
                            />
                            <button
                              onClick={() => handleUpdateQuantity(item.id_cart, item.qty + 1)}
                              disabled={item.qty >= stock}
                              style={{ 
                                width: '28px', 
                                height: '28px', 
                                border: '1px solid #dee2e6', 
                                borderRadius: '5px', 
                                background: 'white', 
                                cursor: item.qty >= stock ? 'not-allowed' : 'pointer',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                opacity: item.qty >= stock ? 0.5 : 1
                              }}
                            >
                              <Plus size={14} />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id_cart)}
                              style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                color: '#dc3545',
                                padding: '4px'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div style={{ 
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid #e9ecef',
                          textAlign: 'right'
                        }}>
                          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>
                            Subtotal: {formatCurrency(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Coupon Code Section */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Kode kupon (coba: discount10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ 
                      flex: 1, 
                      padding: '10px 12px', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '6px', 
                      fontSize: '12px' 
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{ 
                      padding: '10px 20px', 
                      backgroundColor: '#55B4E5', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      fontWeight: '600', 
                      fontSize: '12px' 
                    }}
                  >
                    Apply
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Section */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            padding: '20px', 
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '20px'
          }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#333', 
              borderBottom: '3px solid #55B4E5', 
              paddingBottom: '10px' 
            }}>
              Ringkasan Belanja
            </h2>

            {totals.selectedCount === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#6c757d' }}>
                <ShoppingCart size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '12px' }}>Pilih item untuk melanjutkan checkout</p>
              </div>
            ) : (
              <>
                {/* Price Summary */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>Subtotal ({totals.selectedCount} items)</span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>Pengiriman</span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(totals.shipping)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>Pajak (10%)</span>
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>{formatCurrency(totals.tax)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#6c757d' }}>Diskon</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#28a745' }}>-{formatCurrency(totals.discount)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '16px', 
                  padding: '12px 0', 
                  borderTop: '2px solid #e9ecef', 
                  borderBottom: '2px solid #e9ecef'
                }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#FBB338' }}>{formatCurrency(totals.total)}</span>
                </div>

                {/* Checkout Button */}
                <button 
                  onClick={() => router.push('/checkout')}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#55B4E5', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    marginBottom: '12px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4a9fcf'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#55B4E5'}
                >
                  Lanjut ke Pembayaran →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;