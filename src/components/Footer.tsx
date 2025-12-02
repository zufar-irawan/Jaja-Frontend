'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, MessageCircle, Music } from 'lucide-react';

export default function Footer() {
    const links = {
        jaja: [
            { name: 'Tentang Jaja', href: '/Privacy/Tentang' },
            { name: 'Blogs', href: '#' },
            { name: 'Kebijakan Privasi', href: '/Privacy/Tentang?section=kebijakan-privasi' },
            { name: 'Syarat Layanan', href: '/Privacy/Tentang?section=syarat-layanan' }
        ],
        layanan: [
            { name: 'Cara Menangggapi Komplain', href: '/Privacy/Tentang?section=cara-komplain' },
            { name: 'Pengembalian Dana dan Barang', href: '/Privacy/Tentang?section=ketentuan-pengembalian' },
            { name: 'Bantuan', href: '#' },
            { name: 'Mulai Jualan', href: '/' }
        ]
    };

    const paymentMethods = [
        { name: 'BCA', logo: '/images/BCA.png' },
        { name: 'Mandiri', logo: '/images/Mandiri.png' },
        { name: 'Gopay', logo: '/images/gopay.png' },
        { name: 'Visa', logo: '/images/VISA.png' },
        { name: 'Mastercard', logo: '/images/mastercard.png' }
    ];

    const shippingPartners = [
        { name: 'J&T Express', logo: '/images/JnT.png' },
        { name: 'SiCepat', logo: '/images/sicepat.png' }
    ];

    return (
        <footer className="bg-linear-to-br from-[#55B4E5] via-[#4AA8DC] to-[#FBB338] text-white">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Jaja.id Section */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Jaja.id</h3>
                        <ul className="space-y-3">
                            {links.jaja.map((link, index) => (
                                <li key={index}>
                                    <Link 
                                        href={link.href} 
                                        className="text-white/90 hover:text-[#FBB338] transition-colors duration-300 text-sm"
                                    >
                                        {link.name}
                                    </Link>
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
                                    <Link 
                                        href={link.href} 
                                        className="text-white/90 hover:text-[#FBB338] transition-colors duration-300 text-sm"
                                    >
                                        {link.name}
                                    </Link>
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
                            <a href="#" className="block hover:opacity-80 transition-opacity duration-300">
                                <img 
                                    src="/images/appstore.png" 
                                    alt="Download on App Store" 
                                    className="h-12 w-auto opacity-90"
                                    style={{ filter: 'invert(1)' }}
                                />
                            </a>
                            <a href="#" className="block hover:opacity-80 transition-opacity duration-300">
                                <img 
                                    src="/images/goggleplay.png" 
                                    alt="Get it on Google Play" 
                                    className="h-12 w-auto opacity-90"
                                    style={{ filter: 'invert(1)' }}
                                />
                            </a>
                        </div>
                    </div>

                    {/* Payment & Shipping Section */}
                    <div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 text-white">Pengiriman</h3>
                            <div className="flex gap-3 flex-wrap">
                                {shippingPartners.map((partner, index) => (
                                    <div key={index} className="bg-white rounded-lg p-3 h-14 w-24 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                                        <img 
                                            src={partner.logo} 
                                            alt={partner.name} 
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white">Pembayaran</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {paymentMethods.map((method, index) => (
                                    <div key={index} className="bg-white rounded-lg p-2 h-12 flex items-center justify-center hover:shadow-lg transition-shadow duration-300">
                                        <img 
                                            src={method.logo} 
                                            alt={method.name} 
                                            className="max-w-full max-h-full object-contain"
                                        />
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