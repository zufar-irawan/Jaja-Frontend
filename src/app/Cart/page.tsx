'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  selected: boolean;
}

const ShoppingCartApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: 'Lorem ipsum dolor sit amet',
      color: 'Black',
      size: 'M',
      price: 899000,
      quantity: 1,
      image: '🪑',
      selected: false
    },
    {
      id: 2,
      name: 'Consectetur adipiscing elit',
      color: 'White',
      size: 'L',
      price: 649000,
      originalPrice: 799000,
      quantity: 2,
      image: '🧥',
      selected: false
    },
    {
      id: 3,
      name: 'Sed do eiusmod tempor',
      color: 'Blue',
      size: 'S',
      price: 499000,
      quantity: 1,
      image: '👕',
      selected: false
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express' | 'free'>('standard');
  const [discount, setDiscount] = useState(0);

  const toggleItemSelection = (id: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'discount10') {
      setDiscount(100000);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Shipping cost hanya berlaku jika ada item yang dipilih
  const shippingCost = selectedItems.length > 0 
    ? (deliveryType === 'standard' ? 50000 : deliveryType === 'express' ? 100000 : 0)
    : 0;

  const tax = selectedItems.length > 0 ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost + tax - discount;

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '16px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Cart Items Section - Lebar */}
          <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
              Shopping Cart
            </h2>
            
            {/* Table Header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '40px 1.5fr 100px 120px 100px 40px', 
              gap: '12px', 
              padding: '10px 0', 
              borderBottom: '2px solid #e9ecef', 
              fontWeight: '600', 
              color: '#6c757d', 
              fontSize: '11px',
              alignItems: 'center'
            }}>
              <div></div>
              <div>PRODUCT</div>
              <div style={{ textAlign: 'center' }}>PRICE</div>
              <div style={{ textAlign: 'center' }}>QUANTITY</div>
              <div style={{ textAlign: 'center' }}>TOTAL</div>
              <div></div>
            </div>

            {/* Cart Items */}
            {cartItems.map(item => (
              <div key={item.id} style={{ 
                display: 'grid', 
                gridTemplateColumns: '40px 1.5fr 100px 120px 100px 40px', 
                gap: '12px', 
                padding: '16px 0', 
                borderBottom: '1px solid #e9ecef', 
                alignItems: 'center'
              }}>
                
                {/* Checkbox */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItemSelection(item.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#55B4E5' }}
                  />
                </div>

                {/* Product Info */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '28px',
                    flexShrink: 0
                  }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ 
                      fontSize: '13px', 
                      fontWeight: '500', 
                      marginBottom: '4px', 
                      color: '#333', 
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </h3>
                    <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '6px' }}>
                      Color: {item.color} | Size: {item.size}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ 
                        fontSize: '10px', 
                        color: '#6c757d', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '3px',
                        padding: 0
                      }}
                    >
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                    Rp {item.price.toLocaleString('id-ID')}
                  </div>
                  {item.originalPrice && (
                    <div style={{ fontSize: '10px', color: '#6c757d', textDecoration: 'line-through' }}>
                      Rp {item.originalPrice.toLocaleString('id-ID')}
                    </div>
                  )}
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '5px', 
                      background: 'white', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#6c757d',
                      fontSize: '12px'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: '500', minWidth: '25px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      border: '1px solid #dee2e6', 
                      borderRadius: '5px', 
                      background: 'white', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#6c757d',
                      fontSize: '12px'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total - Simplified */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#333' }}>
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Delete Button */}
                <div style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: '#dc3545',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Coupon Code Section */}
            <div style={{ 
              marginTop: 'auto', 
              paddingTop: '20px', 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Kode kupon"
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
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{ 
                    padding: '10px 16px', 
                    backgroundColor: 'white', 
                    color: '#55B4E5', 
                    border: '2px solid #55B4E5', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}
                >
                  <ShoppingCart size={14} /> Update
                </button>
                <button
                  onClick={clearCart}
                  style={{ 
                    padding: '10px 16px', 
                    backgroundColor: 'white', 
                    color: '#dc3545', 
                    border: '2px solid #dc3545', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: '600', 
                    fontSize: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}
                >
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '10px', 
            padding: '20px', 
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)', 
            display: 'flex', 
            flexDirection: 'column' 
          }}>
            <h2 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              marginBottom: '16px', 
              color: '#333', 
              borderBottom: '3px solid #55B4E5', 
              paddingBottom: '10px' 
            }}>
              Order Summary
            </h2>

            {selectedItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#6c757d' }}>
                <ShoppingCart size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ fontSize: '12px' }}>Pilih item untuk melanjutkan checkout</p>
              </div>
            ) : (
              <>
                {/* Selected Items */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '10px' }}>Item Terpilih ({selectedItems.length})</div>
                  {selectedItems.map(item => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px', 
                      padding: '8px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                        <div style={{ fontSize: '16px' }}>{item.image}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>{item.name}</div>
                          <div style={{ fontSize: '10px', color: '#6c757d' }}>Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#333', alignSelf: 'center' }}>
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: '1', minWidth: '100px' }}>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Subtotal</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>Rp {subtotal.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ flex: '1', minWidth: '100px' }}>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Pengiriman</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>Rp {shippingCost.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ flex: '1', minWidth: '100px' }}>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Pajak (10%)</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>Rp {tax.toLocaleString('id-ID')}</div>
                    </div>
                    <div style={{ flex: '1', minWidth: '100px' }}>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '3px' }}>Diskon</div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#28a745' }}>-Rp {discount.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                </div>

                {/* Shipping Options */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '8px' }}>Pilih Metode Pengiriman</div>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'standard'}
                      onChange={() => setDeliveryType('standard')}
                      style={{ accentColor: '#55B4E5', width: '14px', height: '14px' }}
                    />
                    <span style={{ color: '#333' }}>Pengiriman Standar - Rp 50.000</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'express'}
                      onChange={() => setDeliveryType('express')}
                      style={{ accentColor: '#55B4E5', width: '14px', height: '14px' }}
                    />
                    <span style={{ color: '#333' }}>Pengiriman Express - Rp 100.000</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryType === 'free'}
                      onChange={() => setDeliveryType('free')}
                      style={{ accentColor: '#55B4E5', width: '14px', height: '14px' }}
                    />
                    <span style={{ color: '#333' }}>Gratis Ongkir (Pesanan di atas Rp 3jt)</span>
                  </label>
                </div>
              </>
            )}

            {/* Total */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '16px', 
              padding: '12px 0', 
              borderTop: '2px solid #e9ecef', 
              borderBottom: '2px solid #e9ecef', 
              marginTop: 'auto' 
            }}>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>Total</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#FBB338' }}>Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {/* Checkout Button */}
            <button 
              disabled={selectedItems.length === 0}
              style={{ 
                width: '100%', 
                padding: '12px', 
                backgroundColor: selectedItems.length === 0 ? '#dee2e6' : '#55B4E5', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: selectedItems.length === 0 ? 'not-allowed' : 'pointer', 
                fontWeight: '600', 
                fontSize: '14px', 
                marginBottom: '12px', 
                transition: 'all 0.3s',
                opacity: selectedItems.length === 0 ? 0.6 : 1
              }}
            >
              Lanjut ke Pembayaran →
            </button>

            {/* Continue Shopping */}
            <button style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: 'transparent', 
              color: '#55B4E5', 
              border: 'none', 
              cursor: 'pointer', 
              fontSize: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px' 
            }}>
              <ArrowLeft size={14} /> Lanjutkan Belanja
            </button>

            {/* Payment Methods */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
              <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '8px', textAlign: 'center' }}>Metode Pembayaran</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '6px 8px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '10px', color: '#6c757d' }}>💳</div>
                <div style={{ padding: '6px 8px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '10px', color: '#6c757d' }}>GoPay</div>
                <div style={{ padding: '6px 8px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '10px', color: '#6c757d' }}>OVO</div>
                <div style={{ padding: '6px 8px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '10px', color: '#6c757d' }}>Dana</div>
                <div style={{ padding: '6px 8px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '10px', color: '#6c757d' }}>ShopeePay</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartApp;