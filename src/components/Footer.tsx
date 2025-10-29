    'use client';

    import React from 'react';
    import { Facebook, Instagram, MessageCircle, Music } from 'lucide-react';

    export default function Footer() {
    const links = {
        jaja: [
        { name: 'Tentang Jaja', href: '#' },
        { name: 'Blogs', href: '#' },
        { name: 'Kebijakan Privasi', href: '#' },
        { name: 'Syarat Layanan', href: '#' }
        ],
        layanan: [
        { name: 'Cara Menangggapi Komplain', href: '#' },
        { name: 'Pengembalian Dana dan Barang', href: '#' },
        { name: 'Bantuan', href: '#' },
        { name: 'Mulai Jualan', href: '#' }
        ]
    };

    const paymentMethods = [
        { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/2560px-Bank_Central_Asia.svg.png' },
        { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Bank_Mandiri_logo_2016.svg/2560px-Bank_Mandiri_logo_2016.svg.png' },
        { name: 'CIMB Niaga', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/CIMB_Niaga.svg/2560px-CIMB_Niaga.svg.png' },
        { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/2560px-BNI_logo.svg.png' },
        { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png' },
        { name: 'Gopay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/2560px-Gopay_logo.svg.png' },
        { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png' }
    ];

    const shippingPartners = [
        { name: 'J&T Express', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/New_Logo_JT_express.png/2560px-New_Logo_JT_express.png' },
        { name: 'SiCepat', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/SiCepat_Ekspres_logo.png/2560px-SiCepat_Ekspres_logo.png' }
    ];

    return (
        <footer className="bg-gradient-to-br from-[#55B4E5] via-[#4AA8DC] to-[#FBB338] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Jaja.id Section */}
            <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Jaja.id</h3>
                <ul className="space-y-3">
                {links.jaja.map((link, index) => (
                    <li key={index}>
                    <a href={link.href} className="text-white/90 hover:text-[#FBB338] transition-colors duration-300 text-sm">
                        {link.name}
                    </a>
                    </li>
                ))}
                </ul>
            </div>

            {/* Layanan Pelanggan Section */}
            <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Layanan Pelanggan</h3>
                <ul className="space-y-3">
                {links.layanan.map((link, index) => (
                    <li key={index}>
                    <a href={link.href} className="text-white/90 hover:text-[#FBB338] transition-colors duration-300 text-sm">
                        {link.name}
                    </a>
                    </li>
                ))}
                </ul>
            </div>

            {/* Social Media Section */}
            <div>
                <h3 className="text-2xl font-bold mb-6 text-white">Sosial Media</h3>
                <div className="flex gap-4 mb-8">
                <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FBB338] transition-all duration-300 hover:scale-110">
                    <MessageCircle className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FBB338] transition-all duration-300 hover:scale-110">
                    <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FBB338] transition-all duration-300 hover:scale-110">
                    <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FBB338] transition-all duration-300 hover:scale-110">
                    <Music className="w-6 h-6" />
                </a>
                </div>

                <h4 className="text-lg font-semibold mb-4 text-white">Download Apps</h4>
                <div className="space-y-3">
                <a href="#" className="block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-black text-xl">🍎</span>
                    </div>
                    <div>
                        <p className="text-xs text-white/70">Download on the</p>
                        <p className="text-sm font-semibold">App Store</p>
                    </div>
                    </div>
                </a>
                <a href="#" className="block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-2xl">▶️</span>
                    </div>
                    <div>
                        <p className="text-xs text-white/70">GET IT ON</p>
                        <p className="text-sm font-semibold">Google Play</p>
                    </div>
                    </div>
                </a>
                </div>
            </div>

            {/* Payment & Shipping Section */}
            <div>
                <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-white">Pengiriman</h3>
                <div className="flex gap-3 flex-wrap">
                    {shippingPartners.map((partner, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 h-12 w-20 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                        <span className="text-xs font-semibold text-gray-800">{partner.name}</span>
                    </div>
                    ))}
                </div>
                </div>

                <div>
                <h3 className="text-xl font-bold mb-4 text-white">Pembayaran</h3>
                <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method, index) => (
                    <div key={index} className="bg-white rounded-lg p-2 h-12 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                        <span className="text-xs font-semibold text-gray-800">{method.name}</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/90 text-sm">
                © 2025 Jaja.id. All rights reserved.
            </p>
            </div>
        </div>
        </footer>
    );
    }