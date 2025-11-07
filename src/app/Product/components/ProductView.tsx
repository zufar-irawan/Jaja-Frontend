"use client"

import ProductImages from '@/app/Product/components/ProductImages'
import ProductInfo from '@/app/Product/components/ProductInfo'
import StoreInfo from '@/app/Product/components/StoreInfo'
import ProductTabs from '@/app/Product/components/ProductTabs'
import ProductCard from '@/components/ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/utils/productService'

interface ProductViewProps {
    product: Product;
    otherProduct: Product[];
    storeInfo: any;
    productSpecs: Record<string, string>;
    features: any[];
    reviews: any[];
    ratingStats: any;
    categories: string[];
    images: string[];
    variants: any[];
}

export default function ProductView({ 
    product, 
    otherProduct, 
    storeInfo, 
    productSpecs, 
    features, 
    reviews, 
    ratingStats, 
    categories, 
    images, 
    variants 
}: ProductViewProps) {

    // Filter and transform other products
    const relatedProducts = otherProduct
        .filter((p: Product) => !p.is_deleted && p.id_produk !== product.id_produk)
        .slice(0, 8)

    // Use covers from product if images array is empty
    const productImages = images.length > 0 ? images : (product.covers?.map(cover => cover.foto) || [])

    return (
        <div style={{ 
            fontFamily: "'Poppins', sans-serif", 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh', 
            padding: '32px' 
        }}>
            
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
                            images={productImages}
                            selectedImage={0}
                            setSelectedImage={() => {}}
                            discount={product.diskon || 0}
                        />
                    </div>

                    {/* Product Info */}
                    <div style={{ 
                        flex: '1',
                        minWidth: 0
                    }}>
                        <ProductInfo 
                            variants={variants}
                            selectedVariant="Standard"
                            setSelectedVariant={() => {}}
                            quantity={1}
                            setQuantity={() => {}}
                            ratingStats={ratingStats}
                            productName={product.nama_produk}
                            productWeight={product.berat || ''}
                            productCondition={product.kondisi}
                            productStock={product.stok}
                            productId={product.id_produk}
                            productImage={productImages[0]}
                            storeName={storeInfo.name}
                            productPrice={product.harga}
                            productDiscount={product.diskon}
                        />
                    </div>
                </div>

                {/* Store Info */}
                <StoreInfo storeInfo={storeInfo} />

                {/* Product Tabs */}
                <ProductTabs 
                    activeTab="description"
                    setActiveTab={() => {}}
                    features={features}
                    productSpecs={productSpecs}
                    ratingStats={ratingStats}
                    reviews={reviews}
                    description={product.deskripsi}
                />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
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
                                }}>Lainnya dari Toko Ini</span>
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

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.map((prod) => (
                                <ProductCard
                                    key={prod.id_produk}
                                    item={{
                                        id: prod.id_produk,
                                        name: prod.nama_produk,
                                        price: prod.harga,
                                        image: prod.covers?.[0]?.foto || '',
                                        address: prod.tokos?.alamat_toko || '',
                                        slug: prod.slug_produk
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}