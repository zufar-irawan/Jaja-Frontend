// components/ClientLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '@components/Navigation';
import Footer from '@components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  console.log('🔍 Current pathname:', pathname);
  
  // Daftar halaman yang TIDAK pakai header/footer default
  const noLayoutPages = [
    '/Privacy/Tentang',      // ← TAMBAHKAN INI
    '/kebijakan-privasi', 
    '/privacy'
  ];
  
  // Jika halaman ada di list, render tanpa header/footer
  if (noLayoutPages.includes(pathname)) {
    console.log('✅ Skipping layout for:', pathname);
    return <>{children}</>;
  }
  
  console.log('❌ Using default layout for:', pathname);
  
  // Render dengan header/footer untuk halaman lain
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}