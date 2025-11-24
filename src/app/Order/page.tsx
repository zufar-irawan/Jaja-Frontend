'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Package,
  User,
  Clock,
  FileText,
  MoreVertical
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetail {
  orderNumber: string;
  orderDate: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  payment: {
    method: string;
    total: number;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    voucher: number;
    ongkir: number;
    biayaLayanan: number;
    pajak: number;
    potonganJajaId: number;
    kasJajaId: number;
  };
  timeline: {
    orderTime: string;
    paymentTime: string;
    shippingTime: string;
    completionTime: string;
  };
  status: string;
}

const OrderCheckout: React.FC = () => {
  const [orderData] = useState<OrderDetail>({
    orderNumber: 'JJD-9808-2025111121101',
    orderDate: '11-11-2025 08:39',
    customer: {
      name: 'maddie',
      phone: '085819141800',
      address:
        'Jl masjid al amar no 12, Kel. Lubang Buaya, Kec. Cipayung, Kota Jakarta Timur, Prov. DKI Jakarta 010101'
    },
    payment: {
      method: 'General Trading - Eureka',
      total: 11278900
    },
    items: [
      {
        id: '1',
        name: 'Notebook Lenovo Slim 5',
        image: '/api/placeholder/80/80',
        price: 10977900,
        quantity: 1,
        subtotal: 10977900
      }
    ],
    pricing: {
      subtotal: 10977900,
      voucher: 0,
      ongkir: 0,
      biayaLayanan: 5000,
      pajak: 0,
      potonganJajaId: 0,
      kasJajaId: 0
    },
    timeline: {
      orderTime: '11-11-2025 08:39',
      paymentTime: 'Data belum tersedia',
      shippingTime: 'Data belum tersedia',
      completionTime: 'Data belum tersedia'
    },
    status: 'SALIN'
  });

  const formatCurrency = (amount: number): string => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Payment Deadline Banner */}
      <div className="bg-linear-to-r from-orange-400 to-yellow-400">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center gap-3">
            <span className="text-white font-semibold text-base">
              Batas Pembayaran
            </span>
            <div className="flex items-center gap-2">
              {['23h', '20m', '58s'].map((time, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg px-2.5 py-1.5 min-w-[50px] text-center"
                >
                  <span className="text-xl font-bold text-gray-800">
                    {time.replace(/\D/g, '')}
                  </span>
                  <span className="text-xs text-gray-600 block">
                    {time.replace(/\d/g, '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Order Management
                </h1>
                <p className="text-xs text-gray-500">
                  Detail Pesanan #{orderData.orderNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Order Status
                </p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {orderData.status}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Total Items
                </p>
                <p className="text-lg font-bold text-gray-800 mt-1">
                  {orderData.items.length} Produk
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Order Date
                </p>
                <p className="text-sm font-bold text-gray-800 mt-1">
                  {orderData.orderDate}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User size={20} />
                  Customer Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                    Name
                  </label>
                  <p className="text-sm font-medium text-gray-800">
                    {orderData.customer.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                    Phone
                  </label>
                  <p className="text-sm font-medium text-gray-800">
                    {orderData.customer.phone}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                    Shipping Address
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {orderData.customer.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Package size={20} />
                  Pilih Jasa Pengiriman
                </h2>
              </div>
              <div className="p-6">
                <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-gray-800 bg-white cursor-pointer">
                  <option value="jne">JNE Regular - Rp15.000 (2-3 hari)</option>
                  <option value="jnt">J&T Express - Rp12.000 (2-4 hari)</option>
                  <option value="sicepat">SiCepat REG - Rp10.000 (3-5 hari)</option>
                  <option value="grab">Grab Express - Rp25.000 (same day)</option>
                </select>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-600 uppercase pb-3">Product</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">Price</th>
                      <th className="text-center text-xs font-semibold text-gray-600 uppercase pb-3">Qty</th>
                      <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                              <Package className="text-gray-400" size={20} />
                            </div>
                            <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                          </div>
                        </td>
                        <td className="text-right text-sm text-gray-600">{formatCurrency(item.price)}</td>
                        <td className="text-center text-sm text-gray-600">{item.quantity}</td>
                        <td className="text-right text-sm font-semibold text-gray-800">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                    placeholder="Add notes for this order..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (1 Produk)</span>
                  <span className="font-medium text-gray-800">{formatCurrency(orderData.pricing.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Voucher Toko</span>
                  <span className="font-medium text-red-600">-Rp0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-medium text-gray-800">Rp0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Biaya Layanan</span>
                  <span className="font-medium text-gray-800">
                    Rp{orderData.pricing.biayaLayanan.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak (0%)</span>
                  <span className="font-medium text-gray-800">Rp0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Potongan Jaja.id</span>
                  <span className="font-medium text-gray-800">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kas Jaja.id</span>
                  <span className="font-medium text-gray-800">0</span>
                </div>
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(orderData.payment.total)}</span>
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Pilih Metode Pembayaran
                  </button>
                  <button className="w-full py-3 bg-white border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors">
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Timeline</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Waktu Pemesanan</p>
                    <p className="text-xs text-gray-500 mt-0.5">{orderData.timeline.orderTime}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Waktu Pembayaran</p>
                    <p className="text-xs text-gray-400 mt-0.5">{orderData.timeline.paymentTime}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Waktu Pengiriman</p>
                    <p className="text-xs text-gray-400 mt-0.5">{orderData.timeline.shippingTime}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Waktu Pesanan Selesai</p>
                    <p className="text-xs text-gray-400 mt-0.5">{orderData.timeline.completionTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
