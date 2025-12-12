'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'

interface Feature {
  title: string
  description: string
}

interface RatingBreakdown {
  stars: number
  count: number
  percentage: number
}

interface RatingStats {
  total: number
  average: number
  breakdown: RatingBreakdown[]
}

interface Review {
  name: string
  date: string
  rating: number
  comment: string
  likes: number
  images?: string[]
}

interface ProductTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  features: Feature[]
  productSpecs: Record<string, string>
  ratingStats: RatingStats
  reviews: Review[]
  description: string
}

export default function ProductTabs({
  activeTab: initialActiveTab,
  setActiveTab: externalSetActiveTab,
  features,
  productSpecs,
  ratingStats,
  reviews,
  description
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    externalSetActiveTab(tab)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      border: '1px solid rgba(0,0,0,0.04)',
      marginBottom: '32px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      {/* Tabs Header */}
      <div style={{
        display: 'flex',
        gap: '24px',
        borderBottom: '2px solid #f3f4f6',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => handleTabChange('description')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '14px 0',
            fontSize: '15px',
            fontWeight: '600',
            color: activeTab === 'description' ? '#55B4E5' : '#6b7280',
            cursor: 'pointer',
            borderBottom: activeTab === 'description' ? '3px solid #55B4E5' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Deskripsi Produk
        </button>
        <button
          onClick={() => handleTabChange('reviews')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '14px 0',
            fontSize: '15px',
            fontWeight: '600',
            color: activeTab === 'reviews' ? '#55B4E5' : '#6b7280',
            cursor: 'pointer',
            borderBottom: activeTab === 'reviews' ? '3px solid #55B4E5' : '3px solid transparent',
            marginBottom: '-2px',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Ulasan ({ratingStats.total})
        </button>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '20px',
            marginTop: 0,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.3px'
          }}>
            Spesifikasi Lengkap
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0',
            marginBottom: '32px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '16px'
          }}>
            {Object.entries(productSpecs).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                padding: '14px 16px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  width: '180px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {key}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  flex: 1,
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '16px',
            marginTop: 0,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.3px'
          }}>
            Tentang Produk
          </h3>

          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.8',
            marginBottom: '24px',
            whiteSpace: 'pre-line',
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            {description}
          </p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          {/* Rating Summary */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h4 style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '12px',
                marginTop: 0,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontFamily: "'Poppins', sans-serif"
              }}>Rating Rata-rata</h4>
              <div style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1',
                letterSpacing: '-2px',
                fontFamily: "'Poppins', sans-serif"
              }}>
                {ratingStats.average}<span style={{ fontSize: '24px', color: '#6b7280', fontWeight: '500' }}>/5</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '12px',
                marginBottom: '12px'
              }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={20}
                    fill={i <= Math.floor(ratingStats.average) ? "#FBB338" : "none"}
                    stroke="#FBB338"
                  />
                ))}
              </div>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '500'
              }}>
                Dari {ratingStats.total} ulasan
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              {ratingStats.breakdown.map((item) => (
                <div key={item.stars} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#374151',
                    width: '65px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '500'
                  }}>{item.stars} bintang</span>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #FBB338 0%, #f59e0b 100%)',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    width: '35px',
                    textAlign: 'right',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '600'
                  }}>{item.count}</span>
                </div>
              ))}
            </div>

            <button style={{
              width: '100%',
              background: 'linear-gradient(135deg, #55B4E5 0%, #3b9ed9 100%)',
              border: 'none',
              color: 'white',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: '0 4px 12px rgba(85, 180, 229, 0.3)'
            }}>
              Tulis Ulasan
            </button>
          </div>

          {/* Individual Reviews */}
          <div>
            <div style={{ marginBottom: '20px' }}>
              <select style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                backgroundColor: 'white',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                transition: 'all 0.2s ease'
              }}>
                <option>Terbaru</option>
                <option>Rating Tertinggi</option>
                <option>Rating Terendah</option>
                <option>Paling Membantu</option>
              </select>
            </div>

            {reviews.map((review, idx) => (
              <div key={idx} style={{
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: idx < reviews.length - 1 ? '2px solid #f3f4f6' : 'none',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #55B4E5 0%, #3b9ed9 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 2px 8px rgba(85, 180, 229, 0.3)'
                  }}>
                    {review.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: '#1a1a1a', 
                      fontSize: '15px',
                      fontFamily: "'Poppins', sans-serif"
                    }}>{review.name}</div>
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      fontFamily: "'Poppins', sans-serif"
                    }}>{review.date}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '3px',
                  marginBottom: '12px'
                }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={16}
                      fill={i <= review.rating ? "#FBB338" : "none"}
                      stroke="#FBB338"
                    />
                  ))}
                </div>

                <p style={{
                  color: '#374151',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  marginBottom: '12px',
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {review.comment}
                </p>

                {review.images && review.images.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    {review.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`Review ${imgIdx + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '2px solid #e5e7eb',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                )}

                <button style={{
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  color: '#6b7280',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.2s ease'
                }}>
                  👍 Membantu ({review.likes})
                </button>
              </div>
            ))}

            {reviews.length > 3 && (
              <button style={{
                width: '100%',
                backgroundColor: 'white',
                border: '2px solid #55B4E5',
                color: '#55B4E5',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '16px',
                transition: 'all 0.2s ease',
                fontFamily: "'Poppins', sans-serif"
              }}>
                Muat Lebih Banyak Ulasan
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}