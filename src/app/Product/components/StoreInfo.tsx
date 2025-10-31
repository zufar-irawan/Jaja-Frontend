import React from 'react';
import { MapPin, Star, Store } from 'lucide-react';

interface StoreInfoProps {
  storeInfo: {
    image: string;
    name: string;
    location: string;
    rating: number;
    totalReviews: number;
    responseRate: string;
    responseTime: string;
    products: number;
  };
}

export default function StoreInfo({ storeInfo }: StoreInfoProps) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      padding: '32px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      marginBottom: '32px',
      border: '1px solid rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <img 
          src={storeInfo.image}
          alt={storeInfo.name}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px',
            marginTop: 0,
            letterSpacing: '-0.3px'
          }}>
            {storeInfo.name}
          </h3>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#7f8c8d',
            marginBottom: '4px'
          }}>
            <MapPin size={14} />
            <span>{storeInfo.location}</span>
          </div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '14px'
          }}>
            <Star size={14} fill="#FBB338" stroke="#FBB338" />
            <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{storeInfo.rating}</span>
            <span style={{ color: '#7f8c8d' }}>({storeInfo.totalReviews.toLocaleString()})</span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Tingkat Respon</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{storeInfo.responseRate}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Waktu Respon</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{storeInfo.responseTime}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Total Produk</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>{storeInfo.products}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '4px' }}>Bergabung</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>3 tahun lalu</div>
        </div>
      </div>

      <button style={{
        width: '200px',
        background: 'linear-gradient(135deg, #55B4E5 0%, #3b9ed9 100%)',
        border: 'none',
        color: 'white',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 16px rgba(85, 180, 229, 0.3)'
      }}>
        <Store size={18} />
        Kunjungi Toko
      </button>
    </div>
  );
}