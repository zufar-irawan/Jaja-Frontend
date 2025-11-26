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
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #e5e5e5',
      marginBottom: '32px'
    }}>
      {/* Tabs Header */}
      <div style={{
        display: 'flex',
        gap: '24px',
        borderBottom: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => handleTabChange('description')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '12px 0',
            fontSize: '14px',
            fontWeight: '500',
            color: activeTab === 'description' ? '#111' : '#999',
            cursor: 'pointer',
            borderBottom: activeTab === 'description' ? '2px solid #000' : '2px solid transparent',
            marginBottom: '-1px',
            transition: 'all 0.2s ease'
          }}
        >
          Deskripsi Produk
        </button>
        <button
          onClick={() => handleTabChange('reviews')}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '12px 0',
            fontSize: '14px',
            fontWeight: '500',
            color: activeTab === 'reviews' ? '#111' : '#999',
            cursor: 'pointer',
            borderBottom: activeTab === 'reviews' ? '2px solid #000' : '2px solid transparent',
            marginBottom: '-1px',
            transition: 'all 0.2s ease'
          }}
        >
          Ulasan ({ratingStats.total})
        </button>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111',
            marginBottom: '16px',
            marginTop: 0
          }}>
            Spesifikasi Lengkap
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0',
            marginBottom: '32px'
          }}>
            {Object.entries(productSpecs).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                padding: '12px 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#111',
                  width: '180px'
                }}>
                  {key}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#666',
                  flex: 1
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111',
            marginBottom: '12px',
            marginTop: 0
          }}>
            Tentang Produk
          </h3>

          <p style={{
            color: '#666',
            fontSize: '14px',
            lineHeight: '1.7',
            marginBottom: '24px',
            whiteSpace: 'pre-line'
          }}>
            {description}
          </p>

          {/* Features Section */}
          {/* <h4 style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#111',
            marginBottom: '16px',
            marginTop: '24px'
          }}>
            Fitur Unggulan
          </h4>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {features.map((feature, idx) => (
              <div key={idx} style={{
                padding: '16px',
                backgroundColor: '#fafafa',
                borderRadius: '4px',
                border: '1px solid #f0f0f0'
              }}>
                <h5 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111',
                  marginBottom: '6px',
                  marginTop: 0
                }}>
                  {feature.title}
                </h5>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
          {/* Rating Summary */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: '500',
                color: '#999',
                marginBottom: '8px',
                marginTop: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Rating Rata-rata</h4>
              <div style={{
                fontSize: '42px',
                fontWeight: '600',
                color: '#111',
                lineHeight: '1',
                letterSpacing: '-1px'
              }}>
                {ratingStats.average}<span style={{ fontSize: '20px', color: '#999' }}>/5</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '3px',
                marginTop: '8px',
                marginBottom: '8px'
              }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={20}
                    fill={i <= Math.floor(ratingStats.average) ? "#000" : "none"}
                    stroke="#000"
                  />
                ))}
              </div>
              <div style={{ fontSize: '13px', color: '#666' }}>
                Dari {ratingStats.total} ulasan
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              {ratingStats.breakdown.map((item) => (
                <div key={item.stars} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    width: '55px'
                  }}>{item.stars} bintang</span>
                  <div style={{
                    flex: 1,
                    height: '6px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      backgroundColor: '#000',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    width: '35px',
                    textAlign: 'right'
                  }}>{item.count}</span>
                </div>
              ))}
            </div>

            <button style={{
              width: '100%',
              backgroundColor: '#000',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              Tulis Ulasan
            </button>
          </div>

          {/* Individual Reviews */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <select style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #e5e5e5',
                fontSize: '13px',
                color: '#111',
                cursor: 'pointer',
                backgroundColor: 'white',
                fontWeight: '500'
              }}>
                <option>Terbaru</option>
                <option>Rating Tertinggi</option>
                <option>Rating Terendah</option>
                <option>Paling Membantu</option>
              </select>
            </div>

            {reviews.map((review, idx) => (
              <div key={idx} style={{
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: idx < reviews.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    {review.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#111', fontSize: '14px' }}>{review.name}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{review.date}</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '3px',
                  marginBottom: '8px'
                }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={14}
                      fill={i <= review.rating ? "#000" : "none"}
                      stroke="#000"
                    />
                  ))}
                </div>

                <p style={{
                  color: '#666',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  marginBottom: '10px'
                }}>
                  {review.comment}
                </p>

                {review.images && review.images.length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    {review.images.map((img, imgIdx) => (
                      <img
                        key={imgIdx}
                        src={img}
                        alt={`Review ${imgIdx + 1}`}
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: '1px solid #f0f0f0'
                        }}
                      />
                    ))}
                  </div>
                )}

                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#666',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                  fontWeight: '500'
                }}>
                  👍 Membantu ({review.likes})
                </button>
              </div>
            ))}

            {reviews.length > 3 && (
              <button style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: '1px solid #e5e5e5',
                color: '#111',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '12px',
                transition: 'all 0.2s ease'
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