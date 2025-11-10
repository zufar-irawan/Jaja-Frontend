// app/Product/[id]/page.tsx
import { getProductBySlug } from '@/utils/productService'
import { notFound } from 'next/navigation'
import ProductView from '@/app/Product/components/ProductView'

interface ProductPageProps {
    params: Promise<{
        id: string // This is the slug
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    try {
        const { id: slug } = await params
        if (!slug) {
            console.error("No slug provided for product page.")
            notFound()
        }

        // Fetch product by slug
        const response = await getProductBySlug(slug)
        
        if (!response.success || !response.data?.product) {
            console.warn(`Product with slug "${slug}" not found or failed to load. API response:`, response)
            notFound()
        }

        const { product, otherProduct } = response.data

        // Transform data for components
        const images = [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop',
            'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=500&h=500&fit=crop'
        ]

        // Calculate discount
        const discount = product.diskon || 0
        const originalPrice = product.harga * (1 + discount / 100)

        // Build variants from product data
        const variants = [
            {
                name: 'Standard',
                price: product.harga,
                originalPrice: originalPrice,
                stock: product.stok || 0
            }
        ]

        const categories = [
            'Elektronik',
            product.kategori?.kategori || 'Kategori',
            product.nama_produk,
        ].filter(Boolean)

        // Store info
        const storeInfo = {
            slug: product.tokos?.slug_toko || '',
            name: product.tokos?.nama_toko || 'Nama Toko',
            location: product.tokos?.alamat_toko || 'Lokasi tidak diketahui',
            rating: 4.8, // Mock data
            totalReviews: 15420, // Mock data   
            responseRate: '98%', // Mock data
            responseTime: '< 1 jam', // Mock data
            products: 245, // Mock data
            image: product.tokos?.foto
                ? `https://kb8334ks-3000.asse.devtunnels.ms/uploads/stores/${product.tokos.foto}`
                : 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop'
        }

        // Product specs
        const productSpecs = {
            'Kondisi': product.kondisi ? product.kondisi.charAt(0).toUpperCase() + product.kondisi.slice(1) : '-',
            'Berat': product.berat ? `${product.berat}g` : '-',
            'Stok': product.stok?.toString() || '0',
            'SKU': product.kode_sku || '-',
            'Merek': product.merek?.toString() || '-',
            'Ukuran Paket': product.ukuran_paket_panjang ? `${product.ukuran_paket_panjang} x ${product.ukuran_paket_lebar} x ${product.ukuran_paket_tinggi} cm` : '-',
        }

        // Features from description
        const features = [
            {
                title: 'Kualitas Terjamin',
                description: 'Produk original dengan kualitas terbaik dan garansi resmi.'
            },
            {
                title: 'Pengiriman Cepat',
                description: 'Dikemas dengan baik dan dikirim dalam waktu 1-2 hari kerja.'
            },
            {
                title: 'Harga Terbaik',
                description: 'Dapatkan harga terbaik dengan berbagai promo menarik.'
            },
            {
                title: 'Produk Berkualitas',
                description: product.deskripsi.substring(0, 100) + '...'
            }
        ]

        // Reviews (mock data - can be integrated with API if available)
        const reviews = [
            {
                name: 'Pembeli Terverifikasi',
                date: '25 Okt 2024', // Static date to prevent hydration error
                rating: 5,
                comment: 'Produk sangat bagus, sesuai deskripsi. Pengiriman cepat dan packing rapi. Recommended!',
                likes: 24,
                images: []
            },
            {
                name: 'User JajaID',
                date: '23 Okt 2024', // Static date to prevent hydration error
                rating: 4,
                comment: 'Barang bagus, sesuai ekspektasi. Seller responsif.',
                likes: 12,
                images: []
            }
        ]

        const ratingStats = {
            average: product.avg_rating || 4.5,
            total: 892,
            breakdown: [
                { stars: 5, count: 650, percentage: 73 },
                { stars: 4, count: 178, percentage: 20 },
                { stars: 3, count: 45, percentage: 5 },
                { stars: 2, count: 13, percentage: 1 },
                { stars: 1, count: 6, percentage: 1 }
            ]
        }

        return (
            <ProductView
                product={product}
                otherProduct={otherProduct}
                storeInfo={storeInfo}
                productSpecs={productSpecs}
                features={features}
                reviews={reviews}
                ratingStats={ratingStats}
                categories={categories}
                images={images}
                variants={variants}
            />
        )
    } catch (error) {
        console.error('Error loading product:', error)
        notFound()
    }
}