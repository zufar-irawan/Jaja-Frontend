'use client';

import React, { useState } from 'react';
import ProductImages from '../components/ProductImages';
import ProductInfo from '../components/ProductInfo';
import StoreInfo from '../components/StoreInfo';
import ProductTabs from '../components/ProductTabs';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';

interface Variant {
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
}

interface StoreInfoType {
  name: string;
  location: string;
  rating: number;
  totalReviews: number;
  responseRate: string;
  responseTime: string;
  products: number;
  image: string;
}

interface ProductSpecs {
  [key: string]: string;
}

interface Feature {
  title: string;
  description: string;
}

interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
  likes: number;
  images: string[];
}

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

interface RatingStats {
  average: number;
  total: number;
  breakdown: RatingBreakdown[];
}

interface RelatedProduct {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  rating: number;
  price: string;
  originalPrice: string;
}

export default function ProductPage() {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [selectedVariant, setSelectedVariant] = useState<string>('16GB/512GB');

  // Data
  const images: string[] = [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=500&h=500&fit=crop'
  ];

  const variants: Variant[] = [
    { name: '8GB/256GB', price: 8500000, originalPrice: 10000000, stock: 15 },
    { name: '16GB/512GB', price: 10977900, originalPrice: 13999000, stock: 10 },
    { name: '16GB/1TB', price: 12500000, originalPrice: 15999000, stock: 5 }
  ];

  const categories: string[] = ['Elektronik', 'Komputer & Laptop', 'Laptop', 'Laptop Consumer'];

  const storeInfo: StoreInfoType = {
    name: 'Lenovo Official Store',
    location: 'Jakarta Pusat',
    rating: 4.8,
    totalReviews: 15420,
    responseRate: '98%',
    responseTime: '< 1 jam',
    products: 245,
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop'
  };

  const productSpecs: ProductSpecs = {
    processor: 'Intel Core i7-1355U (up to 5.0 GHz)',
    ram: '16GB DDR4',
    storage: '512GB SSD NVMe',
    display: '14" FHD (1920x1080) IPS, Anti-glare',
    graphics: 'Intel Iris Xe Graphics',
    battery: '56Wh, up to 10 hours',
    weight: '1.46 kg',
    os: 'Windows 11 Home',
    ports: '2x USB-C, 2x USB-A, HDMI, Audio Jack',
    connectivity: 'WiFi 6, Bluetooth 5.1',
    camera: 'HD 720p with Privacy Shutter',
    audio: 'Dolby Audio, Dual Speakers'
  };

  const features: Feature[] = [
    {
      title: 'Performa Tinggi',
      description: 'Dilengkapi processor Intel Core i7 generasi terbaru yang memberikan performa maksimal untuk multitasking dan aplikasi berat.'
    },
    {
      title: 'Desain Premium',
      description: 'Body aluminum yang kokoh dengan desain slim dan elegant, mudah dibawa kemana-mana.'
    },
    {
      title: 'Layar Jernih',
      description: 'Layar IPS FHD dengan teknologi anti-glare memberikan pengalaman visual yang nyaman di berbagai kondisi pencahayaan.'
    },
    {
      title: 'Baterai Tahan Lama',
      description: 'Baterai berkapasitas besar yang dapat bertahan hingga 10 jam untuk produktivitas sepanjang hari.'
    }
  ];

  const reviews: Review[] = [
    {
      name: 'Budi Santoso',
      date: '15 Okt, 2025',
      rating: 5,
      comment: 'Laptop sangat bagus, performa cepat dan desain elegan. Sangat puas dengan pembelian ini.',
      likes: 156,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=150&fit=crop'
      ]
    },
    {
      name: 'Siti Aminah',
      date: '20 Okt, 2025',
      rating: 4,
      comment: 'Kualitas build bagus, layar jernih. Hanya baterai agak kurang tahan lama untuk pemakaian berat.',
      likes: 89,
      images: []
    },
    {
      name: 'Ahmad Rizki',
      date: '22 Okt, 2025',
      rating: 5,
      comment: 'Pengiriman cepat, packing rapi. Laptop sesuai deskripsi, recommended seller!',
      likes: 124,
      images: [
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=150&h=150&fit=crop'
      ]
    }
  ];

  const ratingStats: RatingStats = {
    average: 4.5,
    total: 892,
    breakdown: [
      { stars: 5, count: 650, percentage: 73 },
      { stars: 4, count: 178, percentage: 20 },
      { stars: 3, count: 45, percentage: 5 },
      { stars: 2, count: 13, percentage: 1 },
      { stars: 1, count: 6, percentage: 1 }
    ]
  };

  const relatedProducts: RelatedProduct[] = [
    {
      id: 1,
      name: 'Lenovo ThinkPad X1 Carbon',
      subtitle: 'Business Laptop Ultrabook',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      rating: 4.8,
      price: 'Rp 18.999.000',
      originalPrice: 'Rp 22.999.000'
    },
    {
      id: 2,
      name: 'Lenovo Yoga 9i',
      subtitle: '2-in-1 Convertible Laptop',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      rating: 4.6,
      price: 'Rp 15.499.000',
      originalPrice: 'Rp 18.999.000'
    },
    {
      id: 3,
      name: 'Lenovo Legion 5 Pro',
      subtitle: 'Gaming Laptop RTX 4060',
      image: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=300&h=300&fit=crop',
      rating: 4.9,
      price: 'Rp 21.999.000',
      originalPrice: 'Rp 25.999.000'
    },
    {
      id: 4,
      name: 'Lenovo IdeaPad 5',
      subtitle: 'Student Laptop Thin & Light',
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop',
      rating: 4.4,
      price: 'Rp 9.999.000',
      originalPrice: 'Rp 12.999.000'
    }
  ];

  const currentVariant = variants.find(v => v.name === selectedVariant);
  const discount = Math.round(((currentVariant!.originalPrice - currentVariant!.price) / currentVariant!.originalPrice) * 100);

  return (
    <div style={{ 
      fontFamily: "'Poppins', sans-serif", 
      backgroundColor: '#f8f9fa', 
      minHeight: '100vh', 
      padding: '32px' 
    }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Breadcrumb */}
        <div style={{ 
          marginBottom: '24px',
          fontSize: '14px',
          color: '#7f8c8d',
          fontFamily: "'Poppins', sans-serif"
        }}>
          {categories.map((cat, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ margin: '0 8px' }}>›</span>}
              <span style={{ 
                color: idx === categories.length - 1 ? '#55B4E5' : '#7f8c8d',
                fontWeight: idx === categories.length - 1 ? '600' : '400',
                fontFamily: "'Poppins', sans-serif"
              }}>{cat}</span>
            </span>
          ))}
        </div>

        {/* Product Section */}
        <div style={{ 
          display: 'flex', 
          gap: '32px', 
          marginBottom: '32px',
          alignItems: 'flex-start'
        }}>
          {/* Product Images */}
          <div style={{ 
            flex: '1',
            minWidth: 0
          }}>
            <ProductImages 
              images={images}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              discount={discount}
            />
          </div>

          {/* Product Info */}
          <div style={{ 
            flex: '1',
            minWidth: 0
          }}>
            <ProductInfo 
              variants={variants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              quantity={quantity}
              setQuantity={setQuantity}
              ratingStats={ratingStats}
            />
          </div>
        </div>

        {/* Store Info */}
        <StoreInfo storeInfo={storeInfo} />

        {/* Product Tabs */}
        <ProductTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          features={features}
          productSpecs={productSpecs}
          ratingStats={ratingStats}
          reviews={reviews}
        />

         {/* Related Products */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0,
              fontFamily: "'Poppins', sans-serif"
            }}>
              Produk <span style={{ 
                color: '#6b7280', 
                fontWeight: '400',
                fontFamily: "'Poppins', sans-serif"
              }}>Terkait</span>
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <ChevronLeft size={20} />
              </button>
              <button style={{
                backgroundColor: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {relatedProducts.map(product => (
              <div key={product.id} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '20px',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {/* Love Icon Only */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 1
                }}>
                  <button style={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    <Heart size={16} />
                  </button>
                </div>

                {/* Image */}
                <img 
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '16px'
                  }}
                />

                {/* Info */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '4px',
                  marginTop: 0,
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '12px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {product.subtitle}
                </p>

                {/* Rating & Price */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {product.rating}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1a1a1a',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {product.price}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {product.originalPrice}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}