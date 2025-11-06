'use client';

import React, { useState } from 'react';
import { Check, X, Tag, ChevronRight, MapPin, Truck, Package } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

interface VoucherStore {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedShipping, setSelectedShipping] = useState<string>('');
  const [voucherStoreCode, setVoucherStoreCode] = useState<string>('');
  const [voucherJajaCode, setVoucherJajaCode] = useState<string>('');
  const [appliedStoreVoucher, setAppliedStoreVoucher] = useState<VoucherStore | null>(null);
  const [appliedJajaVoucher, setAppliedJajaVoucher] = useState<VoucherStore | null>(null);
  const [shippingAddress, setShippingAddress] = useState<string>('');

  // Mock data dari cart
  const cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Lorem ipsum dolor sit amet',
      color: 'Black',
      size: 'M',
      price: 899000,
      quantity: 1,
      image: '🪑'
    },
    {
      id: 2,
      name: 'Consectetur adipiscing elit',
      color: 'White',
      size: 'L',
      price: 649000,
      originalPrice: 799000,
      quantity: 2,
      image: '🧥'
    }
  ];

  const shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Standar', price: 50000, estimatedDays: '3-5 hari' },
    { id: 'express', name: 'Express', price: 100000, estimatedDays: '1-2 hari' },
    { id: 'free', name: 'Gratis', price: 0, estimatedDays: '5-7 hari' }
  ];

  const availableStoreVouchers: VoucherStore[] = [
    { code: 'TOKO10', discount: 10, type: 'percentage' },
    { code: 'DISKON20K', discount: 20000, type: 'fixed' }
  ];

  const availableJajaVouchers: VoucherStore[] = [
    { code: 'JAJA15', discount: 15, type: 'percentage' },
    { code: 'GRATIS25K', discount: 25000, type: 'fixed' }
  ];

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping);
  const shippingCost = selectedShippingMethod?.price || 0;

  const storeDiscount = appliedStoreVoucher
    ? appliedStoreVoucher.type === 'percentage'
      ? (subtotal * appliedStoreVoucher.discount) / 100
      : appliedStoreVoucher.discount
    : 0;

  const afterStoreDiscount = subtotal - storeDiscount;
  
  const jajaDiscount = appliedJajaVoucher
    ? appliedJajaVoucher.type === 'percentage'
      ? (afterStoreDiscount * appliedJajaVoucher.discount) / 100
      : appliedJajaVoucher.discount
    : 0;

  const tax = afterStoreDiscount * 0.1;
  const total = afterStoreDiscount - jajaDiscount + shippingCost + tax;

  // Handlers
  const handleApplyStoreVoucher = () => {
    const voucher = availableStoreVouchers.find(v => v.code === voucherStoreCode.toUpperCase());
    if (voucher) {
      setAppliedStoreVoucher(voucher);
      setVoucherStoreCode('');
    } else {
      alert('Kode voucher toko tidak valid');
    }
  };

  const handleApplyJajaVoucher = () => {
    const voucher = availableJajaVouchers.find(v => v.code === voucherJajaCode.toUpperCase());
    if (voucher) {
      setAppliedJajaVoucher(voucher);
      setVoucherJajaCode('');
    } else {
      alert('Kode voucher jaja tidak valid');
    }
  };

  const handleSelectShipping = (methodId: string) => {
    setSelectedShipping(methodId);
  };

  const handleSubmitCheckout = () => {
    if (!shippingAddress) {
      alert('Mohon isi alamat pengiriman');
      return;
    }
    if (!selectedShipping) {
      alert('Mohon pilih metode pengiriman');
      return;
    }
    setStep(2);
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {step === 2 ? (
          // Success State
          <div style={{ 
            height: 'calc(100vh - 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '10px', 
              padding: '40px 60px', 
              textAlign: 'center', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              width: '100%'
            }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                backgroundColor: '#55B4E5', 
                margin: '0 auto 20px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Check size={40} style={{ color: 'white' }} />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '10px', color: '#333' }}>Pesanan Berhasil!</h2>
              <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '24px' }}>Terima kasih telah berbelanja di jaja.id</p>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                padding: '20px', 
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <p style={{ fontSize: '10px', color: '#6c757d', marginBottom: '4px' }}>Nomor Pesanan</p>
                  <p style={{ fontSize: '18px', fontWeight: '700', color: '#FBB338' }}>
                    #JAJA-{Math.floor(Math.random() * 100000)}
                  </p>
                </div>
                <div style={{ height: '1px', backgroundColor: '#dee2e6' }}></div>
                <div>
                  <p style={{ fontSize: '10px', color: '#6c757d', marginBottom: '4px' }}>Total Pembayaran</p>
                  <p style={{ fontSize: '22px', fontWeight: '700', color: '#55B4E5' }}>
                    {formatCurrency(total)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  backgroundColor: '#55B4E5', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '13px', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 400px', 
            gap: '16px',
            alignItems: 'stretch'
          }}>
            
            {/* Column 1 - Items & Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              
              {/* Order Items - Compact */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                padding: '18px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px', 
                  paddingBottom: '10px',
                  borderBottom: '2px solid #55B4E5'
                }}>
                  <Package size={18} style={{ color: '#55B4E5' }} />
                  <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>
                    Item Pesanan ({cartItems.length})
                  </h2>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px'
                }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      padding: '10px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '6px',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        width: '45px', 
                        height: '45px', 
                        backgroundColor: 'white', 
                        borderRadius: '5px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '22px',
                        flexShrink: 0
                      }}>
                        {item.image}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          fontSize: '11px', 
                          fontWeight: '500', 
                          marginBottom: '2px', 
                          color: '#333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </h3>
                        <div style={{ fontSize: '9px', color: '#6c757d' }}>
                          {item.color} • {item.size} • Qty: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#55B4E5', flexShrink: 0 }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address - Compact */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                padding: '18px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #55B4E5'
                }}>
                  <MapPin size={18} style={{ color: '#55B4E5' }} />
                  <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Alamat Pengiriman</h2>
                </div>
                <textarea
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #dee2e6', 
                    borderRadius: '6px', 
                    fontSize: '11px',
                    resize: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    flex: 1,
                    minHeight: '120px'
                  }}
                  placeholder="Masukkan alamat lengkap pengiriman..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Column 2 - Shipping & Vouchers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              
              {/* Shipping Method - Horizontal */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                padding: '18px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #55B4E5'
                }}>
                  <Truck size={18} style={{ color: '#55B4E5' }} />
                  <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Metode Pengiriman</h2>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {shippingMethods.map(method => (
                    <label 
                      key={method.id}
                      style={{ 
                        flex: 1,
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px', 
                        padding: '12px 8px',
                        border: selectedShipping === method.id ? '2px solid #55B4E5' : '1px solid #dee2e6',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: selectedShipping === method.id ? '#f0f9ff' : 'transparent',
                        textAlign: 'center'
                      }}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={selectedShipping === method.id}
                        onChange={() => handleSelectShipping(method.id)}
                        style={{ accentColor: '#55B4E5', width: '14px', height: '14px' }}
                      />
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>{method.name}</div>
                      <div style={{ fontSize: '9px', color: '#6c757d' }}>{method.estimatedDays}</div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#55B4E5' }}>
                        {formatCurrency(method.price)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vouchers - Compact */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '10px', 
                padding: '18px', 
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginBottom: '12px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid #FBB338'
                }}>
                  <Tag size={18} style={{ color: '#FBB338' }} />
                  <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Voucher & Promo</h2>
                </div>
                
                {/* Store Voucher */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '9px', fontWeight: '600', marginBottom: '6px', color: '#6c757d' }}>
                    VOUCHER TOKO
                  </label>
                  {appliedStoreVoucher ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px', 
                      backgroundColor: '#55B4E5', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                        <Check size={14} />
                        <span style={{ fontSize: '11px', fontWeight: '600' }}>{appliedStoreVoucher.code}</span>
                      </div>
                      <button
                        onClick={() => setAppliedStoreVoucher(null)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Kode voucher"
                        value={voucherStoreCode}
                        onChange={(e) => setVoucherStoreCode(e.target.value.toUpperCase())}
                        style={{ 
                          flex: 1, 
                          padding: '8px 10px', 
                          border: '1px solid #dee2e6', 
                          borderRadius: '6px', 
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      />
                      <button
                        onClick={handleApplyStoreVoucher}
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: '#55B4E5', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontWeight: '600', 
                          fontSize: '11px',
                          flexShrink: 0
                        }}
                      >
                        Pakai
                      </button>
                    </div>
                  )}
                </div>

                {/* Jaja Voucher */}
                <div>
                  <label style={{ display: 'block', fontSize: '9px', fontWeight: '600', marginBottom: '6px', color: '#6c757d' }}>
                    VOUCHER JAJA
                  </label>
                  {appliedJajaVoucher ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px', 
                      backgroundColor: '#FBB338', 
                      borderRadius: '6px' 
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                        <Check size={14} />
                        <span style={{ fontSize: '11px', fontWeight: '600' }}>{appliedJajaVoucher.code}</span>
                      </div>
                      <button
                        onClick={() => setAppliedJajaVoucher(null)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'white', 
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        placeholder="Kode voucher"
                        value={voucherJajaCode}
                        onChange={(e) => setVoucherJajaCode(e.target.value.toUpperCase())}
                        style={{ 
                          flex: 1, 
                          padding: '8px 10px', 
                          border: '1px solid #dee2e6', 
                          borderRadius: '6px', 
                          fontSize: '11px',
                          fontFamily: 'Poppins, sans-serif'
                        }}
                      />
                      <button
                        onClick={handleApplyJajaVoucher}
                        style={{ 
                          padding: '8px 16px', 
                          backgroundColor: '#FBB338', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '6px', 
                          cursor: 'pointer', 
                          fontWeight: '600', 
                          fontSize: '11px',
                          flexShrink: 0
                        }}
                      >
                        Pakai
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3 - Order Summary */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '10px', 
              padding: '20px', 
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h2 style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                marginBottom: '16px', 
                color: '#333', 
                borderBottom: '3px solid #55B4E5', 
                paddingBottom: '10px' 
              }}>
                Ringkasan Pesanan
              </h2>

              {/* Price Breakdown - Compact */}
              <div style={{ 
                marginBottom: '14px', 
                padding: '12px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6c757d' }}>Subtotal ({cartItems.length} item)</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>{formatCurrency(subtotal)}</span>
                </div>
                
                {appliedStoreVoucher && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#6c757d' }}>Diskon Toko</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#55B4E5' }}>-{formatCurrency(storeDiscount)}</span>
                  </div>
                )}
                
                {appliedJajaVoucher && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#6c757d' }}>Diskon Jaja</span>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#FBB338' }}>-{formatCurrency(jajaDiscount)}</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6c757d' }}>Ongkir</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>{formatCurrency(shippingCost)}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6c757d' }}>Pajak (10%)</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#333' }}>{formatCurrency(tax)}</span>
                </div>
              </div>

              {/* Total */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px', 
                padding: '14px 0', 
                borderTop: '2px solid #e9ecef', 
                borderBottom: '2px solid #e9ecef'
              }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#FBB338' }}>{formatCurrency(total)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleSubmitCheckout}
                style={{ 
                  width: '100%', 
                  padding: '13px', 
                  backgroundColor: '#55B4E5', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontWeight: '600', 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}
              >
                Bayar Sekarang
                <ChevronRight size={16} />
              </button>

              {/* Payment Methods */}
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e9ecef' }}>
                <div style={{ fontSize: '9px', color: '#6c757d', marginBottom: '8px', textAlign: 'center', fontWeight: '600' }}>
                  METODE PEMBAYARAN
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <div style={{ padding: '5px 7px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '9px', color: '#6c757d', fontWeight: '500' }}>💳 Card</div>
                  <div style={{ padding: '5px 7px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '9px', color: '#6c757d', fontWeight: '500' }}>GoPay</div>
                  <div style={{ padding: '5px 7px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '9px', color: '#6c757d', fontWeight: '500' }}>OVO</div>
                  <div style={{ padding: '5px 7px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '9px', color: '#6c757d', fontWeight: '500' }}>Dana</div>
                  <div style={{ padding: '5px 7px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '9px', color: '#6c757d', fontWeight: '500' }}>ShopePay</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;